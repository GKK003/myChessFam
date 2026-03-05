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
      desc: "Our flagship spring tournament! Open to all skill levels.",
      status: "open",
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
      desc: "Chess fundamentals and puzzles.",
      status: "open",
    },
  ],
};

const sessions = new Map();

/* helpers */
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
    date: d.toLocaleDateString("en-US"),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
};

/* MongoDB */
const MONGODB_URL = process.env.MONGODB_URL || process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || "mychessfamily";

const client = new MongoClient(MONGODB_URL);
let db, colTournaments, colCamps, colTournRegs, colCampRegs;

async function initMongo() {
  await client.connect();

  db = client.db(DB_NAME);

  colTournaments = db.collection("tournaments");
  colCamps = db.collection("camps");
  colTournRegs = db.collection("tournamentRegs");
  colCampRegs = db.collection("campRegs");

  if ((await colTournaments.countDocuments()) === 0) {
    await colTournaments.insertMany(DEFAULT_DB.tournaments);
  }

  if ((await colCamps.countDocuments()) === 0) {
    await colCamps.insertMany(DEFAULT_DB.camps);
  }

  console.log("MongoDB connected");
}

await initMongo();

/* server */
const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "OPTIONS") return send(res, 200, { ok: true });

    const url = new URL(req.url, "http://localhost");

    /* bootstrap */
    if (req.method === "GET" && url.pathname === "/api/bootstrap") {
      const tournaments = await colTournaments.find().toArray();
      const camps = await colCamps.find().toArray();
      return send(res, 200, { tournaments, camps });
    }

    /* login */
    if (req.method === "POST" && url.pathname === "/api/admin/login") {
      const body = await parseBody(req);

      if (body.username !== "admin" || body.password !== "chess123") {
        return send(res, 401, { error: "Invalid credentials" });
      }

      const token = crypto.randomUUID();
      sessions.set(token, true);

      return send(res, 200, { token });
    }

    /* logout */
    if (req.method === "POST" && url.pathname === "/api/admin/logout") {
      const token = (req.headers.authorization || "").replace("Bearer ", "");
      sessions.delete(token);
      return send(res, 200, { ok: true });
    }

    /* get registrations */
    if (req.method === "GET" && url.pathname === "/api/admin/registrations") {
      if (!authed(req)) return send(res, 401, { error: "Unauthorized" });

      const tournamentRegs = await colTournRegs
        .find()
        .sort({ id: -1 })
        .toArray();
      const campRegs = await colCampRegs.find().sort({ id: -1 }).toArray();

      return send(res, 200, { tournamentRegs, campRegs });
    }

    /* create tournament registration */
    if (
      req.method === "POST" &&
      url.pathname === "/api/registrations/tournament"
    ) {
      const body = await parseBody(req);
      const stamp = nowStamp();

      await colTournRegs.insertOne({
        id: Date.now(),
        ...body,
        date: stamp.date,
        time: stamp.time,
      });

      return send(res, 201, { ok: true });
    }

    /* create camp registration */
    if (req.method === "POST" && url.pathname === "/api/registrations/camp") {
      const body = await parseBody(req);
      const stamp = nowStamp();

      await colCampRegs.insertOne({
        id: Date.now(),
        ...body,
        date: stamp.date,
        time: stamp.time,
      });

      return send(res, 201, { ok: true });
    }

    /* DELETE tournament registration */
    const delTourReg = url.pathname.match(
      /^\/api\/admin\/registrations\/tournament\/(\d+)$/,
    );
    if (req.method === "DELETE" && delTourReg) {
      if (!authed(req)) return send(res, 401, { error: "Unauthorized" });

      const id = Number(delTourReg[1]);
      await colTournRegs.deleteOne({ id });

      const tournamentRegs = await colTournRegs
        .find()
        .sort({ id: -1 })
        .toArray();
      return send(res, 200, { tournamentRegs });
    }

    /* DELETE camp registration */
    const delCampReg = url.pathname.match(
      /^\/api\/admin\/registrations\/camp\/(\d+)$/,
    );
    if (req.method === "DELETE" && delCampReg) {
      if (!authed(req)) return send(res, 401, { error: "Unauthorized" });

      const id = Number(delCampReg[1]);
      await colCampRegs.deleteOne({ id });

      const campRegs = await colCampRegs.find().sort({ id: -1 }).toArray();
      return send(res, 200, { campRegs });
    }

    return send(res, 404, { error: "Not found" });
  } catch (err) {
    console.error(err);
    return send(res, 500, { error: "Server error" });
  }
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log("API running on port", PORT);
});
