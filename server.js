/* global process, Buffer */
import http from "node:http";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { MongoClient } from "mongodb";

/* =========================
   ENV
========================= */
const PORT = process.env.PORT || 4000;
const MONGODB_URL = process.env.MONGODB_URL || process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || "mychessfamily";
const TOKEN_SECRET = process.env.TOKEN_SECRET || "change-this-in-render";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

if (!MONGODB_URL) {
  console.error("❌ Missing MONGODB_URL / MONGODB_URI env var");
  process.exit(1);
}

/* =========================
   HELPERS
========================= */
const send = (res, status, payload) => {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": CORS_ORIGIN,
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
  });
  res.end(JSON.stringify(payload));
};

const parseBody = async (req) => {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return {};
  }
};

const nowStamp = () => {
  const d = new Date();
  return {
    date: d.toLocaleDateString("en-US"),
    time: d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

/* =========================
   STATELESS TOKEN
========================= */
const b64 = (s) => Buffer.from(s, "utf8").toString("base64url");
const unb64 = (s) => Buffer.from(s, "base64url").toString("utf8");

const sign = (data) =>
  crypto.createHmac("sha256", TOKEN_SECRET).update(data).digest("hex");

const createToken = (username) => {
  const payload = JSON.stringify({
    u: username,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 30,
  });
  const p = b64(payload);
  const sig = sign(p);
  return `${p}.${sig}`;
};

const verifyToken = (token) => {
  if (!token) return null;
  const [p, sig] = token.split(".");
  if (!p || !sig) return null;
  if (sign(p) !== sig) return null;

  try {
    const obj = JSON.parse(unb64(p));
    if (!obj.exp || Date.now() > obj.exp) return null;
    return obj;
  } catch {
    return null;
  }
};

const authed = (req) => {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  return !!verifyToken(token);
};

/* =========================
   DEFAULT DATA
========================= */
const DEFAULT_DB = {
  camps: [
    {
      id: 1,
      name: "Summer Chess Camp – Session 1",
      dateStart: "2025-06-23",
      dateEnd: "2025-06-27",
      location: "Chess Club HQ, Upper West Side",
      type: "Half Day (9AM–1PM)",
      age: "All Ages (6–16)",
      price: 350,
      spots: 20,
      desc: "Chess fundamentals and puzzles.",
      status: "open",
      createdAt: Date.now(),
    },
  ],
  reviews: [
    {
      id: 1,
      childName: "Sarah M.",
      rating: 5,
      text: "Amazing coaches. My son improved a lot!",
      date: "2/14/2025",
      time: "10:12 AM",
      approved: true,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    },
    {
      id: 2,
      childName: "Daniel K.",
      rating: 4,
      text: "Great camp experience. Well organized and fun.",
      date: "1/29/2025",
      time: "3:40 PM",
      approved: true,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
    },
  ],
};

/* =========================
   MONGO
========================= */
const client = new MongoClient(MONGODB_URL);
let db, colCamps, colCampRegs, colReviews;

async function initMongo() {
  await client.connect();
  db = client.db(DB_NAME);

  colCamps = db.collection("camps");
  colCampRegs = db.collection("campRegs");
  colReviews = db.collection("reviews");

  if ((await colCamps.countDocuments()) === 0) {
    await colCamps.insertMany(DEFAULT_DB.camps);
  }

  if ((await colReviews.countDocuments()) === 0) {
    await colReviews.insertMany(DEFAULT_DB.reviews);
  }

  console.log("✅ MongoDB connected:", DB_NAME);
}

await initMongo();

/* =========================
   SERVER
========================= */
const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "OPTIONS") {
      return send(res, 200, { ok: true });
    }

    const url = new URL(req.url, "http://localhost");

    /* -------------------------
       PUBLIC: bootstrap
       GET /api/bootstrap
    ------------------------- */
    if (req.method === "GET" && url.pathname === "/api/bootstrap") {
      const camps = await colCamps.find().sort({ id: -1 }).toArray();
      return send(res, 200, { camps });
    }

    /* -------------------------
       PUBLIC: reviews
       GET /api/reviews
    ------------------------- */
    if (req.method === "GET" && url.pathname === "/api/reviews") {
      const reviews = await colReviews
        .find({ approved: true })
        .sort({ createdAt: -1 })
        .toArray();

      return send(res, 200, { reviews });
    }

    /* -------------------------
       PUBLIC: create review
       POST /api/reviews
    ------------------------- */
    if (req.method === "POST" && url.pathname === "/api/reviews") {
      const body = await parseBody(req);
      const stamp = nowStamp();

      const text = String(body.text || "").trim();
      if (text.length < 10) {
        return send(res, 400, { error: "Review too short" });
      }

      const review = {
        id: Date.now(),
        childName: String(body.childName || "").trim(),
        rating: Math.max(1, Math.min(5, Number(body.rating) || 5)),
        text,
        date: stamp.date,
        time: stamp.time,
        approved: false,
        createdAt: Date.now(),
      };

      await colReviews.insertOne(review);
      return send(res, 201, { ok: true });
    }

    /* -------------------------
       PUBLIC: camp registration
       POST /api/registrations/camp
    ------------------------- */
    if (req.method === "POST" && url.pathname === "/api/registrations/camp") {
      const body = await parseBody(req);
      const stamp = nowStamp();

      const required = [
        "campId",
        "campName",
        "childName",
        "dob",
        "level",
        "parent",
        "email",
        "phone",
      ];

      for (const k of required) {
        if (!body[k]) return send(res, 400, { error: `Missing ${k}` });
      }

      const reg = {
        id: Date.now(),
        campId: Number(body.campId),
        campName: String(body.campName),
        childName: String(body.childName),
        dob: String(body.dob),
        level: String(body.level),
        parent: String(body.parent),
        email: String(body.email),
        phone: String(body.phone),
        emergency: String(body.emergency || "—"),
        medical: String(body.medical || "None"),
        price: Number(body.price) || 0,
        date: stamp.date,
        time: stamp.time,
        createdAt: Date.now(),
      };

      await colCampRegs.insertOne(reg);
      return send(res, 201, { ok: true });
    }

    /* -------------------------
       ADMIN: login
       POST /api/admin/login
    ------------------------- */
    if (req.method === "POST" && url.pathname === "/api/admin/login") {
      const body = await parseBody(req);

      if (body.username !== "admin" || body.password !== "chess123") {
        return send(res, 401, { error: "Invalid credentials" });
      }

      const token = createToken("admin");
      return send(res, 200, { token });
    }

    /* -------------------------
       ADMIN: logout
       POST /api/admin/logout
    ------------------------- */
    if (req.method === "POST" && url.pathname === "/api/admin/logout") {
      return send(res, 200, { ok: true });
    }

    /* -------------------------
       ADMIN: registrations
       GET /api/admin/registrations
    ------------------------- */
    if (req.method === "GET" && url.pathname === "/api/admin/registrations") {
      if (!authed(req)) return send(res, 401, { error: "Unauthorized" });

      const campRegs = await colCampRegs
        .find()
        .sort({ createdAt: -1 })
        .toArray();

      return send(res, 200, { campRegs });
    }

    /* -------------------------
       ADMIN: delete camp registration
       DELETE /api/admin/registrations/camp/:id
    ------------------------- */
    const delCampReg = url.pathname.match(
      /^\/api\/admin\/registrations\/camp\/(\d+)$/,
    );
    if (req.method === "DELETE" && delCampReg) {
      if (!authed(req)) return send(res, 401, { error: "Unauthorized" });

      const id = Number(delCampReg[1]);
      await colCampRegs.deleteOne({ id });

      return send(res, 200, { ok: true });
    }

    /* -------------------------
       ADMIN: add camp
       POST /api/admin/camps
    ------------------------- */
    if (req.method === "POST" && url.pathname === "/api/admin/camps") {
      if (!authed(req)) return send(res, 401, { error: "Unauthorized" });

      const body = await parseBody(req);

      if (!body.name || !body.dateStart || !body.dateEnd || !body.location) {
        return send(res, 400, {
          error: "Missing name/dateStart/dateEnd/location",
        });
      }

      const camp = {
        id: Date.now(),
        name: String(body.name),
        dateStart: String(body.dateStart),
        dateEnd: String(body.dateEnd),
        location: String(body.location),
        type: String(body.type || ""),
        age: String(body.age || ""),
        price: Number(body.price) || 0,
        spots: Number(body.spots) || 20,
        desc: String(body.desc || ""),
        status: String(body.status || "open"),
        createdAt: Date.now(),
      };

      await colCamps.insertOne(camp);

      const camps = await colCamps.find().sort({ id: -1 }).toArray();
      return send(res, 200, { camps });
    }

    /* -------------------------
       ADMIN: update camp status
       PATCH /api/admin/camps/:id/status
    ------------------------- */
    const campStatus = url.pathname.match(
      /^\/api\/admin\/camps\/(\d+)\/status$/,
    );
    if (req.method === "PATCH" && campStatus) {
      if (!authed(req)) return send(res, 401, { error: "Unauthorized" });

      const id = Number(campStatus[1]);
      const body = await parseBody(req);
      const status = String(body.status || "");

      if (!["open", "upcoming", "full"].includes(status)) {
        return send(res, 400, { error: "Invalid status" });
      }

      await colCamps.updateOne({ id }, { $set: { status } });

      const camps = await colCamps.find().sort({ id: -1 }).toArray();
      return send(res, 200, { camps });
    }

    /* -------------------------
       ADMIN: delete camp
       DELETE /api/admin/camps/:id
    ------------------------- */
    const delCamp = url.pathname.match(/^\/api\/admin\/camps\/(\d+)$/);
    if (req.method === "DELETE" && delCamp) {
      if (!authed(req)) return send(res, 401, { error: "Unauthorized" });

      const id = Number(delCamp[1]);
      await colCamps.deleteOne({ id });

      const camps = await colCamps.find().sort({ id: -1 }).toArray();
      return send(res, 200, { camps });
    }

    /* -------------------------
       ADMIN: list all reviews
       GET /api/admin/reviews
    ------------------------- */
    if (req.method === "GET" && url.pathname === "/api/admin/reviews") {
      if (!authed(req)) return send(res, 401, { error: "Unauthorized" });

      const reviews = await colReviews.find().sort({ createdAt: -1 }).toArray();
      return send(res, 200, { reviews });
    }

    /* -------------------------
       ADMIN: approve review
       PATCH /api/admin/reviews/:id/approve
    ------------------------- */
    const approveReview = url.pathname.match(
      /^\/api\/admin\/reviews\/(\d+)\/approve$/,
    );
    if (req.method === "PATCH" && approveReview) {
      if (!authed(req)) return send(res, 401, { error: "Unauthorized" });

      const id = Number(approveReview[1]);
      await colReviews.updateOne({ id }, { $set: { approved: true } });

      return send(res, 200, { ok: true });
    }

    /* -------------------------
       ADMIN: delete review
       DELETE /api/admin/reviews/:id
    ------------------------- */
    const delReview = url.pathname.match(/^\/api\/admin\/reviews\/(\d+)$/);
    if (req.method === "DELETE" && delReview) {
      if (!authed(req)) return send(res, 401, { error: "Unauthorized" });

      const id = Number(delReview[1]);
      await colReviews.deleteOne({ id });

      return send(res, 200, { ok: true });
    }

    /* -------------------------
       STATIC ASSETS FROM DIST
    ------------------------- */
    if (req.method === "GET" && !url.pathname.startsWith("/api")) {
      const safePath = path
        .normalize(url.pathname)
        .replace(/^(\.\.[/\\])+/, "");
      let filePath =
        safePath === "/" || safePath === ""
          ? path.join(process.cwd(), "dist", "index.html")
          : path.join(process.cwd(), "dist", safePath);

      try {
        const stat = await fs.stat(filePath);

        if (stat.isFile()) {
          const ext = path.extname(filePath).toLowerCase();
          const contentTypes = {
            ".html": "text/html; charset=utf-8",
            ".js": "application/javascript; charset=utf-8",
            ".css": "text/css; charset=utf-8",
            ".json": "application/json; charset=utf-8",
            ".svg": "image/svg+xml",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".webp": "image/webp",
            ".ico": "image/x-icon",
            ".woff": "font/woff",
            ".woff2": "font/woff2",
          };

          const data = await fs.readFile(filePath);
          res.writeHead(200, {
            "Content-Type": contentTypes[ext] || "application/octet-stream",
          });
          res.end(data);
          return;
        }
      } catch {
        // ignore and fall through to SPA fallback
      }

      const indexPath = path.join(process.cwd(), "dist", "index.html");
      const html = await fs.readFile(indexPath, "utf8");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
      return;
    }

    return send(res, 404, { error: "Not found" });
  } catch (err) {
    console.error(err);
    return send(res, 500, { error: "Server error" });
  }
});

server.listen(PORT, () => {
  console.log(`✅ API running on port ${PORT}`);
});
