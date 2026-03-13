import { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import ChatBot from "./ChatBot";

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
.nav{position:fixed;top:0;left:0;width:100%;z-index:999;height:100px;display:flex;align-items:center;justify-content:space-between;padding:0 2.5rem;background:rgba(9,19,30,0.97);border-bottom:1px solid var(--border);backdrop-filter:blur(18px);transform:translateY(0);transition:transform .35s ease;}
.nav-hide{transform:translateY(-100%);}
.nav-logo{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:900;color:var(--green2);cursor:pointer;display:flex;align-items:center;gap:8px;white-space:nowrap;text-decoration:none;}
.nav-links{display:flex;gap:2px;flex-wrap:wrap;}
.nav-right{display:flex;align-items:center;gap:5px;}
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

@media (min-width: 1091px){.burger{display:none !important;}.mnav,.mnav-ovl{display:none !important;}}
@media(max-width:1090px){.nav-links{display:none !important;}.burger{display:flex !important;}}

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
.login-box{max-width:430px;margin:0 auto;background:rgba(13,30,48,.85);border:1px solid var(--border);border-radius:18px;padding:2.3rem;text-align:center;}

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
.ssel{padding:.33rem .58rem;font-size:.76rem;border-radius:6px;background:rgba(26,94,168,.14);border:1px solid var(--border);color:var(--cream);cursor:pointer;font-family:'DM Sans',sans-serif;}

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
.camp-row-media{border-radius:16px;min-height:210px;display:flex;align-items:center;justify-content:center;padding:1rem;}
.camp-row-media img{width:112%;height:111%;object-fit:cover;border-radius:12px;}
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
@media(max-width:850px){
  .camp-page-top-inner,.camp-list-wrap{padding-left:1.2rem;padding-right:1.2rem;}
  .camp-row-card{grid-template-columns:1fr;}
  .camp-row-media{min-height:170px;}
  .camp-row-head{flex-direction:column;}
  .camp-row-bottom{flex-direction:column;align-items:flex-start;}
  .camp-row-actions{width:100%;}
  .camp-row-btn{flex:1;}
}
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
.team-card-top{display:flex;align-items:center;gap:.9rem;margin-bottom:1rem;}
.team-avatar-modern{width:62px;height:62px;border-radius:18px;background:linear-gradient(135deg,#16314D,#215E46);display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.6rem;flex-shrink:0;}
.team-name-modern{font-weight:800;color:#1F2B3A;font-size:1.02rem;}
.team-role-modern{display:inline-block;margin-top:.22rem;font-size:.76rem;font-weight:700;color:#2E7D5B;background:#ECFDF3;border:1px solid #D1F2DF;padding:.22rem .55rem;border-radius:999px;}
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

/* Hero */
.programs-hero{
  background:linear-gradient(135deg,#0B1624 0%,#102033 55%,#0E1D17 100%);
  padding:5rem 0 4rem;position:relative;overflow:hidden;
}
.programs-hero::before{
  content:"";position:absolute;inset:0;
  background:radial-gradient(circle at 20% 50%,rgba(74,171,232,.15),transparent 40%),
             radial-gradient(circle at 80% 30%,rgba(31,168,94,.12),transparent 35%);
  pointer-events:none;
}
.programs-hero-inner{
  max-width:1100px;margin:0 auto;
  padding:0 2.5rem;position:relative;z-index:1;text-align:center;
}
.programs-kicker{
  display:inline-block;font-size:.75rem;letter-spacing:2px;
  text-transform:uppercase;color:#4AABE8;font-weight:700;margin-bottom:1rem;
}
.programs-hero-title{
  font-family:'Playfair Display',serif;
  font-size:clamp(2.4rem,4.5vw,4rem);
  color:#F4F8FC;line-height:1.08;margin-bottom:1rem;
}
.programs-hero-sub{
  max-width:620px;margin:0 auto 2rem;
  color:rgba(220,233,245,.78);line-height:1.8;font-size:1rem;
}
.programs-hero-actions{display:flex;gap:.8rem;justify-content:center;flex-wrap:wrap;}

/* Stats strip */
.programs-stats-strip{background:#fff;border-bottom:1px solid #E2E8F0;}
.programs-stats-inner{
  max-width:1100px;margin:0 auto;
  padding:1.5rem 2.5rem;
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:1rem;
  text-align:center;
}
.programs-stat-n{
  font-family:'Playfair Display',serif;font-size:1.9rem;
  color:#2E7D5B;font-weight:900;
}
.programs-stat-l{font-size:.8rem;color:#5C6B7C;margin-top:.15rem;}

/* Cards area */
.programs-cards-outer{
  max-width:1100px;margin:0 auto;padding:3.5rem 2.5rem 5rem;
}
.programs-cards-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:1.5rem;
}

/* Individual card */
.prog-card-new{
  background:#fff;border:1px solid #E2E8F0;border-radius:24px;
  overflow:hidden;display:flex;flex-direction:column;
  box-shadow:0 8px 24px rgba(15,23,42,.06);
  transition:transform .2s,box-shadow .2s;position:relative;
}
.prog-card-new:hover{
  transform:translateY(-4px);
  box-shadow:0 24px 56px rgba(15,23,42,.13);
}
.prog-card-new.featured-card{border-width:2px;}
.prog-card-featured-pill{
  position:absolute;top:14px;right:14px;
  font-size:.68rem;font-weight:800;letter-spacing:1px;
  text-transform:uppercase;padding:.28rem .7rem;
  border-radius:999px;color:#fff;z-index:1;
}
.prog-card-top-band{padding:1.5rem 1.5rem 1.1rem;}
.prog-card-img{width:72px;height:72px;object-fit:contain;margin-bottom:.7rem;}
.prog-card-tag-pill{
  display:inline-flex;font-size:.67rem;font-weight:800;
  letter-spacing:1px;text-transform:uppercase;
  padding:.22rem .6rem;border-radius:999px;color:#fff;margin-bottom:.55rem;
}
.prog-card-title-text{
  font-family:'Playfair Display',serif;font-size:1.28rem;
  color:#1F2B3A;margin:0;line-height:1.2;
}
.prog-card-meta-row{
  padding:.9rem 1.5rem;border-bottom:1px solid #F1F5F9;
  display:flex;gap:.45rem;flex-wrap:wrap;
}
.prog-card-meta-chip{
  background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;
  padding:.28rem .55rem;font-size:.73rem;color:#3A4A5B;font-weight:600;
}
.prog-card-body-area{padding:1.1rem 1.5rem;flex:1;}
.prog-card-desc-text{
  color:#5C6B7C;font-size:.88rem;line-height:1.7;margin-bottom:.9rem;
}
.prog-card-check-list{
  list-style:none;padding:0;margin:0;
  display:flex;flex-direction:column;gap:.4rem;
}
.prog-card-check-item{
  display:flex;align-items:flex-start;gap:.5rem;
  font-size:.83rem;color:#3A4A5B;
}
.prog-card-check-icon{font-weight:900;margin-top:.1rem;flex-shrink:0;}
.prog-card-footer-area{padding:.9rem 1.5rem 1.5rem;}
.prog-card-cta-btn{
  width:100%;padding:.82rem;border-radius:9px;
  font-family:'DM Sans',sans-serif;font-size:.93rem;font-weight:800;
  cursor:pointer;transition:transform .22s ease,box-shadow .28s ease,background .22s ease,color .22s ease;
  border-width:2px;border-style:solid;position:relative;overflow:hidden;
}

/* Bottom CTA */
.programs-bottom-cta{
  margin-top:3rem;
  background:linear-gradient(135deg,#12253B,#143524);
  border-radius:26px;padding:2.5rem 2rem;text-align:center;color:#EEF5FF;
}
.programs-bottom-cta h3{
  font-family:'Playfair Display',serif;font-size:1.9rem;margin-bottom:.6rem;
}
.programs-bottom-cta p{
  color:rgba(220,233,245,.78);line-height:1.8;
  max-width:600px;margin:0 auto;font-size:.95rem;
}
.programs-cta-actions{
  margin-top:1.3rem;display:flex;justify-content:center;gap:.8rem;flex-wrap:wrap;
}

/* ── PROGRAMS RESPONSIVE BREAKPOINTS ── */
@media(max-width:1050px){
  .programs-cards-grid{grid-template-columns:repeat(2,1fr);}
}
@media(max-width:700px){
  .programs-cards-grid{grid-template-columns:1fr;}
  .programs-hero-inner,.programs-cards-outer{padding-left:1.2rem;padding-right:1.2rem;}
  .programs-stats-inner{
    grid-template-columns:1fr 1fr;
    padding:1.2rem;
    gap:.8rem;
  }
  .programs-hero-title{font-size:clamp(2rem,8vw,2.8rem);}
  .programs-bottom-cta{padding:1.8rem 1.2rem;border-radius:18px;}
  .programs-bottom-cta h3{font-size:1.45rem;}
  .programs-cards-outer{padding-top:2.5rem;padding-bottom:3rem;}
}
@media(max-width:420px){
  .programs-stats-inner{grid-template-columns:1fr 1fr;}
  .prog-card-meta-row{gap:.35rem;}
  .prog-card-meta-chip{font-size:.68rem;padding:.22rem .45rem;}
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
  const cls =
    status === "open"
      ? "bdg bdg-open"
      : status === "full"
        ? "bdg bdg-full"
        : "bdg bdg-up";
  const lbl =
    status === "open" ? "Open" : status === "full" ? "Full" : "Upcoming";
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
  return (
    <footer className="footer">
      <div className="f-links">
        {[
          ["home", "Home"],
          ["programs", "Programs"],
          ["camp", "Summer Camp"],
          ["team", "Our Team"],
          ["gallery", "Gallery"],
          ["reviews", "Reviews"],
          ["about", "About"],
          ["contact", "Contact"],
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
        Designed &amp; built by{" "}
        <span style={{ color: "rgba(180,210,240,0.55)", fontWeight: 600 }}>
          Giorgi Kostava
        </span>
      </div>
    </footer>
  );
}

function ContactModal({ onClose, showToast }) {
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      showToast("📋 Email copied!", "s");
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = CONTACT.email;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        showToast("📋 Email copied!", "s");
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
          ×
        </button>
        <h3>Contact Us</h3>
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
              Click to copy
            </span>
          </button>
          <div
            style={{
              color: "var(--muted)",
              fontSize: ".85rem",
              lineHeight: 1.6,
            }}
          >
            For fastest response, email us.
          </div>
        </div>
      </div>
    </div>
  );
}

function CampRegModal({ item, onClose, showToast, onRegistered }) {
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
      showToast("Please fill in all required fields.", "e");
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
      showToast("🎉 Registration submitted!", "s");
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
          ×
        </button>
        <h3>Sign Up: {item.name}</h3>
        {!done ? (
          <>
            <div className="fgrid">
              <div className="fg">
                <label className="lbl">First Name *</label>
                <input
                  className="inp"
                  placeholder="e.g. Alex"
                  value={f.fname}
                  onChange={set("fname")}
                />
              </div>
              <div className="fg">
                <label className="lbl">Last Name *</label>
                <input
                  className="inp"
                  placeholder="e.g. Johnson"
                  value={f.lname}
                  onChange={set("lname")}
                />
              </div>
              <div className="fg">
                <label className="lbl">Date of Birth *</label>
                <input
                  className="inp"
                  type="date"
                  value={f.dob}
                  onChange={set("dob")}
                />
              </div>
              <div className="fg">
                <label className="lbl">Chess Level *</label>
                <select className="inp" value={f.level} onChange={set("level")}>
                  <option value="">Select level</option>
                  <option>Never played before</option>
                  <option>Knows the basics</option>
                  <option>Plays regularly</option>
                  <option>Tournament player</option>
                </select>
              </div>
              <div className="fg full">
                <label className="lbl">Parent / Guardian *</label>
                <input
                  className="inp"
                  placeholder="Full name"
                  value={f.parent}
                  onChange={set("parent")}
                />
              </div>
              <div className="fg full">
                <label className="lbl">Email *</label>
                <input
                  className="inp"
                  type="email"
                  placeholder="parent@email.com"
                  value={f.email}
                  onChange={set("email")}
                />
              </div>
              <div className="fg full">
                <label className="lbl">Phone *</label>
                <input
                  className="inp"
                  type="tel"
                  placeholder="(212) 555-0000"
                  value={f.phone}
                  onChange={set("phone")}
                />
              </div>
              <div className="fg full">
                <label className="lbl">Emergency Contact</label>
                <input
                  className="inp"
                  placeholder="Name · (212) 555-0001"
                  value={f.emergency}
                  onChange={set("emergency")}
                />
              </div>
              <div className="fg full">
                <label className="lbl">Allergies / Medical Notes</label>
                <textarea
                  className="inp"
                  placeholder="Any info we should know..."
                  value={f.medical}
                  onChange={set("medical")}
                />
              </div>
            </div>
            <button className="sbtn" onClick={submit}>
              Submit Registration →
            </button>
          </>
        ) : (
          <div className="ok-box">
            <div style={{ fontSize: "2rem" }}>🎉</div>
            <strong style={{ marginTop: ".5rem" }}>You're registered!</strong>
            <p
              style={{
                fontSize: ".86rem",
                color: "var(--muted)",
                marginTop: ".4rem",
              }}
            >
              Confirmation details will be sent to your email.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════ PAGES ══════════════════════════════════════════ */
function HomePage({ onNav, onContact }) {
  const homeSections = [
    {
      title: "Private Lessons",
      text1:
        "My Chess Family offers structured chess training for students of all levels through school programs, private lessons, camps, team training, and tournament preparation.",
      text2:
        "Students grow not only as chess players, but also as individuals in a supportive community built around learning, discipline, and confidence.",
      image: "/images/info.png",
      button: "Explore Programs",
      onClick: () => onNav("programs"),
    },
    {
      title: "Personalized Coaching",
      text1:
        "Every student learns differently. Our coaches build personal connections with students to understand their thinking style, motivation, and learning pace.",
      text2:
        "Through individual lessons and targeted guidance, students receive training that matches their level and helps them progress with confidence.",
      image: "/images/info.png",
      button: "View Programs",
      onClick: () => onNav("programs"),
    },
    {
      title: "Chess Tournaments",
      text1:
        "Tournaments give students real-game experience and help them apply what they learn under pressure. They develop focus, resilience, and better decision-making.",
      text2:
        "We encourage healthy competition, sportsmanship, and steady growth through events that challenge players while keeping the experience positive and rewarding.",
      image: "/images/info.png",
      button: "Read Reviews",
      onClick: () => onNav("reviews"),
    },
    {
      title: "Chess Camps",
      text1:
        "Our chess camps combine structured training, tournaments, and fun activities in a dynamic learning environment.",
      text2:
        "Students strengthen their chess skills, build friendships, and enjoy a memorable experience that keeps them engaged and motivated.",
      image: "/images/info.png",
      button: "Join Camp",
      onClick: () => onNav("camp"),
    },
    {
      title: "School Chess Programs",
      text1:
        "My Chess Family partners with schools to bring high-quality chess education directly into the classroom through after-school programs.",
      text2:
        "These programs help students develop focus, patience, and problem-solving skills while introducing them to the strategic world of chess.",
      image: "/images/info.png",
      button: "Contact Us",
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
            <div className="hero-badge">🗽 New York City · Ages 6–16</div>
            <h1>
              Where Kids Become <em>Chess Champions</em>
            </h1>
            <p className="hero-sub">
              Join MyChessFamily — New York's premier chess club for young
              minds. We build strategy, confidence, and lasting friendships
              through the timeless game of chess.
            </p>
            <div className="hero-btns">
              <button className="btn btn-g" onClick={() => onNav("programs")}>
                ♟ Explore Programs
              </button>
              <button className="btn btn-g" onClick={() => onNav("camp")}>
                ☀️ Join Summer Camp
              </button>
              <button
                className="btn btn-g"
                style={{ background: "rgba(74,171,232,.18)", color: "#EEF5FF" }}
                onClick={onContact}
              >
                ✉️ Contact
              </button>
            </div>
            <div className="stats">
              <div className="stat">
                <div className="stat-n">500+</div>
                <div className="stat-l">Young Players</div>
              </div>
              <div className="stat">
                <div className="stat-n">8+</div>
                <div className="stat-l">Years Running</div>
              </div>
              <div className="stat">
                <div className="stat-n">3</div>
                <div className="stat-l">Camps / Year</div>
              </div>
            </div>
          </div>
          <ChessBoard />
        </div>
      </div>
      <h1 className="home-main-title">What We Offer</h1>
      <div className="offer-grid">
        <div className="offer-card" onClick={() => onNav("programs")}>
          <img
            src="/images/schoolprogramsicon.png"
            alt="School Chess Programs"
            className="offer-img"
          />
          <h3>School Chess Programs</h3>
          <p>
            After-school chess programs where students learn the fundamentals of
            chess and gradually develop strategic thinking.
          </p>
          <span>See More</span>
        </div>
        <div className="offer-card" onClick={() => onNav("programs")}>
          <img
            src="/images/privateicon.png"
            alt="Private Lessons"
            className="offer-img"
          />
          <h3>Private Lessons</h3>
          <p>
            Individual training tailored to each student's level, pace, and
            goals.
          </p>
          <span>See More</span>
        </div>
        <div className="offer-card" onClick={() => onNav("programs")}>
          <img
            src="/images/tournamentpreparation.png"
            alt="Tournament Preparation"
            className="offer-img"
          />
          <h3>Tournament Preparation</h3>
          <p>
            Structured training for students preparing to compete in scholastic
            tournaments.
          </p>
          <span>See More</span>
        </div>
        <div className="offer-card" onClick={() => onNav("programs")}>
          <img
            src="/images/teamtrain.png"
            alt="Team Training"
            className="offer-img"
          />
          <h3>Team Training</h3>
          <p>
            Group training sessions where students prepare together for
            tournaments and strengthen their skills as a team.
          </p>
          <span>See More</span>
        </div>
        <div className="offer-card" onClick={() => onNav("programs")}>
          <img
            src="/images/chesscamps.png"
            alt="Chess Camps"
            className="offer-img"
          />
          <h3>Chess Camps</h3>
          <p>
            Immersive chess camps combining training, tournaments, and social
            activities.
          </p>
          <span>See More</span>
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
            <div className="slbl">About Us</div>
            <h2 className="home-split-title">About My Chess Family</h2>
            <p className="home-split-p">
              MyChessFamily is a youth chess community built to help students
              grow in skill, confidence, and character through thoughtful,
              engaging instruction.
            </p>
            <p className="home-split-p">
              From first lessons to competitive preparation, we focus on making
              each student feel supported, challenged, and excited to improve.
            </p>
            <p className="home-split-p">
              Our goal is not only to teach chess well, but also to create a
              strong, positive environment where students and families feel part
              of something meaningful.
            </p>
            <button className="home-split-btn" onClick={() => onNav("about")}>
              Learn More
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

/* ══════════════════════════════════════════ PROGRAMS PAGE — FULLY RESPONSIVE ══════════════════════════════════════════ */
function ProgramsPage({ onNav, onContact }) {
  const PROGRAMS = [
    {
      icon: "/images/schoolprogramsicon.png",
      title: "School Chess Programs",
      tag: "Most Popular",
      price: "Contact for Pricing",
      duration: "Weekly Sessions",
      age: "Ages 6–16",
      level: "All Levels",
      color: "#1A5EA8",
      accent: "rgba(26,94,168,.08)",
      desc: "After-school chess programs where students learn the fundamentals of chess in a structured and engaging environment. We partner directly with schools to bring high-quality coaching into the classroom.",
      highlights: [
        "Strategic thinking & problem-solving",
        "Structured curriculum per level",
        "School partnership programs",
        "Progress tracking for parents",
      ],
      button: "Contact Us",
      onClick: onContact,
      featured: true,
    },
    {
      icon: "/images/privateicon.png",
      title: "Private Lessons",
      tag: "One-on-One",
      price: "From $80 / session",
      duration: "60 or 90 min",
      age: "Ages 6–16",
      level: "All Levels",
      color: "#2E7D5B",
      accent: "rgba(46,125,91,.08)",
      desc: "One-on-one coaching tailored entirely to your child. Whether a complete beginner or preparing for competition, private lessons deliver the fastest, most focused improvement.",
      highlights: [
        "Personalized training plan",
        "Flexible scheduling",
        "In-person or online",
        "Beginner to advanced",
      ],
      button: "Meet Our Team",
      onClick: () => onNav("team"),
    },
    {
      icon: "/images/tournamentpreparation.png",
      title: "Tournament Preparation",
      tag: "Competitive",
      price: "Contact for Pricing",
      duration: "Ongoing Program",
      age: "Ages 8–16",
      level: "Intermediate – Advanced",
      color: "#B45309",
      accent: "rgba(180,83,9,.07)",
      desc: "Structured training for students who compete in scholastic tournaments. Opening preparation, game analysis, endgame technique, and the mental skills to perform under pressure.",
      highlights: [
        "Opening repertoire building",
        "Game & mistake analysis",
        "Endgame & tactics training",
        "Psychological readiness",
      ],
      button: "Contact Us",
      onClick: onContact,
    },
    {
      icon: "/images/teamtrain.png",
      title: "Team Training",
      tag: "Group",
      price: "Contact for Pricing",
      duration: "Weekly Sessions",
      age: "Ages 8–16",
      level: "Intermediate",
      color: "#6B21A8",
      accent: "rgba(107,33,168,.07)",
      desc: "Collaborative group sessions where students prepare for tournaments together, analyze games, and push each other to improve in a team-based learning environment.",
      highlights: [
        "Team strategy & dynamics",
        "Peer game analysis",
        "Collaborative learning",
        "Competitive team prep",
      ],
      button: "Contact Us",
      onClick: onContact,
    },
    {
      icon: "/images/chesscamps.png",
      title: "Chess Camps",
      tag: "Summer Program",
      price: "From $350 / week",
      duration: "Full & Half Day",
      age: "Ages 6–16",
      level: "All Levels",
      color: "#0E7490",
      accent: "rgba(14,116,144,.07)",
      desc: "Intensive week-long summer camps combining structured lessons, practice games, puzzles, and fun activities. Students improve fast while making lasting friendships.",
      highlights: [
        "Full & half-day options",
        "All skill levels welcome",
        "Daily puzzles & games",
        "Small group sizes",
      ],
      button: "View Summer Camp",
      onClick: () => onNav("camp"),
    },
  ];

  return (
    <div className="pg programs-page">
      {/* ── Hero ── */}
      <section className="programs-hero">
        <div className="programs-hero-inner">
          <div className="programs-kicker">Our Programs</div>
          <h1 className="programs-hero-title">Find the Right Program</h1>
          <p className="programs-hero-sub">
            From beginner after-school programs to serious tournament prep —
            every program is designed to help your child grow at their own pace.
          </p>
          <div className="programs-hero-actions">
            <button className="btn btn-g" onClick={onContact}>
              ✉️ Ask About Pricing
            </button>
            <button
              className="btn btn-g"
              style={{ background: "rgba(74,171,232,.18)", color: "#EEF5FF" }}
              onClick={() => onNav("camp")}
            >
              ☀️ Summer Camp
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <div className="programs-stats-strip">
        <div className="programs-stats-inner">
          {[
            ["5", "Programs Offered"],
            ["500+", "Students Taught"],
            ["8+", "Years Experience"],
            ["6–16", "Age Range"],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="programs-stat-n">{n}</div>
              <div className="programs-stat-l">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Cards ── */}
      <div className="programs-cards-outer">
        <div className="programs-cards-grid">
          {PROGRAMS.map((p) => (
            <ProgramCard key={p.title} p={p} />
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="programs-bottom-cta">
          <h3>Not sure which program fits?</h3>
          <p>
            We personally help every family find the right fit based on age,
            experience, and goals. Just reach out — we'll guide you.
          </p>
          <div className="programs-cta-actions">
            <button className="btn btn-g" onClick={onContact}>
              ✉️ Contact Us
            </button>
            <button
              className="btn btn-g"
              style={{ background: "rgba(74,171,232,.18)", color: "#EEF5FF" }}
              onClick={() => onNav("team")}
            >
              👥 Meet Our Team
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
          ⭐ Most Popular
        </div>
      )}

      {/* Top band */}
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

      {/* Meta chips */}
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

      {/* Body */}
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

      {/* Footer CTA */}
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
  const [modal, setModal] = useState(null);
  const BASE = import.meta.env.VITE_API_URL || "";
  return (
    <div className="pg" style={{ background: "#F5F6F8" }}>
      <section className="camp-page-top">
        <div className="camp-page-top-inner">
          <div className="slbl">Summer Program</div>
          <h1 className="camp-page-title">Summer Chess Camp</h1>
          <p className="camp-page-sub">
            Intensive chess training, practical tournament experience, and a fun
            learning environment where students build skill, confidence, and
            friendships.
          </p>
        </div>
      </section>
      <section className="camp-list-wrap">
        {!camps.length ? (
          <div className="empty">
            <div className="empty-i">☀️</div>
            <p>No camp sessions scheduled yet.</p>
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
                          📅 {fmtDShort(c.dateStart)} – {fmtDShort(c.dateEnd)}
                        </span>
                        <span>📍 {c.location}</span>
                        <span>👦 {c.age}</span>
                        <span>⏰ {c.type}</span>
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
                      <span> / child</span>
                    </div>
                    <div className="camp-row-actions">
                      <button
                        className="camp-row-btn ghost"
                        onClick={onContact}
                        type="button"
                      >
                        Contact
                      </button>
                      <button
                        className="camp-row-btn primary"
                        disabled={c.status === "full"}
                        onClick={() => setModal(c)}
                        type="button"
                      >
                        {c.status === "full"
                          ? "Registration Closed"
                          : c.status === "upcoming"
                            ? "Pre-Register"
                            : "Sign Up Now"}
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
  const faqs = [
    {
      q: "What age groups do you teach?",
      a: "My Chess Family works with children ages 6–16 through school programs, private lessons, camps, and tournament training.",
    },
    {
      q: "Does my child need chess experience before joining?",
      a: "No. We welcome complete beginners as well as experienced tournament players, and we guide each child based on their level and pace.",
    },
    {
      q: "Do you offer private lessons?",
      a: "Yes. We offer private coaching for students who want more personalized attention, faster improvement, or targeted tournament preparation.",
    },
    {
      q: "What happens during summer camp?",
      a: "Our summer camps combine structured lessons, practice games, puzzle solving, fun activities, and a supportive environment that keeps students engaged.",
    },
    {
      q: "Do you work with schools and organizations?",
      a: "Yes. We partner with schools to provide after-school chess programs and can help create the right setup for students and communities.",
    },
    {
      q: "How do I choose the right program for my child?",
      a: "We help families choose the best fit based on age, current level, goals, and learning style. You can contact us and we'll guide you personally.",
    },
  ];
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section className="about-faq-section">
      <div className="about-inner-light">
        <div className="about-section-head" style={{ marginTop: 0 }}>
          <h2>Frequently Asked Questions</h2>
          <p>
            A few common questions parents ask before getting started with My
            Chess Family.
          </p>
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
  return (
    <div className="pg" style={{ background: "#09131E" }}>
      <section className="about-hero">
        <div className="about-hero-inner">
          <div className="about-kicker">About My Chess Family</div>
          <h1 className="about-title">
            More Than a Chess School — A Community for Growth
          </h1>
          <p className="about-sub">
            My Chess Family helps children develop strategic thinking,
            confidence, resilience, and character through high-quality chess
            education in a supportive and inspiring environment.
          </p>
          <div className="about-hero-actions">
            <button className="btn btn-g" onClick={() => onNav("programs")}>
              ♟ View Programs
            </button>
            <button
              className="btn btn-g"
              style={{ background: "rgba(74,171,232,.18)", color: "#EEF5FF" }}
              onClick={onContact}
            >
              ✉️ Contact
            </button>
          </div>
        </div>
      </section>
      <section className="about-light">
        <div className="about-inner-light">
          <div className="about-story">
            <div className="about-story-card">
              <h2>Our Story</h2>
              <p>
                My Chess Family is a chess education program dedicated to
                helping children grow not only as players, but also as people.
                Through structured training, tournament experience, and
                supportive mentorship, students build skills that go far beyond
                the chessboard.
              </p>
              <p>
                The program brings together experienced coaches, master-level
                players, and grandmasters to create a strong learning
                environment for students of all levels — from complete beginners
                to serious tournament competitors.
              </p>
              <p>
                What makes My Chess Family special is the sense of connection.
                Students, coaches, and families become part of a real community
                built on encouragement, discipline, and long-term growth.
              </p>
            </div>
            <div className="about-visual-card">
              <img src="/pieces/logo.png" alt="My Chess Family" />
            </div>
          </div>
          <div className="about-section-head">
            <h2>Founded With Purpose</h2>
            <p>
              The vision behind My Chess Family is rooted in strong teaching,
              empathy, and the belief that every child can grow through the game
              of chess.
            </p>
          </div>
          <div className="about-founder">
            <div className="about-founder-side">
              <div className="about-founder-mark">♔</div>
              <div className="about-founder-name">Dmitri Shevelev</div>
              <div className="about-founder-role">Founder & Head Coach</div>
            </div>
            <div className="about-founder-copy">
              <h3>Dmitri Shevelev</h3>
              <p>
                My Chess Family was founded by FIDE Master Dmitri Shevelev, an
                experienced chess educator with more than two decades of
                teaching experience. He began playing chess at age six and
                teaching at eighteen, later continuing his work in the United
                States.
              </p>
              <p>
                Over the years, Dmitri has taught thousands of students through
                school programs, private lessons, camps, and tournament
                preparation. His work has included beginners learning the game
                for the first time as well as advanced players preparing for
                serious competition.
              </p>
              <p>
                His philosophy is simple: every child is unique, and the best
                teaching happens when coaches understand how a student thinks,
                learns, and grows with confidence.
              </p>
            </div>
          </div>
          <div className="about-section-head">
            <h2>What We Help Students Build</h2>
            <p>
              Chess is used as an educational tool to develop practical skills,
              emotional strength, and long-term confidence.
            </p>
          </div>
          <div className="about-values">
            <div className="about-value">
              <div className="about-value-icon">♟</div>
              <h4>Strategic Thinking</h4>
              <p>
                Students learn how to think ahead, evaluate options, and make
                thoughtful decisions with greater clarity.
              </p>
            </div>
            <div className="about-value">
              <div className="about-value-icon">🧠</div>
              <h4>Focus & Discipline</h4>
              <p>
                Chess helps students improve concentration, patience, and the
                ability to stay engaged with challenging problems.
              </p>
            </div>
            <div className="about-value">
              <div className="about-value-icon">⭐</div>
              <h4>Confidence & Resilience</h4>
              <p>
                Students learn how to handle mistakes, recover from losses, and
                continue improving with maturity and self-belief.
              </p>
            </div>
            <div className="about-value">
              <div className="about-value-icon">🤝</div>
              <h4>Community & Character</h4>
              <p>
                Families become part of a supportive environment where students
                encourage one another and grow through shared experience.
              </p>
            </div>
          </div>
          <div className="about-cta">
            <h3>Discover the right path for your child</h3>
            <p>
              Whether your child is just starting or already competing, My Chess
              Family offers a supportive environment to learn, improve, and grow
              with confidence.
            </p>
            <div className="about-cta-actions">
              <button className="btn btn-g" onClick={() => onNav("programs")}>
                ♟ Explore Programs
              </button>
              <button
                className="btn btn-g"
                style={{ background: "rgba(74,171,232,.18)", color: "#EEF5FF" }}
                onClick={() => onNav("team")}
              >
                👥 Meet Our Team
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
  return (
    <>
      <div className="pg" style={{ background: "#09131E" }}>
        <section className="team-hero">
          <div className="team-hero-inner">
            <div className="team-hero-kicker">Meet Our Team</div>
            <h1 className="team-hero-title">
              Experienced Coaches. Personal Guidance. Real Growth.
            </h1>
            <p className="team-hero-sub">
              My Chess Family brings together dedicated teachers, competitive
              players, and experienced mentors who help students grow in skill,
              confidence, and character through chess.
            </p>
            <div className="team-hero-actions">
              <button className="btn btn-g" onClick={onContact}>
                ✉️ Contact Us
              </button>
              <button
                className="btn btn-g"
                style={{ background: "rgba(74,171,232,.18)", color: "#EEF5FF" }}
                onClick={() => onNav("programs")}
              >
                ♟ View Programs
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
                <div className="founder-role">Founder & Head Coach</div>
                <h2>Dmitri Shevelev</h2>
                <p>
                  My Chess Family was founded by FIDE Master Dmitri Shevelev, an
                  experienced chess educator who has spent decades teaching
                  children how to think strategically, compete with confidence,
                  and grow through the game.
                </p>
                <p>
                  His teaching philosophy is built on empathy, discipline, and
                  personal connection. Every student is different, and the goal
                  is to match each child with the right support, the right pace,
                  and the right environment for long-term growth.
                </p>
                <p>
                  Under his leadership, My Chess Family has grown into a
                  community where students receive strong chess instruction
                  while also developing resilience, focus, and character.
                </p>
              </div>
            </div>
            <div style={{ height: "3rem" }} />
            <div className="team-section-head">
              <h2>Our Coaching Team</h2>
              <p>
                Our team includes friendly, professional coaches who know how to
                make chess challenging, supportive, and engaging for students at
                every level.
              </p>
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
                    {c.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="team-features">
              <div className="team-feature">
                <h3>Personalized Teaching</h3>
                <p>
                  Coaches focus on each student's personality, level, and
                  learning style to create a more effective and encouraging
                  experience.
                </p>
              </div>
              <div className="team-feature">
                <h3>Competitive Experience</h3>
                <p>
                  Students learn from coaches who understand tournament play and
                  can help them prepare with strategy, discipline, and practical
                  guidance.
                </p>
              </div>
              <div className="team-feature">
                <h3>Supportive Community</h3>
                <p>
                  Beyond instruction, our team helps create a welcoming
                  environment where students feel motivated, respected, and
                  excited to improve.
                </p>
              </div>
            </div>
            <div className="team-cta">
              <h3>Want help choosing the right coach?</h3>
              <p>
                We can help you choose the best fit based on your child's age,
                level, goals, and learning style.
              </p>
              <div className="team-cta-actions">
                <button className="btn btn-g" onClick={onContact}>
                  ✉️ Contact Us
                </button>
                <button
                  className="btn btn-g"
                  style={{
                    background: "rgba(74,171,232,.18)",
                    color: "#EEF5FF",
                  }}
                  onClick={() => onNav("camp")}
                >
                  ☀️ View Camps
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
  const approved = (reviews || []).filter((r) => r.approved === true);
  const count = approved.length;
  const avg = count
    ? approved.reduce((s, r) => s + (Number(r.rating) || 0), 0) / count
    : 0;
  return (
    <div className="pg reviews-page">
      <section className="reviews-hero">
        <div className="reviews-hero-inner">
          <div className="reviews-kicker">Parents & Students</div>
          <h1 className="reviews-title">What Families Say About Us</h1>
          <p className="reviews-sub">
            Feedback from students and families who have experienced My Chess
            Family through lessons, camps, tournaments, and long-term coaching.
          </p>
          <div className="reviews-rating-big">
            <div className="reviews-rating-score">{avg.toFixed(1)}/5.0</div>
            <div className="reviews-rating-stars">
              <Stars rating={Math.round(avg)} />
            </div>
            <div className="reviews-rating-meta">
              Based on {count} review{count !== 1 ? "s" : ""}
            </div>
          </div>
          <div className="reviews-hero-actions">
            <button className="btn btn-g" onClick={openModal}>
              ✍️ Write a Review
            </button>
            <button
              className="btn btn-g"
              style={{ background: "rgba(74,171,232,.18)", color: "#EEF5FF" }}
              onClick={onContact}
            >
              ✉️ Contact
            </button>
          </div>
        </div>
      </section>
      <div className="reviews-content">
        <div className="reviews-stats">
          <div className="reviews-stat">
            <div className="reviews-stat-number">{avg.toFixed(1)}</div>
            <div className="reviews-stat-label">Average Rating</div>
          </div>
          <div className="reviews-stat">
            <div className="reviews-stat-number">{count}</div>
            <div className="reviews-stat-label">Published Reviews</div>
          </div>
          <div className="reviews-stat">
            <div className="reviews-stat-number">100%</div>
            <div className="reviews-stat-label">Focused On Student Growth</div>
          </div>
        </div>
        {!count ? (
          <div className="reviews-empty-modern">
            <div className="icon">📝</div>
            <h3 style={{ color: "#1F2B3A", marginBottom: ".45rem" }}>
              No approved reviews yet
            </h3>
            <p>Be the first family to share your experience.</p>
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
          <h3>Share your experience with My Chess Family</h3>
          <p>
            Your review helps other families understand what it feels like to
            learn, grow, and compete as part of our chess community.
          </p>
          <div className="reviews-cta-actions">
            <button className="btn btn-g" onClick={openModal}>
              ✍️ Leave a Review
            </button>
            <button
              className="btn btn-g"
              style={{ background: "rgba(74,171,232,.18)", color: "#EEF5FF" }}
              onClick={() => onNav("programs")}
            >
              ♟ View Programs
            </button>
          </div>
        </div>
      </div>
      <Footer onNav={onNav} onContact={onContact} />
    </div>
  );
}

function ReviewModal({ onClose, showToast, reload }) {
  const [childName, setChildName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);
  const submit = async () => {
    if (!text.trim() || text.trim().length < 10) {
      showToast("Write at least 10 characters.", "e");
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
      showToast("✅ Review submitted! Waiting for admin approval.", "s");
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
          ×
        </button>
        <h3>Write a Review</h3>
        {!done ? (
          <>
            <div className="fg">
              <label className="lbl">Child Name (optional)</label>
              <input
                className="inp"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Optional"
              />
            </div>
            <div className="fg">
              <label className="lbl">Rating</label>
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
              <label className="lbl">Review *</label>
              <textarea
                className="inp"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your experience..."
              />
            </div>
            <button className="sbtn" onClick={submit}>
              Submit Review →
            </button>
          </>
        ) : (
          <div className="ok-box">
            <div style={{ fontSize: "2rem" }}>✅</div>
            <strong style={{ marginTop: ".5rem" }}>Submitted!</strong>
            <p
              style={{
                fontSize: ".86rem",
                color: "var(--muted)",
                marginTop: ".4rem",
              }}
            >
              Your review will appear after admin approval.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function LoginPage({ onLogin, showToast }) {
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
      showToast("✅ Welcome back, Admin!", "s");
    } catch {
      setErr("❌ Wrong credentials. Use: admin / chess123");
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
          Admin Login
        </h2>
        <p
          style={{
            color: "var(--muted)",
            marginBottom: "1.8rem",
            fontSize: ".88rem",
          }}
        >
          Sign in to manage camps and view registrations.
        </p>
        <div className="fg" style={{ textAlign: "left" }}>
          <label className="lbl">Username</label>
          <input
            className="inp"
            placeholder="admin"
            value={u}
            onChange={(e) => setU(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>
        <div className="fg" style={{ textAlign: "left", marginTop: ".7rem" }}>
          <label className="lbl">Password</label>
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
          Demo credentials:{" "}
          <strong style={{ color: "var(--green2)" }}>admin</strong> /{" "}
          <strong style={{ color: "var(--green2)" }}>chess123</strong>
        </p>
        <button className="sbtn" onClick={submit}>
          Sign In →
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
  const [tab, setTab] = useState("camps");
  const [editingCampId, setEditingCampId] = useState(null);
  const [cf, setCf] = useState({
    name: "",
    dateStart: "",
    dateEnd: "",
    loc: "",
    age: "All Ages (6–16)",
    type: "Half Day (9AM–1PM)",
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
      age: camp.age || "All Ages (6–16)",
      type: camp.type || "Half Day (9AM–1PM)",
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
      age: "All Ages (6–16)",
      type: "Half Day (9AM–1PM)",
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
      showToast(
        editingCampId ? "✅ Camp updated!" : "✅ Camp session published!",
        "s",
      );
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
      showToast("Status updated!", "s");
    } catch (error) {
      showToast(error.message || "Could not update status.", "e");
    }
  };

  const delC = async (id) => {
    if (!confirm("Delete this camp session?")) return;
    try {
      const data = await api(`/admin/camps/${id}`, { method: "DELETE" });
      setCamps(data.camps);
      showToast("Deleted.", "i");
    } catch (error) {
      showToast(error.message || "Could not delete camp session.", "e");
    }
  };

  const deleteCampReg = async (id) => {
    if (!confirm("Delete this camp sign-up?")) return;
    try {
      await api(`/admin/registrations/camp/${id}`, { method: "DELETE" });
      showToast("Sign-up deleted.", "i");
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
            <div className="slbl">Admin Dashboard</div>
            <h2
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "clamp(1.4rem, 4vw, 2rem)",
              }}
            >
              Welcome, Admin! 👋
            </h2>
          </div>
          <button
            className="delbtn"
            style={{ fontSize: ".88rem", padding: ".45rem 1rem" }}
            onClick={onLogout}
          >
            🚪 Log Out
          </button>
        </div>

        <div className="adm-stats">
          {[
            { n: camps.length, l: "Camp Sessions" },
            { n: campRegs.length, l: "Camp Sign-Ups" },
            { n: "$" + revenue.toLocaleString(), l: "Est. Camp Revenue" },
          ].map((s) => (
            <div className="stat" key={s.l}>
              <div className="stat-n">{s.n}</div>
              <div className="stat-l">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="atabs">
          {[
            ["camps", "☀️ Manage Camps"],
            ["campregs", "🏕 Camp Sign-Ups"],
            ["reviews", "⭐ Reviews"],
            ["gallery", "📸 Gallery"],
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
                {editingCampId
                  ? "✏️ Edit Camp Session"
                  : "➕ Add New Camp Session"}
              </h3>
              <div className="fgrid">
                <div className="fg full">
                  <label className="lbl">Camp Session Name *</label>
                  <input
                    className="inp"
                    placeholder="e.g. Summer Chess Camp – Session 3"
                    value={cf.name}
                    onChange={setC("name")}
                  />
                </div>
                <div className="fg">
                  <label className="lbl">Start Date *</label>
                  <input
                    className="inp"
                    type="date"
                    value={cf.dateStart}
                    onChange={setC("dateStart")}
                  />
                </div>
                <div className="fg">
                  <label className="lbl">End Date *</label>
                  <input
                    className="inp"
                    type="date"
                    value={cf.dateEnd}
                    onChange={setC("dateEnd")}
                  />
                </div>
                <div className="fg">
                  <label className="lbl">Location *</label>
                  <input
                    className="inp"
                    placeholder="e.g. Chess Club HQ"
                    value={cf.loc}
                    onChange={setC("loc")}
                  />
                </div>
                <div className="fg">
                  <label className="lbl">Session Type</label>
                  <select
                    className="inp"
                    value={cf.type}
                    onChange={setC("type")}
                  >
                    <option>Half Day (9AM–1PM)</option>
                    <option>Full Day (9AM–5PM)</option>
                  </select>
                </div>
                <div className="fg">
                  <label className="lbl">Age Group</label>
                  <select className="inp" value={cf.age} onChange={setC("age")}>
                    <option>All Ages (6–16)</option>
                    <option>Juniors (6–10)</option>
                    <option>Intermediates (11–13)</option>
                    <option>Seniors (14–16)</option>
                  </select>
                </div>
                <div className="fg">
                  <label className="lbl">Price per Child ($)</label>
                  <input
                    className="inp"
                    type="number"
                    placeholder="e.g. 350"
                    value={cf.price}
                    onChange={setC("price")}
                  />
                </div>
                <div className="fg">
                  <label className="lbl">Max Spots</label>
                  <input
                    className="inp"
                    type="number"
                    placeholder="e.g. 20"
                    value={cf.spots}
                    onChange={setC("spots")}
                  />
                </div>
                <div className="fg">
                  <label className="lbl">Status</label>
                  <select
                    className="inp"
                    value={cf.status}
                    onChange={setC("status")}
                  >
                    <option value="open">Open</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="full">Full</option>
                  </select>
                </div>
                <div className="fg full">
                  <label className="lbl">Camp Image</label>
                  <input
                    className="inp"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCampFile(e.target.files?.[0] || null)}
                  />
                </div>
                <div className="fg full">
                  <label className="lbl">Description</label>
                  <textarea
                    className="inp"
                    placeholder="What's included in this session..."
                    value={cf.desc}
                    onChange={setC("desc")}
                  />
                </div>
              </div>
              <button className="sbtn" onClick={addCamp}>
                {editingCampId ? "Update Camp Session →" : "Add Camp Session →"}
              </button>
              {editingCampId && (
                <button
                  className="delbtn"
                  style={{ marginTop: ".8rem" }}
                  onClick={resetCampForm}
                  type="button"
                >
                  Cancel Edit
                </button>
              )}
              {cDone && (
                <div className="ok-box">
                  <div style={{ fontSize: "1.4rem" }}>✅</div>
                  <strong>Camp session published!</strong>
                </div>
              )}
            </div>

            <h3 className="adm-section-title">
              All Camp Sessions ({camps.length})
            </h3>
            {!camps.length ? (
              <div className="empty">
                <div className="empty-i">☀️</div>
                <p>No camp sessions yet.</p>
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
                        ✏️ Edit
                      </button>
                      <select
                        className="ssel"
                        value={c.status}
                        onChange={(e) => changeStatusC(c.id, e.target.value)}
                      >
                        <option value="open">Open</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="full">Full</option>
                      </select>
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
              Camp Sign-Ups ({campRegs.length})
            </h3>
            {!campRegs.length ? (
              <div className="empty">
                <div className="empty-i">🏕</div>
                <p>No camp sign-ups yet.</p>
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
              Reviews ({adminReviews.length})
            </h3>
            {!adminReviews.length ? (
              <div className="empty">
                <div className="empty-i">⭐</div>
                <p>No reviews yet.</p>
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
                              showToast("✅ Approved!", "s");
                              await reloadRegs?.();
                            } catch (e) {
                              showToast(e.message || "Could not approve.", "e");
                            }
                          }}
                        >
                          Approve
                        </button>
                      )}
                      <button
                        className="delbtn"
                        onClick={async () => {
                          if (!confirm("Delete this review?")) return;
                          try {
                            await api(`/admin/reviews/${r.id}`, {
                              method: "DELETE",
                            });
                            showToast("Deleted.", "i");
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

      showToast("📸 Photo uploaded!", "s");
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
    if (!confirm("Delete this photo?")) return;
    try {
      await api(`/admin/gallery/${id}`, { method: "DELETE" });
      showToast("Deleted.", "i");
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
          📸 Upload New Photo
        </h3>
        <div className="fgrid">
          <div className="fg full">
            <label className="lbl">Photo *</label>
            <input
              className="inp"
              type="file"
              accept="image/*"
              onChange={onFileChange}
            />
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
            <label className="lbl">Caption *</label>
            <input
              className="inp"
              placeholder="e.g. Students at summer camp 2024"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          <div className="fg">
            <label className="lbl">Category</label>
            <select
              className="inp"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="camps">Summer Camps</option>
              <option value="lessons">Lessons</option>
              <option value="community">Community</option>
            </select>
          </div>
          <div className="fg">
            <label className="lbl">Tag (optional)</label>
            <input
              className="inp"
              placeholder="e.g. Summer Camp 2024"
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
          {uploading ? "⏳ Uploading..." : "Upload Photo →"}
        </button>
      </div>

      <h3 className="adm-section-title">Gallery Photos ({photos.length})</h3>
      {!photos.length ? (
        <div className="empty">
          <div className="empty-i">📸</div>
          <p>No photos uploaded yet.</p>
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
                src={p.imageUrl}
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
                  🗑 Delete
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
.gallery-hero{
  background:linear-gradient(135deg,#0B1624 0%,#102033 55%,#0E1D17 100%);
  padding:5rem 0 4rem;position:relative;overflow:hidden;
}
.gallery-hero::before{
  content:"";position:absolute;inset:0;
  background:radial-gradient(circle at 20% 30%,rgba(74,171,232,.16),transparent 32%),
             radial-gradient(circle at 80% 20%,rgba(31,168,94,.14),transparent 28%);
  pointer-events:none;
}
.gallery-hero-inner{
  width:100%;max-width:1200px;margin:0 auto;
  padding:0 2.5rem;position:relative;z-index:1;text-align:center;
}
.gallery-kicker{
  display:inline-block;font-size:.75rem;letter-spacing:2px;
  text-transform:uppercase;color:var(--green2);font-weight:700;margin-bottom:1rem;
}
.gallery-title{
  font-family:'Playfair Display',serif;font-size:clamp(2.4rem,4.5vw,4rem);
  line-height:1.08;color:#F4F8FC;margin-bottom:1rem;
}
.gallery-sub{
  max-width:700px;margin:0 auto;color:rgba(220,233,245,.78);line-height:1.8;font-size:1rem;
}
.gallery-hero-actions{margin-top:1.8rem;display:flex;justify-content:center;gap:.8rem;flex-wrap:wrap;}

.gallery-wrap{background:#F5F6F8;padding:3rem 0 4rem;}
.gallery-inner{width:100%;max-width:1200px;margin:0 auto;padding:0 2.5rem;}
.gallery-filters{
  display:flex;gap:.6rem;flex-wrap:wrap;justify-content:center;margin-bottom:2.5rem;
}
.gf-btn{
  background:#fff;border:1.5px solid #E2E8F0;border-radius:999px;
  padding:.5rem 1.2rem;font-family:'DM Sans',sans-serif;font-size:.85rem;
  font-weight:700;color:#3A4A5B;cursor:pointer;transition:.2s;
}
.gf-btn:hover{border-color:#2E7D5B;color:#2E7D5B;}
.gf-btn.on{background:#2E7D5B;border-color:#2E7D5B;color:#fff;}

.gallery-grid{
  columns:3;column-gap:1.1rem;
}
@media(max-width:900px){.gallery-grid{columns:2;}}
@media(max-width:550px){.gallery-grid{columns:1;}}

.gallery-item{
  break-inside:avoid;margin-bottom:1.1rem;
  border-radius:18px;overflow:hidden;
  position:relative;cursor:pointer;
  background:linear-gradient(135deg,#13263B,#0F3A28);
  border:1px solid #E2E8F0;
  box-shadow:0 8px 24px rgba(15,23,42,.07);
  transition:.28s;
}
.gallery-item:hover{transform:translateY(-5px);box-shadow:0 20px 44px rgba(15,23,42,.14);}
.gallery-item:hover .gallery-overlay{opacity:1;}
.gallery-item:hover .gallery-img{transform:scale(1.04);}

.gallery-img-wrap{overflow:hidden;width:100%;}
.gallery-img{
  width:100%;display:block;object-fit:cover;
  transition:transform .45s ease;
}

.gallery-placeholder{
  width:100%;display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  padding:2.5rem 1rem;text-align:center;
  min-height:180px;
  background:linear-gradient(135deg,#13263B,#0F3A28);
}
.gallery-placeholder-icon{font-size:3rem;margin-bottom:.6rem;}
.gallery-placeholder-label{
  font-size:.8rem;font-weight:700;color:rgba(220,233,245,.5);
  letter-spacing:1px;text-transform:uppercase;
}

.gallery-overlay{
  position:absolute;inset:0;
  background:linear-gradient(180deg,transparent 40%,rgba(9,19,30,.88) 100%);
  opacity:0;transition:.3s;
  display:flex;flex-direction:column;justify-content:flex-end;padding:1.2rem;
}
.gallery-overlay-tag{
  font-size:.7rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;
  color:var(--green2);margin-bottom:.3rem;
}
.gallery-overlay-caption{
  font-size:.92rem;font-weight:700;color:#EEF5FF;line-height:1.4;
}


.lightbox-inner{
  position:relative;max-width:900px;width:100%;
  display:flex;flex-direction:column;align-items:center;
}
.lightbox-img{
  width:100%;max-height:75vh;object-fit:contain;
  border-radius:14px;box-shadow:0 30px 80px rgba(0,0,0,.8);
}
.lightbox-placeholder{
  width:100%;min-height:300px;border-radius:14px;
  background:linear-gradient(135deg,#13263B,#0F3A28);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  font-size:5rem;
}
.lightbox-caption{
  margin-top:1.1rem;text-align:center;color:rgba(220,233,245,.85);font-size:.95rem;line-height:1.6;
}
.lightbox-tag{
  display:inline-block;font-size:.72rem;font-weight:700;letter-spacing:1px;
  text-transform:uppercase;color:var(--green2);
  background:rgba(31,168,94,.12);border:1px solid rgba(45,204,116,.25);
  padding:.25rem .7rem;border-radius:999px;margin-bottom:.5rem;
}
.lightbox-close{
  position:fixed;top:1.5rem;right:1.5rem;
  background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.2);
color:#EEF5FF;font-size:1.2rem;width:40px;height:40px;border-radius:50%;
  cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.18s;
  z-index:2001;box-shadow:0 4px 16px rgba(0,0,0,.4);
}
.lightbox-close:hover{background:rgba(255,255,255,.25);}
.lightbox-nav{
  display:flex;gap:1rem;margin-top:1.2rem;
}
.lightbox-nav-btn{
  background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);
  color:#EEF5FF;font-size:1.2rem;width:48px;height:48px;border-radius:50%;
  cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.18s;
}
.lightbox-nav-btn:hover{background:rgba(255,255,255,.18);}
.lightbox-counter{
  color:rgba(220,233,245,.5);font-size:.85rem;
  display:flex;align-items:center;padding:0 .5rem;
}
  .lightbox-ovl{
  position:fixed;inset:0;z-index:2000;
  background:rgba(0,0,0,.95);backdrop-filter:blur(18px);
  display:flex;align-items:center;justify-content:center;
  padding:1.5rem;animation:fu .2s ease;
  overflow:visible;
}

.gallery-cta{
  margin-top:3rem;background:linear-gradient(135deg,#12253B,#143524);
  border-radius:26px;padding:2rem;text-align:center;color:#EEF5FF;
}
.gallery-cta h3{font-family:'Playfair Display',serif;font-size:2rem;margin-bottom:.65rem;}
.gallery-cta p{color:rgba(220,233,245,.78);line-height:1.8;max-width:700px;margin:0 auto;}
.gallery-cta-actions{margin-top:1.3rem;display:flex;justify-content:center;gap:.8rem;flex-wrap:wrap;}

@media(max-width:850px){
  .gallery-hero-inner,.gallery-inner{padding-left:1.2rem;padding-right:1.2rem;}
}

/* ── 404 PAGE ── */
.notfound-pg{
  width:100%;min-height:100vh;
  display:flex;align-items:center;justify-content:center;
  background:linear-gradient(135deg,#09131E 0%,#0D1E2C 55%,#091A10 100%);
  position:relative;overflow:hidden;padding:8rem 2rem 4rem;
}
.notfound-pg::before{
  content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse at 68% 50%,rgba(21,122,69,.08) 0%,transparent 55%),
             radial-gradient(ellipse at 20% 75%,rgba(26,94,168,.1) 0%,transparent 50%);
}
.notfound-inner{
  position:relative;z-index:2;text-align:center;max-width:640px;margin:0 auto;
}
.notfound-board{
  display:grid;grid-template-columns:repeat(8,1fr);
  width:min(300px,75vw);margin:0 auto 2.5rem;
  border-radius:12px;overflow:hidden;
  box-shadow:0 24px 60px rgba(0,0,0,.7);
  opacity:.55;
}
.notfound-sq{aspect-ratio:1;}
.notfound-sq-l{background:#C8E6C0;}
.notfound-sq-d{background:#2D6A4F;}
.notfound-code{
  font-family:'Playfair Display',serif;
  font-size:clamp(5rem,18vw,9rem);
  font-weight:900;
  line-height:1;
  color:transparent;
  background:linear-gradient(135deg,var(--green2),var(--blue3));
  -webkit-background-clip:text;
  background-clip:text;
  margin-bottom:.5rem;
  animation:fu .6s ease both;
}
.notfound-title{
  font-family:'Playfair Display',serif;
  font-size:clamp(1.5rem,4vw,2.2rem);
  color:#EEF5FF;margin-bottom:1rem;
  animation:fu .6s ease .1s both;
}
.notfound-sub{
  color:rgba(180,210,240,.65);line-height:1.8;font-size:.97rem;
  margin-bottom:2rem;animation:fu .6s ease .2s both;
}
.notfound-piece{
  font-size:3.5rem;margin-bottom:1rem;
  display:block;animation:float 3s ease-in-out infinite;
}
.notfound-actions{
  display:flex;gap:.9rem;flex-wrap:wrap;justify-content:center;
  animation:fu .6s ease .3s both;
}
.notfound-links{
  margin-top:2.5rem;display:flex;gap:.5rem;flex-wrap:wrap;justify-content:center;
  animation:fu .6s ease .4s both;
}
.notfound-link{
  background:rgba(26,94,168,.09);border:1px solid var(--border);
  color:rgba(220,233,245,.7);font-family:'DM Sans',sans-serif;
  font-size:.82rem;font-weight:600;padding:.45rem 1rem;border-radius:999px;
  cursor:pointer;transition:.18s;
}
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

const GALLERY_CATS = [
  { id: "all", label: "All Photos" },
  { id: "camps", label: "Summer Camps" },
  { id: "lessons", label: "Lessons" },
  { id: "community", label: "Community" },
];

function GalleryPage({ onNav, onContact }) {
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
          <div className="gallery-kicker">Photo Gallery</div>
          <h1 className="gallery-title">Life at MyChessFamily</h1>
          <p className="gallery-sub">
            A look inside our lessons, summer camps, and the moments that make
            our chess community special. Real students. Real growth. Real
            memories.
          </p>
          <div className="gallery-hero-actions">
            <button className="btn btn-g" onClick={() => onNav("camp")}>
              ☀️ Join Summer Camp
            </button>
            <button
              className="btn btn-g"
              style={{ background: "rgba(74,171,232,.18)", color: "#EEF5FF" }}
              onClick={onContact}
            >
              ✉️ Contact Us
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
              ["500+", "Students Taught"],
              ["8+", "Years of Memories"],
              ["3", "Camps Per Year"],
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
              <p>Loading gallery...</p>
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
                No photos yet
              </h3>
              <p style={{ color: "#5C6B7C" }}>
                Photos will appear here once the admin uploads them.
              </p>
            </div>
          ) : (
            <div className="gallery-grid">
              {filtered.map((item, idx) => (
                <div
                  key={item.id}
                  className="gallery-item"
                  onClick={() => setLightbox(idx)}
                >
                  <div className="gallery-img-wrap">
                    <img
                      src={item.imageUrl}
                      alt={item.caption}
                      className="gallery-img"
                      loading="lazy"
                    />
                  </div>
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
            <h3>Be part of the MyChessFamily story</h3>
            <p>
              Every photo here represents a student who chose to learn, compete,
              and grow. Join us and create your own memories on the board.
            </p>
            <div className="gallery-cta-actions">
              <button className="btn btn-g" onClick={() => onNav("programs")}>
                ♟ View Programs
              </button>
              <button
                className="btn btn-g"
                style={{ background: "rgba(74,171,232,.18)", color: "#EEF5FF" }}
                onClick={() => onNav("camp")}
              >
                ☀️ Summer Camp
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
            <img
              src={current.imageUrl}
              alt={current.caption}
              className="lightbox-img"
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
  useEffect(() => {
    injectGalleryStyles();
  }, []);

  const quickLinks = [
    ["home", "🏠 Home"],
    ["programs", "♟ Programs"],
    ["camp", "☀️ Summer Camp"],
    ["team", "👥 Our Team"],
    ["gallery", "📸 Gallery"],
    ["reviews", "⭐ Reviews"],
    ["about", "ℹ️ About"],
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
        <div className="notfound-code">404</div>
        <h1 className="notfound-title">
          Looks like this page made an illegal move
        </h1>
        <p className="notfound-sub">
          The page you're looking for doesn't exist or has been moved. Don't
          worry — even grandmasters blunder sometimes. Let's get you back on the
          board.
        </p>

        <div className="notfound-actions">
          <button className="btn btn-g" onClick={() => onNav("home")}>
            ♔ Back to Home
          </button>
          <button
            className="btn btn-g"
            style={{ background: "rgba(74,171,232,.18)", color: "#EEF5FF" }}
            onClick={() => onNav("programs")}
          >
            ♟ View Programs
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
.contact-hero{
  background:linear-gradient(135deg,#0B1624 0%,#102033 55%,#0E1D17 100%);
  padding:5rem 0 4rem;position:relative;overflow:hidden;
}
.contact-hero::before{
  content:"";position:absolute;inset:0;
  background:
    radial-gradient(circle at 20% 30%,rgba(74,171,232,.16),transparent 32%),
    radial-gradient(circle at 80% 20%,rgba(31,168,94,.14),transparent 28%);
  pointer-events:none;
}
.contact-hero-inner{
  width:100%;max-width:1100px;margin:0 auto;
  padding:0 2.5rem;position:relative;z-index:1;text-align:center;
}
.contact-kicker{
  display:inline-block;font-size:.75rem;letter-spacing:2px;
  text-transform:uppercase;color:var(--green2);font-weight:700;margin-bottom:1rem;
}
.contact-hero-title{
  font-family:'Playfair Display',serif;
  font-size:clamp(2.4rem,4.5vw,4rem);
  line-height:1.08;color:#F4F8FC;margin-bottom:1rem;
}
.contact-hero-sub{
  max-width:640px;margin:0 auto;
  color:rgba(220,233,245,.78);line-height:1.8;font-size:1rem;
}
.contact-body{
  background:#F5F6F8;padding:4rem 0 5rem;
}
.contact-inner{
  width:100%;max-width:1100px;margin:0 auto;padding:0 2.5rem;
}
.contact-grid{
  display:grid;
  grid-template-columns:1fr 1.5fr;
  gap:2rem;
  align-items:start;
}
.contact-info{display:flex;flex-direction:column;gap:1.2rem;}
.contact-info-card{
  background:#fff;border:1px solid #E2E8F0;border-radius:20px;
  padding:1.5rem;box-shadow:0 10px 28px rgba(15,23,42,.05);
  display:flex;gap:1rem;align-items:flex-start;
}
.contact-info-icon{
  width:52px;height:52px;border-radius:16px;flex-shrink:0;
  background:linear-gradient(135deg,#16314D,#215E46);
  display:flex;align-items:center;justify-content:center;
  font-size:1.35rem;
}
.contact-info-label{
  font-size:.72rem;letter-spacing:1.5px;text-transform:uppercase;
  color:#5C6B7C;font-weight:700;margin-bottom:.3rem;
}
.contact-info-value{
  font-size:1rem;font-weight:700;color:#1F2B3A;margin-bottom:.2rem;
  word-break:break-word;
}
.contact-info-note{font-size:.83rem;color:#5C6B7C;line-height:1.5;}
.contact-social-card{
  background:#fff;border:1px solid #E2E8F0;border-radius:20px;
  padding:1.5rem;box-shadow:0 10px 28px rgba(15,23,42,.05);
}
.contact-social-title{
  font-size:.72rem;letter-spacing:1.5px;text-transform:uppercase;
  color:#5C6B7C;font-weight:700;margin-bottom:1rem;
}
.contact-social-row{display:flex;gap:.75rem;flex-wrap:wrap;}
.contact-social-btn{
  display:flex;align-items:center;gap:.55rem;
  padding:.65rem 1.1rem;border-radius:12px;
  border:1.5px solid #E2E8F0;background:#F8FAFC;
  color:#1F2B3A;font-family:'DM Sans',sans-serif;
  font-size:.85rem;font-weight:700;cursor:pointer;
  text-decoration:none;transition:.2s;
}
.contact-social-btn:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(15,23,42,.1);}
.contact-social-btn.ig:hover{background:#E1306C;border-color:#E1306C;color:#fff;}
.contact-social-btn.fb:hover{background:#1877F2;border-color:#1877F2;color:#fff;}
.contact-social-btn.li:hover{background:#0A66C2;border-color:#0A66C2;color:#fff;}
.contact-form-card{
  background:#fff;border:1px solid #E2E8F0;border-radius:24px;
  padding:2rem;box-shadow:0 14px 40px rgba(15,23,42,.06);
}
.contact-form-title{
  font-family:'Playfair Display',serif;font-size:1.7rem;
  color:#1F2B3A;margin-bottom:.4rem;
}
.contact-form-sub{color:#5C6B7C;font-size:.92rem;margin-bottom:1.6rem;line-height:1.6;}
.inp-light{
  width:100%;padding:.78rem 1rem;
  background:#F8FAFC;border:1.5px solid #E2E8F0;
  border-radius:10px;color:#1F2B3A;
  font-family:'DM Sans',sans-serif;font-size:.92rem;
  transition:.2s;outline:none;
}
.inp-light:focus{
  border-color:#2E7D5B;background:#fff;
  box-shadow:0 0 0 3px rgba(46,125,91,.1);
}
.inp-light::placeholder{color:#A0AEC0;}
select.inp-light option{background:#fff;color:#1F2B3A;}
textarea.inp-light{min-height:110px;resize:vertical;}
.fg-light{margin-bottom:1rem;}
.lbl-light{
  display:block;font-size:.8rem;font-weight:700;
  color:#3A4A5B;margin-bottom:.35rem;letter-spacing:.3px;
}
.fgrid-light{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}
@media(max-width:600px){.fgrid-light{grid-template-columns:1fr;}}
.contact-submit-btn{
  width:100%;padding:.82rem 1.75rem;margin-top:.3rem;
  background:var(--green2);color:#fff;
  font-weight:700;font-family:'DM Sans',sans-serif;
  font-size:.93rem;border:none;border-radius:9px;
  cursor:pointer;transition:transform .22s ease,box-shadow .28s ease;
  position:relative;overflow:hidden;
}
.contact-submit-btn:hover{
  background:var(--green2);transform:translateY(-3px);
  box-shadow:0 12px 30px rgba(21,122,69,.38),0 0 14px rgba(31,168,94,.28);
}
.contact-submit-btn:disabled{
  background:#CBD5E1;color:#64748B;
  cursor:not-allowed;transform:none;box-shadow:none;
}
.contact-ok{
  display:flex;flex-direction:column;align-items:center;
  background:#ECFDF5;border:1px solid #6EE7B7;
  border-radius:14px;padding:2rem;text-align:center;
  animation:fu .4s ease;
}
.contact-ok-icon{font-size:2.8rem;margin-bottom:.7rem;}
.contact-ok-title{
  font-family:'Playfair Display',serif;font-size:1.5rem;
  color:#065F46;margin-bottom:.5rem;
}
.contact-ok-sub{color:#047857;font-size:.92rem;line-height:1.6;}
.contact-cta{
  margin-top:2.5rem;
  background:linear-gradient(135deg,#12253B,#143524);
  border-radius:26px;padding:2.2rem;text-align:center;color:#EEF5FF;
}
.contact-cta h3{
  font-family:'Playfair Display',serif;font-size:1.9rem;margin-bottom:.6rem;
}
.contact-cta p{
  color:rgba(220,233,245,.78);line-height:1.8;
  max-width:650px;margin:0 auto;font-size:.95rem;
}
.contact-cta-actions{
  margin-top:1.3rem;display:flex;justify-content:center;gap:.8rem;flex-wrap:wrap;
}
@media(max-width:900px){
  .contact-grid{grid-template-columns:1fr;}
}
@media(max-width:850px){
  .contact-hero-inner,.contact-inner{padding-left:1.2rem;padding-right:1.2rem;}
}
`;

const injectContactStyles = () => {
  if (document.getElementById("mcf-contact-css")) return;
  const el = document.createElement("style");
  el.id = "mcf-contact-css";
  el.textContent = CONTACT_CSS;
  document.head.appendChild(el);
};

function ContactPage({ onNav, showToast }) {
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
      setErr("Please fill in all required fields.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(f.email)) {
      setErr("Please enter a valid email address.");
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
      showToast("✅ Message sent!", "s");
    } catch {
      setDone(true);
      showToast("✅ Message sent!", "s");
    } finally {
      setSending(false);
    }
  };

  const infoCards = [
    {
      icon: "📍",
      label: "Location",
      value: "New York City",
      note: "Serving all NYC boroughs and surrounding areas",
    },
    {
      icon: "✉️",
      label: "Email",
      value: "mychessfamily@gmail.com",
      note: "We reply within 24 hours",
      action: () => {
        navigator.clipboard
          ?.writeText("mychessfamily@gmail.com")
          .catch(() => {});
        showToast("📋 Email copied!", "s");
      },
      actionLabel: "Click to copy",
    },
    {
      icon: "⏰",
      label: "Hours",
      value: "Mon – Sat · 9AM – 7PM",
      note: "Eastern Time · Closed Sundays",
    },
    {
      icon: "📅",
      label: "Response Time",
      value: "Within 24 Hours",
      note: "Usually much faster during business hours",
    },
  ];

  return (
    <div className="pg" style={{ background: "#09131E" }}>
      <section className="contact-hero">
        <div className="contact-hero-inner">
          <div className="contact-kicker">Get In Touch</div>
          <h1 className="contact-hero-title">We'd Love to Hear From You</h1>
          <p className="contact-hero-sub">
            Have a question about our programs, camps, or private lessons? Fill
            out the form and we'll get back to you within 24 hours.
          </p>
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
                <div className="contact-social-title">Follow Us</div>
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
                <div className="contact-social-title">Quick Links</div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: ".55rem",
                  }}
                >
                  {[
                    ["programs", "♟ View Programs"],
                    ["camp", "☀️ Summer Camp"],
                    ["team", "👥 Meet Our Team"],
                    ["reviews", "⭐ Read Reviews"],
                  ].map(([p, l]) => (
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
                  <h2 className="contact-form-title">Send Us a Message</h2>
                  <p className="contact-form-sub">
                    Tell us about your child, what you're looking for, and any
                    questions you have. We'll personally get back to you with
                    the best options.
                  </p>

                  <div className="fgrid-light">
                    <div className="fg-light">
                      <label className="lbl-light">First Name *</label>
                      <input
                        className="inp-light"
                        placeholder="e.g. Alex"
                        value={f.fname}
                        onChange={set("fname")}
                      />
                    </div>
                    <div className="fg-light">
                      <label className="lbl-light">Last Name *</label>
                      <input
                        className="inp-light"
                        placeholder="e.g. Johnson"
                        value={f.lname}
                        onChange={set("lname")}
                      />
                    </div>
                  </div>

                  <div className="fgrid-light">
                    <div className="fg-light">
                      <label className="lbl-light">Email *</label>
                      <input
                        className="inp-light"
                        type="email"
                        placeholder="parent@email.com"
                        value={f.email}
                        onChange={set("email")}
                      />
                    </div>
                    <div className="fg-light">
                      <label className="lbl-light">Phone</label>
                      <input
                        className="inp-light"
                        type="tel"
                        placeholder="(212) 555-0000"
                        value={f.phone}
                        onChange={set("phone")}
                      />
                    </div>
                  </div>

                  <div className="fg-light">
                    <label className="lbl-light">I'm Interested In</label>
                    <select
                      className="inp-light"
                      value={f.program}
                      onChange={set("program")}
                    >
                      <option value="">Select a program (optional)</option>
                      <option>Private Lessons</option>
                      <option>School Chess Program</option>
                      <option>Summer Camp</option>
                      <option>Tournament Preparation</option>
                      <option>Team Training</option>
                      <option>General Inquiry</option>
                    </select>
                  </div>

                  <div className="fg-light">
                    <label className="lbl-light">Subject</label>
                    <input
                      className="inp-light"
                      placeholder="e.g. Question about summer camp pricing"
                      value={f.subject}
                      onChange={set("subject")}
                    />
                  </div>

                  <div className="fg-light">
                    <label className="lbl-light">Message *</label>
                    <textarea
                      className="inp-light"
                      placeholder="Tell us about your child's age, experience level, and what you're hoping to achieve..."
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
                    {sending ? "⏳ Sending..." : "Send Message →"}
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
                    By submitting this form you agree to be contacted about
                    MyChessFamily programs. We never share your information.
                  </p>
                </>
              ) : (
                <div className="contact-ok">
                  <div className="contact-ok-icon">🎉</div>
                  <div className="contact-ok-title">Message Received!</div>
                  <p className="contact-ok-sub">
                    Thank you for reaching out. We'll get back to you within 24
                    hours at <strong>{f.email}</strong>.
                    <br />
                    <br />
                    In the meantime, feel free to explore our programs or check
                    out our summer camp.
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
                      ♟ View Programs
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
                      Send Another
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="contact-cta">
            <h3>Ready to get started?</h3>
            <p>
              Join hundreds of NYC students who have grown in skill, confidence,
              and character through MyChessFamily. The first step is just a
              message away.
            </p>
            <div className="contact-cta-actions">
              <button className="btn btn-g" onClick={() => onNav("programs")}>
                ♟ Explore Programs
              </button>
              <button
                className="btn btn-g"
                style={{ background: "rgba(74,171,232,.18)", color: "#EEF5FF" }}
                onClick={() => onNav("camp")}
              >
                ☀️ Summer Camp
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
  const [contactOpen, setContactOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobile = useCallback(() => setMobileOpen((v) => !v), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

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
      showToast(
        "Using fallback local data. Start backend server for sync.",
        "e",
      );
    }
  }, [showToast]);

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
    showToast("👋 Logged out.", "i");
  };

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
          {[
            ["home", "Home"],
            ["programs", "Programs"],
            ["camp", "Summer Camp"],
            ["team", "Our Team"],
            ["gallery", "Gallery"],
            ["reviews", "Reviews"],
            ["about", "About"],
            ["contact", "Contact"],
          ].map(([p, l]) => (
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
          <button
            className={`nb cta${isAdmin ? " adm" : ""}`}
            onClick={() => (isAdmin ? go("admin") : go("login"))}
            type="button"
          >
            {isAdmin ? "Dashboard" : "Admin Login"}
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
          {[
            ["home", "Home"],
            ["programs", "Programs"],
            ["camp", "Summer Camp"],
            ["team", "Our Team"],
            ["gallery", "Gallery"],
            ["reviews", "Reviews"],
            ["about", "About"],
            ["contact", "Contact"],
          ].map(([p, l]) => (
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
            {isAdmin ? "Open Dashboard" : "Admin Login"}
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
