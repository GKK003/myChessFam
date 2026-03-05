import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Routes,
  Route,
  Navigate,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";

/* ══════════════════════════════════════════
      API
══════════════════════════════════════════ */
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

/* ══════════════════════════════════════════
   CONTENT / SETTINGS (good practice: centralize)
══════════════════════════════════════════ */
const CONTACT = {
  city: "New York City",
  phoneDisplay: "(212) 555-0182",
  phoneLink: "+12125550182",
  email: "info@mychessfamily.org",
};

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
];

const PIECES = {
  0: ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
  1: ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
  6: ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
  7: ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
};

const fmtDShort = (d) =>
  new Date(d + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

/* ══════════════════════════════════════════
   STYLES
══════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:100%;overflow-x:hidden;scroll-behavior:smooth;}
body{font-family:'DM Sans',sans-serif;background:#09131E;color:#DCE9F5;}
:root{
  --navy:#09131E;--navy2:#0D1E30;--navy3:#122540;--navy4:#183050;
  --blue:#1A5EA8;--blue2:#2272CC;--blue3:#4AABE8;
  --green:#157A45;--green2:#1FA85E;--green3:#2DCC74;
  --cream:#DCE9F5;--muted:rgba(180,210,240,0.6);
  --border:rgba(74,171,232,0.18);--borderg:rgba(45,204,116,0.2);
  --r:13px;
}

/* ── NAV ── */
.nav{position:fixed;top:0;left:0;width:100%;z-index:999;height:66px;display:flex;align-items:center;justify-content:space-between;padding:0 2.5rem;background:rgba(9,19,30,0.97);border-bottom:1px solid var(--border);backdrop-filter:blur(18px);}
.nav-logo{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:900;color:var(--green3);cursor:pointer;display:flex;align-items:center;gap:8px;white-space:nowrap;text-decoration:none;}
.nav-links{display:flex;gap:2px;flex-wrap:wrap;}
.nav-right{display:flex;align-items:center;gap:10px;}
.nb{background:none;border:none;color:var(--muted);font-family:'DM Sans',sans-serif;font-size:.875rem;font-weight:500;padding:.4rem .85rem;border-radius:7px;cursor:pointer;transition:.18s;white-space:nowrap;text-decoration:none;display:inline-flex;align-items:center;}
.nb:hover,.nb.on{color:var(--blue3);background:rgba(74,171,232,0.1);}
.nb.cta{background:var(--green);color:#fff;font-weight:700;padding:.4rem 1.1rem;}
.nb.cta:hover{background:var(--green2);}
.nb.cta.adm{background:rgba(21,122,69,0.22);color:var(--green3);border:1px solid rgba(45,204,116,0.35);}
.nb.cta.adm:hover{background:rgba(21,122,69,0.38);}
.adm-dot{font-size:.78rem;color:var(--green3);font-weight:600;}

/* ── PAGE BASE ── */
.pg{width:100%;min-height:100vh;padding-top:66px;}

/* ── HERO ── */
.hero{width:100%;min-height:calc(100vh - 66px);display:flex;align-items:center;background:linear-gradient(135deg,#09131E 0%,#0D1E2C 55%,#091A10 100%);position:relative;overflow:hidden;}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 68% 50%,rgba(21,122,69,.1) 0%,transparent 55%),radial-gradient(ellipse at 20% 75%,rgba(26,94,168,.12) 0%,transparent 50%);}
.hero-bg{position:absolute;inset:0;display:grid;grid-template-columns:repeat(8,1fr);grid-template-rows:repeat(8,1fr);opacity:.04;pointer-events:none;}
.hero-bg div{background:var(--blue3);}
.hero-bg div:nth-child(even){background:transparent;}
.hero-inner{position:relative;z-index:2;width:100%;max-width:1320px;margin:0 auto;padding:3rem 2.5rem;display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;}
.hero-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(45,204,116,.1);border:1px solid rgba(45,204,116,.38);color:var(--green3);font-size:.73rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:.32rem .95rem;border-radius:100px;margin-bottom:1.35rem;animation:fu .6s ease both;}
.hero h1{font-family:'Playfair Display',serif;font-size:clamp(2.3rem,4.8vw,4.2rem);font-weight:900;line-height:1.07;margin-bottom:1.3rem;animation:fu .6s ease .1s both;}
.hero h1 em{color:var(--green3);font-style:normal;}
.hero-sub{font-size:1.02rem;color:var(--muted);line-height:1.78;margin-bottom:2rem;animation:fu .6s ease .2s both;}
.hero-btns{display:flex;gap:.9rem;flex-wrap:wrap;animation:fu .6s ease .3s both;}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-top:2rem;animation:fu .6s ease .45s both;}
.stat{background:rgba(26,94,168,.1);border:1px solid var(--border);border-radius:11px;padding:1rem;text-align:center;}
.stat-n{font-family:'Playfair Display',serif;font-size:1.9rem;font-weight:900;color:var(--green3);}
.stat-l{font-size:.75rem;color:var(--muted);margin-top:1px;}

/* ── BOARD ── */
.board-wrap{animation:fu .6s ease .2s both;position:relative;}
.board-wrap::after{content:'';position:absolute;inset:-7px;border-radius:18px;background:linear-gradient(135deg,var(--green),var(--blue2),var(--green3),var(--blue3));z-index:-1;opacity:.45;}
.mboard{display:grid;grid-template-columns:repeat(8,1fr);border-radius:11px;overflow:hidden;box-shadow:0 28px 70px rgba(0,0,0,.7);}
.sq{aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:clamp(.8rem,2vw,1.75rem);}
.sq-l{background:#C8E6C0;}.sq-d{background:#2D6A4F;}

/* ── BTN ── */
.btn{display:inline-flex;align-items:center;gap:6px;font-family:'DM Sans',sans-serif;font-size:.93rem;font-weight:700;padding:.82rem 1.75rem;border-radius:9px;border:none;cursor:pointer;transition:.22s;}
.btn-g{background:var(--green);color:#fff;}
.btn-g:hover{background:var(--green2);transform:translateY(-2px);box-shadow:0 8px 26px rgba(21,122,69,.45);}
.btn-w{width:100%;justify-content:center;}

/* ── SECTIONS ── */
.wrap{width:100%;max-width:1320px;margin:0 auto;padding:4.5rem 2.5rem;}
.slbl{font-size:.72rem;letter-spacing:3px;text-transform:uppercase;color:var(--green3);font-weight:700;margin-bottom:.55rem;}
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
.prog::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--green);}
.prog:nth-child(2)::before{background:var(--blue3);}
.prog:nth-child(3)::before{background:var(--green3);}
.prog:hover{transform:translateY(-5px);box-shadow:0 18px 55px rgba(0,0,0,.4);border-color:rgba(74,171,232,.3);}
.prog-icon{font-size:2.2rem;margin-bottom:.85rem;}
.prog h3{font-family:'Playfair Display',serif;font-size:1.3rem;margin-bottom:.65rem;}
.prog p{color:var(--muted);line-height:1.65;font-size:.91rem;}
.prog-tag{display:inline-block;margin-top:.85rem;background:rgba(21,122,69,.14);color:var(--green3);font-size:.7rem;font-weight:700;letter-spacing:1px;padding:.22rem .7rem;border-radius:100px;}

/* ── WHY GRID ── */
.why{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1.8rem;margin-top:1.8rem;}
.why-i .wi{font-size:1.8rem;margin-bottom:.65rem;}
.why-i h4{font-weight:700;margin-bottom:.38rem;color:var(--cream);}
.why-i p{color:var(--muted);font-size:.88rem;line-height:1.65;}

/* ── CAMP CARD ── */
.cc{background:rgba(21,122,69,.08);border:1px solid var(--borderg);border-radius:18px;overflow:hidden;transition:.28s;}
.cc:hover{transform:translateY(-5px);box-shadow:0 18px 55px rgba(21,122,69,.18);border-color:rgba(45,204,116,.38);}
.cc-top{height:140px;display:flex;align-items:center;justify-content:center;font-size:4rem;position:relative;background:linear-gradient(135deg,#081A0F,#0D3320);}
.cc-tbdg{position:absolute;top:.85rem;right:.85rem;background:var(--green2);color:#fff;font-size:.65rem;font-weight:700;padding:.22rem .65rem;border-radius:100px;}
.cc-body{padding:1.4rem;}
.cc-body h3{font-family:'Playfair Display',serif;font-size:1.15rem;color:#EEF5FF;margin-bottom:.3rem;}
.cc-sub{color:var(--muted);font-size:.83rem;margin-bottom:.5rem;}
.cc-price{font-family:'Playfair Display',serif;font-size:1.8rem;color:var(--green3);font-weight:900;margin:.5rem 0;}
.cc-price span{font-size:.85rem;color:var(--muted);font-family:'DM Sans',sans-serif;font-weight:400;}
.cc-desc{color:var(--muted);font-size:.85rem;line-height:1.6;margin-bottom:1.1rem;}

/* ── STATUS BADGE ── */
.bdg{position:absolute;top:.9rem;right:.9rem;padding:.22rem .7rem;border-radius:100px;font-size:.66rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;}
.bdg-open{background:var(--green);color:#fff;}
.bdg-up{background:rgba(74,171,232,.2);color:var(--blue3);border:1px solid var(--blue3);}
.bdg-full{background:rgba(220,53,69,.18);color:#fc8181;border:1px solid #fc8181;}

/* ── ACTION BTN ── */
.abtn{width:100%;padding:.78rem;background:var(--green);color:#fff;font-weight:700;font-family:'DM Sans',sans-serif;border:none;border-radius:8px;cursor:pointer;font-size:.9rem;transition:.2s;}
.abtn:hover{background:var(--green2);transform:translateY(-1px);}
.abtn:disabled{background:rgba(255,255,255,.07);color:rgba(180,210,240,.3);cursor:not-allowed;transform:none;}

/* ── FORMS ── */
.fgrid{display:grid;grid-template-columns:1fr 1fr;gap:.9rem;}
.fg{margin-bottom:.9rem;}
.fg.full{grid-column:1/-1;}
.lbl{display:block;font-size:.8rem;font-weight:600;color:rgba(180,210,240,.85);margin-bottom:.32rem;letter-spacing:.3px;}
.inp{width:100%;padding:.72rem .95rem;background:rgba(26,94,168,.09);border:1.5px solid rgba(74,171,232,.18);border-radius:8px;color:var(--cream);font-family:'DM Sans',sans-serif;font-size:.91rem;transition:.2s;outline:none;}
.inp:focus{border-color:var(--green3);background:rgba(21,122,69,.09);box-shadow:0 0 0 3px rgba(45,204,116,.12);}
.inp::placeholder{color:rgba(180,210,240,.22);}
select.inp option{background:#0D1E30;}
textarea.inp{min-height:85px;resize:vertical;}
.sbtn{width:100%;padding:.95rem;background:var(--green);color:#fff;font-weight:700;font-family:'DM Sans',sans-serif;font-size:.97rem;border:none;border-radius:9px;cursor:pointer;transition:.22s;margin-top:.25rem;}
.sbtn:hover{background:var(--green2);transform:translateY(-2px);box-shadow:0 8px 26px rgba(21,122,69,.45);}
.ok-box{display:flex;flex-direction:column;align-items:center;background:rgba(21,122,69,.14);border:1px solid var(--green2);border-radius:10px;padding:1.3rem;text-align:center;margin-top:.85rem;animation:fu .4s ease;}
.err-box{background:rgba(220,53,69,.1);border:1px solid rgba(220,53,69,.28);border-radius:8px;padding:.65rem .95rem;color:#fc8181;font-size:.86rem;margin-top:.85rem;}

/* ── MODAL ── */
.ovl{position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.88);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:1rem;}
.modal{background:#0C1C2E;border:1px solid var(--border);border-radius:18px;padding:2.2rem;max-width:530px;width:100%;max-height:92vh;overflow-y:auto;animation:fu .3s ease;}
.modal h3{font-family:'Playfair Display',serif;font-size:1.5rem;margin-bottom:1.3rem;color:#EEF5FF;}
.mcls{float:right;background:none;border:none;color:var(--muted);font-size:1.55rem;cursor:pointer;line-height:1;margin:-3px 0 0;}
.mcls:hover{color:var(--cream);}

/* ── ADMIN ── */
.login-box{max-width:430px;margin:4rem auto;background:rgba(13,30,48,.85);border:1px solid var(--border);border-radius:18px;padding:2.3rem;text-align:center;}
.adm-wrap{width:100%;max-width:1200px;margin:0 auto;padding:2rem 2.5rem 4rem;}
.adm-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:1rem;margin-bottom:2rem;}
.atabs{display:flex;gap:6px;margin-bottom:1.8rem;border-bottom:1px solid rgba(74,171,232,.12);padding-bottom:.85rem;flex-wrap:wrap;}
.atab{background:none;border:none;color:var(--muted);font-family:'DM Sans',sans-serif;font-size:.875rem;font-weight:600;padding:.42rem .95rem;cursor:pointer;border-radius:7px;transition:.18s;}
.atab.on{background:rgba(21,122,69,.14);color:var(--green3);}
.add-form{background:rgba(13,30,48,.8);border:1px solid var(--border);border-radius:14px;padding:1.8rem;margin-bottom:1.8rem;}
.ei{background:rgba(26,94,168,.07);border:1px solid var(--border);border-radius:10px;padding:.95rem 1.3rem;margin-bottom:.7rem;display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;}
.ei-name{font-weight:600;margin-bottom:.22rem;color:#EEF5FF;}
.ei-meta{font-size:.8rem;color:var(--muted);}
.delbtn{background:rgba(220,53,69,.14);border:1px solid rgba(220,53,69,.28);color:#fc8181;border-radius:7px;padding:.38rem .75rem;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:.8rem;transition:.18s;flex-shrink:0;}
.delbtn:hover{background:rgba(220,53,69,.26);}
.ssel{padding:.33rem .58rem;font-size:.76rem;border-radius:6px;background:rgba(26,94,168,.14);border:1px solid var(--border);color:var(--cream);cursor:pointer;font-family:'DM Sans',sans-serif;}

/* ── TABLE ── */
.twrap{overflow-x:auto;margin-top:.9rem;}
table{width:100%;border-collapse:collapse;font-size:.85rem;}
th{background:rgba(26,94,168,.14);color:var(--blue3);text-align:left;padding:.65rem .95rem;font-size:.7rem;letter-spacing:1px;text-transform:uppercase;white-space:nowrap;}
td{padding:.72rem .95rem;border-bottom:1px solid rgba(74,171,232,.07);color:rgba(180,210,240,.85);vertical-align:middle;}
tr:hover td{background:rgba(26,94,168,.07);}
.empty{text-align:center;padding:2.5rem;color:var(--muted);}
.empty-i{font-size:2.3rem;margin-bottom:.6rem;}

/* ── ABOUT ── */
.about-g{display:grid;grid-template-columns:1fr 1fr;gap:3.5rem;align-items:center;}
.about-vis{background:linear-gradient(135deg,var(--navy3),var(--navy4));border-radius:18px;padding:2.5rem;text-align:center;border:1px solid var(--border);}
.apc{font-size:3.8rem;line-height:1.6;}

/* ── TEAM ── */
.tgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(195px,1fr));gap:1.3rem;margin-top:2.2rem;}
.tcard{text-align:center;background:rgba(26,94,168,.07);border:1px solid var(--border);border-radius:var(--r);padding:1.8rem 1.3rem;transition:.28s;position:relative;overflow:hidden;}
.tcard::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--green3),var(--blue3));opacity:.9;}
.tcard:hover{border-color:rgba(45,204,116,.35);transform:translateY(-4px);box-shadow:0 18px 55px rgba(0,0,0,.35);}
.tav{width:66px;height:66px;border-radius:50%;margin:0 auto .85rem;display:flex;align-items:center;justify-content:center;font-size:1.8rem;background:linear-gradient(135deg,var(--navy3),var(--navy4));border:2px solid var(--green);}
.tcard h4{font-weight:700;margin-bottom:.18rem;color:#EEF5FF;}
.tcard .role{font-size:.8rem;color:var(--muted);}
.tcard .bio{font-size:.81rem;color:var(--muted);margin-top:.65rem;line-height:1.5;}
.tagrow{display:flex;flex-wrap:wrap;gap:.35rem;justify-content:center;margin-top:.85rem;}
.tag{font-size:.68rem;font-weight:700;letter-spacing:.5px;color:rgba(220,233,245,.9);background:rgba(45,204,116,.12);border:1px solid rgba(45,204,116,.22);padding:.18rem .5rem;border-radius:999px;}

/* ── FOOTER ── */
.footer{width:100vw;background:#060F18;border-top:1px solid var(--border);padding:3rem 2.5rem;text-align:center;color:var(--muted);font-size:.86rem;}
.f-logo{font-family:'Playfair Display',serif;font-size:1.65rem;color:var(--green3);margin-bottom:.85rem;}
.f-links{display:flex;justify-content:center;gap:2rem;margin:1.1rem 0;flex-wrap:wrap;}
.flnk{color:var(--muted);text-decoration:none;cursor:pointer;transition:.18s;background:none;border:none;font-family:'DM Sans',sans-serif;font-size:.86rem;padding:0;}
.flnk:hover{color:var(--green3);}

/* ── MISC ── */
.chip{display:inline-block;background:rgba(21,122,69,.12);border:1px solid var(--borderg);color:var(--green3);font-size:.7rem;font-weight:600;padding:.18rem .62rem;border-radius:100px;margin:.18rem;}
.toast{position:fixed;bottom:1.8rem;right:1.8rem;z-index:2000;background:#0C1C2E;border-radius:11px;padding:.95rem 1.4rem;font-size:.88rem;font-weight:600;display:flex;align-items:center;gap:.65rem;box-shadow:0 10px 38px rgba(0,0,0,.55);animation:toastIn .4s cubic-bezier(.34,1.56,.64,1);max-width:310px;}
.toast-s{border:1px solid var(--green2);color:var(--green3);}
.toast-e{border:1px solid #fc8181;color:#fc8181;}
.toast-i{border:1px solid var(--border);color:var(--cream);}

@keyframes fu{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
@keyframes toastIn{from{opacity:0;transform:translateY(100%);}to{opacity:1;transform:translateY(0);}}

@media(max-width:850px){
  .hero-inner{grid-template-columns:1fr;}
  .board-wrap{display:none;}
  .about-g{grid-template-columns:1fr;}
  .fgrid{grid-template-columns:1fr;}
  .fg.full{grid-column:1;}
  .nav{padding:0 1rem;}
  .nb{padding:.38rem .5rem;font-size:.8rem;}
  .wrap{padding:3rem 1.2rem;}
  .adm-wrap{padding:1.5rem 1.2rem 3rem;}
}
`;

const injectStyles = () => {
  if (document.getElementById("mcf-css")) return;
  const el = document.createElement("style");
  el.id = "mcf-css";
  el.textContent = CSS;
  document.head.appendChild(el);
};

/* ══════════════════════════════════════════
   SMALL SHARED COMPONENTS
══════════════════════════════════════════ */
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
              {piece || ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Footer({ onContact }) {
  const navigate = useNavigate();
  const onNav = (p) => {
    navigate(p);
    window.scrollTo(0, 0);
  };

  return (
    <footer className="footer">
      <div className="f-logo">♔ MyChessFamily</div>

      <div className="f-links">
        {[
          ["/", "Home"],
          ["/summercamp", "Summer Camp"],
          ["/about", "About"],
          ["/team", "Our Team"],
        ].map(([p, l]) => (
          <button key={p} className="flnk" onClick={() => onNav(p)}>
            {l}
          </button>
        ))}
        <button className="flnk" onClick={onContact}>
          Contact
        </button>
      </div>

      <p>
        📍 {CONTACT.city} &nbsp;·&nbsp; 📞 {CONTACT.phoneDisplay} &nbsp;·&nbsp;
        ✉ {CONTACT.email}
      </p>
      <p style={{ marginTop: ".7rem" }}>
        © 2025 MyChessFamily. All rights reserved.
      </p>
    </footer>
  );
}

/* Contact popup modal */
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
          <a
            href={`tel:${CONTACT.phoneLink}`}
            className="inp"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
            onClick={() => showToast("📞 Opening dialer…", "i")}
          >
            <span>📞 {CONTACT.phoneDisplay}</span>
            <span style={{ color: "var(--muted)", fontSize: ".85rem" }}>
              Tap to call
            </span>
          </a>

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
            For fastest response, email us. If you call and we miss it, we’ll
            call you back.
          </div>
        </div>
      </div>
    </div>
  );
}

/* Camp Registration modal (camp-only) */
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
    const base = !f.fname || !f.lname || !f.parent || !f.email || !f.phone;
    const campExtra = !f.dob || !f.level;

    if (base || campExtra) {
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

/* ══════════════════════════════════════════
   PAGES
══════════════════════════════════════════ */
function HomePage({ onContact }) {
  const navigate = useNavigate();
  const nav = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

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
              Join MyChessFamily — New York&apos;s premier chess club for young
              minds. We build strategy, confidence, and lasting friendships
              through the timeless game of chess.
            </p>

            <div className="hero-btns">
              <button className="btn btn-g" onClick={() => nav("/summercamp")}>
                ☀️ Join Summer Camp
              </button>
              <button
                className="btn btn-g"
                style={{ background: "var(--navy3)" }}
                onClick={() => nav("/team")}
              >
                ♟ Meet Our Team
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

      <div className="wrap">
        <div className="slbl">What We Offer</div>
        <h2 className="stit">
          Programs for Every Young
          <br />
          Chess Enthusiast
        </h2>

        <div className="g3">
          {[
            {
              icon: "♟",
              title: "Weekly Classes",
              desc: "Structured lessons from beginner to advanced. Our coaches guide kids through openings, tactics, endgames, and strategy.",
              tag: "Ages 6–16 · All Levels",
            },
            {
              icon: "☀️",
              title: "Summer Chess Camp",
              desc: "Intensive week-long camps featuring chess mastery, team challenges, and tons of fun. Full-day and half-day options available!",
              tag: "June – August",
            },
            {
              icon: "🧩",
              title: "Puzzles & Training",
              desc: "Improve calculation and pattern recognition with fun puzzles and guided practice activities.",
              tag: "All Skill Levels",
            },
          ].map((p, i) => (
            <div className="prog" key={i}>
              <div className="prog-icon">{p.icon}</div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <div className="prog-tag">{p.tag}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="sdiv" />

      <div className="wrap" style={{ paddingTop: "3rem" }}>
        <div className="slbl">Why Chess?</div>
        <h2 className="stit">
          Chess Builds More Than
          <br />
          Just Game Skills
        </h2>

        <div className="why">
          {[
            {
              icon: "🧠",
              title: "Critical Thinking",
              desc: "Chess teaches kids to think ahead, evaluate options, and make thoughtful decisions under pressure.",
            },
            {
              icon: "📚",
              title: "Academic Performance",
              desc: "Chess players often improve in focus, reading, and math skills — great for the classroom.",
            },
            {
              icon: "🤝",
              title: "Sportsmanship",
              desc: "Win or lose gracefully. Chess builds respect, patience, and resilience.",
            },
            {
              icon: "🌟",
              title: "Confidence",
              desc: "Every improvement builds self-esteem and pride in young players.",
            },
          ].map((w, i) => (
            <div className="why-i" key={i}>
              <div className="wi">{w.icon}</div>
              <h4>{w.title}</h4>
              <p>{w.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer onContact={onContact} />
    </div>
  );
}

function CampPage({ camps, showToast, onRegistered, onContact }) {
  const [modal, setModal] = useState(null);

  return (
    <div className="pg">
      <div
        className="ph"
        style={{
          background:
            "linear-gradient(180deg,rgba(21,122,69,.1) 0%,transparent 100%)",
        }}
      >
        <div className="slbl" style={{ color: "var(--green3)" }}>
          Summer Programs
        </div>
        <h1 className="stit">Summer Chess Camps</h1>
        <p className="ph-sub">
          An unforgettable week of chess mastery, fun challenges, and new
          friendships in the heart of New York City!
        </p>
      </div>

      <div className="wrap" style={{ paddingTop: "3rem" }}>
        {!camps.length ? (
          <div className="empty">
            <div className="empty-i">☀️</div>
            <p>No camp sessions scheduled yet. Check back soon!</p>
          </div>
        ) : (
          <div className="g3">
            {camps.map((c) => (
              <div className="cc" key={c.id}>
                <div className="cc-top">
                  <span style={{ fontSize: "3.5rem" }}>☀️</span>
                  <span className="cc-tbdg">{c.type}</span>
                </div>

                <div className="cc-body" style={{ position: "relative" }}>
                  <Badge status={c.status} />
                  <h3 style={{ marginTop: ".5rem" }}>{c.name}</h3>
                  <div className="cc-sub">
                    📅 {fmtDShort(c.dateStart)} – {fmtDShort(c.dateEnd)}
                  </div>
                  <div className="cc-sub">
                    📍 {c.location} · 👦 {c.age}
                  </div>
                  <div className="cc-price">
                    ${c.price} <span>/ child</span>
                  </div>
                  <p className="cc-desc">{c.desc}</p>

                  <button
                    className="abtn"
                    disabled={c.status === "full"}
                    onClick={() => setModal(c)}
                  >
                    {c.status === "full"
                      ? "Registration Closed"
                      : c.status === "upcoming"
                        ? "Pre-Register"
                        : "Sign Up Now"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <CampRegModal
          item={modal}
          onClose={() => setModal(null)}
          showToast={showToast}
          onRegistered={onRegistered}
        />
      )}

      <Footer onContact={onContact} />
    </div>
  );
}

function AboutPage({ onContact }) {
  const navigate = useNavigate();
  const nav = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <div className="pg">
      <div className="ph">
        <div className="slbl">Our Story</div>
        <h1 className="stit">About MyChessFamily</h1>
        <p className="ph-sub">
          A youth chess community built on learning, confidence, and real
          friendships.
        </p>
      </div>

      <div className="wrap">
        <div className="about-g">
          <div className="about-vis">
            <div className="apc">
              ♔ ♕ ♖<br />♗ ♘ ♙<br />♛ ♚ ♜
            </div>
            <p
              style={{
                marginTop: "1.4rem",
                color: "var(--muted)",
                fontSize: ".88rem",
                fontStyle: "italic",
              }}
            >
              "Chess is the gymnasium of the mind."
            </p>
            <p
              style={{
                color: "var(--green3)",
                fontSize: ".78rem",
                marginTop: ".38rem",
              }}
            >
              — Blaise Pascal
            </p>
          </div>

          <div>
            <h2
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "2rem",
                marginBottom: "1.3rem",
              }}
            >
              Founded With a Purpose
            </h2>
            <p
              style={{
                color: "var(--muted)",
                lineHeight: 1.8,
                marginBottom: "1rem",
              }}
            >
              MyChessFamily was founded in 2016 in New York City with a simple
              but powerful mission: to give every child, regardless of
              background, access to the transformative game of chess.
            </p>
            <p
              style={{
                color: "var(--muted)",
                lineHeight: 1.8,
                marginBottom: "1rem",
              }}
            >
              Over the years, we&apos;ve grown from a small after-school program
              into one of New York&apos;s most beloved youth chess
              organizations—teaching hundreds of kids each year to think
              strategically, compete gracefully, and grow into confident young
              adults.
            </p>
            <p style={{ color: "var(--muted)", lineHeight: 1.8 }}>
              Our coaches are passionate about youth development. Chess is for
              every child — from first-timers to future grandmasters.
            </p>

            <div style={{ marginTop: "1.3rem" }}>
              {["📍 New York City", "🎓 Certified Coaches", "👶 Ages 6–16"].map(
                (c) => (
                  <span className="chip" key={c}>
                    {c}
                  </span>
                ),
              )}
            </div>

            <div
              style={{
                marginTop: "1.6rem",
                display: "flex",
                gap: ".8rem",
                flexWrap: "wrap",
              }}
            >
              <button
                className="btn btn-g"
                style={{ background: "var(--navy3)" }}
                onClick={() => nav("/team")}
              >
                ♟ Meet Our Team
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
        </div>
      </div>

      <Footer onContact={onContact} />
    </div>
  );
}

/* ✅ Our Team Page */
function TeamPage({ onContact }) {
  const navigate = useNavigate();
  const nav = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <div className="pg">
      <div
        className="ph"
        style={{
          background:
            "linear-gradient(180deg,rgba(45,204,116,.08) 0%,transparent 100%)",
        }}
      >
        <div className="slbl" style={{ color: "var(--green3)" }}>
          The People Behind The Program
        </div>
        <h1 className="stit">Our Team</h1>
        <p className="ph-sub">
          Coaches who teach chess skills—and the confidence to use them.
        </p>
      </div>

      <div className="wrap" style={{ paddingTop: "3rem" }}>
        <div style={{ marginTop: "4.5rem" }}>
          <div className="slbl">Meet the Coaches</div>
          <h2 className="stit">Friendly, Professional, Focused</h2>
          <div className="sdiv" style={{ marginTop: "1.2rem" }} />

          <div className="tgrid">
            {TEAM.map((c) => (
              <div className="tcard" key={c.name}>
                <div className="tav">{c.av}</div>
                <h4>{c.name}</h4>
                <div className="role">{c.role}</div>
                <div className="bio">{c.bio}</div>
                <div className="tagrow">
                  {c.tags.map((t) => (
                    <span className="tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "2.3rem",
              background: "rgba(26,94,168,.07)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: "1.6rem",
              display: "grid",
              gap: ".9rem",
            }}
          >
            <div style={{ fontWeight: 700, color: "#EEF5FF" }}>
              Want to talk to a coach?
            </div>
            <div
              style={{
                color: "var(--muted)",
                lineHeight: 1.7,
                fontSize: ".92rem",
              }}
            >
              Ask about the right class level, camp schedule, or tournament
              preparation. We’ll help you choose what fits your child best.
            </div>
            <div style={{ display: "flex", gap: ".8rem", flexWrap: "wrap" }}>
              <button className="btn btn-g" onClick={onContact}>
                ✉️ Contact Us
              </button>
              <button
                className="btn btn-g"
                style={{ background: "rgba(45,204,116,.18)", color: "#EEF5FF" }}
                onClick={() => nav("/summercamp")}
              >
                ☀️ View Camps
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer onContact={onContact} />
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
    <div className="pg">
      <div className="login-box" style={{ marginTop: "4rem" }}>
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
          <strong style={{ color: "var(--green3)" }}>admin</strong> /{" "}
          <strong style={{ color: "var(--green3)" }}>chess123</strong>
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
  onLogout,
  showToast,
}) {
  const [tab, setTab] = useState("camps");

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
  });
  const setC = (k) => (e) => setCf((p) => ({ ...p, [k]: e.target.value }));
  const [cDone, setCDone] = useState(false);

  const revenue = campRegs.reduce((s, r) => s + (r.price || 0), 0);

  const addCamp = async () => {
    if (!cf.name || !cf.dateStart || !cf.dateEnd || !cf.loc) {
      showToast("Fill Name, Dates & Location.", "e");
      return;
    }

    try {
      const data = await api("/admin/camps", {
        method: "POST",
        body: JSON.stringify({
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
        }),
      });

      setCamps(data.camps);
      setCDone(true);
      setTimeout(() => setCDone(false), 3000);

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
      });

      showToast("✅ Camp session published!", "s");
    } catch (error) {
      showToast(error.message || "Could not add camp session.", "e");
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
                fontSize: "2rem",
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
                ➕ Add New Camp Session
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
                Add Camp Session →
              </button>

              {cDone && (
                <div className="ok-box">
                  <div style={{ fontSize: "1.4rem" }}>✅</div>
                  <strong>Camp session published!</strong>
                </div>
              )}
            </div>

            <h3
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "1.15rem",
                marginBottom: ".9rem",
              }}
            >
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
                    <div style={{ flex: 1 }}>
                      <div className="ei-name">{c.name}</div>
                      <div className="ei-meta">
                        📅 {fmtDShort(c.dateStart)} – {fmtDShort(c.dateEnd)} ·
                        📍 {c.location} · {c.type} · 💵 ${c.price} · 📝 {rc}{" "}
                        sign-up{rc !== 1 ? "s" : ""}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: ".5rem",
                        flexShrink: 0,
                        alignItems: "center",
                      }}
                    >
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
            <h3
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "1.15rem",
                marginBottom: ".9rem",
              }}
            >
              Camp Sign-Ups ({campRegs.length})
            </h3>

            {!campRegs.length ? (
              <div className="empty">
                <div className="empty-i">🏕</div>
                <p>No camp sign-ups yet.</p>
              </div>
            ) : (
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
                              r.medical === "None" ? "var(--muted)" : "#fc8181",
                          }}
                        >
                          {r.medical}
                        </td>
                        <td style={{ color: "var(--green3)", fontWeight: 700 }}>
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
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* Route guard */
function RequireAdmin({ isAdmin, children }) {
  if (!isAdmin) return <Navigate to="/login" replace />;
  return children;
}

/* ══════════════════════════════════════════
   ROOT (Router)
══════════════════════════════════════════ */
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isAdmin, setIsAdmin] = useState(
    () => !!localStorage.getItem(AUTH_KEY),
  );
  const [toasts, setToasts] = useState([]);

  const [camps, setCamps] = useState(DEF_CAMPS);
  const [campRegs, setCampRegs] = useState([]);

  // Contact popup state
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    injectStyles();
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
    } catch {
      setIsAdmin(false);
      localStorage.removeItem(AUTH_KEY);
    }
  }, []);

  // Load public data once (and keep your fallback)
  useEffect(() => {
    setTimeout(() => {
      loadPublicData();
    }, 0);
  }, [loadPublicData]);

  // ✅ Better practice: only poll admin registrations when user is on /admin
  const isOnAdminRoute = useMemo(
    () => location.pathname.startsWith("/admin"),
    [location.pathname],
  );

  useEffect(() => {
    if (!isAdmin || !isOnAdminRoute) return;

    setTimeout(() => {
      loadAdminData();
    }, 0);

    const interval = setInterval(() => {
      loadAdminData();
    }, 10000);

    return () => clearInterval(interval);
  }, [isAdmin, isOnAdminRoute, loadAdminData]);

  const handleLogin = async () => {
    setIsAdmin(true);
    navigate("/admin", { replace: true });
    await loadAdminData();
  };

  const handleLogout = async () => {
    try {
      await api("/admin/logout", { method: "POST" });
    } catch {
      // ignore
    }
    localStorage.removeItem(AUTH_KEY);
    setIsAdmin(false);
    setCampRegs([]);
    navigate("/", { replace: true });
    showToast("👋 Logged out.", "i");
  };

  const navLinkClass = ({ isActive }) => `nb${isActive ? " on" : ""}`;

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#09131E" }}>
      <nav className="nav">
        <div
          className="nav-logo"
          onClick={() => (navigate("/"), window.scrollTo(0, 0))}
        >
          ♔ MyChessFamily
        </div>

        <div className="nav-links">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/summercamp" className={navLinkClass}>
            Summer Camp
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
          <NavLink to="/team" className={navLinkClass}>
            Our Team
          </NavLink>

          {/* Contact after Our Team */}
          <button className="nb" onClick={openContact}>
            Contact
          </button>
        </div>

        <div className="nav-right">
          {isAdmin && <span className="adm-dot">● Admin</span>}
          <button
            className={`nb cta${isAdmin ? " adm" : ""}`}
            onClick={() => {
              if (isAdmin) {
                navigate("/admin");
              } else {
                navigate("/login");
              }
              window.scrollTo(0, 0);
            }}
          >
            {isAdmin ? "Dashboard" : "Admin Login"}
          </button>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage onContact={openContact} />} />
        <Route
          path="/summercamp"
          element={
            <CampPage
              camps={camps}
              showToast={showToast}
              onRegistered={loadAdminData}
              onContact={openContact}
            />
          }
        />
        <Route path="/about" element={<AboutPage onContact={openContact} />} />
        <Route path="/team" element={<TeamPage onContact={openContact} />} />
        <Route
          path="/login"
          element={<LoginPage onLogin={handleLogin} showToast={showToast} />}
        />

        <Route
          path="/admin"
          element={
            <RequireAdmin isAdmin={isAdmin}>
              <AdminPage
                camps={camps}
                setCamps={setCamps}
                campRegs={campRegs}
                reloadRegs={loadAdminData}
                onLogout={handleLogout}
                showToast={showToast}
              />
            </RequireAdmin>
          }
        />

        {/* Optional: redirect old internal routes if you ever used them */}
        <Route path="/camp" element={<Navigate to="/summercamp" replace />} />
        <Route path="/team-page" element={<Navigate to="/team" replace />} />

        {/* 404 -> home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {contactOpen && (
        <ContactModal onClose={closeContact} showToast={showToast} />
      )}

      <Toast toasts={toasts} />
    </div>
  );
}
