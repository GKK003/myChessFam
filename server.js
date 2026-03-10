/* global process, Buffer */
import express from "express";
import cors from "cors";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import { MongoClient } from "mongodb";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

/* =========================
   PATHS
========================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(process.cwd(), "dist");

/* =========================
   ENV
========================= */
const PORT = process.env.PORT || 4000;
const MONGODB_URL = process.env.MONGODB_URL || process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || "mychessfamily";
const TOKEN_SECRET = process.env.TOKEN_SECRET || "change-this-in-render";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!MONGODB_URL) {
  console.error("❌ Missing MONGODB_URL / MONGODB_URI env var");
  process.exit(1);
}

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error("❌ Missing Cloudinary environment variables");
  process.exit(1);
}

/* =========================
   CLOUDINARY
========================= */
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => {
    const original = file.originalname || "camp-image";
    const baseName = original.replace(/\.[^/.]+$/, "");
    const safeName = baseName
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50);

    return {
      folder: "mychessfamily/camps",
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
      public_id: `${Date.now()}-${safeName || "camp"}`,
    };
  },
});

const upload = multer({
  storage: cloudinaryStorage,
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

const toNumberId = (value) => Number(value);

const getCloudinaryPublicIdFromUrl = (url) => {
  try {
    if (!url || typeof url !== "string") return null;
    if (!url.includes("res.cloudinary.com")) return null;

    const parts = url.split("/");
    const uploadIndex = parts.findIndex((p) => p === "upload");
    if (uploadIndex === -1) return null;

    // after /upload/ may come version like v123456
    const afterUpload = parts.slice(uploadIndex + 1);

    const first = afterUpload[0] || "";
    const withoutVersion = /^v\d+$/.test(first)
      ? afterUpload.slice(1)
      : afterUpload;

    if (!withoutVersion.length) return null;

    const joined = withoutVersion.join("/");
    const lastDot = joined.lastIndexOf(".");
    return lastDot === -1 ? joined : joined.slice(0, lastDot);
  } catch {
    return null;
  }
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
    return res.json({ camps });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/reviews", async (_req, res) => {
  try {
    const reviews = await colReviews
      .find({ approved: true })
      .sort({ createdAt: -1 })
      .toArray();

    return res.json({ reviews });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
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
    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
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

    for (const key of required) {
      if (!body[key]) {
        return res.status(400).json({ error: `Missing ${key}` });
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
    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
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
  return res.json({ token });
});

app.post("/api/admin/logout", (_req, res) => {
  return res.json({ ok: true });
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
      image: req.file.path, // Cloudinary URL
    });
  },
);

/* =========================
   ADMIN REGISTRATIONS
========================= */
app.get("/api/admin/registrations", requireAuth, async (_req, res) => {
  try {
    const campRegs = await colCampRegs.find().sort({ createdAt: -1 }).toArray();
    return res.json({ campRegs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

app.delete(
  "/api/admin/registrations/camp/:id",
  requireAuth,
  async (req, res) => {
    try {
      const id = toNumberId(req.params.id);
      await colCampRegs.deleteOne({ id });
      return res.json({ ok: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
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
    return res.json({ camps });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

app.patch("/api/admin/camps/:id", requireAuth, async (req, res) => {
  try {
    const id = toNumberId(req.params.id);
    const body = req.body || {};

    if (!body.name || !body.dateStart || !body.dateEnd || !body.location) {
      return res.status(400).json({
        error: "Missing name/dateStart/dateEnd/location",
      });
    }

    const existingCamp = await colCamps.findOne({ id });
    if (!existingCamp) {
      return res.status(404).json({ error: "Camp not found" });
    }

    const nextImage = String(body.image || "/images/camp-default.jpg");

    if (
      existingCamp.image &&
      typeof existingCamp.image === "string" &&
      existingCamp.image !== nextImage &&
      existingCamp.image.includes("res.cloudinary.com")
    ) {
      const oldPublicId = getCloudinaryPublicIdFromUrl(existingCamp.image);
      if (oldPublicId) {
        try {
          await cloudinary.uploader.destroy(oldPublicId, {
            resource_type: "image",
          });
        } catch (e) {
          console.error("Cloudinary delete failed:", e);
        }
      }
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
          image: nextImage,
        },
      },
    );

    const camps = await colCamps.find().sort({ id: -1 }).toArray();
    return res.json({ camps });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

app.patch("/api/admin/camps/:id/status", requireAuth, async (req, res) => {
  try {
    const id = toNumberId(req.params.id);
    const status = String(req.body?.status || "");

    if (!["open", "upcoming", "full"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    await colCamps.updateOne({ id }, { $set: { status } });

    const camps = await colCamps.find().sort({ id: -1 }).toArray();
    return res.json({ camps });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/admin/camps/:id", requireAuth, async (req, res) => {
  try {
    const id = toNumberId(req.params.id);
    const camp = await colCamps.findOne({ id });

    if (!camp) {
      return res.status(404).json({ error: "Camp not found" });
    }

    if (
      camp.image &&
      typeof camp.image === "string" &&
      camp.image.includes("res.cloudinary.com")
    ) {
      const publicId = getCloudinaryPublicIdFromUrl(camp.image);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId, {
            resource_type: "image",
          });
        } catch (e) {
          console.error("Cloudinary delete failed:", e);
        }
      }
    }

    await colCamps.deleteOne({ id });

    const camps = await colCamps.find().sort({ id: -1 }).toArray();
    return res.json({ camps });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   ADMIN REVIEWS
========================= */
app.get("/api/admin/reviews", requireAuth, async (_req, res) => {
  try {
    const reviews = await colReviews.find().sort({ createdAt: -1 }).toArray();
    return res.json({ reviews });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

app.patch("/api/admin/reviews/:id/approve", requireAuth, async (req, res) => {
  try {
    const id = toNumberId(req.params.id);
    await colReviews.updateOne({ id }, { $set: { approved: true } });
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/admin/reviews/:id", requireAuth, async (req, res) => {
  try {
    const id = toNumberId(req.params.id);
    await colReviews.deleteOne({ id });
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
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
    return res.status(500).send("Server error");
  }
});

/* =========================
   START
========================= */
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
