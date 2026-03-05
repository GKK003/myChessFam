/* global Buffer, process */
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "db.json");

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
  tournamentRegs: [],
  campRegs: [],
};

const sessions = new Map();

const send = (res, status, payload) => {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
  });
  res.end(JSON.stringify(payload));
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

async function ensureDb() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_DB, null, 2));
  }
}
const readDb = async () => JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
const writeDb = async (db) =>
  fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2));

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

await ensureDb();

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return send(res, 200, { ok: true });
  const url = new URL(req.url, "http://localhost");

  if (req.method === "GET" && url.pathname === "/api/bootstrap") {
    const db = await readDb();
    return send(res, 200, { tournaments: db.tournaments, camps: db.camps });
  }

  if (req.method === "POST" && url.pathname === "/api/admin/login") {
    const body = await parseBody(req);
    if (body.username !== "admin" || body.password !== "chess123")
      return send(res, 401, { error: "Invalid credentials" });
    const token = crypto.randomUUID();
    sessions.set(token, true);
    return send(res, 200, { token });
  }

  if (req.method === "POST" && url.pathname === "/api/admin/logout") {
    const token = (req.headers.authorization || "").replace("Bearer ", "");
    if (token) sessions.delete(token);
    return send(res, 200, { ok: true });
  }

  if (req.method === "GET" && url.pathname === "/api/admin/registrations") {
    if (!authed(req)) return send(res, 401, { error: "Unauthorized" });
    const db = await readDb();
    return send(res, 200, {
      tournamentRegs: db.tournamentRegs,
      campRegs: db.campRegs,
    });
  }

  // ✅ DELETE one tournament registration
  const delTR = url.pathname.match(
    /^\/api\/admin\/registrations\/tournament\/(\d+)$/,
  );
  if (req.method === "DELETE" && delTR) {
    if (!authed(req)) return send(res, 401, { error: "Unauthorized" });
    const id = Number(delTR[1]);
    const db = await readDb();
    const before = db.tournamentRegs.length;
    db.tournamentRegs = db.tournamentRegs.filter((r) => r.id !== id);
    await writeDb(db);
    if (db.tournamentRegs.length === before)
      return send(res, 404, { error: "Registration not found" });
    return send(res, 200, { ok: true });
  }

  const delCR = url.pathname.match(
    /^\/api\/admin\/registrations\/camp\/(\d+)$/,
  );
  if (req.method === "DELETE" && delCR) {
    if (!authed(req)) return send(res, 401, { error: "Unauthorized" });
    const id = Number(delCR[1]);
    const db = await readDb();
    const before = db.campRegs.length;
    db.campRegs = db.campRegs.filter((r) => r.id !== id);
    await writeDb(db);
    if (db.campRegs.length === before)
      return send(res, 404, { error: "Sign-up not found" });
    return send(res, 200, { ok: true });
  }

  if (
    req.method === "POST" &&
    url.pathname === "/api/registrations/tournament"
  ) {
    const body = await parseBody(req);
    const db = await readDb();
    const stamp = nowStamp();
    db.tournamentRegs.push({
      id: Date.now(),
      ...body,
      date: stamp.date,
      time: stamp.time,
    });
    await writeDb(db);
    return send(res, 201, { ok: true });
  }

  if (req.method === "POST" && url.pathname === "/api/registrations/camp") {
    const body = await parseBody(req);
    const db = await readDb();
    const stamp = nowStamp();
    db.campRegs.push({
      id: Date.now(),
      ...body,
      date: stamp.date,
      time: stamp.time,
    });
    await writeDb(db);
    return send(res, 201, { ok: true });
  }

  if (req.method === "POST" && url.pathname === "/api/admin/tournaments") {
    if (!authed(req)) return send(res, 401, { error: "Unauthorized" });
    const body = await parseBody(req);
    const db = await readDb();
    db.tournaments.push({ id: Date.now(), ...body });
    await writeDb(db);
    return send(res, 201, { tournaments: db.tournaments });
  }

  const tStatus = url.pathname.match(
    /^\/api\/admin\/tournaments\/(\d+)\/status$/,
  );
  if (req.method === "PATCH" && tStatus) {
    if (!authed(req)) return send(res, 401, { error: "Unauthorized" });
    const id = Number(tStatus[1]);
    const body = await parseBody(req);
    const db = await readDb();
    db.tournaments = db.tournaments.map((t) =>
      t.id === id ? { ...t, status: body.status } : t,
    );
    await writeDb(db);
    return send(res, 200, { tournaments: db.tournaments });
  }

  const tDel = url.pathname.match(/^\/api\/admin\/tournaments\/(\d+)$/);
  if (req.method === "DELETE" && tDel) {
    if (!authed(req)) return send(res, 401, { error: "Unauthorized" });
    const id = Number(tDel[1]);
    const db = await readDb();
    db.tournaments = db.tournaments.filter((t) => t.id !== id);
    await writeDb(db);
    return send(res, 200, { tournaments: db.tournaments });
  }

  if (req.method === "POST" && url.pathname === "/api/admin/camps") {
    if (!authed(req)) return send(res, 401, { error: "Unauthorized" });
    const body = await parseBody(req);
    const db = await readDb();
    db.camps.push({ id: Date.now(), ...body });
    await writeDb(db);
    return send(res, 201, { camps: db.camps });
  }

  const cStatus = url.pathname.match(/^\/api\/admin\/camps\/(\d+)\/status$/);
  if (req.method === "PATCH" && cStatus) {
    if (!authed(req)) return send(res, 401, { error: "Unauthorized" });
    const id = Number(cStatus[1]);
    const body = await parseBody(req);
    const db = await readDb();
    db.camps = db.camps.map((c) =>
      c.id === id ? { ...c, status: body.status } : c,
    );
    await writeDb(db);
    return send(res, 200, { camps: db.camps });
  }

  const cDel = url.pathname.match(/^\/api\/admin\/camps\/(\d+)$/);
  if (req.method === "DELETE" && cDel) {
    if (!authed(req)) return send(res, 401, { error: "Unauthorized" });
    const id = Number(cDel[1]);
    const db = await readDb();
    db.camps = db.camps.filter((c) => c.id !== id);
    await writeDb(db);
    return send(res, 200, { camps: db.camps });
  }

  return send(res, 404, { error: "Not found" });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () =>
  console.log(`API server running on http://localhost:${PORT}`),
);
