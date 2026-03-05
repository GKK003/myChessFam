/* global Buffer, process */
import http from "node:http";
import crypto from "node:crypto";
import { MongoClient } from "mongodb";

const DEFAULT_DB = {
  tournaments: [
    {
      id: 1,
      name: "Spring Scholastic Open",
      date: "2025-03-15",
      location: "Chess Club HQ, Upper West Side",
      age: "All Ages (6–16)",
      max: 32,
      fee: 25,
      format: "Swiss System",
      desc: "Our flagship spring tournament! Open to all skill levels. Trophies for top 3 in each section.",
      status: "open",
    },
    {
      id: 2,
      name: "Junior Rapid Championship",
      date: "2025-04-05",
      location: "Brooklyn Community Center",
      age: "Juniors (6–10)",
      max: 24,
      fee: 20,
      format: "Rapid",
      desc: "A fast-paced rapid tournament for our youngest players. G/15 time control.",
      status: "open",
    },
    {
      id: 3,
      name: "NYC Youth Invitational",
      date: "2025-05-17",
      location: "Manhattan Public Library",
      age: "Seniors (14–16)",
      max: 20,
      fee: 30,
      format: "Swiss System",
      desc: "Invitational for top-rated players. USCF rated.",
      status: "upcoming",
    },
  ],
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
      desc: "Chess fundamentals, puzzle competitions, board games, snacks. Certificate of completion included.",
      status: "open",
    },
    {
      id: 2,
      name: "Summer Chess Camp – Session 2",
      dateStart: "2025-07-07",
      dateEnd: "2025-07-11",
      location: "Chess Club HQ, Upper West Side",
      type: "Full Day (9AM–5PM)",
      age: "All Ages (6–16)",
      price: 550,
      spots: 20,
      desc: "Advanced strategy, tournament simulations, team challenges, lunch, guest grandmaster visit, trophy ceremony.",
      status: "open",
    },
  ],
};

// Admin sessions (tokens) are in-memory.
// Note: On redeploy/restart, tokens reset (normal).
const sessions = new Map();

/* ─────────────────────────────
   Helpers
───────────────────────────── */
const send = (res, status, payload) => {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
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

const authed = (req) => {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  return token && sessions.has(token);
};

const nowStamp = () => {
  const d = new Date();
  return {
    date: d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
};

/* ─────────────────────────────
   MongoDB setup
───────────────────────────── */
const MONGODB_URL = process.env.MONGODB_URL || process.env.MONGODB_URI;
if (!MONGODB_URL) {
  console.error("❌ Missing env var MONGODB_URL (or MONGODB_URI).");
  process.exit(1);
}

const DB_NAME = process.env.MONGODB_DB || "mychessfamily";

const client = new MongoClient(MONGODB_URL, {
  // good defaults for Render
  maxPoolSize: 10,
});

let db, colTournaments, colCamps, colTournRegs, colCampRegs;

async function initMongo() {
  await client.connect();
  db = client.db(DB_NAME);

  colTournaments = db.collection("tournaments");
  colCamps = db.collection("camps");
  colTournRegs = db.collection("tournamentRegs");
  colCampRegs = db.collection("campRegs");

  // Seed only if empty
  const tCount = await colTournaments.countDocuments();
  const cCount = await colCamps.countDocuments();

  if (tCount === 0) {
    await colTournaments.insertMany(DEFAULT_DB.tournaments);
  }
  if (cCount === 0) {
    await colCamps.insertMany(DEFAULT_DB.camps);
  }

  // Helpful indexes (optional but good)
  await colTournaments.createIndex({ id: 1 }, { unique: true });
  await colCamps.createIndex({ id: 1 }, { unique: true });
  await colTournRegs.createIndex({ id: 1 }, { unique: true });
  await colCampRegs.createIndex({ id: 1 }, { unique: true });

  console.log("✅ MongoDB connected. DB =", DB_NAME);
}

await initMongo();

/* ─────────────────────────────
   Server routes (same paths as before)
───────────────────────────── */
const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "OPTIONS") return send(res, 200, { ok: true });

    const url = new URL(req.url, "http://localhost");

    // Health check (optional)
    if (req.method === "GET" && url.pathname === "/") {
      return send(res, 200, { ok: true, service: "mychessfamily-api" });
    }

    // PUBLIC: bootstrap
    if (req.method === "GET" && url.pathname === "/api/bootstrap") {
      const tournaments = await colTournaments
        .find({})
        .sort({ id: 1 })
        .toArray();
      const camps = await colCamps.find({}).sort({ id: 1 }).toArray();
      return send(res, 200, { tournaments, camps });
    }

    // ADMIN: login
    if (req.method === "POST" && url.pathname === "/api/admin/login") {
      const body = await parseBody(req);
      if (body.username !== "admin" || body.password !== "chess123") {
        return send(res, 401, { error: "Invalid credentials" });
      }
      const token = crypto.randomUUID();
      sessions.set(token, true);
      return send(res, 200, { token });
    }

    // ADMIN: logout (token removal optional)
    if (req.method === "POST" && url.pathname === "/api/admin/logout") {
      // If you want to actually remove token:
      const token = (req.headers.authorization || "").replace("Bearer ", "");
      if (token) sessions.delete(token);
      return send(res, 200, { ok: true });
    }

    // ADMIN: get registrations
    if (req.method === "GET" && url.pathname === "/api/admin/registrations") {
      if (!authed(req)) return send(res, 401, { error: "Unauthorized" });

      const tournamentRegs = await colTournRegs
        .find({})
        .sort({ id: -1 })
        .toArray();
      const campRegs = await colCampRegs.find({}).sort({ id: -1 }).toArray();

      return send(res, 200, { tournamentRegs, campRegs });
    }

    // PUBLIC: create tournament registration
    if (
      req.method === "POST" &&
      url.pathname === "/api/registrations/tournament"
    ) {
      const body = await parseBody(req);
      const stamp = nowStamp();

      const doc = {
        id: Date.now(), // keep numeric id like before (frontend uses r.id)
        ...body,
        date: stamp.date,
        time: stamp.time,
      };

      await colTournRegs.insertOne(doc);
      return send(res, 201, { ok: true });
    }

    // PUBLIC: create camp registration
    if (req.method === "POST" && url.pathname === "/api/registrations/camp") {
      const body = await parseBody(req);
      const stamp = nowStamp();

      const doc = {
        id: Date.now(),
        ...body,
        date: stamp.date,
        time: stamp.time,
      };

      await colCampRegs.insertOne(doc);
      return send(res, 201, { ok: true });
    }

    // ADMIN: add tournament
    if (req.method === "POST" && url.pathname === "/api/admin/tournaments") {
      if (!authed(req)) return send(res, 401, { error: "Unauthorized" });
      const body = await parseBody(req);

      const doc = { id: Date.now(), ...body };
      await colTournaments.insertOne(doc);

      const tournaments = await colTournaments
        .find({})
        .sort({ id: 1 })
        .toArray();
      return send(res, 201, { tournaments });
    }

    // ADMIN: update tournament status
    const tStatus = url.pathname.match(
      /^\/api\/admin\/tournaments\/(\d+)\/status$/,
    );
    if (req.method === "PATCH" && tStatus) {
      if (!authed(req)) return send(res, 401, { error: "Unauthorized" });
      const id = Number(tStatus[1]);
      const body = await parseBody(req);

      await colTournaments.updateOne({ id }, { $set: { status: body.status } });

      const tournaments = await colTournaments
        .find({})
        .sort({ id: 1 })
        .toArray();
      return send(res, 200, { tournaments });
    }

    // ADMIN: delete tournament
    const tDel = url.pathname.match(/^\/api\/admin\/tournaments\/(\d+)$/);
    if (req.method === "DELETE" && tDel) {
      if (!authed(req)) return send(res, 401, { error: "Unauthorized" });
      const id = Number(tDel[1]);

      await colTournaments.deleteOne({ id });

      const tournaments = await colTournaments
        .find({})
        .sort({ id: 1 })
        .toArray();
      return send(res, 200, { tournaments });
    }

    // ADMIN: add camp
    if (req.method === "POST" && url.pathname === "/api/admin/camps") {
      if (!authed(req)) return send(res, 401, { error: "Unauthorized" });
      const body = await parseBody(req);

      const doc = { id: Date.now(), ...body };
      await colCamps.insertOne(doc);

      const camps = await colCamps.find({}).sort({ id: 1 }).toArray();
      return send(res, 201, { camps });
    }

    // ADMIN: update camp status
    const cStatus = url.pathname.match(/^\/api\/admin\/camps\/(\d+)\/status$/);
    if (req.method === "PATCH" && cStatus) {
      if (!authed(req)) return send(res, 401, { error: "Unauthorized" });
      const id = Number(cStatus[1]);
      const body = await parseBody(req);

      await colCamps.updateOne({ id }, { $set: { status: body.status } });

      const camps = await colCamps.find({}).sort({ id: 1 }).toArray();
      return send(res, 200, { camps });
    }

    // ADMIN: delete camp
    const cDel = url.pathname.match(/^\/api\/admin\/camps\/(\d+)$/);
    if (req.method === "DELETE" && cDel) {
      if (!authed(req)) return send(res, 401, { error: "Unauthorized" });
      const id = Number(cDel[1]);

      await colCamps.deleteOne({ id });

      const camps = await colCamps.find({}).sort({ id: 1 }).toArray();
      return send(res, 200, { camps });
    }

    // (Optional) ADMIN: delete a single tournament registration by id
    const trDel = url.pathname.match(/^\/api\/admin\/tournamentRegs\/(\d+)$/);
    if (req.method === "DELETE" && trDel) {
      if (!authed(req)) return send(res, 401, { error: "Unauthorized" });
      const id = Number(trDel[1]);
      await colTournRegs.deleteOne({ id });
      return send(res, 200, { ok: true });
    }

    // (Optional) ADMIN: delete a single camp registration by id
    const crDel = url.pathname.match(/^\/api\/admin\/campRegs\/(\d+)$/);
    if (req.method === "DELETE" && crDel) {
      if (!authed(req)) return send(res, 401, { error: "Unauthorized" });
      const id = Number(crDel[1]);
      await colCampRegs.deleteOne({ id });
      return send(res, 200, { ok: true });
    }

    return send(res, 404, { error: "Not found" });
  } catch (err) {
    console.error("Server error:", err);
    return send(res, 500, { error: "Server error" });
  }
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
