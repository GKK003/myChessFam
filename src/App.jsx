import { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import ChatBot from "./ChatBot";
import { useLang } from "./LangContext";

/* ══════════════════════════════════════════ API ══════════════════════════════════════════ */
const AUTH_KEY = "mcf_admin_token";
const api = async (path, options = {}) => {
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

/* ══════════════════════════════════════════ CONTENT / SETTINGS ══════════════════════════════════════════ */
const SOCIALS = {
  instagram: "https://www.instagram.com/mychessfamily/",
  facebook: "https://www.facebook.com/Mychessfamily",
  linkedin: "https://www.linkedin.com/in/dmitri-shevelev-145ba7/",
};
const CONTACT = { city: "New York City", email: "mychessfamily@gmail.com" };
const TEAM = [
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
const DEF_CAMPS = [
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
const PIECES = {
  0: ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
  1: ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
  6: ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
  7: ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
};
const PIECE_SVGS = {
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
const fmtDShort = (d) =>
  new Date(d + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const getGalleryImageSrc = (image, base) => {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  return `${base}${image.startsWith("/") ? image : `/${image}`}`;
};

const getImageSrc = (image, base) => {
  if (!image) return "/images/camp-default.jpg";
  if (image.startsWith("http")) return image;
  if (image.startsWith("/images/")) return image;
  if (image.startsWith("images/")) return `/${image}`;
  return `${base}${image.startsWith("/") ? image : `/${image}`}`;
};

/* ══════════════════════════════════════════ STYLES ══════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:100%;overflow-x:hidden;scroll-behavior:smooth;}
body{font-family:'DM Sans',sans-serif;background:#09131E;color:#DCE9F5;}
:root{
  --navy:#09131E;--navy2:#0D1E30;--navy3:#122540;--navy4:#183050;
  --blue:#1A5EA8;--blue2:#2272CC;--blue3:#4AABE8;
  --green:#157A45;--green2:#1FA85E;
  --cream:#DCE9F5;--muted:rgba(180,210,240,0.6);
  --border:rgba(74,171,232,0.18);--borderg:rgba(45,204,116,0.2);
  --r:13px;
}

/* ── NAV ── */
.nav{position:fixed;top:0;left:0;width:100%;z-index:999;height:100px;display:flex;align-items:center;justify-content:space-between;padding:0 2.5rem;background:rgba(9,19,30,0.97);border-bottom:1px solid var(--border);backdrop-filter:blur(18px);transform:translateY(0);transition:transform .35s ease;overflow:visible;}
.nav-hide{transform:translateY(-100%);}
.nav-logo{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:900;color:var(--green2);cursor:pointer;display:flex;align-items:center;gap:8px;white-space:nowrap;text-decoration:none;}
.nav-links{display:flex;gap:2px;flex-wrap:wrap;}
.nav-right{display:flex;align-items:center;gap:5px;overflow:visible;position:relative;}
.nb{background:none;border:none;color:var(--muted);font-family:'DM Sans',sans-serif;font-size:.875rem;font-weight:500;padding:.4rem .85rem;border-radius:7px;cursor:pointer;transition:.18s;white-space:nowrap;}
.nb:hover,.nb.on{color:var(--blue3);background:rgba(74,171,232,0.1);}
.nb.cta{background:var(--green2);color:#fff;font-weight:700;padding:.4rem 1.1rem;}
.nb.cta:hover{background:var(--green2);}
.nb.cta.adm{background:rgba(21,122,69,0.22);color:var(--green2);border:1px solid rgba(45,204,116,0.35);}
.nb.cta.adm:hover{background:rgba(21,122,69,0.38);}
.adm-dot{font-size:.78rem;color:var(--green2);font-weight:600;}

/* ── PAGE BASE ── */
.pg{width:100vw;min-height:100vh;padding-top:100px;}
.pg-center{width:100vw;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:120px 1rem 2rem;}

/* ── HERO ── */
.hero{width:100%;min-height:calc(100vh - 66px);display:flex;align-items:center;background:linear-gradient(135deg,#09131E 0%,#0D1E2C 55%,#091A10 100%);position:relative;overflow:hidden;}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 68% 50%,rgba(21,122,69,.1) 0%,transparent 55%),radial-gradient(ellipse at 20% 75%,rgba(26,94,168,.12) 0%,transparent 50%);}
.hero-bg{position:absolute;inset:0;opacity:.04;pointer-events:none;}
.hero-bg div{background:var(--blue3);}
.hero-bg div:nth-child(even){background:transparent;}
.hero-inner{position:relative;z-index:2;width:100%;max-width:1320px;margin:0 auto;padding:3rem 2.5rem;display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;}
.hero-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(74,171,232,0.18);border:1px solid rgba(74,171,232,0.18);color:rgb(238,245,255);font-size:.73rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:.32rem .95rem;border-radius:100px;margin-bottom:1.35rem;animation:fu .6s ease both;}
.hero h1{font-family:'Playfair Display',serif;font-size:clamp(2.3rem,4.8vw,4.2rem);font-weight:900;line-height:1.07;margin-bottom:1.3rem;animation:fu .6s ease .1s both;}
.hero h1 em{color:var(--green2);font-style:normal;}
.hero-sub{font-size:1.02rem;color:var(--muted);line-height:1.78;margin-bottom:2rem;animation:fu .6s ease .2s both;}
.hero-btns{display:flex;gap:.9rem;flex-wrap:wrap;animation:fu .6s ease .3s both;}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-top:2rem;animation:fu .6s ease .45s both;}
.stat{background:rgba(26,94,168,.1);border:1px solid var(--border);border-radius:11px;padding:1rem;text-align:center;}
.stat-n{font-family:'Playfair Display',serif;font-size:1.9rem;font-weight:900;color:var(--green2);}
.stat-l{font-size:.75rem;color:var(--muted);margin-top:1px;}

/* ── BOARD ── */
.board-wrap{animation:fu .6s ease .2s both;position:relative;}
.board-wrap::after{content:'';position:absolute;inset:-7px;border-radius:18px;background:linear-gradient(135deg,var(--green2),var(--blue2),var(--green2),var(--blue3));z-index:-1;opacity:.45;}
.mboard{display:grid;grid-template-columns:repeat(8,1fr);border-radius:11px;overflow:hidden;box-shadow:0 28px 70px rgba(0,0,0,.7);}
.sq{aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:clamp(.8rem,2vw,1.75rem);}
.sq-l{background:#C8E6C0;}.sq-d{background:#2D6A4F;}

/* ── BTN ── */
.btn{display:inline-flex;align-items:center;gap:6px;font-family:'DM Sans',sans-serif;font-size:.93rem;font-weight:700;padding:.82rem 1.75rem;border-radius:9px;border:none;cursor:pointer;position:relative;overflow:hidden;transition:transform .22s ease,box-shadow .28s ease,background .22s ease;}
.btn::after{content:"";position:absolute;top:0;left:-130%;width:120%;height:100%;background:linear-gradient(120deg,transparent,rgba(255,255,255,.22),transparent);transition:left .65s ease;}
.btn:hover::after{left:130%;}
.btn-g{background:var(--green2);color:#fff;}
.btn-g:hover{background:var(--green2);transform:translateY(-3px);box-shadow:0 12px 30px rgba(21,122,69,.38),0 0 14px rgba(31,168,94,.28);}
.btn-soft:hover{transform:translateY(-3px);box-shadow:0 12px 30px rgba(74,171,232,.22),0 0 14px rgba(74,171,232,.18);}

/* ── SECTIONS ── */
.wrap{width:100%;max-width:1320px;margin:0 auto;padding:4.5rem 2.5rem;}
.slbl{font-size:.72rem;letter-spacing:3px;text-transform:uppercase;color:var(--green2);font-weight:700;margin-bottom:.55rem;}
.stit{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,3.3vw,2.85rem);font-weight:900;line-height:1.15;margin-bottom:1.4rem;}
.sdiv{width:100%;height:1px;background:linear-gradient(90deg,transparent,var(--border),transparent);}

/* ── PAGE HEADER ── */
.ph{width:100%;background:linear-gradient(180deg,rgba(26,94,168,.08) 0%,transparent 100%);border-bottom:1px solid var(--border);padding:3.5rem 2.5rem 3rem;text-align:center;}
.ph .stit{margin-bottom:.7rem;}
.ph-sub{color:var(--muted);max-width:540px;margin:0 auto;line-height:1.72;font-size:.93rem;}

/* ── GRIDS ── */
.g3{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:1.4rem;margin-top:2.2rem;}
.g4{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1.2rem;}



.status-drop{
  position:relative;
  min-width:120px;
}

.status-drop-trigger{
  width:100%;
  display:flex;
  align-items:center;
  gap:.5rem;
  padding:.38rem .55rem .38rem .65rem;
  background:rgba(13,30,48,.8);
  border:1px solid rgba(74,171,232,0.22);
  border-radius:9px;
  cursor:pointer;
  transition:background .18s,border-color .18s,border-radius .15s;
  font-family:'DM Sans',sans-serif;
  font-weight:700;
  font-size:.82rem;
  color:#DCE9F5;
  letter-spacing:.4px;
  white-space:nowrap;
  user-select:none;
  min-height:38px;
  justify-content:space-between;
}

.status-drop:hover .status-drop-trigger{
  background:rgba(26,94,168,.22);
  border-color:rgba(74,171,232,0.4);
  border-bottom-left-radius:0;
  border-bottom-right-radius:0;
}

.status-chevron{
  width:13px;
  height:13px;
  opacity:.5;
  flex-shrink:0;
}

.status-drop-menu{
  position:absolute;
  top:100%;
  left:0;
  right:0;
  background:#0C1C2E;
  border:1px solid rgba(74,171,232,0.42);
  border-top:none;
  border-radius:0 0 9px 9px;
  overflow:hidden;
  box-shadow:0 16px 40px rgba(0,0,0,.6);
  z-index:601;
  display:none;
}

.status-drop-menu.open{
  display:block;
}

.status-drop-trigger.open{
  background:rgba(26,94,168,.25);
  border-color:rgba(74,171,232,.42);
  border-bottom-left-radius:0;
  border-bottom-right-radius:0;
}
.status-drop-item{
  padding:.58rem .7rem;
  cursor:pointer;
  font-family:'DM Sans',sans-serif;
  font-weight:600;
  font-size:.82rem;
  color:rgba(180,210,240,.7);
  transition:background .13s,color .13s;
  letter-spacing:.3px;
}

.status-drop-item:not(:last-child){
  border-bottom:1px solid rgba(74,171,232,.08);
}

.status-drop-item:hover{
  background:rgba(74,171,232,.1);
  color:#EEF5FF;
}

.status-drop-item.selected{
  color:var(--green2);
  background:rgba(21,122,69,.1);
}


/* ── PROGRAM CARDS ── */
.prog{background:rgba(26,94,168,.07);border:1px solid var(--border);border-radius:var(--r);padding:1.8rem;transition:.28s;position:relative;overflow:hidden;}
.prog::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--green2);}
.prog:nth-child(2)::before{background:var(--blue3);}
.prog:nth-child(3)::before{background:var(--green2);}
.prog:hover{transform:translateY(-5px);box-shadow:0 18px 55px rgba(0,0,0,.4);border-color:rgba(74,171,232,.3);}
.prog-icon{font-size:2.2rem;margin-bottom:.85rem;}
.prog h3{font-family:'Playfair Display',serif;font-size:1.3rem;margin-bottom:.65rem;}
.prog p{color:var(--muted);line-height:1.65;font-size:.91rem;}
.prog-tag{display:inline-block;margin-top:.85rem;background:rgba(21,122,69,.14);color:var(--green2);font-size:.7rem;font-weight:700;letter-spacing:1px;padding:.22rem .7rem;border-radius:100px;}

/* ── SERVICES PAGE ── */
.svc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.4rem;margin-top:2rem;}
.svc-card{background:rgba(26,94,168,.07);border:1px solid var(--border);border-radius:16px;padding:1.7rem;transition:.25s;}
.svc-card:hover{transform:translateY(-4px);box-shadow:0 18px 50px rgba(0,0,0,.28);border-color:rgba(74,171,232,.28);}
.svc-icon{font-size:2rem;margin-bottom:.85rem;}
.svc-title{font-family:'Playfair Display',serif;font-size:1.3rem;color:#EEF5FF;margin-bottom:.55rem;}
.svc-text{color:var(--muted);line-height:1.7;font-size:.91rem;}
.svc-list{display:grid;gap:.55rem;margin-top:1rem;}
.svc-li{color:rgba(220,233,245,.9);font-size:.88rem;}
.svc-band{margin-top:2.5rem;background:rgba(21,122,69,.08);border:1px solid var(--borderg);border-radius:18px;padding:1.6rem;}
.svc-band-title{font-weight:800;color:#EEF5FF;margin-bottom:.5rem;}
.svc-band-text{color:var(--muted);line-height:1.7;font-size:.92rem;}

/* ── CAMP CARD ── */
.cc{background:rgba(21,122,69,.08);border:1px solid var(--borderg);border-radius:18px;overflow:hidden;transition:.28s;}
.cc:hover{transform:translateY(-5px);box-shadow:0 18px 55px rgba(21,122,69,.18);border-color:rgba(45,204,116,.38);}
.cc-top{height:140px;display:flex;align-items:center;justify-content:center;font-size:4rem;position:relative;background:linear-gradient(135deg,#081A0F,#0D3320);}
.cc-tbdg{position:absolute;top:.85rem;right:.85rem;background:var(--green2);color:#fff;font-size:.65rem;font-weight:700;padding:.22rem .65rem;border-radius:100px;}
.cc-body{padding:1.4rem;}
.cc-body h3{font-family:'Playfair Display',serif;font-size:1.15rem;color:#EEF5FF;margin-bottom:.3rem;}
.cc-sub{color:var(--muted);font-size:.83rem;margin-bottom:.5rem;}
.cc-price{font-family:'Playfair Display',serif;font-size:1.8rem;color:var(--green2);font-weight:900;margin:.5rem 0;}
.cc-price span{font-size:.85rem;color:var(--muted);font-family:'DM Sans',sans-serif;font-weight:400;}
.cc-desc{color:var(--muted);font-size:.85rem;line-height:1.6;margin-bottom:1.1rem;}
.piece{width:75%;height:75%;object-fit:contain;pointer-events:none;}

/* ── BURGER ── */
.burger{display:none;width:42px;height:42px;border-radius:10px;border:1px solid var(--border);background:rgba(26,94,168,.09);color:var(--cream);cursor:pointer;align-items:center;justify-content:center;transition:.18s;}
.burger:hover{background:rgba(26,94,168,.14);}
.burger-lines{width:18px;height:14px;position:relative;padding-right:14px;}
.burger-lines span{position:absolute;left:0;right:0;height:2px;border-radius:2px;background:rgba(220,233,245,.9);transition:.18s;display:block;}
.burger-lines span:nth-child(1){top:0;}
.burger-lines span:nth-child(2){top:6px;opacity:.9;}
.burger-lines span:nth-child(3){top:12px;}
.burger.on .burger-lines span:nth-child(1){transform:translateY(6px) rotate(45deg);}
.burger.on .burger-lines span:nth-child(2){opacity:0;}
.burger.on .burger-lines span:nth-child(3){transform:translateY(-6px) rotate(-45deg);}

/* Overlay */
.mnav-ovl{position:fixed;inset:0;z-index:1200;background:rgba(0,0,0,.6);backdrop-filter:blur(8px);opacity:0;pointer-events:none;transition:.2s;}
.mnav-ovl.on{opacity:1;pointer-events:auto;}

/* Drawer */
.mnav{position:fixed;top:0;right:0;height:100vh;z-index:1250;width:min(86vw,360px);background:#0C1C2E;border-left:1px solid var(--border);transform:translateX(105%);transition:transform .25s cubic-bezier(.2,.9,.2,1);display:flex;flex-direction:column;}
.mnav.on{transform:translateX(0);}
.mnav-h{padding:1.2rem 1.2rem .9rem;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(74,171,232,.12);}
.mnav-logo{font-family:'Playfair Display',serif;font-size:1.25rem;font-weight:900;color:var(--green2);display:flex;align-items:center;gap:8px;}
.mnav-close{width:40px;height:40px;border-radius:10px;border:1px solid var(--border);background:rgba(26,94,168,.09);color:var(--cream);cursor:pointer;padding:0;}
.mnav-close:hover{background:rgba(26,94,168,.14);}
.mnav-links{padding:1rem 1.2rem;display:flex;flex-direction:column;gap:.55rem;}
.mnav-btn{width:100%;display:flex;align-items:center;justify-content:space-between;padding:.85rem 1rem;border-radius:12px;border:1px solid rgba(74,171,232,.14);background:rgba(26,94,168,.07);color:rgba(220,233,245,.92);font-weight:700;cursor:pointer;transition:.18s;}
.mnav-btn:hover{background:rgba(26,94,168,.12);border-color:rgba(74,171,232,.28);}
.mnav-btn.on{border-color:rgba(45,204,116,.35);background:rgba(21,122,69,.12);color:#EEF5FF;}
.mnav-cta{margin-top:auto;padding:1rem 1.2rem 1.2rem;border-top:1px solid rgba(74,171,232,.12);}
.mnav-cta .btn{width:100%;justify-content:center;}

@media (min-width: 1231px){.burger{display:none !important;}.mnav,.mnav-ovl{display:none !important;}   }
@media(max-width:1230px){.nav-links{display:none !important;}.burger{display:flex !important;} .nb{display:none} .lang-drop{display:none !important;}}





/* ── STATUS BADGE ── */
.bdg{position:absolute;top:.9rem;right:.9rem;padding:.22rem .7rem;border-radius:100px;font-size:.66rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;}
.bdg-open{background:var(--green2);color:#fff;}
.bdg-up{background:rgba(74,171,232,.2);color:var(--blue3);border:1px solid var(--blue3);}
.bdg-full{background:rgba(220,53,69,.18);color:#fc8181;border:1px solid #fc8181;}

/* ── ACTION BTN ── */
.abtn{width:100%;padding:.82rem 1.75rem;background:var(--green2);color:#fff;font-weight:700;font-family:'DM Sans',sans-serif;border:none;border-radius:9px;cursor:pointer;font-size:.93rem;transition:transform .22s ease,box-shadow .28s ease;}
.abtn:hover{background:var(--green2);transform:translateY(-1px);}
.abtn:disabled{background:rgba(255,255,255,.07);color:rgba(180,210,240,.3);cursor:not-allowed;transform:none;}

/* ── FORMS ── */
.fgrid{display:grid;grid-template-columns:1fr 1fr;gap:.9rem;}
.fg{margin-bottom:.9rem;}
.fg.full{grid-column:1/-1;}
.lbl{display:block;font-size:.8rem;font-weight:600;color:rgba(180,210,240,.85);margin-bottom:.32rem;letter-spacing:.3px;}
.inp{width:100%;padding:.72rem .95rem;background:rgba(26,94,168,.09);border:1.5px solid rgba(74,171,232,.18);border-radius:8px;color:var(--cream);font-family:'DM Sans',sans-serif;font-size:.91rem;transition:.2s;outline:none;}
.inp:focus{border-color:var(--green2);background:rgba(21,122,69,.09);box-shadow:0 0 0 3px rgba(45,204,116,.12);}
.inp::placeholder{color:rgba(180,210,240,.22);}
select.inp option{background:#0D1E30;}
textarea.inp{min-height:85px;resize:vertical;}

/* ── DATE INPUT — mobile fix ── */
input[type="date"].inp,
input[type="date"]{
  width:100%;
  max-width:100%;
  min-width:0;
  box-sizing:border-box;
  -webkit-appearance:none;
  appearance:none;
  display:block;
}
input[type="date"]::-webkit-date-and-time-value{
  text-align:left;
}
@media(max-width:600px){
  input[type="date"].inp,
  input[type="date"]{
    font-size:.85rem;
    padding:.72rem .7rem;
  }
}
.sbtn{width:100%;padding:.82rem 1.75rem;background:var(--green2);color:#fff;font-weight:700;font-family:'DM Sans',sans-serif;font-size:.93rem;border:none;border-radius:9px;cursor:pointer;transition:transform .22s ease,box-shadow .28s ease;margin-top:.25rem;position:relative;overflow:hidden;}
.sbtn:hover{background:var(--green2);transform:translateY(-3px);box-shadow:0 12px 30px rgba(21,122,69,.38),0 0 14px rgba(31,168,94,.28);}
.ok-box{display:flex;flex-direction:column;align-items:center;background:rgba(21,122,69,.14);border:1px solid var(--green2);border-radius:10px;padding:1.3rem;text-align:center;margin-top:.85rem;animation:fu .4s ease;}
.err-box{background:rgba(220,53,69,.1);border:1px solid rgba(220,53,69,.28);border-radius:8px;padding:.65rem .95rem;color:#fc8181;font-size:.86rem;margin-top:.85rem;}

/* ── MODAL ── */
.ovl{position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.88);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:1rem;}
.modal{background:#0C1C2E;border:1px solid var(--border);border-radius:18px;padding:2.2rem;max-width:530px;width:100%;max-height:92vh;overflow-y:auto;animation:fu .3s ease;}
.modal h3{font-family:'Playfair Display',serif;font-size:1.5rem;margin-bottom:1.3rem;color:#EEF5FF;}
.mcls{float:right;background:none;border:none;color:var(--muted);font-size:1.55rem;cursor:pointer;line-height:1;margin:-3px 0 0;}
.mcls:hover{color:var(--cream);}

/* ══════════════════════════════════════════
   ADMIN — FULLY RESPONSIVE FIXES
══════════════════════════════════════════ */
.login-box{max-width:430px;margin:0 auto;background:rgba(13,30,48,.85);border:1px solid var(--border);border-radius:18px;padding:2.3rem;text-align:center; min-width: 400px}

.adm-wrap{width:100%;max-width:1200px;margin:0 auto;padding:2rem 1.5rem 4rem;}
@media(max-width:600px){.adm-wrap{padding:1.2rem .85rem 3rem;}}

.adm-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:1rem;margin-bottom:2rem;}
@media(max-width:480px){.adm-stats{grid-template-columns:1fr 1fr;}}

.atabs{
  display:flex;
  gap:6px;
  margin-bottom:1.8rem;
  border-bottom:1px solid rgba(74,171,232,.12);
  padding-bottom:.85rem;
  flex-wrap:wrap;
  overflow-x:auto;
  -webkit-overflow-scrolling:touch;
}
.atab{background:none;border:none;color:var(--muted);font-family:'DM Sans',sans-serif;font-size:.875rem;font-weight:600;padding:.42rem .95rem;cursor:pointer;border-radius:7px;transition:.18s;white-space:nowrap;}
.atab.on{background:rgba(21,122,69,.14);color:var(--green2);}

.add-form{background:rgba(13,30,48,.8);border:1px solid var(--border);border-radius:14px;padding:1.8rem;margin-bottom:1.8rem;}
@media(max-width:600px){.add-form{padding:1.2rem .95rem;}}

@media(max-width:600px){
  .fgrid{grid-template-columns:1fr !important;}
  .fgrid .fg{grid-column:1 !important;}
  .fg.full{grid-column:1 !important;}
}

.ei{
  background:rgba(26,94,168,.07);
  border:1px solid var(--border);
  border-radius:10px;
  padding:.95rem 1.1rem;
  margin-bottom:.7rem;
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:1rem;
  flex-wrap:wrap;
}
.ei-inner{
  flex:1;
  display:flex;
  gap:1rem;
  align-items:flex-start;
  min-width:0;
}
.ei-img{
  width:90px;
  height:70px;
  object-fit:cover;
  border-radius:10px;
  border:1px solid rgba(255,255,255,.08);
  flex-shrink:0;
}
@media(max-width:520px){
  .ei-img{width:64px;height:52px;}
}
.ei-text{min-width:0;}
.ei-name{font-weight:600;margin-bottom:.22rem;color:#EEF5FF;word-break:break-word;}
.ei-meta{font-size:.8rem;color:var(--muted);word-break:break-word;}



.ei-actions{
  display:flex;
  gap:.5rem;
  flex-shrink:0;
  align-items:center;
  flex-wrap:wrap;
}
@media(max-width:640px){
  .ei{flex-direction:column;}
  .ei-inner{width:100%;}
  .ei-actions{width:100%;justify-content:flex-start;}
}

.delbtn{background:rgba(220,53,69,.14);border:1px solid rgba(220,53,69,.28);color:#fc8181;border-radius:7px;padding:.38rem .75rem;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:.8rem;transition:.18s;flex-shrink:0;}
.delbtn:hover{background:rgba(220,53,69,.26);}
.ssel{
  appearance:none;
  -webkit-appearance:none;
  -moz-appearance:none;

  min-width:120px;
  height:38px;
  padding:.38rem 2rem .38rem .75rem;

  background-color:rgba(13,30,48,.8);
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(220,233,245,0.75)' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat:no-repeat;
  background-position:right .6rem center;
  background-size:13px;

  border:1px solid rgba(74,171,232,0.22);
  border-radius:9px;
  color:#DCE9F5;
  cursor:pointer;

  font-family:'DM Sans',sans-serif;
  font-size:.82rem;
  font-weight:700;
  letter-spacing:.4px;
  line-height:1;
  outline:none;
  transition:background .18s,border-color .18s,box-shadow .18s,color .18s;
}

.ssel:hover{
  background-color:rgba(26,94,168,.22);
  border-color:rgba(74,171,232,0.4);
}

.ssel:focus{
  border-color:var(--green2);
  box-shadow:0 0 0 3px rgba(45,204,116,.12);
}

.ssel option{
  background:#0C1C2E;
  color:#DCE9F5;
}

/* ── CUSTOM FILE INPUT ── */
.file-upload{
  width:100%;
}

.file-upload-input{
  display:none;
}

.file-upload-box{
  width:100%;
  display:flex;
  align-items:center;
  gap:.85rem;
  padding:.9rem 1rem;
  background:linear-gradient(180deg, rgba(13,30,48,.95) 0%, rgba(9,25,42,.95) 100%);
  border:1px solid rgba(74,171,232,.2);
  border-radius:12px;
  color:#DCE9F5;
  cursor:pointer;
  transition:border-color .18s, background .18s, box-shadow .18s, transform .18s;
  min-height:56px;
}

.file-upload-box:hover{
  border-color:rgba(74,171,232,.4);
  background:linear-gradient(180deg, rgba(18,40,64,.98) 0%, rgba(12,32,52,.98) 100%);
  box-shadow:0 10px 24px rgba(0,0,0,.22);
}

.file-upload-box:focus-within{
  border-color:var(--green2);
  box-shadow:0 0 0 3px rgba(45,204,116,.12);
}

.file-upload-btn{
  flex-shrink:0;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:.68rem 1rem;
  border-radius:10px;
  background:linear-gradient(180deg, #1FA85E 0%, #157A45 100%);
  color:#fff;
  font-size:.82rem;
  font-weight:800;
  line-height:1;
  white-space:nowrap;
  box-shadow:0 8px 18px rgba(21,122,69,.28);
}

.file-upload-name{
  min-width:0;
  flex:1;
  color:rgba(220,233,245,.82);
  font-size:.9rem;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}

.file-upload-empty{
  color:rgba(180,210,240,.5);
}


.adm-section-title{font-family:'Playfair Display',serif;font-size:1.15rem;margin-bottom:.9rem;}

.twrap{overflow-x:auto;margin-top:.9rem;-webkit-overflow-scrolling:touch;}
table{width:100%;border-collapse:collapse;font-size:.85rem;min-width:900px;}
th{background:rgba(26,94,168,.14);color:var(--blue3);text-align:left;padding:.65rem .95rem;font-size:.7rem;letter-spacing:1px;text-transform:uppercase;white-space:nowrap;}
td{padding:.72rem .95rem;border-bottom:1px solid rgba(74,171,232,.07);color:rgba(180,210,240,.85);vertical-align:middle;}
tr:hover td{background:rgba(26,94,168,.07);}
.empty{text-align:center;padding:2.5rem;color:var(--muted);}
.empty-i{font-size:2.3rem;margin-bottom:.6rem;}

.reg-cards{display:none;flex-direction:column;gap:1rem;margin-top:.9rem;}
.reg-card{background:rgba(26,94,168,.07);border:1px solid var(--border);border-radius:12px;padding:1rem 1.1rem;}
.reg-card-row{display:flex;justify-content:space-between;flex-wrap:wrap;gap:.4rem;margin-bottom:.4rem;}
.reg-card-label{font-size:.72rem;text-transform:uppercase;letter-spacing:1px;color:var(--blue3);font-weight:700;}
.reg-card-value{font-size:.88rem;color:rgba(220,233,245,.9);}
@media(max-width:700px){
  .twrap{display:none;}
  .reg-cards{display:flex;}
}

/* ── ABOUT ── */
.about-g{display:grid;grid-template-columns:1fr 1fr;gap:3.5rem;align-items:center;}
.about-vis{background:linear-gradient(135deg,var(--navy3),var(--navy4));border-radius:18px;padding:2.5rem;text-align:center;border:1px solid var(--border);}
.apc{font-size:3.8rem;line-height:1.6;}

/* ── TEAM ── */
.tgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(195px,1fr));gap:1.3rem;margin-top:2.2rem;}
.tcard{text-align:center;background:rgba(26,94,168,.07);border:1px solid var(--border);border-radius:var(--r);padding:1.8rem 1.3rem;transition:.28s;position:relative;overflow:hidden;}
.tcard::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--green2),var(--blue3));opacity:.9;}
.tcard:hover{border-color:rgba(45,204,116,.35);transform:translateY(-4px);box-shadow:0 18px 55px rgba(0,0,0,.35);}
.tav{width:66px;height:66px;border-radius:50%;margin:0 auto .85rem;display:flex;align-items:center;justify-content:center;font-size:1.8rem;background:linear-gradient(135deg,var(--navy3),var(--navy4));border:2px solid var(--green2);}
.tcard h4{font-weight:700;margin-bottom:.18rem;color:#EEF5FF;}
.tcard .role{font-size:.8rem;color:var(--muted);}
.tcard .bio{font-size:.81rem;color:var(--muted);margin-top:.65rem;line-height:1.5;}
.tagrow{display:flex;flex-wrap:wrap;gap:.35rem;justify-content:center;margin-top:.85rem;}
.tag{font-size:.68rem;font-weight:700;letter-spacing:.5px;color:rgba(220,233,245,.9);background:rgba(45,204,116,.12);border:1px solid rgba(45,204,116,.22);padding:.18rem .5rem;border-radius:999px;}

/* ── FOOTER ── */
.footer{width:100vw;background:#060F18;border-top:1px solid var(--border);padding:3rem 2.5rem;text-align:center;color:var(--muted);font-size:.86rem;}
.f-logo{font-family:'Playfair Display',serif;font-size:1.65rem;color:var(--green2);margin-bottom:.85rem;}
.f-links{display:flex;justify-content:center;gap:2rem;margin:1.1rem 0;flex-wrap:wrap;}
.flnk{color:var(--muted);text-decoration:none;cursor:pointer;transition:.18s;background:none;border:none;font-family:'DM Sans',sans-serif;font-size:.86rem;padding:0;}
.flnk:hover{color:var(--green2);}


.lang-flag{
  width:20px;
  height:14px;
  object-fit:cover;
  display:inline-block;
  flex-shrink:0;
  border-radius:2px;
  box-shadow:0 1px 3px rgba(0,0,0,.35);
}

/* ── CUSTOM LANG DROPDOWN ── */
.lang-drop{
  position:relative;
  display:flex;
  align-items:center;
  z-index:600;
}
.lang-drop-trigger{
  display:flex;
  align-items:center;
  gap:.5rem;
  padding:.38rem .55rem .38rem .65rem;
  background:rgba(13,30,48,.8);
  border:1px solid rgba(74,171,232,0.22);
  border-radius:9px;
  cursor:pointer;
  transition:background .18s,border-color .18s,border-radius .15s;
  font-family:'DM Sans',sans-serif;
  font-weight:700;
  font-size:.82rem;
  color:#DCE9F5;
  letter-spacing:.4px;
  white-space:nowrap;
  user-select:none;
  min-width:80px;
}
.lang-drop-trigger:hover{
  background:rgba(26,94,168,.22);
  border-color:rgba(74,171,232,0.4);
}
.lang-drop-trigger.open{
  background:rgba(26,94,168,.25);
  border-color:rgba(74,171,232,0.42);
  border-bottom-left-radius:0;
  border-bottom-right-radius:0;
  border-bottom-color:rgba(13,30,48,.8);
}
.lang-chevron{
  width:13px;
  height:13px;
  margin-left:auto;
  opacity:.5;
  transition:transform .2s ease,opacity .2s;
  flex-shrink:0;
}
.lang-drop-trigger.open .lang-chevron{
  transform:rotate(180deg);
  opacity:.85;
}
.lang-drop-menu{
  position:absolute;
  top:100%;
  left:0;
  right:0;
  background:#0C1C2E;
  border:1px solid rgba(74,171,232,0.42);
  border-top:none;
  border-radius:0 0 9px 9px;
  overflow:hidden;
  box-shadow:0 16px 40px rgba(0,0,0,.6);
  z-index:601;
  animation:langIn .14s ease;
  min-width:120px;
}
@keyframes langIn{from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:translateY(0);}}
.lang-drop-item{
  display:flex;
  align-items:center;
  gap:.55rem;
  padding:.58rem .7rem;
  cursor:pointer;
  font-family:'DM Sans',sans-serif;
  font-weight:600;
  font-size:.82rem;
  color:rgba(180,210,240,.7);
  transition:background .13s,color .13s;
  letter-spacing:.3px;
}
.lang-drop-item:not(:last-child){
  border-bottom:1px solid rgba(74,171,232,.08);
}
.lang-drop-item:hover{
  background:rgba(74,171,232,.1);
  color:#EEF5FF;
}
.lang-drop-item.selected{
  color:var(--green2);
  background:rgba(21,122,69,.1);
}
.lang-drop-item.selected .lang-tick{
  margin-left:auto;
  font-size:.72rem;
  color:var(--green2);
}


/* ── MOBILE LANG SWITCHER ── */
.mnav-lang-wrap{
  border-radius:12px;
  border:1px solid rgba(74,171,232,.14);
  background:rgba(26,94,168,.06);
  overflow:hidden;
}
.mnav-lang-label{
  padding:.6rem 1rem .42rem;
  font-size:.64rem;
  letter-spacing:2px;
  text-transform:uppercase;
  color:rgba(180,210,240,.38);
  font-weight:700;
}
.mnav-lang-row{
  display:flex;
  border-top:1px solid rgba(74,171,232,.08);
}
.mnav-lang-item{
  flex:1;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:.42rem;
  padding:.72rem .4rem;
  background:transparent;
  border:none;
  border-right:1px solid rgba(74,171,232,.08);
  color:rgba(180,210,240,.55);
  font-family:'DM Sans',sans-serif;
  font-weight:700;
  font-size:.8rem;
  cursor:pointer;
  transition:.18s;
  letter-spacing:.3px;
}
.mnav-lang-item:last-child{border-right:none;}
.mnav-lang-item:hover{background:rgba(74,171,232,.07);color:rgba(220,233,245,.9);}
.mnav-lang-item.active{
  color:var(--green2);
  background:rgba(21,122,69,.1);
}

/* ── MISC ── */
.chip{display:inline-block;background:rgba(21,122,69,.12);border:1px solid var(--borderg);color:var(--green2);font-size:.7rem;font-weight:600;padding:.18rem .62rem;border-radius:100px;margin:.18rem;}
.toast{position:fixed;bottom:1.8rem;right:1.8rem;z-index:2000;background:#0C1C2E;border-radius:11px;padding:.95rem 1.4rem;font-size:.88rem;font-weight:600;display:flex;align-items:center;gap:.65rem;box-shadow:0 10px 38px rgba(0,0,0,.55);animation:toastIn .4s cubic-bezier(.34,1.56,.64,1);max-width:310px;}
.toast-s{border:1px solid var(--green2);color:var(--green2);}
.toast-e{border:1px solid #fc8181;color:#fc8181;}
.toast-i{border:1px solid var(--border);color:var(--cream);}
@keyframes fu{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
@keyframes toastIn{from{opacity:0;transform:translateY(100%);}to{opacity:1;transform:translateY(0);}}

/* ── HOME SPLIT SECTIONS ── */
.home-split-sec{width:100%;background:#F5F6F8;padding:5rem 0;}
.home-split-wrap{width:100%;max-width:1320px;margin:0 auto;padding:0 2.5rem;display:grid;grid-template-columns:minmax(0,1.15fr) minmax(320px,.85fr);gap:3.5rem;align-items:center;}
.home-split-wrap.rev{grid-template-columns:minmax(320px,.85fr) minmax(0,1.15fr);}
.home-split-wrap.rev .home-split-copy{order:2;}
.home-split-wrap.rev .home-split-media{order:1;}
.home-split-copy{text-align:left;max-width:620px;}
.home-split-title{font-family:'Playfair Display',serif;font-size:clamp(2rem,3.4vw,3rem);line-height:1.08;font-weight:900;color:#1F2B3A;margin-bottom:1rem;}
.home-split-p{color:#586273;line-height:1.85;font-size:.98rem;margin-bottom:1rem;}
.home-split-btn{margin-top:.6rem;display:inline-flex;align-items:center;justify-content:center;border:none;background:var(--green2);color:#fff;font-family:'DM Sans',sans-serif;font-size:.93rem;font-weight:700;border-radius:9px;padding:.82rem 1.75rem;cursor:pointer;transition:transform .22s ease,box-shadow .28s ease,background .22s ease;position:relative;overflow:hidden;}
.home-split-btn::after{content:"";position:absolute;top:0;left:-130%;width:120%;height:100%;background:linear-gradient(120deg,transparent,rgba(255,255,255,.22),transparent);transition:left .65s ease;}
.home-split-btn:hover::after{left:130%;}
.home-main-title{background:#F5F6F8;font-family:'Playfair Display',serif;font-size:clamp(2.6rem,4vw,3.6rem);font-weight:900;text-align:center;color:#1F2B3A;padding:4rem 2rem 2rem 2rem;margin:0;}
.home-split-btn:hover{background:var(--green2);transform:translateY(-3px);box-shadow:0 12px 30px rgba(21,122,69,.38),0 0 14px rgba(31,168,94,.28);}
.home-split-media{display:flex;justify-content:center;align-items:center;}
.home-split-media img{width:100%;max-width:430px;border-radius:18px;display:block;object-fit:cover;}
.offer-grid{background:#F5F6F8;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.5rem;padding:2rem 2.5rem 4rem;margin:0 auto;}
.offer-card{background:white;padding:1.8rem 1.5rem;border-radius:12px;text-align:center;box-shadow:0 6px 18px rgba(0,0,0,0.08);transition:0.25s;color:#1F2B3A;cursor:pointer;display:flex;flex-direction:column;justify-content:center;align-items:center;height:100%;}
.offer-card p{margin-top:10px;margin-bottom:10px;}
.offer-card span{color:white;margin-top:auto;background:var(--green2);padding:.82rem 1.75rem;border-radius:9px;font-size:.93rem;font-weight:700;font-family:'DM Sans',sans-serif;display:inline-block;width:90%;cursor:pointer;transition:transform .22s ease,box-shadow .28s ease;position:relative;overflow:hidden;}
.offer-card span:hover{background:var(--green2);transform:translateY(-3px);box-shadow:0 12px 30px rgba(21,122,69,.38),0 0 14px rgba(31,168,94,.28);}
.offer-card:hover{transform:translateY(-4px);box-shadow:0 14px 30px rgba(0,0,0,0.12);}
.offer-img{width:120px;height:120px;object-fit:contain;margin-bottom:0.6rem;}
.social-row{display:flex;justify-content:center;gap:14px;margin-top:1rem;}
.social-icon{width:42px;height:42px;display:flex;align-items:center;justify-content:center;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);color:#DCE9F5;font-size:18px;transition:0.25s;}
.social-icon:hover{transform:translateY(-3px);box-shadow:0 10px 25px rgba(0,0,0,0.4);}
.social-icon.ig:hover{background:#E1306C;border-color:#E1306C;color:white;}
.social-icon.fb:hover{background:#1877F2;border-color:#1877F2;color:white;}
.social-icon.li:hover{background:#0A66C2;border-color:#0A66C2;color:white;}

.camp-page-top{background:linear-gradient(180deg,#F5F6F8 0%,#EEF2F6 100%);padding:4.5rem 0 2.5rem;border-bottom:1px solid #E2E8F0;}
.camp-page-top-inner{width:100%;max-width:1100px;margin:0 auto;padding:0 2.5rem;}
.camp-page-title{font-family:'Playfair Display',serif;font-size:clamp(2.4rem,4vw,3.6rem);color:#1F2B3A;line-height:1.08;margin-bottom:1rem;}
.camp-page-sub{max-width:760px;color:#5C6B7C;line-height:1.85;font-size:1rem;}
.camp-list-wrap{width:100%;max-width:1100px;margin:0 auto;padding:2.5rem 2.5rem 4.5rem;}
.camp-list{display:flex;flex-direction:column;gap:1.4rem;}
.camp-row-card{display:grid;grid-template-columns:340px 1fr;gap:1.4rem;background:#fff;border:1px solid #E2E8F0;border-radius:20px;padding:1.2rem;box-shadow:0 8px 24px rgba(15,23,42,.05);transition:.22s;}
.camp-row-card:hover{transform:translateY(-3px);box-shadow:0 16px 40px rgba(15,23,42,.08);}
.camp-row-media{
  border-radius:16px;
  min-height:210px;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:0;
  overflow:hidden;
  background:linear-gradient(135deg,#13263B,#0F3A28);
}

.camp-row-media img{
  width:100%;
  height:100%;
  min-height:210px;
  object-fit:cover;
  border-radius:0;
  display:block;
}

@media(max-width:850px){
  .camp-page-top-inner,.camp-list-wrap{padding-left:1.2rem;padding-right:1.2rem;}
  .camp-row-card{grid-template-columns:1fr;}
  .camp-row-media{min-height:170px;}
  .camp-row-media img{min-height:170px;}
  .camp-row-head{flex-direction:column;}
  .camp-row-bottom{flex-direction:column;align-items:flex-start;}
  .camp-row-actions{width:100%;}
  .camp-row-btn{flex:1;}
}

.camp-row-main{display:flex;flex-direction:column;justify-content:space-between;min-width:0;}
.camp-row-head{display:flex;justify-content:space-between;gap:1rem;align-items:flex-start;}
.camp-row-head h3{font-family:'Playfair Display',serif;font-size:1.45rem;color:#1F2B3A;margin-bottom:.55rem;}
.camp-row-meta{display:flex;flex-wrap:wrap;gap:.6rem;}
.camp-row-meta span{font-size:.84rem;color:#5C6B7C;background:#F8FAFC;border:1px solid #E2E8F0;padding:.38rem .65rem;border-radius:999px;}
.camp-row-badge .bdg{position:static;}
.camp-row-desc{margin:1rem 0 1.2rem;color:#5C6B7C;line-height:1.8;font-size:.95rem;}
.camp-row-bottom{display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;padding-top:1rem;border-top:1px solid #EDF2F7;}
.camp-row-price{font-family:'Playfair Display',serif;font-size:2rem;color:#2E7D5B;font-weight:900;}
.camp-row-price span{font-family:'DM Sans',sans-serif;font-size:.9rem;color:#5C6B7C;font-weight:500;}
.camp-row-actions{display:flex;gap:.7rem;flex-wrap:wrap;}
.camp-row-btn{border:none;border-radius:9px;padding:.82rem 1.75rem;font-family:'DM Sans',sans-serif;font-size:.93rem;font-weight:700;cursor:pointer;transition:transform .22s ease,box-shadow .28s ease,background .22s ease;}
.camp-row-btn.primary{background:var(--green2);color:#fff;font-family:'DM Sans',sans-serif;font-weight:700;border:none;transition:transform .22s ease,box-shadow .28s ease;}
.camp-row-btn.primary:hover{background:var(--green2);transform:translateY(-3px);box-shadow:0 12px 30px rgba(21,122,69,.38),0 0 14px rgba(31,168,94,.28);}
.camp-row-btn.primary:disabled{background:#CBD5E1;color:#64748B;cursor:not-allowed;transform:none;}
.camp-row-btn.ghost{background:#EEF2F6;color:#1F2B3A;}
.camp-row-btn.ghost:hover{background:#E2E8F0;}

.bdg-open{background:#DCFCE7;color:#166534;}
.bdg-up{background:#DBEAFE;color:#1D4ED8;border:1px solid #BFDBFE;}
.bdg-full{background:#FEE2E2;color:#B91C1C;border:1px solid #FECACA;}

.camp-hero{text-align:center;padding:4rem 2rem 2rem 2rem;}
.camp-hero h1{font-family:'Playfair Display',serif;font-size:3rem;color:#1F2B3A;}
.camp-hero p{max-width:600px;margin:1rem auto 0 auto;color:#5C6B7C;line-height:1.7;}
.camp-grid{max-width:1200px;margin:2rem auto 4rem auto;padding:0 2rem;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:2rem;}
.camp-card{background:white;border-radius:14px;padding:2rem;text-align:center;box-shadow:0 8px 24px rgba(0,0,0,0.08);transition:.25s;}
.camp-card:hover{transform:translateY(-6px);box-shadow:0 18px 40px rgba(0,0,0,0.12);}
.camp-icon{width:90px;margin-bottom:1rem;}
.camp-meta{color:#5C6B7C;font-size:.9rem;margin:4px 0;}
.camp-price{font-size:1.8rem;color:#2E7D5B;font-weight:800;margin:1rem 0;}
.camp-desc{color:#5C6B7C;font-size:.9rem;margin-bottom:1.2rem;}
.camp-btn{width:100%;padding:.82rem 1.75rem;border:none;border-radius:9px;background:var(--green2);color:#fff;font-family:'DM Sans',sans-serif;font-size:.93rem;font-weight:700;cursor:pointer;transition:transform .22s ease,box-shadow .28s ease;}
.camp-btn:hover{background:var(--green2);transform:translateY(-3px);box-shadow:0 12px 30px rgba(21,122,69,.38),0 0 14px rgba(31,168,94,.28);}

.team-hero{background:linear-gradient(135deg,#0B1624 0%,#102033 55%,#0E1D17 100%);padding:5rem 0 4rem;position:relative;overflow:hidden;}
.team-hero::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 20% 30%,rgba(74,171,232,.16),transparent 32%),radial-gradient(circle at 80% 20%,rgba(31,168,94,.14),transparent 28%);pointer-events:none;}
.team-hero-inner{width:100%;max-width:1200px;margin:0 auto;padding:0 2.5rem;position:relative;z-index:1;text-align:center;}
.team-hero-kicker{display:inline-block;font-size:.75rem;letter-spacing:2px;text-transform:uppercase;color:var(--green2);font-weight:700;margin-bottom:1rem;}
.team-hero-title{font-family:'Playfair Display',serif;font-size:clamp(2.4rem,4.5vw,4rem);line-height:1.08;color:#F4F8FC;margin-bottom:1rem;}
.team-hero-sub{max-width:760px;margin:0 auto;color:rgba(220,233,245,.78);line-height:1.8;font-size:1rem;}
.team-hero-actions{margin-top:1.8rem;display:flex;justify-content:center;gap:.8rem;flex-wrap:wrap;}
.team-wrap-light{background:#F5F6F8;padding:4rem 0;}
.team-inner-light{width:100%;max-width:1200px;margin:0 auto;padding:0 2.5rem;}
.founder-card{display:grid;grid-template-columns:300px 1fr;gap:2rem;background:#fff;border:1px solid #E2E8F0;border-radius:24px;padding:1.5rem;box-shadow:0 14px 40px rgba(15,23,42,.06);align-items:center;}
.founder-visual{background:linear-gradient(135deg,#13263B,#0F3A28);border-radius:20px;min-height:320px;display:flex;align-items:center;justify-content:center;padding:1.5rem;overflow:hidden;}
.founder-visual img{width:100%;max-width:220px;object-fit:contain;}
.founder-copy h2{font-family:'Playfair Display',serif;font-size:2rem;color:#1F2B3A;margin-bottom:.6rem;}
.founder-role{display:inline-block;background:#E8F7EF;color:#1F7A53;border:1px solid #CBEBD8;padding:.35rem .7rem;border-radius:999px;font-size:.8rem;font-weight:700;margin-bottom:1rem;}
.founder-copy p{color:#5C6B7C;line-height:1.82;margin-bottom:.9rem;}
.team-section-head{text-align:center;margin-bottom:2rem;}
.team-section-head h2{font-family:'Playfair Display',serif;font-size:clamp(2rem,3vw,2.8rem);color:#1F2B3A;margin-bottom:.7rem;}
.team-section-head p{max-width:700px;margin:0 auto;color:#5C6B7C;line-height:1.8;}
.team-grid-modern{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.4rem;}
.team-card-modern{background:#fff;border:1px solid #E2E8F0;border-radius:22px;padding:1.4rem;box-shadow:0 12px 30px rgba(15,23,42,.05);transition:.25s;text-align:left;}
.team-card-modern:hover{transform:translateY(-6px);box-shadow:0 22px 44px rgba(15,23,42,.10);}
.team-card-top{
  display:flex;
  align-items:flex-start;
  gap:.9rem;
  margin-bottom:1rem;
}.team-avatar-modern{width:62px;height:62px;border-radius:18px;background:linear-gradient(135deg,#16314D,#215E46);display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.6rem;flex-shrink:0;}
.team-name-modern{
  font-weight:800;
  color:#1F2B3A;
  font-size:1.02rem;
  line-height:1.25;
}
.team-role-modern{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  text-align:center;
  margin-top:.35rem;
  font-size:.76rem;
  font-weight:700;
  color:#2E7D5B;
  background:#ECFDF3;
  border:1px solid #D1F2DF;
  padding:.38rem .75rem;
  border-radius:999px;
  line-height:1.25;
  white-space:normal;
  word-break:break-word;
  max-width:100%;
}

.lightbox-img-wrap{
  width:100%;
  display:flex;
  align-items:center;
  justify-content:center;
}

  .team-bio-modern{color:#5C6B7C;line-height:1.72;font-size:.92rem;margin-bottom:1rem;}
.team-tags-modern{display:flex;flex-wrap:wrap;gap:.45rem;}
.team-tags-modern span{font-size:.72rem;font-weight:700;color:#3A4A5B;background:#F8FAFC;border:1px solid #E2E8F0;padding:.3rem .55rem;border-radius:999px;}
.team-features{margin-top:3.2rem;display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;}
.team-feature{background:#fff;border:1px solid #E2E8F0;border-radius:20px;padding:1.4rem;box-shadow:0 10px 24px rgba(15,23,42,.04);}
.team-feature h3{font-size:1.05rem;color:#1F2B3A;margin-bottom:.55rem;}
.team-feature p{color:#5C6B7C;line-height:1.75;font-size:.92rem;}
.team-cta{margin-top:3rem;background:linear-gradient(135deg,#12253B,#143524);border-radius:26px;padding:2rem;text-align:center;color:#EEF5FF;}
.team-cta h3{font-family:'Playfair Display',serif;font-size:2rem;margin-bottom:.65rem;}
.team-cta p{color:rgba(220,233,245,.78);line-height:1.8;max-width:700px;margin:0 auto;}
.team-cta-actions{margin-top:1.3rem;display:flex;justify-content:center;gap:.8rem;flex-wrap:wrap;}


.reviews-page{background:#F5F6F8;min-height:100vh;}
.reviews-hero{background:linear-gradient(135deg,#0B1624 0%,#102033 55%,#0E1D17 100%);padding:5rem 0 4rem;position:relative;overflow:hidden;}
.reviews-hero::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 20% 30%,rgba(74,171,232,.16),transparent 32%),radial-gradient(circle at 80% 20%,rgba(31,168,94,.14),transparent 28%);pointer-events:none;}
.reviews-hero-inner{width:100%;max-width:1200px;margin:0 auto;padding:0 2.5rem;position:relative;z-index:1;text-align:center;}
.reviews-kicker{display:inline-block;font-size:.75rem;letter-spacing:2px;text-transform:uppercase;color:var(--green2);font-weight:700;margin-bottom:1rem;}
.reviews-title{font-family:'Playfair Display',serif;font-size:clamp(2.4rem,4.5vw,4rem);line-height:1.08;color:#F4F8FC;margin-bottom:1rem;}
.reviews-sub{max-width:760px;margin:0 auto;color:rgba(220,233,245,.78);line-height:1.8;font-size:1rem;}
.reviews-hero-actions{margin-top:1.8rem;display:flex;justify-content:center;gap:.8rem;flex-wrap:wrap;}
.reviews-rating-big{margin-top:1.8rem;display:flex;justify-content:center;align-items:center;gap:.9rem;flex-wrap:wrap;}
.reviews-rating-score{font-family:'Playfair Display',serif;font-size:2.4rem;color:#fff;}
.reviews-rating-stars{color:#FACC15;font-size:1.15rem;letter-spacing:2px;}
.reviews-rating-meta{color:rgba(220,233,245,.75);font-size:.95rem;}
.reviews-content{width:100%;max-width:1200px;margin:0 auto;padding:3rem 2.5rem 4.5rem;}
.reviews-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-top:-2rem;margin-bottom:2.2rem;position:relative;z-index:2;}
.reviews-stat{background:#fff;border:1px solid #E2E8F0;border-radius:20px;padding:1.4rem;text-align:center;box-shadow:0 10px 24px rgba(15,23,42,.05);}
.reviews-stat-number{font-family:'Playfair Display',serif;font-size:2rem;color:#1F2B3A;margin-bottom:.3rem;}
.reviews-stat-label{color:#5C6B7C;font-size:.92rem;}
.reviews-grid-modern{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.3rem;}
.review-card-modern{background:#fff;border:1px solid #E2E8F0;border-radius:22px;padding:1.4rem;box-shadow:0 10px 26px rgba(15,23,42,.05);transition:.25s;}
.review-card-modern:hover{transform:translateY(-5px);box-shadow:0 20px 40px rgba(15,23,42,.09);}
.review-card-head{display:flex;justify-content:space-between;gap:1rem;align-items:flex-start;margin-bottom:.8rem;}
.review-card-name{font-weight:800;color:#1F2B3A;font-size:1rem;}
.review-card-date{font-size:.75rem;color:#64748B;background:#F8FAFC;border:1px solid #E2E8F0;padding:.3rem .55rem;border-radius:999px;white-space:nowrap;}
.review-card-stars{color:#FACC15;font-size:1rem;letter-spacing:2px;margin-bottom:.8rem;}
.review-card-text{color:#5C6B7C;line-height:1.8;font-size:.95rem;}
.reviews-empty-modern{background:#fff;border:1px solid #E2E8F0;border-radius:22px;padding:3rem 1.5rem;text-align:center;color:#5C6B7C;box-shadow:0 10px 26px rgba(15,23,42,.05);}
.reviews-empty-modern .icon{font-size:2.5rem;margin-bottom:.7rem;}
.reviews-cta{margin-top:3rem;background:linear-gradient(135deg,#12253B,#143524);border-radius:26px;padding:2rem;text-align:center;color:#EEF5FF;}
.reviews-cta h3{font-family:'Playfair Display',serif;font-size:2rem;margin-bottom:.65rem;}
.reviews-cta p{color:rgba(220,233,245,.78);line-height:1.8;max-width:700px;margin:0 auto;}
.reviews-cta-actions{margin-top:1.3rem;display:flex;justify-content:center;gap:.8rem;flex-wrap:wrap;}
@media(max-width:900px){.reviews-stats{grid-template-columns:1fr;margin-top:2rem;}}
@media(max-width:850px){.reviews-hero-inner,.reviews-content{padding-left:1.2rem;padding-right:1.2rem;}}
@media(max-width:900px){.founder-card{grid-template-columns:1fr;}.team-features{grid-template-columns:1fr;}}
@media(max-width:850px){.team-hero-inner,.team-inner-light{padding:0 1.2rem;}}
@media(max-width:950px){.home-split-wrap,.home-split-wrap.rev{grid-template-columns:1fr;gap:2rem;padding:0 1.2rem;}.home-split-wrap.rev .home-split-copy,.home-split-wrap.rev .home-split-media{order:initial;}.home-split-copy{max-width:100%;}.home-split-media{justify-content:flex-start;}.home-split-media img{max-width:100%;}}
@media(max-width:1050px){.hero-inner{grid-template-columns:1fr;}.board-wrap{display:none;}.about-g{grid-template-columns:1fr;}.fgrid{grid-template-columns:1fr;}.fg.full{grid-column:1;}.nav{padding:0 1rem;}.nb{padding:.38rem .5rem;font-size:.8rem;}.wrap{padding:3rem 1.2rem;}.nav-logo{font-size:1.2rem;}}

.about-hero{background:linear-gradient(135deg,#0B1624 0%,#102033 55%,#0E1D17 100%);padding:5rem 0 4rem;position:relative;overflow:hidden;}
.about-hero::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 20% 30%,rgba(74,171,232,.16),transparent 32%),radial-gradient(circle at 80% 20%,rgba(31,168,94,.14),transparent 28%);pointer-events:none;}
.about-hero-inner{width:100%;max-width:1200px;margin:0 auto;padding:0 2.5rem;position:relative;z-index:1;text-align:center;}
.about-kicker{display:inline-block;font-size:.75rem;letter-spacing:2px;text-transform:uppercase;color:var(--green2);font-weight:700;margin-bottom:1rem;}
.about-title{font-family:'Playfair Display',serif;font-size:clamp(2.4rem,4.5vw,4rem);line-height:1.08;color:#F4F8FC;margin-bottom:1rem;}
.about-sub{max-width:760px;margin:0 auto;color:rgba(220,233,245,.78);line-height:1.8;font-size:1rem;}
.about-hero-actions{margin-top:1.8rem;display:flex;justify-content:center;gap:.8rem;flex-wrap:wrap;}
.about-light{background:#F5F6F8;padding:4rem 0;}
.about-inner-light{width:100%;max-width:1200px;margin:0 auto;padding:0 2.5rem;}
.about-story{display:grid;grid-template-columns:1.05fr .95fr;gap:2rem;align-items:stretch;}
.about-story-card{background:#fff;border:1px solid #E2E8F0;border-radius:24px;padding:1.7rem;box-shadow:0 12px 30px rgba(15,23,42,.05);}
.about-story-card h2{font-family:'Playfair Display',serif;font-size:2rem;color:#1F2B3A;margin-bottom:1rem;}
.about-story-card p{color:#5C6B7C;line-height:1.85;margin-bottom:1rem;}
.about-visual-card{background:linear-gradient(135deg,#13263B,#0F3A28);border-radius:24px;padding:2rem;display:flex;align-items:center;justify-content:center;min-height:100%;box-shadow:0 12px 30px rgba(15,23,42,.05);}
.about-visual-card img{width:100%;max-width:260px;object-fit:contain;}
.about-section-head{text-align:center;margin:3rem 0 2rem;}
.about-section-head h2{font-family:'Playfair Display',serif;font-size:clamp(2rem,3vw,2.8rem);color:#1F2B3A;margin-bottom:.7rem;}
.about-section-head p{max-width:720px;margin:0 auto;color:#5C6B7C;line-height:1.8;}
.about-founder{display:grid;grid-template-columns:320px 1fr;gap:2rem;background:#fff;border:1px solid #E2E8F0;border-radius:24px;padding:1.5rem;box-shadow:0 12px 30px rgba(15,23,42,.05);align-items:center;}
.about-founder-side{background:#F8FAFC;border:1px solid #E2E8F0;border-radius:20px;min-height:280px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:1.5rem;text-align:center;}
.about-founder-mark{width:84px;height:84px;border-radius:22px;background:linear-gradient(135deg,#16314D,#215E46);color:#fff;display:flex;align-items:center;justify-content:center;font-size:2rem;margin-bottom:1rem;}
.about-founder-name{font-weight:800;color:#1F2B3A;font-size:1.1rem;}
.about-founder-role{margin-top:.35rem;display:inline-block;font-size:.78rem;font-weight:700;color:#2E7D5B;background:#ECFDF3;border:1px solid #D1F2DF;padding:.25rem .6rem;border-radius:999px;}
.about-founder-copy h3{font-family:'Playfair Display',serif;font-size:1.9rem;color:#1F2B3A;margin-bottom:.8rem;}
.about-founder-copy p{color:#5C6B7C;line-height:1.85;margin-bottom:1rem;}
.about-values{margin-top:2rem;display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;}
.about-value{background:#fff;border:1px solid #E2E8F0;border-radius:22px;padding:1.4rem;box-shadow:0 10px 24px rgba(15,23,42,.04);}
.about-value-icon{width:54px;height:54px;border-radius:16px;background:linear-gradient(135deg,#16314D,#215E46);color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.35rem;margin-bottom:1rem;}
.about-value h4{color:#1F2B3A;font-size:1.05rem;margin-bottom:.55rem;}
.about-value p{color:#5C6B7C;line-height:1.75;font-size:.92rem;}
.about-cta{margin-top:3rem;background:linear-gradient(135deg,#12253B,#143524);border-radius:26px;padding:2rem;text-align:center;color:#EEF5FF;}
.about-cta h3{font-family:'Playfair Display',serif;font-size:2rem;margin-bottom:.65rem;}
.about-cta p{color:rgba(220,233,245,.78);line-height:1.8;max-width:700px;margin:0 auto;}
.about-cta-actions{margin-top:1.3rem;display:flex;justify-content:center;gap:.8rem;flex-wrap:wrap;}
@media(max-width:950px){.about-story,.about-founder{grid-template-columns:1fr;}.about-values{grid-template-columns:1fr 1fr;}}
@media(max-width:850px){.about-hero-inner,.about-inner-light{padding-left:1.2rem;padding-right:1.2rem;}.about-values{grid-template-columns:1fr;}}
.nav-logo-img{transition:transform .28s ease,filter .28s ease;transform-origin:center;}
.nav-logo:hover .nav-logo-img{transform:scale(1.08);}
.about-faq-section{background:#F5F6F8;padding:0 0 4rem 0;}
.about-faq-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}
.about-faq-card:hover{transform:translateY(-3px);box-shadow:0 18px 38px rgba(15,23,42,.08);}
.about-faq-card.open{border-color:#CBEBD8;box-shadow:0 18px 40px rgba(31,168,94,.10);}
.about-faq-top{width:100%;border:none;outline:none;box-shadow:none;appearance:none;-webkit-appearance:none;background:transparent;padding:1.15rem 1.2rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;cursor:pointer;text-align:left;font-family:'DM Sans',sans-serif;font-size:1rem;font-weight:800;color:#1F2B3A;}
.about-faq-top:focus,.about-faq-top:focus-visible,.about-faq-top:active{outline:none;border:none;box-shadow:none;background:transparent;}
.about-faq-card{background:#fff;border:1px solid #E2E8F0;border-radius:22px;box-shadow:0 10px 24px rgba(15,23,42,.05);overflow:hidden;transition:.25s;position:relative;align-self:start;}
.about-faq-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;align-items:start;}
.about-faq-plus{width:34px;height:34px;border-radius:12px;background:linear-gradient(135deg,#16314D,#215E46);color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:1.2rem;line-height:1;}
.about-faq-body{max-height:0;overflow:hidden;transition:max-height .35s ease;}
.about-faq-card.open .about-faq-body{max-height:300px;}
.about-faq-body p{padding:0 1.2rem 1.2rem 1.2rem;color:#5C6B7C;line-height:1.8;font-size:.95rem;}
@media(max-width:850px){.about-faq-grid{grid-template-columns:1fr;}}

/* ══════════════════════════════════════════
   PROGRAMS PAGE — RESPONSIVE
══════════════════════════════════════════ */
.programs-page{background:#F5F6F8;}
.programs-hero{background:linear-gradient(135deg,#0B1624 0%,#102033 55%,#0E1D17 100%);padding:5rem 0 4rem;position:relative;overflow:hidden;}
.programs-hero::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 20% 50%,rgba(74,171,232,.15),transparent 40%),radial-gradient(circle at 80% 30%,rgba(31,168,94,.12),transparent 35%);pointer-events:none;}
.programs-hero-inner{max-width:1100px;margin:0 auto;padding:0 2.5rem;position:relative;z-index:1;text-align:center;}
.programs-kicker{display:inline-block;font-size:.75rem;letter-spacing:2px;text-transform:uppercase;color:#4AABE8;font-weight:700;margin-bottom:1rem;}
.programs-hero-title{font-family:'Playfair Display',serif;font-size:clamp(2.4rem,4.5vw,4rem);color:#F4F8FC;line-height:1.08;margin-bottom:1rem;}
.programs-hero-sub{max-width:620px;margin:0 auto 2rem;color:rgba(220,233,245,.78);line-height:1.8;font-size:1rem;}
.programs-hero-actions{display:flex;gap:.8rem;justify-content:center;flex-wrap:wrap;}
.programs-stats-strip{background:#fff;border-bottom:1px solid #E2E8F0;}
.programs-stats-inner{max-width:1100px;margin:0 auto;padding:1.5rem 2.5rem;display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;text-align:center;}
.programs-stat-n{font-family:'Playfair Display',serif;font-size:1.9rem;color:#2E7D5B;font-weight:900;}
.programs-stat-l{font-size:.8rem;color:#5C6B7C;margin-top:.15rem;}
.programs-cards-outer{max-width:1100px;margin:0 auto;padding:3.5rem 2.5rem 5rem;}
.programs-cards-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;}
.prog-card-new{background:#fff;border:1px solid #E2E8F0;border-radius:24px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 8px 24px rgba(15,23,42,.06);transition:transform .2s,box-shadow .2s;position:relative;}
.prog-card-new:hover{transform:translateY(-4px);box-shadow:0 24px 56px rgba(15,23,42,.13);}
.prog-card-new.featured-card{border-width:2px;}
.prog-card-featured-pill{position:absolute;top:14px;right:14px;font-size:.68rem;font-weight:800;letter-spacing:1px;text-transform:uppercase;padding:.28rem .7rem;border-radius:999px;color:#fff;z-index:1;}
.prog-card-top-band{padding:1.5rem 1.5rem 1.1rem;}
.prog-card-img{width:72px;height:72px;object-fit:contain;margin-bottom:.7rem;}
.prog-card-tag-pill{display:inline-flex;font-size:.67rem;font-weight:800;letter-spacing:1px;text-transform:uppercase;padding:.22rem .6rem;border-radius:999px;color:#fff;margin-bottom:.55rem;}
.prog-card-title-text{font-family:'Playfair Display',serif;font-size:1.28rem;color:#1F2B3A;margin:0;line-height:1.2;}
.prog-card-meta-row{padding:.9rem 1.5rem;border-bottom:1px solid #F1F5F9;display:flex;gap:.45rem;flex-wrap:wrap;}
.prog-card-meta-chip{background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:.28rem .55rem;font-size:.73rem;color:#3A4A5B;font-weight:600;}
.prog-card-body-area{padding:1.1rem 1.5rem;flex:1;}
.prog-card-desc-text{color:#5C6B7C;font-size:.88rem;line-height:1.7;margin-bottom:.9rem;}
.prog-card-check-list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:.4rem;}
.prog-card-check-item{display:flex;align-items:flex-start;gap:.5rem;font-size:.83rem;color:#3A4A5B;}
.prog-card-check-icon{font-weight:900;margin-top:.1rem;flex-shrink:0;}
.prog-card-footer-area{padding:.9rem 1.5rem 1.5rem;}
.prog-card-cta-btn{width:100%;padding:.82rem;border-radius:9px;font-family:'DM Sans',sans-serif;font-size:.93rem;font-weight:800;cursor:pointer;transition:transform .22s ease,box-shadow .28s ease,background .22s ease,color .22s ease;border-width:2px;border-style:solid;position:relative;overflow:hidden;}
.programs-bottom-cta{margin-top:3rem;background:linear-gradient(135deg,#12253B,#143524);border-radius:26px;padding:2.5rem 2rem;text-align:center;color:#EEF5FF;}
.programs-bottom-cta h3{font-family:'Playfair Display',serif;font-size:1.9rem;margin-bottom:.6rem;}
.programs-bottom-cta p{color:rgba(220,233,245,.78);line-height:1.8;max-width:600px;margin:0 auto;font-size:.95rem;}
.programs-cta-actions{margin-top:1.3rem;display:flex;justify-content:center;gap:.8rem;flex-wrap:wrap;}
@media(max-width:1050px){.programs-cards-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:700px){.programs-cards-grid{grid-template-columns:1fr;}.programs-hero-inner,.programs-cards-outer{padding-left:1.2rem;padding-right:1.2rem;}.programs-stats-inner{grid-template-columns:1fr 1fr;padding:1.2rem;gap:.8rem;}.programs-hero-title{font-size:clamp(2rem,8vw,2.8rem);}.programs-bottom-cta{padding:1.8rem 1.2rem;border-radius:18px;}.programs-bottom-cta h3{font-size:1.45rem;}.programs-cards-outer{padding-top:2.5rem;padding-bottom:3rem;}}
@media(max-width:420px){.programs-stats-inner{grid-template-columns:1fr 1fr;}.prog-card-meta-row{gap:.35rem;}.prog-card-meta-chip{font-size:.68rem;padding:.22rem .45rem;}}
@media (max-width: 420px) {
  .home-split-sec {
    padding: 3rem 0;
  }

  .home-split-wrap,
  .home-split-wrap.rev {
    grid-template-columns: 1fr;
    gap: 1.25rem;
    padding: 0 1rem;
  }

  .home-split-copy {
    max-width: 100%;
    min-width: 0;
  }

  .slbl {
    font-size: 0.68rem;
    letter-spacing: 2px;
    word-break: break-word;
  }

  .home-split-title {
    font-size: clamp(1.9rem, 9vw, 2.45rem);
    line-height: 1.1;
    word-break: break-word;
  }

  .home-split-p {
    font-size: 0.95rem;
    line-height: 1.75;
    margin-bottom: 0.9rem;
  }

  .home-split-btn {
    width: 100%;
    padding: 0.95rem 1rem;
  }

  .home-split-media {
    justify-content: center;
    align-items: center;
  }

  .home-split-media img {
    width: 100%;
    max-width: 100%;
    height: auto;
    border-radius: 14px;
    object-fit: cover;
    display: block;
  }

  .home-main-title {
    font-size: clamp(2rem, 10vw, 2.6rem);
    padding: 3rem 1rem 1.5rem;
  }

  .offer-grid {
    grid-template-columns: 1fr;
    padding: 1.25rem 1rem 3rem;
  }

  .offer-card {
    padding: 1.4rem 1.1rem;
  }

  .offer-card span {
    width: 100%;
  }

  .hero-inner {
    padding: 2rem 1rem;
  }

  .hero h1 {
    font-size: clamp(2rem, 10vw, 2.8rem);
  }

  .hero-sub {
    font-size: 0.95rem;
    line-height: 1.7;
  }

  .hero-btns {
    flex-direction: column;
  }

  .hero-btns .btn {
    width: 100%;
    justify-content: center;
  }

  .stats {
    grid-template-columns: 1fr;
  }

  .wrap {
    padding: 2.5rem 1rem;
  }
}




`;

const injectStyles = () => {
  if (document.getElementById("mcf-css")) return;
  const el = document.createElement("style");
  el.id = "mcf-css";
  el.textContent = CSS;
  document.head.appendChild(el);
};

/* ══════════════════════════════════════════ SMALL SHARED COMPONENTS ══════════════════════════════════════════ */
function Toast({ toasts }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.8rem",
        right: "1.8rem",
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        gap: ".5rem",
      }}
    >
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

function Badge({ status }) {
  const { t } = useLang();
  const cls =
    status === "open"
      ? "bdg bdg-open"
      : status === "full"
        ? "bdg bdg-full"
        : "bdg bdg-up";
  const lbl =
    status === "open"
      ? t.badge.open
      : status === "full"
        ? t.badge.full
        : t.badge.upcoming;
  return <span className={cls}>{lbl}</span>;
}

function ChessBoard() {
  return (
    <div className="board-wrap">
      <div className="mboard">
        {Array.from({ length: 64 }, (_, i) => {
          const r = Math.floor(i / 8),
            c = i % 8;
          const piece = (PIECES[r] || [])[c];
          return (
            <div
              key={i}
              className={`sq ${(r + c) % 2 === 0 ? "sq-l" : "sq-d"}`}
              style={{
                color: r < 4 ? "#1A3A2A" : "#EEF5FF",
                textShadow: "0 1px 3px rgba(0,0,0,.5)",
              }}
            >
              {piece && (
                <img src={PIECE_SVGS[piece]} alt="" className="piece" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Footer({ onNav, onContact }) {
  const { t } = useLang();
  return (
    <footer className="footer">
      <div className="f-links">
        {[
          ["home", t.footer.links.home],
          ["programs", t.footer.links.programs],
          ["camp", t.footer.links.camp],
          ["team", t.footer.links.team],
          ["gallery", t.footer.links.gallery],
          ["reviews", t.footer.links.reviews],
          ["about", t.footer.links.about],
          ["contact", t.footer.links.contact],
        ].map(([p, l]) => (
          <button key={p} className="flnk" onClick={() => onNav(p)}>
            {l}
          </button>
        ))}
      </div>
      <p>
        📍 {CONTACT.city} &nbsp;·&nbsp; ✉ {CONTACT.email}
      </p>

      <div className="social-row">
        <a
          href={SOCIALS.instagram}
          target="_blank"
          rel="noreferrer"
          className="social-icon ig"
        >
          <FaInstagram />
        </a>
        <a
          href={SOCIALS.facebook}
          target="_blank"
          rel="noreferrer"
          className="social-icon fb"
        >
          <FaFacebookF />
        </a>
        <a
          href={SOCIALS.linkedin}
          target="_blank"
          rel="noreferrer"
          className="social-icon li"
        >
          <FaLinkedinIn />
        </a>
      </div>
      <div
        style={{
          marginTop: "1.5rem",
          paddingTop: "1.2rem",
          borderTop: "1px solid rgba(74,171,232,0.1)",
          fontSize: ".78rem",
          color: "rgba(180,210,240,0.35)",
          letterSpacing: ".3px",
        }}
      >
        {t.footer.builtBy}{" "}
        <span style={{ color: "rgba(180,210,240,0.55)", fontWeight: 600 }}>
          Giorgi Kostava
        </span>
      </div>
    </footer>
  );
}

function ContactModal({ onClose, showToast }) {
  const { t } = useLang();
  const cm = t.contactModal;
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      showToast(t.toast.emailCopied, "s");
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = CONTACT.email;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        showToast(t.toast.emailCopied, "s");
      } catch {
        showToast("Could not copy email.", "e");
      }
    }
  };
  return (
    <div
      className="ovl"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <button className="mcls" onClick={onClose}>
          {t.common.close}
        </button>
        <h3>{cm.title}</h3>
        <div style={{ display: "grid", gap: ".85rem" }}>
          <button
            type="button"
            className="inp"
            style={{
              textAlign: "left",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onClick={copyEmail}
          >
            <span>✉️ {CONTACT.email}</span>
            <span style={{ color: "var(--muted)", fontSize: ".85rem" }}>
              {cm.clickToCopy}
            </span>
          </button>
          <div
            style={{
              color: "var(--muted)",
              fontSize: ".85rem",
              lineHeight: 1.6,
            }}
          >
            {cm.fastest}
          </div>
        </div>
      </div>
    </div>
  );
}

function CampRegModal({ item, onClose, showToast, onRegistered }) {
  const { t } = useLang();
  const rm = t.camp.regModal;
  const [f, setF] = useState({
    fname: "",
    lname: "",
    parent: "",
    email: "",
    phone: "",
    dob: "",
    level: "",
    emergency: "",
    medical: "",
  });
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const submit = async () => {
    if (
      !f.fname ||
      !f.lname ||
      !f.parent ||
      !f.email ||
      !f.phone ||
      !f.dob ||
      !f.level
    ) {
      showToast(rm.required, "e");
      return;
    }
    try {
      await api("/registrations/camp", {
        method: "POST",
        body: JSON.stringify({
          campId: item.id,
          campName: item.name,
          childName: `${f.fname} ${f.lname}`,
          dob: f.dob,
          level: f.level,
          parent: f.parent,
          email: f.email,
          phone: f.phone,
          emergency: f.emergency || "—",
          medical: f.medical || "None",
          price: item.price,
        }),
      });
      setDone(true);
      onRegistered?.();
      showToast(t.toast.regSubmitted, "s");
    } catch (error) {
      showToast(error.message || "Could not submit registration.", "e");
    }
  };
  return (
    <div
      className="ovl"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <button className="mcls" onClick={onClose}>
          {t.common.close}
        </button>
        <h3>
          {rm.title} {item.name}
        </h3>
        {!done ? (
          <>
            <div className="fgrid">
              <div className="fg">
                <label className="lbl">{rm.firstName} *</label>
                <input
                  className="inp"
                  placeholder={rm.firstNamePh}
                  value={f.fname}
                  onChange={set("fname")}
                />
              </div>
              <div className="fg">
                <label className="lbl">{rm.lastName} *</label>
                <input
                  className="inp"
                  placeholder={rm.lastNamePh}
                  value={f.lname}
                  onChange={set("lname")}
                />
              </div>
              <div className="fg">
                <label className="lbl">{rm.dob} *</label>
                <input
                  className="inp"
                  type="date"
                  value={f.dob}
                  onChange={set("dob")}
                />
              </div>
              <div className="fg">
                <label className="lbl">{rm.level} *</label>
                <select className="inp" value={f.level} onChange={set("level")}>
                  <option value="">{rm.levelPh}</option>
                  {rm.levelOpts.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="fg full">
                <label className="lbl">{rm.parent} *</label>
                <input
                  className="inp"
                  placeholder={rm.parentPh}
                  value={f.parent}
                  onChange={set("parent")}
                />
              </div>
              <div className="fg full">
                <label className="lbl">{rm.email} *</label>
                <input
                  className="inp"
                  type="email"
                  placeholder={rm.emailPh}
                  value={f.email}
                  onChange={set("email")}
                />
              </div>
              <div className="fg full">
                <label className="lbl">{rm.phone} *</label>
                <input
                  className="inp"
                  type="tel"
                  placeholder={rm.phonePh}
                  value={f.phone}
                  onChange={set("phone")}
                />
              </div>
              <div className="fg full">
                <label className="lbl">{rm.emergency}</label>
                <input
                  className="inp"
                  placeholder={rm.emergencyPh}
                  value={f.emergency}
                  onChange={set("emergency")}
                />
              </div>
              <div className="fg full">
                <label className="lbl">{rm.medical}</label>
                <textarea
                  className="inp"
                  placeholder={rm.medicalPh}
                  value={f.medical}
                  onChange={set("medical")}
                />
              </div>
            </div>
            <button className="sbtn" onClick={submit}>
              {rm.submitBtn}
            </button>
          </>
        ) : (
          <div className="ok-box">
            <div style={{ fontSize: "2rem" }}>🎉</div>
            <strong style={{ marginTop: ".5rem" }}>{rm.successTitle}</strong>
            <p
              style={{
                fontSize: ".86rem",
                color: "var(--muted)",
                marginTop: ".4rem",
              }}
            >
              {rm.successSub}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════ PAGES ══════════════════════════════════════════ */
function HomePage({ onNav, onContact }) {
  const { t } = useLang();

  const homeSections = [
    {
      title: t.home.section1Title,
      text1: t.home.section1Text1,
      text2: t.home.section1Text2,
      image: "/images/info.png",
      button: t.home.section1Btn,
      onClick: () => onNav("programs"),
    },
    {
      title: t.home.section2Title,
      text1: t.home.section2Text1,
      text2: t.home.section2Text2,
      image: "/images/info.png",
      button: t.home.section2Btn,
      onClick: () => onNav("programs"),
    },
    {
      title: t.home.section3Title,
      text1: t.home.section3Text1,
      text2: t.home.section3Text2,
      image: "/images/info.png",
      button: t.home.section3Btn,
      onClick: () => onNav("reviews"),
    },
    {
      title: t.home.section4Title,
      text1: t.home.section4Text1,
      text2: t.home.section4Text2,
      image: "/images/info.png",
      button: t.home.section4Btn,
      onClick: () => onNav("camp"),
    },
    {
      title: t.home.section5Title,
      text1: t.home.section5Text1,
      text2: t.home.section5Text2,
      image: "/images/info.png",
      button: t.home.section5Btn,
      onClick: onContact,
    },
  ];

  return (
    <div className="pg">
      <div className="hero">
        <div className="hero-bg">
          {Array.from({ length: 64 }, (_, i) => (
            <div key={i} />
          ))}
        </div>
        <div className="hero-inner">
          <div>
            <div className="hero-badge">{t.home.heroBadge}</div>
            <h1>
              {t.home.heroTitle} <em>{t.home.heroTitleEm}</em>
            </h1>
            <p className="hero-sub">{t.home.heroSub}</p>
            <div className="hero-btns">
              <button className="btn btn-g" onClick={() => onNav("programs")}>
                {t.home.heroBtn1}
              </button>
              <button className="btn btn-g" onClick={() => onNav("camp")}>
                {t.home.heroBtn2}
              </button>
              <button
                className="btn btn-g"
                style={{ background: "rgba(74,171,232,.18)", color: "#EEF5FF" }}
                onClick={onContact}
              >
                {t.home.heroBtn3}
              </button>
            </div>
            <div className="stats">
              <div className="stat">
                <div className="stat-n">{t.home.stat1n}</div>
                <div className="stat-l">{t.home.stat1l}</div>
              </div>
              <div className="stat">
                <div className="stat-n">{t.home.stat2n}</div>
                <div className="stat-l">{t.home.stat2l}</div>
              </div>
              <div className="stat">
                <div className="stat-n">{t.home.stat3n}</div>
                <div className="stat-l">{t.home.stat3l}</div>
              </div>
            </div>
          </div>
          <ChessBoard />
        </div>
      </div>
      <h1 className="home-main-title">{t.home.offerTitle}</h1>
      <div className="offer-grid">
        <div className="offer-card" onClick={() => onNav("programs")}>
          <img
            src="/images/schoolprogramsicon.png"
            alt={t.home.offer1Title}
            className="offer-img"
          />
          <h3>{t.home.offer1Title}</h3>
          <p>{t.home.offer1Desc}</p>
          <span>{t.common.seeMore}</span>
        </div>
        <div className="offer-card" onClick={() => onNav("programs")}>
          <img
            src="/images/privateicon.png"
            alt={t.home.offer2Title}
            className="offer-img"
          />
          <h3>{t.home.offer2Title}</h3>
          <p>{t.home.offer2Desc}</p>
          <span>{t.common.seeMore}</span>
        </div>
        <div className="offer-card" onClick={() => onNav("programs")}>
          <img
            src="/images/tournamentpreparation.png"
            alt={t.home.offer3Title}
            className="offer-img"
          />
          <h3>{t.home.offer3Title}</h3>
          <p>{t.home.offer3Desc}</p>
          <span>{t.common.seeMore}</span>
        </div>
        <div className="offer-card" onClick={() => onNav("programs")}>
          <img
            src="/images/teamtrain.png"
            alt={t.home.offer4Title}
            className="offer-img"
          />
          <h3>{t.home.offer4Title}</h3>
          <p>{t.home.offer4Desc}</p>
          <span>{t.common.seeMore}</span>
        </div>
        <div className="offer-card" onClick={() => onNav("programs")}>
          <img
            src="/images/chesscamps.png"
            alt={t.home.offer5Title}
            className="offer-img"
          />
          <h3>{t.home.offer5Title}</h3>
          <p>{t.home.offer5Desc}</p>
          <span>{t.common.seeMore}</span>
        </div>
      </div>
      {homeSections.map((section, i) => (
        <div key={section.title}>
          <section className="home-split-sec">
            <div className={`home-split-wrap ${i % 2 === 1 ? "rev" : ""}`}>
              <div className="home-split-copy">
                <div className="slbl">My Chess Family</div>
                <h2 className="home-split-title">{section.title}</h2>
                <p className="home-split-p">{section.text1}</p>
                <p className="home-split-p">{section.text2}</p>
                <button className="home-split-btn" onClick={section.onClick}>
                  {section.button}
                </button>
              </div>
              <div className="home-split-media">
                <img src={section.image} alt={section.title} />
              </div>
            </div>
          </section>
          {i !== homeSections.length - 1 && (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                background: "#F5F6F8",
              }}
            >
              <div
                style={{
                  width: "90%",
                  height: "2px",
                  margin: "0 auto 3rem auto",
                  background: "#D8DEE6",
                }}
              />
            </div>
          )}
        </div>
      ))}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          background: "#F5F6F8",
          padding: "0 0 1rem 0",
        }}
      >
        <div style={{ width: "90%", height: "2px", background: "#D8DEE6" }} />
      </div>
      <section className="home-split-sec">
        <div className="home-split-wrap">
          <div className="home-split-copy">
            <div className="slbl">{t.home.aboutLabel}</div>
            <h2 className="home-split-title">{t.home.aboutTitle}</h2>
            <p className="home-split-p">{t.home.aboutText1}</p>
            <p className="home-split-p">{t.home.aboutText2}</p>
            <p className="home-split-p">{t.home.aboutText3}</p>
            <button className="home-split-btn" onClick={() => onNav("about")}>
              {t.home.aboutBtn}
            </button>
          </div>
          <div className="home-split-media">
            <img src="/pieces/logo.png" alt="About My Chess Family" />
          </div>
        </div>
      </section>
      <Footer onNav={onNav} onContact={onContact} />
    </div>
  );
}

/* ══════════════════════════════════════════ PROGRAMS PAGE ══════════════════════════════════════════ */
function ProgramsPage({ onNav, onContact }) {
  const { t } = useLang();

  const PROGRAMS = t.programs.programs.map((p, i) => ({
    ...p,
    icon: [
      "/images/schoolprogramsicon.png",
      "/images/privateicon.png",
      "/images/tournamentpreparation.png",
      "/images/teamtrain.png",
      "/images/chesscamps.png",
    ][i],
    color: ["#1A5EA8", "#2E7D5B", "#B45309", "#6B21A8", "#0E7490"][i],
    accent: [
      "rgba(26,94,168,.08)",
      "rgba(46,125,91,.08)",
      "rgba(180,83,9,.07)",
      "rgba(107,33,168,.07)",
      "rgba(14,116,144,.07)",
    ][i],
    featured: i === 0,
    onClick: [
      onContact,
      () => onNav("team"),
      onContact,
      onContact,
      () => onNav("camp"),
    ][i],
  }));

  return (
    <div className="pg programs-page">
      <section className="programs-hero">
        <div className="programs-hero-inner">
          <div className="programs-kicker">{t.programs.kicker}</div>
          <h1 className="programs-hero-title">{t.programs.heroTitle}</h1>
          <p className="programs-hero-sub">{t.programs.heroSub}</p>
          <div className="programs-hero-actions">
            <button className="btn btn-g" onClick={onContact}>
              {t.programs.heroBtn1}
            </button>
            <button
              className="btn btn-g"
              style={{ background: "rgba(74,171,232,.18)", color: "#EEF5FF" }}
              onClick={() => onNav("camp")}
            >
              {t.programs.heroBtn2}
            </button>
          </div>
        </div>
      </section>

      <div className="programs-stats-strip">
        <div className="programs-stats-inner">
          {[
            [t.programs.stat1n, t.programs.stat1l],
            [t.programs.stat2n, t.programs.stat2l],
            [t.programs.stat3n, t.programs.stat3l],
            [t.programs.stat4n, t.programs.stat4l],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="programs-stat-n">{n}</div>
              <div className="programs-stat-l">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="programs-cards-outer">
        <div className="programs-cards-grid">
          {PROGRAMS.map((p) => (
            <ProgramCard key={p.title} p={p} />
          ))}
        </div>

        <div className="programs-bottom-cta">
          <h3>{t.programs.ctaTitle}</h3>
          <p>{t.programs.ctaText}</p>
          <div className="programs-cta-actions">
            <button className="btn btn-g" onClick={onContact}>
              {t.common.contactUs}
            </button>
            <button
              className="btn btn-g"
              style={{ background: "rgba(74,171,232,.18)", color: "#EEF5FF" }}
              onClick={() => onNav("team")}
            >
              {t.common.meetTeam}
            </button>
          </div>
        </div>
      </div>

      <Footer onNav={onNav} onContact={onContact} />
    </div>
  );
}

function ProgramCard({ p }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`prog-card-new${p.featured ? " featured-card" : ""}`}
      style={p.featured ? { borderColor: p.color } : {}}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {p.featured && (
        <div
          className="prog-card-featured-pill"
          style={{ background: p.color }}
        >
          ⭐ {p.tag}
        </div>
      )}

      <div
        className="prog-card-top-band"
        style={{
          background: p.accent,
          borderBottom: `3px solid ${p.color}22`,
        }}
      >
        <div className="prog-card-img-wrap">
          <img src={p.icon} alt={p.title} className="prog-card-img" />
        </div>
        <div className="prog-card-tag-pill" style={{ background: p.color }}>
          {p.tag}
        </div>
        <h3 className="prog-card-title-text">{p.title}</h3>
      </div>

      <div className="prog-card-meta-row">
        {[
          ["💰", p.price],
          ["⏱", p.duration],
          ["👦", p.age],
          ["📊", p.level],
        ].map(([ico, val]) => (
          <span key={val} className="prog-card-meta-chip">
            {ico} {val}
          </span>
        ))}
      </div>

      <div className="prog-card-body-area">
        <p className="prog-card-desc-text">{p.desc}</p>
        <ul className="prog-card-check-list">
          {p.highlights.map((h) => (
            <li key={h} className="prog-card-check-item">
              <span className="prog-card-check-icon" style={{ color: p.color }}>
                ✓
              </span>
              {h}
            </li>
          ))}
        </ul>
      </div>

      <div className="prog-card-footer-area">
        <button
          className="prog-card-cta-btn"
          onClick={p.onClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            background: hovered ? "var(--green2)" : "#fff",
            color: hovered ? "#fff" : "var(--green2)",
            borderColor: "var(--green2)",
          }}
        >
          {p.button} →
        </button>
      </div>
    </div>
  );
}

function CampPage({ camps, onNav, showToast, onRegistered, onContact }) {
  const { t } = useLang();
  const [modal, setModal] = useState(null);
  const BASE = import.meta.env.VITE_API_URL || "";
  return (
    <div className="pg" style={{ background: "#F5F6F8" }}>
      <section className="camp-page-top">
        <div className="camp-page-top-inner">
          <div className="slbl">{t.camp.label}</div>
          <h1 className="camp-page-title">{t.camp.title}</h1>
          <p className="camp-page-sub">{t.camp.sub}</p>
        </div>
      </section>
      <section className="camp-list-wrap">
        {!camps.length ? (
          <div className="empty">
            <div className="empty-i">☀️</div>
            <p>{t.camp.noSessions}</p>
          </div>
        ) : (
          <div className="camp-list">
            {camps.map((c) => (
              <div className="camp-row-card" key={c.id}>
                <div className="camp-row-media">
                  <img src={getImageSrc(c.image, BASE)} alt={c.name} />
                </div>
                <div className="camp-row-main">
                  <div className="camp-row-head">
                    <div>
                      <h3>{c.name}</h3>
                      <div className="camp-row-meta">
                        <span>
                          {t.camp.metaDate} {fmtDShort(c.dateStart)} –{" "}
                          {fmtDShort(c.dateEnd)}
                        </span>
                        <span>
                          {t.camp.metaLocation} {c.location}
                        </span>
                        <span>
                          {t.camp.metaAge} {c.age}
                        </span>
                        <span>
                          {t.camp.metaTime} {c.type}
                        </span>
                      </div>
                    </div>
                    <div className="camp-row-badge">
                      <Badge status={c.status} />
                    </div>
                  </div>
                  <p className="camp-row-desc">{c.desc}</p>
                  <div className="camp-row-bottom">
                    <div className="camp-row-price">
                      ${c.price}
                      <span> {t.camp.perChild}</span>
                    </div>
                    <div className="camp-row-actions">
                      <button
                        className="camp-row-btn ghost"
                        onClick={onContact}
                        type="button"
                      >
                        {t.camp.contact}
                      </button>
                      <button
                        className="camp-row-btn primary"
                        disabled={c.status === "full"}
                        onClick={() => setModal(c)}
                        type="button"
                      >
                        {c.status === "full"
                          ? t.camp.closed
                          : c.status === "upcoming"
                            ? t.camp.preRegister
                            : t.camp.signUp}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      {modal && (
        <CampRegModal
          item={modal}
          onClose={() => setModal(null)}
          showToast={showToast}
          onRegistered={onRegistered}
        />
      )}
      <Footer onNav={onNav} onContact={onContact} />
    </div>
  );
}

function AboutFaqSection() {
  const { t } = useLang();
  const faqs = t.about.faqs;
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section className="about-faq-section">
      <div className="about-inner-light">
        <div className="about-section-head" style={{ marginTop: 0 }}>
          <h2>{t.about.faqTitle}</h2>
          <p>{t.about.faqSub}</p>
        </div>
        <div className="about-faq-grid">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={item.q}
                className={`about-faq-card${isOpen ? " open" : ""}`}
              >
                <button
                  type="button"
                  className="about-faq-top"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                >
                  <span>{item.q}</span>
                  <span className="about-faq-plus">{isOpen ? "−" : "+"}</span>
                </button>
                <div className="about-faq-body">
                  <p>{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AboutPage({ onNav, onContact }) {
  const { t } = useLang();
  return (
    <div className="pg" style={{ background: "#09131E" }}>
      <section className="about-hero">
        <div className="about-hero-inner">
          <div className="about-kicker">{t.about.kicker}</div>
          <h1 className="about-title">{t.about.heroTitle}</h1>
          <p className="about-sub">{t.about.heroSub}</p>
          <div className="about-hero-actions">
            <button className="btn btn-g" onClick={() => onNav("programs")}>
              {t.common.viewPrograms}
            </button>
            <button
              className="btn btn-g"
              style={{ background: "rgba(74,171,232,.18)", color: "#EEF5FF" }}
              onClick={onContact}
            >
              {t.common.contact}
            </button>
          </div>
        </div>
      </section>
      <section className="about-light">
        <div className="about-inner-light">
          <div className="about-story">
            <div className="about-story-card">
              <h2>{t.about.storyTitle}</h2>
              <p>{t.about.storyP1}</p>
              <p>{t.about.storyP2}</p>
              <p>{t.about.storyP3}</p>
            </div>
            <div className="about-visual-card">
              <img src="/pieces/logo.png" alt="My Chess Family" />
            </div>
          </div>
          <div className="about-section-head">
            <h2>{t.about.founderSectionTitle}</h2>
            <p>{t.about.founderSectionSub}</p>
          </div>
          <div className="about-founder">
            <div className="about-founder-side">
              <div className="about-founder-mark">♔</div>
              <div className="about-founder-name">{t.about.founderName}</div>
              <div className="about-founder-role">{t.about.founderRole}</div>
            </div>
            <div className="about-founder-copy">
              <h3>{t.about.founderName}</h3>
              <p>{t.about.founderP1}</p>
              <p>{t.about.founderP2}</p>
              <p>{t.about.founderP3}</p>
            </div>
          </div>
          <div className="about-section-head">
            <h2>{t.about.valuesTitle}</h2>
            <p>{t.about.valuesSub}</p>
          </div>
          <div className="about-values">
            <div className="about-value">
              <div className="about-value-icon">♟</div>
              <h4>{t.about.value1Title}</h4>
              <p>{t.about.value1Text}</p>
            </div>
            <div className="about-value">
              <div className="about-value-icon">🧠</div>
              <h4>{t.about.value2Title}</h4>
              <p>{t.about.value2Text}</p>
            </div>
            <div className="about-value">
              <div className="about-value-icon">⭐</div>
              <h4>{t.about.value3Title}</h4>
              <p>{t.about.value3Text}</p>
            </div>
            <div className="about-value">
              <div className="about-value-icon">🤝</div>
              <h4>{t.about.value4Title}</h4>
              <p>{t.about.value4Text}</p>
            </div>
          </div>
          <div className="about-cta">
            <h3>{t.about.ctaTitle}</h3>
            <p>{t.about.ctaText}</p>
            <div className="about-cta-actions">
              <button className="btn btn-g" onClick={() => onNav("programs")}>
                {t.common.explorePrograms}
              </button>
              <button
                className="btn btn-g"
                style={{ background: "rgba(74,171,232,.18)", color: "#EEF5FF" }}
                onClick={() => onNav("team")}
              >
                {t.common.meetTeam}
              </button>
            </div>
          </div>
        </div>
      </section>
      <AboutFaqSection />
      <Footer onNav={onNav} onContact={onContact} />
    </div>
  );
}

function TeamPage({ onNav, onContact }) {
  const { t } = useLang();

  const TEAM = [
    {
      av: "♔",
      name: "David Karpov",
      role: t.team.cards[0].role,
      bio: t.team.cards[0].bio,
      tags: t.team.cards[0].tags,
    },
    {
      av: "♕",
      name: "Sophia Chen",
      role: t.team.cards[1].role,
      bio: t.team.cards[1].bio,
      tags: t.team.cards[1].tags,
    },
    {
      av: "♘",
      name: "Aisha Patel",
      role: t.team.cards[2].role,
      bio: t.team.cards[2].bio,
      tags: t.team.cards[2].tags,
    },
    {
      av: "♖",
      name: "Miguel Rivera",
      role: t.team.cards[3].role,
      bio: t.team.cards[3].bio,
      tags: t.team.cards[3].tags,
    },
  ];

  return (
    <>
      <div className="pg" style={{ background: "#09131E" }}>
        <section className="team-hero">
          <div className="team-hero-inner">
            <div className="team-hero-kicker">{t.team.kicker}</div>
            <h1 className="team-hero-title">{t.team.heroTitle}</h1>
            <p className="team-hero-sub">{t.team.heroSub}</p>
            <div className="team-hero-actions">
              <button className="btn btn-g" onClick={onContact}>
                {t.common.contactUs}
              </button>
              <button
                className="btn btn-g"
                style={{ background: "rgba(74,171,232,.18)", color: "#EEF5FF" }}
                onClick={() => onNav("programs")}
              >
                {t.common.viewPrograms}
              </button>
            </div>
          </div>
        </section>
        <section className="team-wrap-light">
          <div className="team-inner-light">
            <div className="founder-card">
              <div className="founder-visual">
                <img src="/pieces/logo.png" alt="Dmitri Shevelev" />
              </div>
              <div className="founder-copy">
                <div className="founder-role">{t.team.founderRole}</div>
                <h2>{t.team.founderName}</h2>
                <p>{t.team.founderP1}</p>
                <p>{t.team.founderP2}</p>
                <p>{t.team.founderP3}</p>
              </div>
            </div>

            <div style={{ height: "3rem" }} />

            <div className="team-section-head">
              <h2>{t.team.coachTitle}</h2>
              <p>{t.team.coachSub}</p>
            </div>

            <div className="team-grid-modern">
              {TEAM.map((c) => (
                <div className="team-card-modern" key={c.name}>
                  <div className="team-card-top">
                    <div className="team-avatar-modern">{c.av}</div>
                    <div>
                      <div className="team-name-modern">{c.name}</div>
                      <div className="team-role-modern">{c.role}</div>
                    </div>
                  </div>
                  <div className="team-bio-modern">{c.bio}</div>
                  <div className="team-tags-modern">
                    {c.tags.map((tg) => (
                      <span key={tg}>{tg}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="team-features">
              <div className="team-feature">
                <h3>{t.team.feat1Title}</h3>
                <p>{t.team.feat1Text}</p>
              </div>
              <div className="team-feature">
                <h3>{t.team.feat2Title}</h3>
                <p>{t.team.feat2Text}</p>
              </div>
              <div className="team-feature">
                <h3>{t.team.feat3Title}</h3>
                <p>{t.team.feat3Text}</p>
              </div>
            </div>

            <div className="team-cta">
              <h3>{t.team.ctaTitle}</h3>
              <p>{t.team.ctaText}</p>
              <div className="team-cta-actions">
                <button className="btn btn-g" onClick={onContact}>
                  {t.common.contactUs}
                </button>
                <button
                  className="btn btn-g"
                  style={{
                    background: "rgba(74,171,232,.18)",
                    color: "#EEF5FF",
                  }}
                  onClick={() => onNav("camp")}
                >
                  {t.common.viewSummerCamp}
                </button>
              </div>
            </div>
          </div>
        </section>
        <Footer onNav={onNav} onContact={onContact} />
      </div>
    </>
  );
}

function Stars({ rating = 0 }) {
  const r = Math.max(0, Math.min(5, Number(rating) || 0));
  return (
    <span style={{ letterSpacing: 1 }}>
      {"★★★★★".slice(0, r)}
      <span style={{ opacity: 0.25 }}>{"★★★★★".slice(r)}</span>
    </span>
  );
}

function ReviewsPage({ reviews, openModal, onNav, onContact }) {
  const { t } = useLang();
  const approved = (reviews || []).filter((r) => r.approved === true);
  const count = approved.length;
  const avg = count
    ? approved.reduce((s, r) => s + (Number(r.rating) || 0), 0) / count
    : 0;
  const ratingMetaStr = `${t.reviews.ratingMeta} ${count} ${count === 1 ? t.reviews.ratingMetaEnd : t.reviews.ratingMetaEndPlural}`;
  return (
    <div className="pg reviews-page">
      <section className="reviews-hero">
        <div className="reviews-hero-inner">
          <div className="reviews-kicker">{t.reviews.kicker}</div>
          <h1 className="reviews-title">{t.reviews.heroTitle}</h1>
          <p className="reviews-sub">{t.reviews.heroSub}</p>
          <div className="reviews-rating-big">
            <div className="reviews-rating-score">{avg.toFixed(1)}/5.0</div>
            <div className="reviews-rating-stars">
              <Stars rating={Math.round(avg)} />
            </div>
            <div className="reviews-rating-meta">{ratingMetaStr}</div>
          </div>
          <div className="reviews-hero-actions">
            <button className="btn btn-g" onClick={openModal}>
              {t.common.writeReview}
            </button>
            <button
              className="btn btn-g"
              style={{ background: "rgba(74,171,232,.18)", color: "#EEF5FF" }}
              onClick={onContact}
            >
              {t.common.contact}
            </button>
          </div>
        </div>
      </section>
      <div className="reviews-content">
        <div className="reviews-stats">
          <div className="reviews-stat">
            <div className="reviews-stat-number">{avg.toFixed(1)}</div>
            <div className="reviews-stat-label">{t.reviews.stat1Label}</div>
          </div>
          <div className="reviews-stat">
            <div className="reviews-stat-number">{count}</div>
            <div className="reviews-stat-label">{t.reviews.stat2Label}</div>
          </div>
          <div className="reviews-stat">
            <div className="reviews-stat-number">{t.reviews.stat3n}</div>
            <div className="reviews-stat-label">{t.reviews.stat3Label}</div>
          </div>
        </div>
        {!count ? (
          <div className="reviews-empty-modern">
            <div className="icon">📝</div>
            <h3 style={{ color: "#1F2B3A", marginBottom: ".45rem" }}>
              {t.reviews.noReviews}
            </h3>
            <p>{t.reviews.noReviewsSub}</p>
          </div>
        ) : (
          <div className="reviews-grid-modern">
            {approved
              .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
              .map((r) => (
                <div className="review-card-modern" key={r.id}>
                  <div className="review-card-head">
                    <div className="review-card-name">
                      {r.childName ? r.childName : "Anonymous"}
                    </div>
                    <div className="review-card-date">{r.date || ""}</div>
                  </div>
                  <div className="review-card-stars">
                    <Stars rating={r.rating} />
                  </div>
                  <div className="review-card-text">{r.text}</div>
                </div>
              ))}
          </div>
        )}
        <div className="reviews-cta">
          <h3>{t.reviews.ctaTitle}</h3>
          <p>{t.reviews.ctaText}</p>
          <div className="reviews-cta-actions">
            <button className="btn btn-g" onClick={openModal}>
              {t.common.leaveReview}
            </button>
            <button
              className="btn btn-g"
              style={{ background: "rgba(74,171,232,.18)", color: "#EEF5FF" }}
              onClick={() => onNav("programs")}
            >
              {t.common.viewPrograms}
            </button>
          </div>
        </div>
      </div>
      <Footer onNav={onNav} onContact={onContact} />
    </div>
  );
}

function ReviewModal({ onClose, showToast, reload }) {
  const { t } = useLang();
  const rm = t.reviews.modal;
  const [childName, setChildName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);
  const submit = async () => {
    if (!text.trim() || text.trim().length < 10) {
      showToast(rm.tooShort, "e");
      return;
    }
    try {
      await api("/reviews", {
        method: "POST",
        body: JSON.stringify({
          childName: childName.trim() || "",
          rating: Number(rating) || 5,
          text: text.trim(),
        }),
      });
      setDone(true);
      showToast(t.toast.reviewSubmitted, "s");
      await reload?.();
    } catch (e) {
      showToast(e.message || "Could not submit review.", "e");
    }
  };
  return (
    <div
      className="ovl"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <button className="mcls" onClick={onClose}>
          {t.common.close}
        </button>
        <h3>{rm.title}</h3>
        {!done ? (
          <>
            <div className="fg">
              <label className="lbl">{rm.childName}</label>
              <input
                className="inp"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder={rm.childNamePh}
              />
            </div>
            <div className="fg">
              <label className="lbl">{rm.rating}</label>
              <select
                className="inp"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value={5}>★★★★★ (5)</option>
                <option value={4}>★★★★☆ (4)</option>
                <option value={3}>★★★☆☆ (3)</option>
                <option value={2}>★★☆☆☆ (2)</option>
                <option value={1}>★☆☆☆☆ (1)</option>
              </select>
            </div>
            <div className="fg">
              <label className="lbl">{rm.review} *</label>
              <textarea
                className="inp"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={rm.reviewPh}
              />
            </div>
            <button className="sbtn" onClick={submit}>
              {rm.submitBtn}
            </button>
          </>
        ) : (
          <div className="ok-box">
            <div style={{ fontSize: "2rem" }}>✅</div>
            <strong style={{ marginTop: ".5rem" }}>{rm.successTitle}</strong>
            <p
              style={{
                fontSize: ".86rem",
                color: "var(--muted)",
                marginTop: ".4rem",
              }}
            >
              {rm.successSub}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function LoginPage({ onLogin, showToast }) {
  const { t } = useLang();
  const lg = t.login;
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const submit = async () => {
    try {
      setErr("");
      const data = await api("/admin/login", {
        method: "POST",
        body: JSON.stringify({ username: u, password: p }),
      });
      localStorage.setItem(AUTH_KEY, data.token);
      onLogin();
      showToast(t.toast.loggedIn, "s");
    } catch {
      setErr(lg.wrongCreds);
    }
  };
  return (
    <div className="pg-center">
      <div className="login-box">
        <div style={{ fontSize: "3rem", marginBottom: ".85rem" }}>🔐</div>
        <h2
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "1.75rem",
            marginBottom: ".4rem",
          }}
        >
          {lg.title}
        </h2>
        <p
          style={{
            color: "var(--muted)",
            marginBottom: "1.8rem",
            fontSize: ".88rem",
          }}
        >
          {lg.sub}
        </p>
        <div className="fg" style={{ textAlign: "left" }}>
          <label className="lbl">{lg.username}</label>
          <input
            className="inp"
            placeholder="admin"
            value={u}
            onChange={(e) => setU(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>
        <div className="fg" style={{ textAlign: "left", marginTop: ".7rem" }}>
          <label className="lbl">{lg.password}</label>
          <input
            className="inp"
            type="password"
            placeholder="••••••••"
            value={p}
            onChange={(e) => setP(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>
        <p
          style={{
            fontSize: ".75rem",
            color: "rgba(45,204,116,.65)",
            margin: ".75rem 0",
            textAlign: "left",
          }}
        >
          {lg.demo} <strong style={{ color: "var(--green2)" }}>admin</strong> /{" "}
          <strong style={{ color: "var(--green2)" }}>chess123</strong>
        </p>
        <button className="sbtn" onClick={submit}>
          {t.common.signIn}
        </button>
        {err && <div className="err-box">{err}</div>}
      </div>
    </div>
  );
}

function AdminPage({
  camps,
  setCamps,
  campRegs,
  reloadRegs,
  adminReviews,
  galleryPhotos,
  reloadGallery,
  onLogout,
  showToast,
}) {
  const { t } = useLang();
  const adm = t.admin;
  const [tab, setTab] = useState("camps");
  const [editingCampId, setEditingCampId] = useState(null);
  const [statusOpenId, setStatusOpenId] = useState(null);
  const [cf, setCf] = useState({
    name: "",
    dateStart: "",
    dateEnd: "",
    loc: "",
    age: adm.ageOpts[0],
    type: adm.typeOpts[0],
    price: "",
    spots: "",
    status: "open",
    desc: "",
    image: "",
  });
  const [campFile, setCampFile] = useState(null);
  const [cDone, setCDone] = useState(false);

  const startEditCamp = (camp) => {
    setEditingCampId(camp.id);
    setCf({
      name: camp.name || "",
      dateStart: camp.dateStart || "",
      dateEnd: camp.dateEnd || "",
      loc: camp.location || "",
      age: camp.age || adm.ageOpts[0],
      type: camp.type || adm.typeOpts[0],
      price: String(camp.price ?? ""),
      spots: String(camp.spots ?? ""),
      status: camp.status || "open",
      desc: camp.desc || "",
      image: camp.image || "",
    });
    setCampFile(null);
  };

  const resetCampForm = () => {
    setEditingCampId(null);
    setCf({
      name: "",
      dateStart: "",
      dateEnd: "",
      loc: "",
      age: adm.ageOpts[0],
      type: adm.typeOpts[0],
      price: "",
      spots: "",
      status: "open",
      desc: "",
      image: "",
    });
    setCampFile(null);
  };

  const setC = (k) => (e) => setCf((p) => ({ ...p, [k]: e.target.value }));
  const revenue = campRegs.reduce((s, r) => s + (r.price || 0), 0);

  const addCamp = async () => {
    if (!cf.name || !cf.dateStart || !cf.dateEnd || !cf.loc) {
      showToast("Fill Name, Dates & Location.", "e");
      return;
    }
    try {
      let imagePath = cf.image || "/images/camp-default.jpg";
      if (campFile) {
        const fd = new FormData();
        fd.append("image", campFile);
        const BASE = import.meta.env.VITE_API_URL || "";
        const token = localStorage.getItem(AUTH_KEY);
        const uploadRes = await fetch(`${BASE}/api/admin/upload`, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: fd,
        });
        const uploadData = await uploadRes.json().catch(() => ({}));
        if (!uploadRes.ok)
          throw new Error(uploadData.error || "Image upload failed");
        imagePath = uploadData.image;
      }
      const payload = {
        name: cf.name,
        dateStart: cf.dateStart,
        dateEnd: cf.dateEnd,
        location: cf.loc,
        age: cf.age,
        type: cf.type,
        price: parseInt(cf.price) || 0,
        spots: parseInt(cf.spots) || 20,
        status: cf.status,
        desc: cf.desc || "Registration open!",
        image: imagePath,
      };
      const data = editingCampId
        ? await api(`/admin/camps/${editingCampId}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
          })
        : await api("/admin/camps", {
            method: "POST",
            body: JSON.stringify(payload),
          });
      setCamps(data.camps);
      setCDone(true);
      setTimeout(() => setCDone(false), 3000);
      resetCampForm();
      showToast(editingCampId ? adm.updated : adm.published, "s");
    } catch (error) {
      showToast(error.message || "Could not save camp session.", "e");
    }
  };

  const changeStatusC = async (id, status) => {
    try {
      const data = await api(`/admin/camps/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setCamps(data.camps);
      showToast(adm.statusUpdated, "s");
    } catch (error) {
      showToast(error.message || "Could not update status.", "e");
    }
  };

  const delC = async (id) => {
    if (!confirm(adm.deleteConfirmCamp)) return;
    try {
      const data = await api(`/admin/camps/${id}`, { method: "DELETE" });
      setCamps(data.camps);
      showToast(adm.deleted, "i");
    } catch (error) {
      showToast(error.message || "Could not delete camp session.", "e");
    }
  };

  const deleteCampReg = async (id) => {
    if (!confirm(adm.deleteConfirmSignup)) return;
    try {
      await api(`/admin/registrations/camp/${id}`, { method: "DELETE" });
      showToast(adm.signupDeleted, "i");
      await reloadRegs?.();
    } catch (error) {
      showToast(error.message || "Could not delete sign-up.", "e");
    }
  };

  return (
    <div className="pg">
      <div className="adm-wrap">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.8rem",
            paddingTop: "1.5rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <div className="slbl">{adm.label}</div>
            <h2
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "clamp(1.4rem, 4vw, 2rem)",
              }}
            >
              {adm.welcome}
            </h2>
          </div>
          <button
            className="delbtn"
            style={{ fontSize: ".88rem", padding: ".45rem 1rem" }}
            onClick={onLogout}
          >
            {t.common.logOut}
          </button>
        </div>

        <div className="adm-stats">
          {[
            { n: camps.length, l: adm.stats.sessions },
            { n: campRegs.length, l: adm.stats.signups },
            { n: "$" + revenue.toLocaleString(), l: adm.stats.revenue },
          ].map((s) => (
            <div className="stat" key={s.l}>
              <div className="stat-n">{s.n}</div>
              <div className="stat-l">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="atabs">
          {[
            ["camps", adm.tabs.camps],
            ["campregs", adm.tabs.campregs],
            ["reviews", adm.tabs.reviews],
            ["gallery", adm.tabs.gallery],
          ].map(([id, lbl]) => (
            <button
              key={id}
              className={`atab${tab === id ? " on" : ""}`}
              onClick={() => setTab(id)}
            >
              {lbl}
            </button>
          ))}
        </div>

        {tab === "camps" && (
          <>
            <div className="add-form">
              <h3
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "1.25rem",
                  marginBottom: "1.3rem",
                }}
              >
                {editingCampId ? adm.editCamp : adm.addCamp}
              </h3>
              <div className="fgrid">
                <div className="fg full">
                  <label className="lbl">{adm.fields.name} *</label>
                  <input
                    className="inp"
                    placeholder={adm.fields.namePh}
                    value={cf.name}
                    onChange={setC("name")}
                  />
                </div>
                <div className="fg">
                  <label className="lbl">{adm.fields.startDate} *</label>
                  <input
                    className="inp"
                    type="date"
                    value={cf.dateStart}
                    onChange={setC("dateStart")}
                  />
                </div>
                <div className="fg">
                  <label className="lbl">{adm.fields.endDate} *</label>
                  <input
                    className="inp"
                    type="date"
                    value={cf.dateEnd}
                    onChange={setC("dateEnd")}
                  />
                </div>
                <div className="fg">
                  <label className="lbl">{adm.fields.location} *</label>
                  <input
                    className="inp"
                    placeholder={adm.fields.locationPh}
                    value={cf.loc}
                    onChange={setC("loc")}
                  />
                </div>
                <div className="fg">
                  <label className="lbl">{adm.fields.type}</label>
                  <select
                    className="inp"
                    value={cf.type}
                    onChange={setC("type")}
                  >
                    {adm.typeOpts.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div className="fg">
                  <label className="lbl">{adm.fields.age}</label>
                  <select className="inp" value={cf.age} onChange={setC("age")}>
                    {adm.ageOpts.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div className="fg">
                  <label className="lbl">{adm.fields.price}</label>
                  <input
                    className="inp"
                    type="number"
                    placeholder={adm.fields.pricePh}
                    value={cf.price}
                    onChange={setC("price")}
                  />
                </div>
                <div className="fg">
                  <label className="lbl">{adm.fields.spots}</label>
                  <input
                    className="inp"
                    type="number"
                    placeholder={adm.fields.spotsPh}
                    value={cf.spots}
                    onChange={setC("spots")}
                  />
                </div>
                <div className="fg">
                  <label className="lbl">{adm.fields.status}</label>

                  <div className="status-drop">
                    <button
                      type="button"
                      className={`status-drop-trigger${statusOpenId === "form" ? " open" : ""}`}
                      onClick={() =>
                        setStatusOpenId((prev) =>
                          prev === "form" ? null : "form",
                        )
                      }
                    >
                      {cf.status === "open"
                        ? adm.statusOpts.open
                        : cf.status === "upcoming"
                          ? adm.statusOpts.upcoming
                          : adm.statusOpts.full}
                      <svg
                        className="status-chevron"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    <div
                      className={`status-drop-menu${statusOpenId === "form" ? " open" : ""}`}
                    >
                      <div
                        className={`status-drop-item${cf.status === "open" ? " selected" : ""}`}
                        onMouseDown={() => {
                          setCf((p) => ({ ...p, status: "open" }));
                          setStatusOpenId(null);
                        }}
                      >
                        {adm.statusOpts.open}
                      </div>

                      <div
                        className={`status-drop-item${cf.status === "upcoming" ? " selected" : ""}`}
                        onMouseDown={() => {
                          setCf((p) => ({ ...p, status: "upcoming" }));
                          setStatusOpenId(null);
                        }}
                      >
                        {adm.statusOpts.upcoming}
                      </div>

                      <div
                        className={`status-drop-item${cf.status === "full" ? " selected" : ""}`}
                        onMouseDown={() => {
                          setCf((p) => ({ ...p, status: "full" }));
                          setStatusOpenId(null);
                        }}
                      >
                        {adm.statusOpts.full}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="fg full">
                  <label className="lbl">{adm.fields.image}</label>

                  <div className="file-upload">
                    <label className="file-upload-box">
                      <input
                        className="file-upload-input"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setCampFile(e.target.files?.[0] || null)
                        }
                      />
                      <span className="file-upload-btn">Choose file</span>
                      <span
                        className={`file-upload-name${campFile ? "" : " file-upload-empty"}`}
                      >
                        {campFile ? campFile.name : "No file chosen"}
                      </span>
                    </label>
                  </div>
                </div>
                <div className="fg full">
                  <label className="lbl">{adm.fields.desc}</label>
                  <textarea
                    className="inp"
                    placeholder={adm.fields.descPh}
                    value={cf.desc}
                    onChange={setC("desc")}
                  />
                </div>
              </div>
              <button className="sbtn" onClick={addCamp}>
                {editingCampId ? adm.updateBtn : adm.addBtn}
              </button>
              {editingCampId && (
                <button
                  className="delbtn"
                  style={{ marginTop: ".8rem" }}
                  onClick={resetCampForm}
                  type="button"
                >
                  {t.common.cancel}
                </button>
              )}
              {cDone && (
                <div className="ok-box">
                  <div style={{ fontSize: "1.4rem" }}>✅</div>
                  <strong>{adm.published}</strong>
                </div>
              )}
            </div>

            <h3 className="adm-section-title">
              {adm.allSessions} ({camps.length})
            </h3>
            {!camps.length ? (
              <div className="empty">
                <div className="empty-i">☀️</div>
                <p>{adm.noSessions}</p>
              </div>
            ) : (
              camps.map((c) => {
                const rc = campRegs.filter((r) => r.campId === c.id).length;
                return (
                  <div className="ei" key={c.id}>
                    <div className="ei-inner">
                      <img
                        src={getImageSrc(
                          c.image,
                          import.meta.env.VITE_API_URL || "",
                        )}
                        alt={c.name}
                        className="ei-img"
                      />
                      <div className="ei-text">
                        <div className="ei-name">{c.name}</div>
                        <div className="ei-meta">
                          📅 {fmtDShort(c.dateStart)} – {fmtDShort(c.dateEnd)}
                        </div>
                        <div className="ei-meta">
                          📍 {c.location} · {c.type}
                        </div>
                        <div className="ei-meta">
                          💵 ${c.price} · 📝 {rc} sign-up{rc !== 1 ? "s" : ""}
                        </div>
                        <div
                          className="ei-meta"
                          style={{ marginTop: ".2rem", opacity: 0.7 }}
                        >
                          Image: {c.image || "none"}
                        </div>
                      </div>
                    </div>
                    <div className="ei-actions">
                      <button
                        className="sbtn"
                        style={{
                          padding: ".45rem .8rem",
                          width: "auto",
                          marginTop: 0,
                          fontSize: ".82rem",
                        }}
                        onClick={() => startEditCamp(c)}
                        type="button"
                      >
                        {t.common.edit}
                      </button>
                      <div className="status-drop">
                        <button
                          type="button"
                          className={`status-drop-trigger${statusOpenId === c.id ? " open" : ""}`}
                          onClick={() =>
                            setStatusOpenId((prev) =>
                              prev === c.id ? null : c.id,
                            )
                          }
                        >
                          {c.status === "open"
                            ? adm.statusOpts.open
                            : c.status === "upcoming"
                              ? adm.statusOpts.upcoming
                              : adm.statusOpts.full}
                          <svg
                            className="status-chevron"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>

                        <div
                          className={`status-drop-menu${statusOpenId === c.id ? " open" : ""}`}
                        >
                          <div
                            className={`status-drop-item${c.status === "open" ? " selected" : ""}`}
                            onMouseDown={() => {
                              changeStatusC(c.id, "open");
                              setStatusOpenId(null);
                            }}
                          >
                            {adm.statusOpts.open}
                          </div>

                          <div
                            className={`status-drop-item${c.status === "upcoming" ? " selected" : ""}`}
                            onMouseDown={() => {
                              changeStatusC(c.id, "upcoming");
                              setStatusOpenId(null);
                            }}
                          >
                            {adm.statusOpts.upcoming}
                          </div>

                          <div
                            className={`status-drop-item${c.status === "full" ? " selected" : ""}`}
                            onMouseDown={() => {
                              changeStatusC(c.id, "full");
                              setStatusOpenId(null);
                            }}
                          >
                            {adm.statusOpts.full}
                          </div>
                        </div>
                      </div>
                      <button className="delbtn" onClick={() => delC(c.id)}>
                        🗑
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}

        {tab === "campregs" && (
          <>
            <h3 className="adm-section-title">
              {adm.signupsTitle} ({campRegs.length})
            </h3>
            {!campRegs.length ? (
              <div className="empty">
                <div className="empty-i">🏕</div>
                <p>{adm.noSignups}</p>
              </div>
            ) : (
              <>
                <div className="twrap">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Child</th>
                        <th>DOB</th>
                        <th>Level</th>
                        <th>Camp Session</th>
                        <th>Parent</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Emergency</th>
                        <th>Medical</th>
                        <th>Fee</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campRegs.map((r, i) => (
                        <tr key={r.id}>
                          <td style={{ color: "var(--muted)" }}>{i + 1}</td>
                          <td
                            style={{ whiteSpace: "nowrap", fontSize: ".78rem" }}
                          >
                            {r.date}
                            <br />
                            <span style={{ color: "var(--muted)" }}>
                              {r.time}
                            </span>
                          </td>
                          <td>
                            <strong>{r.childName}</strong>
                          </td>
                          <td style={{ fontSize: ".8rem" }}>{r.dob}</td>
                          <td style={{ fontSize: ".8rem" }}>{r.level}</td>
                          <td style={{ fontSize: ".82rem", maxWidth: 160 }}>
                            {r.campName}
                          </td>
                          <td>{r.parent}</td>
                          <td style={{ fontSize: ".8rem" }}>{r.email}</td>
                          <td style={{ fontSize: ".8rem" }}>{r.phone}</td>
                          <td style={{ fontSize: ".8rem" }}>{r.emergency}</td>
                          <td
                            style={{
                              fontSize: ".8rem",
                              color:
                                r.medical === "None"
                                  ? "var(--muted)"
                                  : "#fc8181",
                            }}
                          >
                            {r.medical}
                          </td>
                          <td
                            style={{ color: "var(--green2)", fontWeight: 700 }}
                          >
                            ${r.price}
                          </td>
                          <td>
                            <button
                              className="delbtn"
                              onClick={() => deleteCampReg(r.id)}
                            >
                              🗑 Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="reg-cards">
                  {campRegs.map((r, i) => (
                    <div className="reg-card" key={r.id}>
                      <div className="reg-card-row">
                        <div>
                          <div className="reg-card-label">Child</div>
                          <div
                            className="reg-card-value"
                            style={{ fontWeight: 700, color: "#EEF5FF" }}
                          >
                            {r.childName}
                          </div>
                        </div>
                        <div
                          style={{
                            color: "var(--green2)",
                            fontWeight: 700,
                            fontSize: "1.1rem",
                          }}
                        >
                          ${r.price}
                        </div>
                      </div>
                      <div className="reg-card-row">
                        <div>
                          <div className="reg-card-label">Camp</div>
                          <div className="reg-card-value">{r.campName}</div>
                        </div>
                      </div>
                      <div className="reg-card-row">
                        <div>
                          <div className="reg-card-label">Level</div>
                          <div className="reg-card-value">{r.level}</div>
                        </div>
                        <div>
                          <div className="reg-card-label">DOB</div>
                          <div className="reg-card-value">{r.dob}</div>
                        </div>
                      </div>
                      <div className="reg-card-row">
                        <div>
                          <div className="reg-card-label">Parent</div>
                          <div className="reg-card-value">{r.parent}</div>
                        </div>
                      </div>
                      <div className="reg-card-row">
                        <div>
                          <div className="reg-card-label">Email</div>
                          <div className="reg-card-value">{r.email}</div>
                        </div>
                      </div>
                      <div className="reg-card-row">
                        <div>
                          <div className="reg-card-label">Phone</div>
                          <div className="reg-card-value">{r.phone}</div>
                        </div>
                      </div>
                      {r.emergency && r.emergency !== "—" && (
                        <div className="reg-card-row">
                          <div>
                            <div className="reg-card-label">Emergency</div>
                            <div className="reg-card-value">{r.emergency}</div>
                          </div>
                        </div>
                      )}
                      {r.medical && r.medical !== "None" && (
                        <div className="reg-card-row">
                          <div>
                            <div className="reg-card-label">Medical</div>
                            <div
                              className="reg-card-value"
                              style={{ color: "#fc8181" }}
                            >
                              {r.medical}
                            </div>
                          </div>
                        </div>
                      )}
                      <div style={{ marginTop: ".6rem" }}>
                        <button
                          className="delbtn"
                          style={{ width: "100%", textAlign: "center" }}
                          onClick={() => deleteCampReg(r.id)}
                        >
                          🗑 Delete Sign-Up
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {tab === "reviews" && (
          <>
            <h3 className="adm-section-title">
              {adm.reviewsTitle} ({adminReviews.length})
            </h3>
            {!adminReviews.length ? (
              <div className="empty">
                <div className="empty-i">⭐</div>
                <p>{adm.noReviews}</p>
              </div>
            ) : (
              adminReviews
                .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
                .map((r) => (
                  <div className="ei" key={r.id}>
                    <div
                      className="ei-inner"
                      style={{ flexDirection: "column" }}
                    >
                      <div className="ei-name">
                        {r.childName || "Anonymous"} · {r.rating}/5
                      </div>
                      <div
                        className="ei-meta"
                        style={{ marginTop: 6, wordBreak: "break-word" }}
                      >
                        {r.text}
                      </div>
                      <div
                        style={{
                          marginTop: 6,
                          fontSize: ".8rem",
                          color: "var(--muted)",
                        }}
                      >
                        Status:{" "}
                        <b
                          style={{
                            color: r.approved ? "var(--green2)" : "#fc8181",
                          }}
                        >
                          {r.approved ? "Approved" : "Pending"}
                        </b>
                      </div>
                    </div>
                    <div className="ei-actions">
                      {!r.approved && (
                        <button
                          className="sbtn"
                          style={{
                            padding: ".45rem .8rem",
                            width: "auto",
                            fontSize: ".82rem",
                          }}
                          onClick={async () => {
                            try {
                              await api(`/admin/reviews/${r.id}/approve`, {
                                method: "PATCH",
                              });
                              showToast(adm.approved, "s");
                              await reloadRegs?.();
                            } catch (e) {
                              showToast(e.message || "Could not approve.", "e");
                            }
                          }}
                        >
                          {t.common.approve}
                        </button>
                      )}
                      <button
                        className="delbtn"
                        onClick={async () => {
                          if (!confirm(adm.deleteConfirmReview)) return;
                          try {
                            await api(`/admin/reviews/${r.id}`, {
                              method: "DELETE",
                            });
                            showToast(adm.deleted, "i");
                            await reloadRegs?.();
                          } catch (e) {
                            showToast(e.message || "Could not delete.", "e");
                          }
                        }}
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))
            )}
          </>
        )}

        {tab === "gallery" && (
          <GalleryAdminTab
            photos={galleryPhotos}
            reload={reloadGallery}
            showToast={showToast}
          />
        )}
      </div>
    </div>
  );
}

function GalleryAdminTab({ photos, reload, showToast }) {
  const { t } = useLang();
  const adm = t.admin;
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("camps");
  const [tag, setTag] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const onFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const submit = async () => {
    if (!file) {
      showToast("Please select an image.", "e");
      return;
    }
    if (!caption.trim()) {
      showToast("Please add a caption.", "e");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const BASE = import.meta.env.VITE_API_URL || "";
      const token = localStorage.getItem("mcf_admin_token");
      const uploadRes = await fetch(`${BASE}/api/admin/upload-gallery`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      const uploadData = await uploadRes.json().catch(() => ({}));
      if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");

      await api("/admin/gallery", {
        method: "POST",
        body: JSON.stringify({
          imageUrl: uploadData.image,
          caption: caption.trim(),
          category,
          tag: tag.trim() || category,
        }),
      });

      showToast(t.toast.photoUploaded, "s");
      setCaption("");
      setCategory("camps");
      setTag("");
      setFile(null);
      setPreview(null);
      await reload?.();
    } catch (err) {
      showToast(err.message || "Upload failed.", "e");
    } finally {
      setUploading(false);
    }
  };

  const deletePhoto = async (id) => {
    if (!confirm(adm.deleteConfirmPhoto)) return;
    try {
      await api(`/admin/gallery/${id}`, { method: "DELETE" });
      showToast(adm.deleted, "i");
      await reload?.();
    } catch (err) {
      showToast(err.message || "Could not delete.", "e");
    }
  };

  return (
    <>
      <div className="add-form">
        <h3
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "1.25rem",
            marginBottom: "1.3rem",
          }}
        >
          {adm.uploadTitle}
        </h3>
        <div className="fgrid">
          <div className="fg full">
            <label className="lbl">{adm.galleryFields.photo} *</label>

            <div className="file-upload">
              <label className="file-upload-box">
                <input
                  className="file-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                />
                <span className="file-upload-btn">Choose file</span>
                <span
                  className={`file-upload-name${file ? "" : " file-upload-empty"}`}
                >
                  {file ? file.name : "No file chosen"}
                </span>
              </label>
            </div>

            {preview && (
              <div style={{ marginTop: ".8rem" }}>
                <img
                  src={preview}
                  alt="preview"
                  style={{
                    width: "100%",
                    maxWidth: 300,
                    borderRadius: 10,
                    objectFit: "cover",
                    border: "1px solid rgba(74,171,232,.18)",
                  }}
                />
              </div>
            )}
          </div>
          <div className="fg full">
            <label className="lbl">{adm.galleryFields.caption} *</label>
            <input
              className="inp"
              placeholder={adm.galleryFields.captionPh}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          <div className="fg">
            <label className="lbl">{adm.galleryFields.category}</label>
            <select
              className="inp"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {adm.categoryOpts.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="fg">
            <label className="lbl">{adm.galleryFields.tag}</label>
            <input
              className="inp"
              placeholder={adm.galleryFields.tagPh}
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />
          </div>
        </div>
        <button
          className="sbtn"
          onClick={submit}
          disabled={uploading}
          style={{ opacity: uploading ? 0.6 : 1 }}
        >
          {uploading ? t.common.uploading : t.common.upload}
        </button>
      </div>

      <h3 className="adm-section-title">
        {adm.galleryTitle} ({photos.length})
      </h3>
      {!photos.length ? (
        <div className="empty">
          <div className="empty-i">📸</div>
          <p>{adm.noPhotos}</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
            gap: "1rem",
          }}
        >
          {photos.map((p) => (
            <div
              key={p.id}
              style={{
                background: "rgba(26,94,168,.07)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                overflow: "hidden",
              }}
            >
              <img
                src={getGalleryImageSrc(
                  p.imageUrl,
                  import.meta.env.VITE_API_URL || "",
                )}
                alt={p.caption}
                style={{
                  width: "100%",
                  height: 150,
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div style={{ padding: ".8rem" }}>
                <div
                  style={{
                    fontSize: ".82rem",
                    fontWeight: 700,
                    color: "#EEF5FF",
                    marginBottom: ".25rem",
                    wordBreak: "break-word",
                  }}
                >
                  {p.caption}
                </div>
                <div
                  style={{
                    fontSize: ".72rem",
                    color: "var(--green2)",
                    marginBottom: ".6rem",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {p.tag || p.category}
                </div>
                <button
                  className="delbtn"
                  style={{ width: "100%", textAlign: "center" }}
                  onClick={() => deletePhoto(p.id)}
                >
                  🗑 {t.common.delete}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ══════════════════════════════════════════ GALLERY & 404 CSS ══════════════════════════════════════════ */
const GALLERY_CSS = `
/* ── GALLERY PAGE ── */
.gallery-hero{background:linear-gradient(135deg,#0B1624 0%,#102033 55%,#0E1D17 100%);padding:5rem 0 4rem;position:relative;overflow:hidden;}
.gallery-hero::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 20% 30%,rgba(74,171,232,.16),transparent 32%),radial-gradient(circle at 80% 20%,rgba(31,168,94,.14),transparent 28%);pointer-events:none;}
.gallery-hero-inner{width:100%;max-width:1200px;margin:0 auto;padding:0 2.5rem;position:relative;z-index:1;text-align:center;}
.gallery-kicker{display:inline-block;font-size:.75rem;letter-spacing:2px;text-transform:uppercase;color:var(--green2);font-weight:700;margin-bottom:1rem;}
.gallery-title{font-family:'Playfair Display',serif;font-size:clamp(2.4rem,4.5vw,4rem);line-height:1.08;color:#F4F8FC;margin-bottom:1rem;}
.gallery-sub{max-width:700px;margin:0 auto;color:rgba(220,233,245,.78);line-height:1.8;font-size:1rem;}
.gallery-hero-actions{margin-top:1.8rem;display:flex;justify-content:center;gap:.8rem;flex-wrap:wrap;}
.gallery-wrap{background:#F5F6F8;padding:3rem 0 4rem;}
.gallery-inner{width:100%;max-width:1200px;margin:0 auto;padding:0 2.5rem;}
.gallery-filters{display:flex;gap:.6rem;flex-wrap:wrap;justify-content:center;margin-bottom:2.5rem;}
.gf-btn{background:#fff;border:1.5px solid #E2E8F0;border-radius:999px;padding:.5rem 1.2rem;font-family:'DM Sans',sans-serif;font-size:.85rem;font-weight:700;color:#3A4A5B;cursor:pointer;transition:.2s;}
.gf-btn:hover{border-color:#2E7D5B;color:#2E7D5B;}
.gf-btn.on{background:#2E7D5B;border-color:#2E7D5B;color:#fff;}
.gallery-grid{columns:3;column-gap:1.1rem;}
@media(max-width:900px){.gallery-grid{columns:2;}}
@media(max-width:550px){.gallery-grid{columns:1;}}
.gallery-item{break-inside:avoid;margin-bottom:1.1rem;border-radius:18px;overflow:hidden;position:relative;cursor:pointer;background:linear-gradient(135deg,#13263B,#0F3A28);border:1px solid #E2E8F0;box-shadow:0 8px 24px rgba(15,23,42,.07);transition:.28s;}
.gallery-item:hover{transform:translateY(-5px);box-shadow:0 20px 44px rgba(15,23,42,.14);}
.gallery-item:hover .gallery-overlay{opacity:1;}
.gallery-item:hover .gallery-img{transform:scale(1.04);}
.gallery-img-wrap{
  overflow:hidden;
  width:100%;
  position:relative;
  background:linear-gradient(135deg,#13263B,#0F3A28);
}

.gallery-img{
  width:100%;
  display:block;
  object-fit:cover;
  transition:transform .45s ease, opacity .25s ease;
  will-change:transform, opacity;
  backface-visibility:hidden;
  -webkit-backface-visibility:hidden;
}

.gallery-img.is-hidden{
  opacity:0;
  position:absolute;
  inset:0;
}

.gallery-img.is-loaded{
  opacity:1;
  position:relative;
}
.gallery-placeholder{
  width:100%;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  padding:2.5rem 1rem;
  text-align:center;
  min-height:220px;
  background:linear-gradient(135deg,#13263B,#0F3A28);
}
.lightbox-img{
  width:100%;
  max-height:75vh;
  object-fit:contain;
  border-radius:14px;
  box-shadow:0 30px 80px rgba(0,0,0,.8);
  display:block;
}  

.gallery-placeholder-icon{font-size:3rem;margin-bottom:.6rem;}
.gallery-placeholder-label{font-size:.8rem;font-weight:700;color:rgba(220,233,245,.5);letter-spacing:1px;text-transform:uppercase;}
.gallery-overlay{position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(9,19,30,.88) 100%);opacity:0;transition:.3s;display:flex;flex-direction:column;justify-content:flex-end;padding:1.2rem;}
.gallery-overlay-tag{font-size:.7rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--green2);margin-bottom:.3rem;}
.gallery-overlay-caption{font-size:.92rem;font-weight:700;color:#EEF5FF;line-height:1.4;}
.lightbox-inner{position:relative;max-width:900px;width:100%;display:flex;flex-direction:column;align-items:center;}
.lightbox-placeholder{width:100%;min-height:300px;border-radius:14px;background:linear-gradient(135deg,#13263B,#0F3A28);display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:5rem;}
.lightbox-caption{margin-top:1.1rem;text-align:center;color:rgba(220,233,245,.85);font-size:.95rem;line-height:1.6;}
.lightbox-tag{display:inline-block;font-size:.72rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--green2);background:rgba(31,168,94,.12);border:1px solid rgba(45,204,116,.25);padding:.25rem .7rem;border-radius:999px;margin-bottom:.5rem;}
.lightbox-close{position:fixed;top:1.5rem;right:1.5rem;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.2);color:#EEF5FF;font-size:1.2rem;width:40px;height:40px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.18s;z-index:2001;box-shadow:0 4px 16px rgba(0,0,0,.4);}
.lightbox-close:hover{background:rgba(255,255,255,.25);}
.lightbox-nav{display:flex;gap:1rem;margin-top:1.2rem;}
.lightbox-nav-btn{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);color:#EEF5FF;font-size:1.2rem;width:48px;height:48px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.18s;}
.lightbox-nav-btn:hover{background:rgba(255,255,255,.18);}
.lightbox-counter{color:rgba(220,233,245,.5);font-size:.85rem;display:flex;align-items:center;padding:0 .5rem;}
.lightbox-ovl{position:fixed;inset:0;z-index:2000;background:rgba(0,0,0,.95);backdrop-filter:blur(18px);display:flex;align-items:center;justify-content:center;padding:1.5rem;animation:fu .2s ease;overflow:visible;}
.gallery-cta{margin-top:3rem;background:linear-gradient(135deg,#12253B,#143524);border-radius:26px;padding:2rem;text-align:center;color:#EEF5FF;}
.gallery-cta h3{font-family:'Playfair Display',serif;font-size:2rem;margin-bottom:.65rem;}
.gallery-cta p{color:rgba(220,233,245,.78);line-height:1.8;max-width:700px;margin:0 auto;}
.gallery-cta-actions{margin-top:1.3rem;display:flex;justify-content:center;gap:.8rem;flex-wrap:wrap;}
@media(max-width:850px){.gallery-hero-inner,.gallery-inner{padding-left:1.2rem;padding-right:1.2rem;}}


/* ── CUSTOM FILE INPUT ── */
.file-upload{
  width:100%;
}

.file-upload-input{
  display:none;
}

.file-upload-box{
  width:100%;
  display:flex;
  align-items:center;
  gap:.75rem;
  padding:.78rem .95rem;
  background:rgba(26,94,168,.09);
  border:1.5px solid rgba(74,171,232,.18);
  border-radius:8px;
  color:var(--cream);
  cursor:pointer;
  transition:.2s;
  min-height:48px;
}

.file-upload-box:hover{
  border-color:rgba(74,171,232,.35);
  background:rgba(26,94,168,.14);
}

.file-upload-box:focus-within{
  border-color:var(--green2);
  background:rgba(21,122,69,.09);
  box-shadow:0 0 0 3px rgba(45,204,116,.12);
}

.file-upload-btn{
  flex-shrink:0;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:.55rem .9rem;
  border-radius:7px;
  background:var(--green2);
  color:#fff;
  font-size:.82rem;
  font-weight:700;
  line-height:1;
  white-space:nowrap;
}

.file-upload-name{
  min-width:0;
  flex:1;
  color:rgba(220,233,245,.78);
  font-size:.88rem;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}


/* ── 404 PAGE ── */
.notfound-pg{width:100%;min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#09131E 0%,#0D1E2C 55%,#091A10 100%);position:relative;overflow:hidden;padding:8rem 2rem 4rem;}
.notfound-pg::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 68% 50%,rgba(21,122,69,.08) 0%,transparent 55%),radial-gradient(ellipse at 20% 75%,rgba(26,94,168,.1) 0%,transparent 50%);}
.notfound-inner{position:relative;z-index:2;text-align:center;max-width:640px;margin:0 auto;}
.notfound-board{display:grid;grid-template-columns:repeat(8,1fr);width:min(300px,75vw);margin:0 auto 2.5rem;border-radius:12px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.7);opacity:.55;}
.notfound-sq{aspect-ratio:1;}
.notfound-sq-l{background:#C8E6C0;}
.notfound-sq-d{background:#2D6A4F;}
.notfound-code{font-family:'Playfair Display',serif;font-size:clamp(5rem,18vw,9rem);font-weight:900;line-height:1;color:transparent;background:linear-gradient(135deg,var(--green2),var(--blue3));-webkit-background-clip:text;background-clip:text;margin-bottom:.5rem;animation:fu .6s ease both;}
.notfound-title{font-family:'Playfair Display',serif;font-size:clamp(1.5rem,4vw,2.2rem);color:#EEF5FF;margin-bottom:1rem;animation:fu .6s ease .1s both;}
.notfound-sub{color:rgba(180,210,240,.65);line-height:1.8;font-size:.97rem;margin-bottom:2rem;animation:fu .6s ease .2s both;}
.notfound-piece{font-size:3.5rem;margin-bottom:1rem;display:block;animation:float 3s ease-in-out infinite;}
.notfound-actions{display:flex;gap:.9rem;flex-wrap:wrap;justify-content:center;animation:fu .6s ease .3s both;}
.notfound-links{margin-top:2.5rem;display:flex;gap:.5rem;flex-wrap:wrap;justify-content:center;animation:fu .6s ease .4s both;}
.notfound-link{background:rgba(26,94,168,.09);border:1px solid var(--border);color:rgba(220,233,245,.7);font-family:'DM Sans',sans-serif;font-size:.82rem;font-weight:600;padding:.45rem 1rem;border-radius:999px;cursor:pointer;transition:.18s;}
.notfound-link:hover{color:var(--green2);border-color:rgba(45,204,116,.3);background:rgba(21,122,69,.1);}
@keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-12px);}}
`;

const injectGalleryStyles = () => {
  if (document.getElementById("mcf-gallery-css")) return;
  const el = document.createElement("style");
  el.id = "mcf-gallery-css";
  el.textContent = GALLERY_CSS;
  document.head.appendChild(el);
};

function SmartGalleryImage({
  src,
  alt,
  className = "",
  wrapperClassName = "gallery-img-wrap",
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  return (
    <div className={wrapperClassName}>
      {!loaded && !failed && (
        <div className="gallery-placeholder">
          <div className="gallery-placeholder-icon">♟</div>
          <div className="gallery-placeholder-label">Loading photo</div>
        </div>
      )}

      {!failed && (
        <img
          src={src}
          alt={alt}
          className={`${className} ${loaded ? "is-loaded" : "is-hidden"}`}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}

      {failed && (
        <div className="gallery-placeholder">
          <div className="gallery-placeholder-icon">📷</div>
          <div className="gallery-placeholder-label">Image unavailable</div>
        </div>
      )}
    </div>
  );
}

function GalleryPage({ onNav, onContact }) {
  const { t } = useLang();
  const GALLERY_CATS = [
    { id: "all", label: t.gallery.filterAll },
    { id: "camps", label: t.gallery.filterCamps },
    { id: "lessons", label: t.gallery.filterLessons },
    { id: "community", label: t.gallery.filterCommunity },
  ];

  const BASE = import.meta.env.VITE_API_URL || "";

  const [filter, setFilter] = useState("all");
  const [lightbox, setLightbox] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    injectGalleryStyles();
  }, []);

  const loadGallery = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api("/gallery");
      setItems(data.photos || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  const filtered =
    filter === "all" ? items : items.filter((i) => i.category === filter);

  const closeLightbox = () => setLightbox(null);
  const prevItem = () =>
    setLightbox((i) => (i - 1 + filtered.length) % filtered.length);
  const nextItem = () => setLightbox((i) => (i + 1) % filtered.length);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevItem();
      if (e.key === "ArrowRight") nextItem();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, filtered.length]);

  const current = lightbox !== null ? filtered[lightbox] : null;

  return (
    <div className="pg" style={{ background: "#09131E" }}>
      <section className="gallery-hero">
        <div className="gallery-hero-inner">
          <div className="gallery-kicker">{t.gallery.kicker}</div>
          <h1 className="gallery-title">{t.gallery.heroTitle}</h1>
          <p className="gallery-sub">{t.gallery.heroSub}</p>
          <div className="gallery-hero-actions">
            <button className="btn btn-g" onClick={() => onNav("camp")}>
              {t.common.joinSummerCamp}
            </button>
            <button
              className="btn btn-g"
              style={{ background: "rgba(74,171,232,.18)", color: "#EEF5FF" }}
              onClick={onContact}
            >
              {t.common.contactUs}
            </button>
          </div>
        </div>
      </section>

      <section className="gallery-wrap">
        <div className="gallery-inner">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
              gap: "1rem",
              marginBottom: "2.5rem",
            }}
          >
            {[
              [t.gallery.stat1n, t.gallery.stat1l],
              [t.gallery.stat2n, t.gallery.stat2l],
              [t.gallery.stat3n, t.gallery.stat3l],
            ].map(([n, l]) => (
              <div
                key={l}
                style={{
                  background: "#fff",
                  border: "1px solid #E2E8F0",
                  borderRadius: 16,
                  padding: "1.1rem",
                  textAlign: "center",
                  boxShadow: "0 8px 20px rgba(15,23,42,.05)",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: "1.8rem",
                    color: "#2E7D5B",
                    fontWeight: 900,
                  }}
                >
                  {n}
                </div>
                <div
                  style={{
                    fontSize: ".8rem",
                    color: "#5C6B7C",
                    marginTop: ".2rem",
                  }}
                >
                  {l}
                </div>
              </div>
            ))}
          </div>

          <div className="gallery-filters">
            {GALLERY_CATS.map((c) => (
              <button
                key={c.id}
                className={`gf-btn${filter === c.id ? " on" : ""}`}
                onClick={() => {
                  setFilter(c.id);
                  setLightbox(null);
                }}
              >
                {c.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "4rem",
                color: "var(--muted)",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: ".8rem" }}>⏳</div>
              <p>{t.gallery.loading}</p>
            </div>
          ) : !filtered.length ? (
            <div
              style={{
                textAlign: "center",
                padding: "4rem 2rem",
                background: "#fff",
                borderRadius: 22,
                border: "1px solid #E2E8F0",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: ".8rem" }}>📸</div>
              <h3 style={{ color: "#1F2B3A", marginBottom: ".5rem" }}>
                {t.gallery.noPhotos}
              </h3>
              <p style={{ color: "#5C6B7C" }}>{t.gallery.noPhotosSub}</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {filtered.map((item, idx) => (
                <div
                  key={item.id}
                  className="gallery-item"
                  onClick={() => setLightbox(idx)}
                >
                  <SmartGalleryImage
                    src={getGalleryImageSrc(item.imageUrl, BASE)}
                    alt={item.caption}
                    className="gallery-img"
                  />
                  <div className="gallery-overlay">
                    <div className="gallery-overlay-tag">
                      {item.tag || item.category}
                    </div>
                    <div className="gallery-overlay-caption">
                      {item.caption}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="gallery-cta">
            <h3>{t.gallery.ctaTitle}</h3>
            <p>{t.gallery.ctaText}</p>
            <div className="gallery-cta-actions">
              <button className="btn btn-g" onClick={() => onNav("programs")}>
                {t.common.viewPrograms}
              </button>
              <button
                className="btn btn-g"
                style={{ background: "rgba(74,171,232,.18)", color: "#EEF5FF" }}
                onClick={() => onNav("camp")}
              >
                {t.common.summerCamp}
              </button>
            </div>
          </div>
        </div>
      </section>

      {lightbox !== null && current && (
        <div
          className="lightbox-ovl"
          onClick={(e) => e.target === e.currentTarget && closeLightbox()}
        >
          <div className="lightbox-inner">
            <button className="lightbox-close" onClick={closeLightbox}>
              ×
            </button>
            <SmartGalleryImage
              src={getGalleryImageSrc(current.imageUrl, BASE)}
              alt={current.caption}
              className="lightbox-img"
              wrapperClassName="lightbox-img-wrap"
            />
            <div className="lightbox-caption">
              <div className="lightbox-tag">
                {current.tag || current.category}
              </div>
              <div>{current.caption}</div>
            </div>
            <div className="lightbox-nav">
              <button className="lightbox-nav-btn" onClick={prevItem}>
                ‹
              </button>
              <span className="lightbox-counter">
                {lightbox + 1} / {filtered.length}
              </span>
              <button className="lightbox-nav-btn" onClick={nextItem}>
                ›
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer onNav={onNav} onContact={onContact} />
    </div>
  );
}

function NotFoundPage({ onNav }) {
  const { t } = useLang();
  useEffect(() => {
    injectGalleryStyles();
  }, []);

  const quickLinks = [
    ["home", `🏠 ${t.nav.home}`],
    ["programs", `♟ ${t.nav.programs}`],
    ["camp", `☀️ ${t.nav.camp}`],
    ["team", `👥 ${t.nav.team}`],
    ["gallery", `📸 ${t.nav.gallery}`],
    ["reviews", `⭐ ${t.nav.reviews}`],
    ["about", `ℹ️ ${t.nav.about}`],
  ];

  return (
    <div className="notfound-pg">
      <div className="notfound-inner">
        <div className="notfound-board">
          {Array.from({ length: 64 }, (_, i) => {
            const r = Math.floor(i / 8),
              c = i % 8;
            return (
              <div
                key={i}
                className={`notfound-sq ${(r + c) % 2 === 0 ? "notfound-sq-l" : "notfound-sq-d"}`}
              />
            );
          })}
        </div>

        <span className="notfound-piece">♟</span>
        <div className="notfound-code">{t.notFound.code}</div>
        <h1 className="notfound-title">{t.notFound.title}</h1>
        <p className="notfound-sub">{t.notFound.sub}</p>

        <div className="notfound-actions">
          <button className="btn btn-g" onClick={() => onNav("home")}>
            {t.notFound.btn1}
          </button>
          <button
            className="btn btn-g"
            style={{ background: "rgba(74,171,232,.18)", color: "#EEF5FF" }}
            onClick={() => onNav("programs")}
          >
            {t.notFound.btn2}
          </button>
        </div>

        <div className="notfound-links">
          {quickLinks.map(([p, l]) => (
            <button key={p} className="notfound-link" onClick={() => onNav(p)}>
              {l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════ CONTACT PAGE CSS ══════════════════════════════════════════ */
const CONTACT_CSS = `
.contact-hero{background:linear-gradient(135deg,#0B1624 0%,#102033 55%,#0E1D17 100%);padding:5rem 0 4rem;position:relative;overflow:hidden;}
.contact-hero::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 20% 30%,rgba(74,171,232,.16),transparent 32%),radial-gradient(circle at 80% 20%,rgba(31,168,94,.14),transparent 28%);pointer-events:none;}
.contact-hero-inner{width:100%;max-width:1100px;margin:0 auto;padding:0 2.5rem;position:relative;z-index:1;text-align:center;}
.contact-kicker{display:inline-block;font-size:.75rem;letter-spacing:2px;text-transform:uppercase;color:var(--green2);font-weight:700;margin-bottom:1rem;}
.contact-hero-title{font-family:'Playfair Display',serif;font-size:clamp(2.4rem,4.5vw,4rem);line-height:1.08;color:#F4F8FC;margin-bottom:1rem;}
.contact-hero-sub{max-width:640px;margin:0 auto;color:rgba(220,233,245,.78);line-height:1.8;font-size:1rem;}
.contact-body{background:#F5F6F8;padding:4rem 0 5rem;}
.contact-inner{width:100%;max-width:1100px;margin:0 auto;padding:0 2.5rem;}
.contact-grid{display:grid;grid-template-columns:1fr 1.5fr;gap:2rem;align-items:start;}
.contact-info{display:flex;flex-direction:column;gap:1.2rem;}
.contact-info-card{background:#fff;border:1px solid #E2E8F0;border-radius:20px;padding:1.5rem;box-shadow:0 10px 28px rgba(15,23,42,.05);display:flex;gap:1rem;align-items:flex-start;}
.contact-info-icon{width:52px;height:52px;border-radius:16px;flex-shrink:0;background:linear-gradient(135deg,#16314D,#215E46);display:flex;align-items:center;justify-content:center;font-size:1.35rem;}
.contact-info-label{font-size:.72rem;letter-spacing:1.5px;text-transform:uppercase;color:#5C6B7C;font-weight:700;margin-bottom:.3rem;}
.contact-info-value{font-size:1rem;font-weight:700;color:#1F2B3A;margin-bottom:.2rem;word-break:break-word;}
.contact-info-note{font-size:.83rem;color:#5C6B7C;line-height:1.5;}
.contact-social-card{background:#fff;border:1px solid #E2E8F0;border-radius:20px;padding:1.5rem;box-shadow:0 10px 28px rgba(15,23,42,.05);}
.contact-social-title{font-size:.72rem;letter-spacing:1.5px;text-transform:uppercase;color:#5C6B7C;font-weight:700;margin-bottom:1rem;}
.contact-social-row{display:flex;gap:.75rem;flex-wrap:wrap;}
.contact-social-btn{display:flex;align-items:center;gap:.55rem;padding:.65rem 1.1rem;border-radius:12px;border:1.5px solid #E2E8F0;background:#F8FAFC;color:#1F2B3A;font-family:'DM Sans',sans-serif;font-size:.85rem;font-weight:700;cursor:pointer;text-decoration:none;transition:.2s;}
.contact-social-btn:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(15,23,42,.1);}
.contact-social-btn.ig:hover{background:#E1306C;border-color:#E1306C;color:#fff;}
.contact-social-btn.fb:hover{background:#1877F2;border-color:#1877F2;color:#fff;}
.contact-social-btn.li:hover{background:#0A66C2;border-color:#0A66C2;color:#fff;}
.contact-form-card{background:#fff;border:1px solid #E2E8F0;border-radius:24px;padding:2rem;box-shadow:0 14px 40px rgba(15,23,42,.06);}
.contact-form-title{font-family:'Playfair Display',serif;font-size:1.7rem;color:#1F2B3A;margin-bottom:.4rem;}
.contact-form-sub{color:#5C6B7C;font-size:.92rem;margin-bottom:1.6rem;line-height:1.6;}
.inp-light{width:100%;padding:.78rem 1rem;background:#F8FAFC;border:1.5px solid #E2E8F0;border-radius:10px;color:#1F2B3A;font-family:'DM Sans',sans-serif;font-size:.92rem;transition:.2s;outline:none;}
.inp-light:focus{border-color:#2E7D5B;background:#fff;box-shadow:0 0 0 3px rgba(46,125,91,.1);}
.inp-light::placeholder{color:#A0AEC0;}
select.inp-light option{background:#fff;color:#1F2B3A;}
textarea.inp-light{min-height:110px;resize:vertical;}
.fg-light{margin-bottom:1rem;}
.lbl-light{display:block;font-size:.8rem;font-weight:700;color:#3A4A5B;margin-bottom:.35rem;letter-spacing:.3px;}
.fgrid-light{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}
@media(max-width:600px){.fgrid-light{grid-template-columns:1fr;}}
.contact-submit-btn{width:100%;padding:.82rem 1.75rem;margin-top:.3rem;background:var(--green2);color:#fff;font-weight:700;font-family:'DM Sans',sans-serif;font-size:.93rem;border:none;border-radius:9px;cursor:pointer;transition:transform .22s ease,box-shadow .28s ease;position:relative;overflow:hidden;}
.contact-submit-btn:hover{background:var(--green2);transform:translateY(-3px);box-shadow:0 12px 30px rgba(21,122,69,.38),0 0 14px rgba(31,168,94,.28);}
.contact-submit-btn:disabled{background:#CBD5E1;color:#64748B;cursor:not-allowed;transform:none;box-shadow:none;}
.contact-ok{display:flex;flex-direction:column;align-items:center;background:#ECFDF5;border:1px solid #6EE7B7;border-radius:14px;padding:2rem;text-align:center;animation:fu .4s ease;}
.contact-ok-icon{font-size:2.8rem;margin-bottom:.7rem;}
.contact-ok-title{font-family:'Playfair Display',serif;font-size:1.5rem;color:#065F46;margin-bottom:.5rem;}
.contact-ok-sub{color:#047857;font-size:.92rem;line-height:1.6;}
.contact-cta{margin-top:2.5rem;background:linear-gradient(135deg,#12253B,#143524);border-radius:26px;padding:2.2rem;text-align:center;color:#EEF5FF;}
.contact-cta h3{font-family:'Playfair Display',serif;font-size:1.9rem;margin-bottom:.6rem;}
.contact-cta p{color:rgba(220,233,245,.78);line-height:1.8;max-width:650px;margin:0 auto;font-size:.95rem;}
.contact-cta-actions{margin-top:1.3rem;display:flex;justify-content:center;gap:.8rem;flex-wrap:wrap;}
@media(max-width:900px){.contact-grid{grid-template-columns:1fr;}}
@media(max-width:850px){.contact-hero-inner,.contact-inner{padding-left:1.2rem;padding-right:1.2rem;}}
`;

const injectContactStyles = () => {
  if (document.getElementById("mcf-contact-css")) return;
  const el = document.createElement("style");
  el.id = "mcf-contact-css";
  el.textContent = CONTACT_CSS;
  document.head.appendChild(el);
};

function ContactPage({ onNav, showToast }) {
  const { t } = useLang();
  useEffect(() => {
    injectContactStyles();
  }, []);

  const [f, setF] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    subject: "",
    program: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async () => {
    setErr("");
    if (!f.fname || !f.lname || !f.email || !f.message) {
      setErr(t.contact.errRequired);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(f.email)) {
      setErr(t.contact.errEmail);
      return;
    }
    setSending(true);
    try {
      await api("/contact", {
        method: "POST",
        body: JSON.stringify({
          name: `${f.fname} ${f.lname}`,
          email: f.email,
          phone: f.phone,
          subject: f.subject,
          program: f.program,
          message: f.message,
        }),
      });
      setDone(true);
      showToast(t.toast.messageSent, "s");
    } catch {
      setDone(true);
      showToast(t.toast.messageSent, "s");
    } finally {
      setSending(false);
    }
  };

  const infoCards = t.contact.info.map((c, i) => ({
    ...c,
    icon: ["📍", "✉️", "⏰", "📅"][i],
    ...(i === 1
      ? {
          action: () => {
            navigator.clipboard
              ?.writeText("mychessfamily@gmail.com")
              .catch(() => {});
            showToast(t.toast.emailCopied, "s");
          },
        }
      : {}),
  }));

  return (
    <div className="pg" style={{ background: "#09131E" }}>
      <section className="contact-hero">
        <div className="contact-hero-inner">
          <div className="contact-kicker">{t.contact.kicker}</div>
          <h1 className="contact-hero-title">{t.contact.heroTitle}</h1>
          <p className="contact-hero-sub">{t.contact.heroSub}</p>
        </div>
      </section>

      <section className="contact-body">
        <div className="contact-inner">
          <div className="contact-grid">
            <div className="contact-info">
              {infoCards.map((c) => (
                <div
                  key={c.label}
                  className="contact-info-card"
                  style={c.action ? { cursor: "pointer" } : {}}
                  onClick={c.action}
                  title={c.action ? c.actionLabel : undefined}
                >
                  <div className="contact-info-icon">{c.icon}</div>
                  <div>
                    <div className="contact-info-label">{c.label}</div>
                    <div className="contact-info-value">{c.value}</div>
                    <div className="contact-info-note">
                      {c.actionLabel ? (
                        <span style={{ color: "#2E7D5B", fontWeight: 600 }}>
                          {c.actionLabel}
                        </span>
                      ) : (
                        c.note
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="contact-social-card">
                <div className="contact-social-title">
                  {t.contact.socialTitle}
                </div>
                <div className="contact-social-row">
                  <a
                    href="https://www.instagram.com/mychessfamily/"
                    target="_blank"
                    rel="noreferrer"
                    className="contact-social-btn ig"
                  >
                    <FaInstagram /> Instagram
                  </a>
                  <a
                    href="https://www.facebook.com/Mychessfamily"
                    target="_blank"
                    rel="noreferrer"
                    className="contact-social-btn fb"
                  >
                    <FaFacebookF /> Facebook
                  </a>
                  <a
                    href="https://www.linkedin.com/in/dmitri-shevelev-145ba7/"
                    target="_blank"
                    rel="noreferrer"
                    className="contact-social-btn li"
                  >
                    <FaLinkedinIn /> LinkedIn
                  </a>
                </div>
              </div>

              <div
                style={{
                  background: "#fff",
                  border: "1px solid #E2E8F0",
                  borderRadius: 20,
                  padding: "1.5rem",
                  boxShadow: "0 10px 28px rgba(15,23,42,.05)",
                }}
              >
                <div className="contact-social-title">
                  {t.contact.quickLinksTitle}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: ".55rem",
                  }}
                >
                  {t.contact.quickLinks.map(([p, l]) => (
                    <button
                      key={p}
                      onClick={() => onNav(p)}
                      style={{
                        background: "#F8FAFC",
                        border: "1.5px solid #E2E8F0",
                        borderRadius: 10,
                        padding: ".65rem 1rem",
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: ".88rem",
                        fontWeight: 700,
                        color: "#1F2B3A",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: ".18s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#2E7D5B";
                        e.currentTarget.style.color = "#2E7D5B";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#E2E8F0";
                        e.currentTarget.style.color = "#1F2B3A";
                      }}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="contact-form-card">
              {!done ? (
                <>
                  <h2 className="contact-form-title">{t.contact.formTitle}</h2>
                  <p className="contact-form-sub">{t.contact.formSub}</p>

                  <div className="fgrid-light">
                    <div className="fg-light">
                      <label className="lbl-light">
                        {t.contact.firstName} *
                      </label>
                      <input
                        className="inp-light"
                        placeholder={t.contact.firstNamePh}
                        value={f.fname}
                        onChange={set("fname")}
                      />
                    </div>
                    <div className="fg-light">
                      <label className="lbl-light">
                        {t.contact.lastName} *
                      </label>
                      <input
                        className="inp-light"
                        placeholder={t.contact.lastNamePh}
                        value={f.lname}
                        onChange={set("lname")}
                      />
                    </div>
                  </div>

                  <div className="fgrid-light">
                    <div className="fg-light">
                      <label className="lbl-light">{t.contact.email} *</label>
                      <input
                        className="inp-light"
                        type="email"
                        placeholder={t.contact.emailPh}
                        value={f.email}
                        onChange={set("email")}
                      />
                    </div>
                    <div className="fg-light">
                      <label className="lbl-light">{t.contact.phone}</label>
                      <input
                        className="inp-light"
                        type="tel"
                        placeholder={t.contact.phonePh}
                        value={f.phone}
                        onChange={set("phone")}
                      />
                    </div>
                  </div>

                  <div className="fg-light">
                    <label className="lbl-light">
                      {t.contact.interestedIn}
                    </label>
                    <select
                      className="inp-light"
                      value={f.program}
                      onChange={set("program")}
                    >
                      <option value="">{t.contact.interestedPh}</option>
                      {t.contact.interestedOpts.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>

                  <div className="fg-light">
                    <label className="lbl-light">{t.contact.subject}</label>
                    <input
                      className="inp-light"
                      placeholder={t.contact.subjectPh}
                      value={f.subject}
                      onChange={set("subject")}
                    />
                  </div>

                  <div className="fg-light">
                    <label className="lbl-light">{t.contact.message} *</label>
                    <textarea
                      className="inp-light"
                      placeholder={t.contact.messagePh}
                      value={f.message}
                      onChange={set("message")}
                      style={{ minHeight: 130 }}
                    />
                  </div>

                  {err && (
                    <div
                      style={{
                        background: "#FEE2E2",
                        border: "1px solid #FECACA",
                        borderRadius: 10,
                        padding: ".7rem 1rem",
                        color: "#B91C1C",
                        fontSize: ".87rem",
                        marginBottom: ".8rem",
                      }}
                    >
                      {err}
                    </div>
                  )}

                  <button
                    className="contact-submit-btn"
                    onClick={submit}
                    disabled={sending}
                  >
                    {sending ? t.common.sending : t.common.sendMessage}
                  </button>

                  <p
                    style={{
                      marginTop: ".9rem",
                      fontSize: ".78rem",
                      color: "#94A3B8",
                      textAlign: "center",
                      lineHeight: 1.6,
                    }}
                  >
                    {t.contact.privacy}
                  </p>
                </>
              ) : (
                <div className="contact-ok">
                  <div className="contact-ok-icon">🎉</div>
                  <div className="contact-ok-title">
                    {t.contact.successTitle}
                  </div>
                  <p className="contact-ok-sub">
                    {t.contact.successSub1} <strong>{f.email}</strong>.
                    <br />
                    <br />
                    {t.contact.successSub2}
                  </p>
                  <div
                    style={{
                      marginTop: "1.3rem",
                      display: "flex",
                      gap: ".7rem",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      className="contact-submit-btn"
                      style={{ width: "auto", padding: ".7rem 1.4rem" }}
                      onClick={() => onNav("programs")}
                    >
                      {t.common.viewPrograms}
                    </button>
                    <button
                      style={{
                        background: "#D1FAE5",
                        border: "1px solid #6EE7B7",
                        color: "#065F46",
                        borderRadius: 12,
                        padding: ".7rem 1.4rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "'DM Sans',sans-serif",
                      }}
                      onClick={() => {
                        setDone(false);
                        setF({
                          fname: "",
                          lname: "",
                          email: "",
                          phone: "",
                          subject: "",
                          program: "",
                          message: "",
                        });
                      }}
                    >
                      {t.contact.sendAnother}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="contact-cta">
            <h3>{t.contact.ctaTitle}</h3>
            <p>{t.contact.ctaText}</p>
            <div className="contact-cta-actions">
              <button className="btn btn-g" onClick={() => onNav("programs")}>
                {t.common.explorePrograms}
              </button>
              <button
                className="btn btn-g"
                style={{ background: "rgba(74,171,232,.18)", color: "#EEF5FF" }}
                onClick={() => onNav("camp")}
              >
                {t.common.summerCamp}
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer onNav={onNav} onContact={() => onNav("contact")} />
    </div>
  );
}

/* ══════════════════════════════════════════ ROOT ══════════════════════════════════════════ */
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, setLang, t } = useLang();

  const pathToPage = {
    "/": "home",
    "/programs": "programs",
    "/camp": "camp",
    "/team": "team",
    "/reviews": "reviews",
    "/about": "about",
    "/gallery": "gallery",
    "/contact": "contact",
    "/login": "login",
    "/admin": "admin",
  };
  const page = pathToPage[location.pathname] || "home";

  const [reviews, setReviews] = useState([]);
  const [adminReviews, setAdminReviews] = useState([]);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [camps, setCamps] = useState(DEF_CAMPS);
  const [campRegs, setCampRegs] = useState([]);
  const [langOpen, setLangOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobile = useCallback(() => setMobileOpen((v) => !v), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Update HTML lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  useEffect(() => {
    injectStyles();
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setHideHeader(currentScrollY > lastScrollY && currentScrollY > 120);
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showToast = useCallback((msg, type = "i") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const openContact = useCallback(() => setContactOpen(true), []);
  const closeContact = useCallback(() => setContactOpen(false), []);

  const loadPublicData = useCallback(async () => {
    try {
      const data = await api("/bootstrap");
      setCamps(data.camps || []);
    } catch {
      showToast(t.toast.fallbackData, "e");
    }
  }, [showToast, t]);

  const loadAdminData = useCallback(async () => {
    if (!localStorage.getItem(AUTH_KEY)) return;
    try {
      const data = await api("/admin/registrations");
      setCampRegs(data.campRegs || []);
      const rev = await api("/admin/reviews");
      setAdminReviews(rev.reviews || []);
      const gal = await api("/gallery");
      setGalleryPhotos(gal.photos || []);
    } catch {
      localStorage.removeItem(AUTH_KEY);
      setIsAdmin(false);
      setCampRegs([]);
      setAdminReviews([]);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      loadPublicData();
    }, 0);
  }, [loadPublicData]);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_KEY);
    if (!token) return;
    api("/admin/registrations")
      .then((data) => {
        setCampRegs(data.campRegs || []);
        setIsAdmin(true);
        return api("/admin/reviews");
      })
      .then((r) => {
        if (r) setAdminReviews(r.reviews || []);
      })
      .catch(() => {
        localStorage.removeItem(AUTH_KEY);
        setIsAdmin(false);
      });
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    setTimeout(() => {
      loadAdminData();
    }, 0);
    const interval = setInterval(() => {
      loadAdminData();
    }, 10000);
    return () => clearInterval(interval);
  }, [isAdmin, loadAdminData]);

  const go = useCallback(
    (p) => {
      setMobileOpen(false);
      if (p === "admin" && !isAdmin) {
        navigate("/login");
        window.scrollTo(0, 0);
        return;
      }
      navigate(p === "home" ? "/" : `/${p}`);
      window.scrollTo(0, 0);
    },
    [isAdmin, navigate],
  );

  const loadGallery = useCallback(async () => {
    try {
      const data = await api("/gallery");
      setGalleryPhotos(data.photos || []);
    } catch {
      console.error("Could not load gallery");
    }
  }, []);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  const loadReviews = useCallback(async () => {
    try {
      const data = await api("/reviews");
      setReviews(data.reviews || []);
    } catch {
      console.error("Could not load reviews");
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleLogin = async () => {
    setIsAdmin(true);
    navigate("/admin");
    await loadAdminData();
  };

  const handleLogout = async () => {
    try {
      await api("/admin/logout", { method: "POST" });
    } catch {}
    localStorage.removeItem(AUTH_KEY);
    setIsAdmin(false);
    setCampRegs([]);
    navigate("/");
    showToast(t.toast.loggedOut, "i");
  };

  const navLinks = [
    ["home", t.nav.home],
    ["programs", t.nav.programs],
    ["camp", t.nav.camp],
    ["team", t.nav.team],
    ["gallery", t.nav.gallery],
    ["reviews", t.nav.reviews],
    ["about", t.nav.about],
    ["contact", t.nav.contact],
  ];

  const LANG_OPTIONS = [
    { code: "en", label: "English", short: "EN", flag: "/flags/us.svg" },
    { code: "ru", label: "Русский", short: "RU", flag: "/flags/ru.svg" },
    { code: "he", label: "עברית", short: "HE", flag: "/flags/il.svg" },
  ];

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#09131E" }}>
      <nav className={`nav ${hideHeader ? "nav-hide" : ""}`}>
        <div className="nav-logo" onClick={() => go("home")}>
          <img
            src="/pieces/logo.png"
            alt="company logo"
            className="nav-logo-img"
            style={{ width: "145px", height: "115px", marginBottom: "10px" }}
          />
        </div>
        <div className="nav-links">
          {navLinks.map(([p, l]) => (
            <button
              key={p}
              className={`nb${page === p ? " on" : ""}`}
              onClick={() => go(p)}
              type="button"
            >
              {l}
            </button>
          ))}
        </div>
        <div className="nav-right">
          {isAdmin && <span className="adm-dot">● Admin</span>}
          {/* Custom lang dropdown — desktop only, hidden on mobile via CSS */}
          <div
            className="lang-drop"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget))
                setLangOpen(false);
            }}
            tabIndex={-1}
          >
            <div
              className={`lang-drop-trigger${langOpen ? " open" : ""}`}
              onClick={() => setLangOpen((v) => !v)}
            >
              <img
                src={LANG_OPTIONS.find((l) => l.code === lang)?.flag}
                alt=""
                className="lang-flag"
              />
              {LANG_OPTIONS.find((l) => l.code === lang)?.short}
              <svg
                className="lang-chevron"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            {langOpen && (
              <div className="lang-drop-menu">
                {LANG_OPTIONS.map((option) => (
                  <div
                    key={option.code}
                    className={`lang-drop-item${lang === option.code ? " selected" : ""}`}
                    onMouseDown={() => {
                      setLang(option.code);
                      setLangOpen(false);
                    }}
                  >
                    <img src={option.flag} alt="" className="lang-flag" />
                    {option.label}
                    {lang === option.code && (
                      <span className="lang-tick">✓</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            className={`nb cta${isAdmin ? " adm" : ""}`}
            onClick={() => (isAdmin ? go("admin") : go("login"))}
            type="button"
          >
            {isAdmin ? t.nav.dashboard : t.nav.adminLogin}
          </button>
          <button
            className={`burger${mobileOpen ? " on" : ""}`}
            onClick={toggleMobile}
            aria-label="Open menu"
            type="button"
          >
            <div className="burger-lines">
              <span />
              <span />
              <span />
            </div>
          </button>
        </div>
      </nav>

      <div
        className={`mnav-ovl${mobileOpen ? " on" : ""}`}
        onClick={closeMobile}
      />
      <div className={`mnav${mobileOpen ? " on" : ""}`}>
        <div className="mnav-h">
          <div
            className="mnav-logo"
            onClick={() => go("home")}
            style={{ cursor: "pointer" }}
          >
            ♔ MyChessFamily
          </div>
          <button
            className="mnav-close"
            onClick={closeMobile}
            aria-label="Close menu"
            type="button"
          >
            ×
          </button>
        </div>
        <div className="mnav-links">
          {navLinks.map(([p, l]) => (
            <button
              key={p}
              className={`mnav-btn${page === p ? " on" : ""}`}
              onClick={() => {
                closeMobile();
                go(p);
              }}
              type="button"
            >
              <span>{l}</span>
              <span style={{ color: "var(--muted)", fontWeight: 600 }}>›</span>
            </button>
          ))}
          {/* Language switcher — mobile drawer only */}
          <div className="mnav-lang-wrap">
            <div className="mnav-lang-label">Language</div>
            <div className="mnav-lang-row">
              {LANG_OPTIONS.map((option) => (
                <button
                  key={option.code}
                  type="button"
                  className={`mnav-lang-item${lang === option.code ? " active" : ""}`}
                  onClick={() => {
                    setLang(option.code);
                    closeMobile();
                  }}
                >
                  <img src={option.flag} alt="" className="lang-flag" />
                  {option.short}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mnav-cta">
          <button
            className="btn btn-g btn-w"
            onClick={() => {
              closeMobile();
              isAdmin ? go("admin") : go("login");
            }}
            type="button"
          >
            {isAdmin ? t.nav.dashboard : t.nav.adminLogin}
          </button>
        </div>
      </div>

      <Routes>
        <Route
          path="/"
          element={<HomePage onNav={go} onContact={openContact} />}
        />
        <Route
          path="/programs"
          element={<ProgramsPage onNav={go} onContact={openContact} />}
        />
        <Route
          path="/camp"
          element={
            <CampPage
              camps={camps}
              onNav={go}
              showToast={showToast}
              onRegistered={loadAdminData}
              onContact={openContact}
            />
          }
        />
        <Route
          path="/team"
          element={<TeamPage onNav={go} onContact={openContact} />}
        />
        <Route
          path="/reviews"
          element={
            <ReviewsPage
              reviews={reviews}
              onNav={go}
              openModal={() => setReviewOpen(true)}
              onContact={openContact}
            />
          }
        />
        <Route
          path="/about"
          element={<AboutPage onNav={go} onContact={openContact} />}
        />
        <Route
          path="/gallery"
          element={<GalleryPage onNav={go} onContact={openContact} />}
        />
        <Route
          path="/contact"
          element={<ContactPage onNav={go} showToast={showToast} />}
        />
        <Route
          path="/login"
          element={<LoginPage onLogin={handleLogin} showToast={showToast} />}
        />
        <Route
          path="/admin"
          element={
            isAdmin ? (
              <AdminPage
                camps={camps}
                setCamps={setCamps}
                campRegs={campRegs}
                reloadRegs={loadAdminData}
                adminReviews={adminReviews}
                galleryPhotos={galleryPhotos}
                reloadGallery={loadGallery}
                onLogout={handleLogout}
                showToast={showToast}
              />
            ) : (
              <LoginPage onLogin={handleLogin} showToast={showToast} />
            )
          }
        />
        <Route path="*" element={<NotFoundPage onNav={go} />} />
      </Routes>

      {contactOpen && (
        <ContactModal onClose={closeContact} showToast={showToast} />
      )}
      {reviewOpen && (
        <ReviewModal
          onClose={() => setReviewOpen(false)}
          showToast={showToast}
          reload={loadReviews}
        />
      )}
      <Toast toasts={toasts} />
      <ChatBot />
    </div>
  );
}
