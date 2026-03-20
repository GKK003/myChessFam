export const AUTH_KEY = "mcf_admin_token";
export const api = async (path, options = {}) => {
  const token = localStorage.getItem(AUTH_KEY);
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const BASE = import.meta.env.VITE_API_URL || "";
  const res = await fetch(`${BASE}/api${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
};

export const SOCIALS = {
  instagram: "https://www.instagram.com/mychessfamily/",
  facebook: "https://www.facebook.com/Mychessfamily",
  linkedin: "https://www.linkedin.com/in/dmitri-shevelev-145ba7/",
};
export const CONTACT = {
  city: "New York City",
  email: "mychessfamily@gmail.com",
};
export const TEAM = [
  {
    av: "♔",
    name: "David Karpov",
    role: "Head Coach",
    bio: "10+ years coaching youth chess. Loves teaching endgames and helping kids build confidence.",
    tags: ["Endgames", "Tournament Prep", "Mentorship"],
  },
  {
    av: "♕",
    name: "Sophia Chen",
    role: "Junior Coach",
    bio: "Former state scholastic champion. Specializes in beginners and building strong fundamentals.",
    tags: ["Beginners", "Tactics", "Confidence"],
  },
  {
    av: "♘",
    name: "Aisha Patel",
    role: "Camp Coordinator",
    bio: "Designs our summer camp experience. Makes every week organized, fun, and unforgettable.",
    tags: ["Camps", "Logistics", "Community"],
  },
  {
    av: "♖",
    name: "Miguel Rivera",
    role: "Strategy Coach",
    bio: "Focuses on middle-game plans and practical decision-making under time pressure.",
    tags: ["Strategy", "Middlegames", "Time Mgmt"],
  },
];
export const DEF_CAMPS = [
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
    image: "/images/camp-default.jpg",
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
    image: "/images/camp-default.jpg",
  },
];
export const PIECES = {
  0: ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
  1: ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
  6: ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
  7: ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
};
export const PIECE_SVGS = {
  "♔": "/pieces/wK.svg",
  "♕": "/pieces/wQ.svg",
  "♖": "/pieces/wR.svg",
  "♗": "/pieces/wB.svg",
  "♘": "/pieces/wN.svg",
  "♙": "/pieces/wP.svg",
  "♚": "/pieces/bK.svg",
  "♛": "/pieces/bQ.svg",
  "♜": "/pieces/bR.svg",
  "♝": "/pieces/bB.svg",
  "♞": "/pieces/bN.svg",
  "♟": "/pieces/bP.svg",
};
export const fmtDShort = (d) =>
  new Date(d + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
export const getGalleryImageSrc = (image, base) => {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  return `${base}${image.startsWith("/") ? image : `/${image}`}`;
};
export const getImageSrc = (image, base) => {
  if (!image) return "/images/camp-default.jpg";
  if (image.startsWith("http")) return image;
  if (image.startsWith("/images/")) return image;
  if (image.startsWith("images/")) return `/${image}`;
  return `${base}${image.startsWith("/") ? image : `/${image}`}`;
};

export const optimizeCloudinaryUrl = (url, width = 800) => {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com")) return url;
  if (url.includes("/upload/f_auto")) return url; // already optimized
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
};
