/* global process, Buffer */
import express from "express";
import cors from "cors";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import multer from "multer";
import { MongoClient } from "mongodb";

/* =========================
   PATHS
========================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "uploads");
const distDir = path.join(process.cwd(), "dist");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

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
   APP
========================= */
const app = express();

app.use(
  cors({
    origin: CORS_ORIGIN === "*" ? true : CORS_ORIGIN,
    credentials: false,
  }),
);
app.use(express.json({ limit: "2mb" }));

/* =========================
   STATIC FILES
========================= */
app.use("/uploads", express.static(uploadsDir));
app.use(express.static(distDir));

/* =========================
   HELPERS
========================= */
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

const requireAuth = (req, res, next) => {
  if (!authed(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

/* =========================
   MULTER UPLOAD
========================= */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeExt = ext || ".jpg";
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /^image\/(jpeg|jpg|png|webp|gif|svg\+xml)$/.test(
      file.mimetype || "",
    );
    if (!ok) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

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
      image: "/images/camp-default.jpg",
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
let db;
let colCamps;
let colCampRegs;
let colReviews;

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
   PUBLIC ROUTES
========================= */
app.get("/api/bootstrap", async (_req, res) => {
  try {
    const camps = await colCamps.find().sort({ id: -1 }).toArray();
    res.json({ camps });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/reviews", async (_req, res) => {
  try {
    const reviews = await colReviews
      .find({ approved: true })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/reviews", async (req, res) => {
  try {
    const body = req.body || {};
    const stamp = nowStamp();

    const text = String(body.text || "").trim();
    if (text.length < 10) {
      return res.status(400).json({ error: "Review too short" });
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
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/registrations/camp", async (req, res) => {
  try {
    const body = req.body || {};
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
      if (!body[k]) {
        return res.status(400).json({ error: `Missing ${k}` });
      }
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
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   ADMIN AUTH
========================= */
app.post("/api/admin/login", (req, res) => {
  const body = req.body || {};

  if (body.username !== "admin" || body.password !== "chess123") {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = createToken("admin");
  res.json({ token });
});

app.post("/api/admin/logout", (_req, res) => {
  res.json({ ok: true });
});

/* =========================
   ADMIN UPLOAD
========================= */
app.post(
  "/api/admin/upload",
  requireAuth,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message || "Upload failed" });
      }
      next();
    });
  },
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    return res.json({
      image: `/uploads/${req.file.filename}`,
    });
  },
);

/* =========================
   ADMIN REGISTRATIONS
========================= */
app.get("/api/admin/registrations", requireAuth, async (_req, res) => {
  try {
    const campRegs = await colCampRegs.find().sort({ createdAt: -1 }).toArray();
    res.json({ campRegs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete(
  "/api/admin/registrations/camp/:id",
  requireAuth,
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      await colCampRegs.deleteOne({ id });
      res.json({ ok: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

/* =========================
   ADMIN CAMPS
========================= */
app.post("/api/admin/camps", requireAuth, async (req, res) => {
  try {
    const body = req.body || {};

    if (!body.name || !body.dateStart || !body.dateEnd || !body.location) {
      return res.status(400).json({
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
      image: String(body.image || "/images/camp-default.jpg"),
      createdAt: Date.now(),
    };

    await colCamps.insertOne(camp);

    const camps = await colCamps.find().sort({ id: -1 }).toArray();
    res.json({ camps });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.patch("/api/admin/camps/:id", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const body = req.body || {};

    if (!body.name || !body.dateStart || !body.dateEnd || !body.location) {
      return res.status(400).json({
        error: "Missing name/dateStart/dateEnd/location",
      });
    }

    await colCamps.updateOne(
      { id },
      {
        $set: {
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
          image: String(body.image || "/images/camp-default.jpg"),
        },
      },
    );

    const camps = await colCamps.find().sort({ id: -1 }).toArray();
    res.json({ camps });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/admin/camps/:id", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const camp = await colCamps.findOne({ id });

    if (
      camp?.image &&
      typeof camp.image === "string" &&
      camp.image.startsWith("/uploads/")
    ) {
      const filename = camp.image.replace("/uploads/", "");
      const filePath = path.join(uploadsDir, filename);

      try {
        await fsp.unlink(filePath);
      } catch {
        // ignore missing file
      }
    }

    await colCamps.deleteOne({ id });

    const camps = await colCamps.find().sort({ id: -1 }).toArray();
    res.json({ camps });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   ADMIN REVIEWS
========================= */
app.get("/api/admin/reviews", requireAuth, async (_req, res) => {
  try {
    const reviews = await colReviews.find().sort({ createdAt: -1 }).toArray();
    res.json({ reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.patch("/api/admin/reviews/:id/approve", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await colReviews.updateOne({ id }, { $set: { approved: true } });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/admin/reviews/:id", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await colReviews.deleteOne({ id });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   SPA FALLBACK
========================= */
app.get(/^(?!\/api).*/, async (req, res) => {
  try {
    const requestedPath = path.join(distDir, req.path);

    if (
      req.path !== "/" &&
      fs.existsSync(requestedPath) &&
      fs.statSync(requestedPath).isFile()
    ) {
      return res.sendFile(requestedPath);
    }

    const indexPath = path.join(distDir, "index.html");
    return res.sendFile(indexPath);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

/* =========================
   START
========================= */
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
