import { useState, useEffect, useCallback } from "react";

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

  const AUTH_KEY = "mcf_admin_token";

  const api = async (path, options = {}) => {
    const token = localStorage.getItem(AUTH_KEY);

    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    if (token) headers.Authorization = `Bearer ${token}`;

    const BASE = "https://mychessfam.onrender.com"; // ✅ backend URL
    const res = await fetch(`${BASE}/api${path}`, { ...options, headers });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Request failed");
    return data;
  };
  const res = await fetch(`${BASE}/api${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
};

const DEF_TOURNAMENTS = [
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

const fmtD = (d) =>
  new Date(d + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

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
.nav-links{display:flex;gap:2px;}
.nav-right{display:flex;align-items:center;gap:10px;}
.nb{background:none;border:none;color:var(--muted);font-family:'DM Sans',sans-serif;font-size:.875rem;font-weight:500;padding:.4rem .85rem;border-radius:7px;cursor:pointer;transition:.18s;white-space:nowrap;}
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
.btn-b{background:var(--blue);color:#fff;}
.btn-b:hover{background:var(--blue2);transform:translateY(-2px);box-shadow:0 8px 26px rgba(26,94,168,.45);}
.btn-ghost{background:transparent;color:var(--cream);border:2px solid rgba(180,210,240,.22);}
.btn-ghost:hover{border-color:var(--blue3);color:var(--blue3);transform:translateY(-2px);}
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
.g2{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:1.4rem;margin-top:2.2rem;}
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

/* ── TOURN CARD ── */
.tc{background:rgba(13,30,48,.85);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;transition:.28s;}
.tc:hover{transform:translateY(-4px);box-shadow:0 18px 55px rgba(0,0,0,.4);border-color:rgba(74,171,232,.35);}
.tc-head{padding:1.35rem;background:linear-gradient(135deg,var(--navy3),var(--navy4));border-bottom:1px solid var(--border);position:relative;}
.tc-head h3{font-family:'Playfair Display',serif;font-size:1.18rem;margin-bottom:.32rem;padding-right:72px;color:#EEF5FF;}
.tc-date{color:var(--green3);font-size:.8rem;font-weight:600;}
.bdg{position:absolute;top:.9rem;right:.9rem;padding:.22rem .7rem;border-radius:100px;font-size:.66rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;}
.bdg-open{background:var(--green);color:#fff;}
.bdg-up{background:rgba(74,171,232,.2);color:var(--blue3);border:1px solid var(--blue3);}
.bdg-full{background:rgba(220,53,69,.18);color:#fc8181;border:1px solid #fc8181;}
.tc-body{padding:1.35rem;}
.tc-meta{display:grid;grid-template-columns:1fr 1fr;gap:.85rem;margin-bottom:1.1rem;}
.tm-l{font-size:.7rem;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:.18rem;}
.tm-v{font-size:.88rem;font-weight:600;color:var(--cream);}
.tc-desc{color:var(--muted);font-size:.86rem;line-height:1.6;margin-bottom:1.1rem;}

/* ── ACTION BTN ── */
.abtn{width:100%;padding:.78rem;background:var(--green);color:#fff;font-weight:700;font-family:'DM Sans',sans-serif;border:none;border-radius:8px;cursor:pointer;font-size:.9rem;transition:.2s;}
.abtn:hover{background:var(--green2);transform:translateY(-1px);}
.abtn:disabled{background:rgba(255,255,255,.07);color:rgba(180,210,240,.3);cursor:not-allowed;transform:none;}

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

/* ── FORMS ── */
.fbox{background:rgba(13,30,48,.8);border:1px solid var(--border);border-radius:18px;padding:2.2rem;}
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
.tgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(195px,1fr));gap:1.3rem;margin-top:2.2rem;}
.tcard{text-align:center;background:rgba(26,94,168,.07);border:1px solid var(--border);border-radius:var(--r);padding:1.8rem 1.3rem;transition:.28s;}
.tcard:hover{border-color:rgba(45,204,116,.35);transform:translateY(-4px);}
.tav{width:66px;height:66px;border-radius:50%;margin:0 auto .85rem;display:flex;align-items:center;justify-content:center;font-size:1.8rem;background:linear-gradient(135deg,var(--navy3),var(--navy4));border:2px solid var(--green);}
.tcard h4{font-weight:700;margin-bottom:.18rem;color:#EEF5FF;}
.tcard .role{font-size:.8rem;color:var(--muted);}
.tcard .bio{font-size:.81rem;color:var(--muted);margin-top:.65rem;line-height:1.5;}

/* ── FOOTER ── */
.footer{width:100vw;background:#060F18;border-top:1px solid var(--border);padding:3rem 2.5rem;text-align:center;color:var(--muted);font-size:.86rem;}
.f-logo{font-family:'Playfair Display',serif;font-size:1.65rem;color:var(--green3);margin-bottom:.85rem;}
.f-links{display:flex;justify-content:center;gap:2rem;margin:1.1rem 0;flex-wrap:wrap;}
.flnk{color:var(--muted);text-decoration:none;cursor:pointer;transition:.18s;background:none;border:none;font-family:'DM Sans',sans-serif;font-size:.86rem;padding:0;}
.flnk:hover{color:var(--green3);}

/* ── MISC ── */
.chip{display:inline-block;background:rgba(21,122,69,.12);border:1px solid var(--borderg);color:var(--green3);font-size:.7rem;font-weight:600;padding:.18rem .62rem;border-radius:100px;margin:.18rem;}
hr{border:none;border-top:1px solid var(--border);margin:1.8rem 0;}
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

function Footer({ onNav }) {
  return (
    <footer className="footer">
      <div className="f-logo">♔ MyChessFamily</div>
      <div className="f-links">
        {[
          ["home", "Home"],
          ["tournaments", "Tournaments"],
          ["camp", "Summer Camp"],
          ["about", "About"],
        ].map(([p, l]) => (
          <button key={p} className="flnk" onClick={() => onNav(p)}>
            {l}
          </button>
        ))}
      </div>
      <p>
        📍 New York City &nbsp;·&nbsp; 📞 (212) 555-0182 &nbsp;·&nbsp; ✉
        info@mychessfamily.org
      </p>
      <p style={{ marginTop: ".7rem" }}>
        © 2025 MyChessFamily. All rights reserved.
      </p>
    </footer>
  );
}

/* Registration modal – shared by tournaments & camps */
function RegModal({ item, type, onClose, showToast, onRegistered }) {
  const [f, setF] = useState({
    fname: "",
    lname: "",
    age: "",
    skill: "",
    parent: "",
    email: "",
    phone: "",
    notes: "",
    dob: "",
    level: "",
    emergency: "",
    medical: "",
  });
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async () => {
    const base = !f.fname || !f.lname || !f.parent || !f.email || !f.phone;
    const tournExtra = type === "tournament" && (!f.age || !f.skill);
    const campExtra = type === "camp" && (!f.dob || !f.level);

    if (base || tournExtra || campExtra) {
      showToast("Please fill in all required fields.", "e");
      return;
    }

    try {
      if (type === "tournament") {
        await api("/registrations/tournament", {
          method: "POST",
          body: JSON.stringify({
            tournId: item.id,
            tournName: item.name,
            childName: `${f.fname} ${f.lname}`,
            age: f.age,
            skill: f.skill,
            parent: f.parent,
            email: f.email,
            phone: f.phone,
            notes: f.notes || "—",
          }),
        });
      } else {
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
      }

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
        <h3>
          {type === "tournament" ? "Register: " : "Sign Up: "}
          {item.name}
        </h3>

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

              {type === "tournament" && (
                <>
                  <div className="fg">
                    <label className="lbl">Age *</label>
                    <select className="inp" value={f.age} onChange={set("age")}>
                      <option value="">Select age</option>
                      {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((a) => (
                        <option key={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                  <div className="fg">
                    <label className="lbl">Skill Level *</label>
                    <select
                      className="inp"
                      value={f.skill}
                      onChange={set("skill")}
                    >
                      <option value="">Select level</option>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                </>
              )}

              {type === "camp" && (
                <>
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
                    <select
                      className="inp"
                      value={f.level}
                      onChange={set("level")}
                    >
                      <option value="">Select level</option>
                      <option>Never played before</option>
                      <option>Knows the basics</option>
                      <option>Plays regularly</option>
                      <option>Tournament player</option>
                    </select>
                  </div>
                </>
              )}

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

              {type === "camp" && (
                <>
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
                </>
              )}

              {type === "tournament" && (
                <div className="fg full">
                  <label className="lbl">Notes</label>
                  <textarea
                    className="inp"
                    placeholder="Any notes for the organizer..."
                    value={f.notes}
                    onChange={set("notes")}
                  />
                </div>
              )}
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
function HomePage({ onNav }) {
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
              <button className="btn btn-g" onClick={() => onNav("camp")}>
                ☀️ Join Summer Camp
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => onNav("tournaments")}
              >
                🏆 View Tournaments
              </button>
            </div>
            <div className="stats">
              <div className="stat">
                <div className="stat-n">500+</div>
                <div className="stat-l">Young Players</div>
              </div>
              <div className="stat">
                <div className="stat-n">12</div>
                <div className="stat-l">Tournaments/Year</div>
              </div>
              <div className="stat">
                <div className="stat-n">8+</div>
                <div className="stat-l">Years Running</div>
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
              desc: "Structured lessons from beginner to advanced. Our USCF-certified coaches guide kids through openings, tactics, endgames, and competitive strategy.",
              tag: "Ages 6–16 · All Levels",
            },
            {
              icon: "🏆",
              title: "Tournaments",
              desc: "Monthly rated and friendly tournaments in a safe, exciting environment. Kids compete, earn ratings, and experience the thrill of real competition.",
              tag: "Monthly Events",
            },
            {
              icon: "☀️",
              title: "Summer Chess Camp",
              desc: "Intensive week-long camps featuring chess mastery, team challenges, and tons of fun. Full-day and half-day options available!",
              tag: "June – August",
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
              desc: "Studies show chess players improve in math, reading, and concentration — skills that transfer directly to the classroom.",
            },
            {
              icon: "🤝",
              title: "Sportsmanship",
              desc: "Win or lose gracefully. Chess instills respect, patience, and resilience in every young competitor.",
            },
            {
              icon: "🌟",
              title: "Confidence",
              desc: "Every improvement, every win, every creative move builds self-esteem and pride in young players.",
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

      <Footer onNav={onNav} />
    </div>
  );
}

function TournamentsPage({ tournaments, onNav, showToast, onRegistered }) {
  const [modal, setModal] = useState(null);

  return (
    <div className="pg">
      <div className="ph">
        <div className="slbl">Competitive Play</div>
        <h1 className="stit">Upcoming Tournaments</h1>
        <p className="ph-sub">
          Register your child for our rated and friendly tournaments. Open to
          all skill levels!
        </p>
      </div>

      <div className="wrap" style={{ paddingTop: "3rem" }}>
        {!tournaments.length ? (
          <div className="empty">
            <div className="empty-i">🏆</div>
            <p>No tournaments scheduled yet. Check back soon!</p>
          </div>
        ) : (
          <div className="g2">
            {tournaments.map((t) => (
              <div className="tc" key={t.id}>
                <div className="tc-head">
                  <Badge status={t.status} />
                  <h3>{t.name}</h3>
                  <div className="tc-date">📅 {fmtD(t.date)}</div>
                </div>
                <div className="tc-body">
                  <div className="tc-meta">
                    <div>
                      <div className="tm-l">Location</div>
                      <div className="tm-v">📍 {t.location}</div>
                    </div>
                    <div>
                      <div className="tm-l">Age Group</div>
                      <div className="tm-v">👦 {t.age}</div>
                    </div>
                    <div>
                      <div className="tm-l">Format</div>
                      <div className="tm-v">♟ {t.format}</div>
                    </div>
                    <div>
                      <div className="tm-l">Entry Fee</div>
                      <div className="tm-v">💵 ${t.fee}</div>
                    </div>
                  </div>
                  <p className="tc-desc">{t.desc}</p>
                  <button
                    className="abtn"
                    disabled={t.status === "full"}
                    onClick={() => setModal(t)}
                  >
                    {t.status === "full"
                      ? "Registration Closed"
                      : t.status === "upcoming"
                        ? "Pre-Register"
                        : "Register Now"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <RegModal
          item={modal}
          type="tournament"
          onClose={() => setModal(null)}
          showToast={showToast}
          onRegistered={onRegistered}
        />
      )}

      <Footer onNav={onNav} />
    </div>
  );
}

function CampPage({ camps, onNav, showToast, onRegistered }) {
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
                <div className="cc-body">
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
        <RegModal
          item={modal}
          type="camp"
          onClose={() => setModal(null)}
          showToast={showToast}
          onRegistered={onRegistered}
        />
      )}

      <Footer onNav={onNav} />
    </div>
  );
}

function AboutPage({ onNav }) {
  return (
    <div className="pg">
      <div className="ph">
        <div className="slbl">Our Story</div>
        <h1 className="stit">About MyChessFamily</h1>
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
              Over 8 years, we've grown from a small after-school program into
              one of New York's most beloved youth chess organizations, teaching
              hundreds of kids each year to think strategically, compete
              gracefully, and grow into confident young adults.
            </p>
            <p style={{ color: "var(--muted)", lineHeight: 1.8 }}>
              Our coaches are USCF-certified and passionate about youth
              development. We believe chess is for every child — from
              first-timers to future grandmasters.
            </p>
            <div style={{ marginTop: "1.3rem" }}>
              {[
                "📍 New York City",
                "🎓 USCF Certified",
                "🏆 State Champions",
                "👶 Ages 6–16",
              ].map((c) => (
                <span className="chip" key={c}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: "4.5rem" }}>
          <div className="slbl">Our Team</div>
          <h2 className="stit">Meet the Coaches</h2>
          <div className="tgrid">
            {[
              {
                av: "♔",
                name: "David Karpov",
                role: "Head Coach · USCF Expert",
                bio: "10+ years coaching youth chess. Loves teaching endgames.",
              },
              {
                av: "♕",
                name: "Sophia Chen",
                role: "Junior Coach · USCF Class A",
                bio: "Former state scholastic champion. Specializes in beginners.",
              },
              {
                av: "♗",
                name: "Marcus Williams",
                role: "Tournament Director",
                bio: "Runs all our tournaments. Keeps things fun and fair.",
              },
              {
                av: "♘",
                name: "Aisha Patel",
                role: "Camp Coordinator",
                bio: "Designs our summer camp experience. Makes every week unforgettable.",
              },
            ].map((c) => (
              <div className="tcard" key={c.name}>
                <div className="tav">{c.av}</div>
                <h4>{c.name}</h4>
                <div className="role">{c.role}</div>
                <div className="bio">{c.bio}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer onNav={onNav} />
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
          Sign in to manage tournaments, camps, and view all registrations.
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
  tournaments,
  setTournaments,
  camps,
  setCamps,
  tournRegs,
  campRegs,
  onLogout,
  showToast,
}) {
  const [tab, setTab] = useState("tournaments");

  const [tf, setTf] = useState({
    name: "",
    date: "",
    loc: "",
    age: "All Ages (6–16)",
    format: "Swiss System",
    max: "",
    fee: "",
    status: "open",
    desc: "",
  });
  const setT = (k) => (e) => setTf((p) => ({ ...p, [k]: e.target.value }));
  const [tDone, setTDone] = useState(false);

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

  const addTournament = async () => {
    if (!tf.name || !tf.date || !tf.loc) {
      showToast("Fill Name, Date & Location.", "e");
      return;
    }

    try {
      const data = await api("/admin/tournaments", {
        method: "POST",
        body: JSON.stringify({
          name: tf.name,
          date: tf.date,
          location: tf.loc,
          age: tf.age,
          format: tf.format,
          max: parseInt(tf.max) || 32,
          fee: parseInt(tf.fee) || 0,
          status: tf.status,
          desc: tf.desc || "Registration open!",
        }),
      });

      setTournaments(data.tournaments);
      setTDone(true);
      setTimeout(() => setTDone(false), 3000);

      setTf({
        name: "",
        date: "",
        loc: "",
        age: "All Ages (6–16)",
        format: "Swiss System",
        max: "",
        fee: "",
        status: "open",
        desc: "",
      });

      showToast("✅ Tournament published!", "s");
    } catch (error) {
      showToast(error.message || "Could not add tournament.", "e");
    }
  };

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

  const changeStatusT = async (id, status) => {
    try {
      const data = await api(`/admin/tournaments/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setTournaments(data.tournaments);
      showToast("Status updated!", "s");
    } catch (error) {
      showToast(error.message || "Could not update status.", "e");
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

  const delT = async (id) => {
    if (!confirm("Delete this tournament?")) return;
    try {
      const data = await api(`/admin/tournaments/${id}`, { method: "DELETE" });
      setTournaments(data.tournaments);
      showToast("Deleted.", "i");
    } catch (error) {
      showToast(error.message || "Could not delete tournament.", "e");
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
            { n: tournaments.length, l: "Tournaments" },
            { n: camps.length, l: "Camp Sessions" },
            { n: tournRegs.length, l: "Tournament Regs" },
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
            ["tournaments", "🏆 Manage Tournaments"],
            ["camps", "☀️ Manage Camps"],
            ["tourregs", "📋 Tournament Regs"],
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

        {tab === "tournaments" && (
          <>
            <div className="add-form">
              <h3
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "1.25rem",
                  marginBottom: "1.3rem",
                }}
              >
                ➕ Add New Tournament
              </h3>

              <div className="fgrid">
                <div className="fg full">
                  <label className="lbl">Tournament Name *</label>
                  <input
                    className="inp"
                    placeholder="e.g. Spring Open 2025"
                    value={tf.name}
                    onChange={setT("name")}
                  />
                </div>

                <div className="fg">
                  <label className="lbl">Date *</label>
                  <input
                    className="inp"
                    type="date"
                    value={tf.date}
                    onChange={setT("date")}
                  />
                </div>

                <div className="fg">
                  <label className="lbl">Location *</label>
                  <input
                    className="inp"
                    placeholder="e.g. Chess Club HQ"
                    value={tf.loc}
                    onChange={setT("loc")}
                  />
                </div>

                <div className="fg">
                  <label className="lbl">Age Group</label>
                  <select className="inp" value={tf.age} onChange={setT("age")}>
                    <option>All Ages (6–16)</option>
                    <option>Juniors (6–10)</option>
                    <option>Intermediates (11–13)</option>
                    <option>Seniors (14–16)</option>
                  </select>
                </div>

                <div className="fg">
                  <label className="lbl">Format</label>
                  <select
                    className="inp"
                    value={tf.format}
                    onChange={setT("format")}
                  >
                    <option>Swiss System</option>
                    <option>Round Robin</option>
                    <option>Knockout</option>
                    <option>Rapid</option>
                    <option>Blitz</option>
                  </select>
                </div>

                <div className="fg">
                  <label className="lbl">Max Participants</label>
                  <input
                    className="inp"
                    type="number"
                    placeholder="32"
                    value={tf.max}
                    onChange={setT("max")}
                  />
                </div>

                <div className="fg">
                  <label className="lbl">Entry Fee ($)</label>
                  <input
                    className="inp"
                    type="number"
                    placeholder="25"
                    value={tf.fee}
                    onChange={setT("fee")}
                  />
                </div>

                <div className="fg">
                  <label className="lbl">Status</label>
                  <select
                    className="inp"
                    value={tf.status}
                    onChange={setT("status")}
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
                    placeholder="Brief description..."
                    value={tf.desc}
                    onChange={setT("desc")}
                  />
                </div>
              </div>

              <button className="sbtn" onClick={addTournament}>
                Add Tournament →
              </button>

              {tDone && (
                <div className="ok-box">
                  <div style={{ fontSize: "1.4rem" }}>✅</div>
                  <strong>Tournament published!</strong>
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
              All Tournaments ({tournaments.length})
            </h3>

            {!tournaments.length ? (
              <div className="empty">
                <div className="empty-i">🏆</div>
                <p>No tournaments yet.</p>
              </div>
            ) : (
              tournaments.map((t) => {
                const rc = tournRegs.filter((r) => r.tournId === t.id).length;
                return (
                  <div className="ei" key={t.id}>
                    <div style={{ flex: 1 }}>
                      <div className="ei-name">{t.name}</div>
                      <div className="ei-meta">
                        📅 {fmtDShort(t.date)} · 📍 {t.location} · 👦 {t.age} ·
                        💵 ${t.fee} · ♟ {t.format} · 📝 {rc} reg
                        {rc !== 1 ? "s" : ""}
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
                        value={t.status}
                        onChange={(e) => changeStatusT(t.id, e.target.value)}
                      >
                        <option value="open">Open</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="full">Full</option>
                      </select>
                      <button className="delbtn" onClick={() => delT(t.id)}>
                        🗑
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}

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
                        sign-up
                        {rc !== 1 ? "s" : ""}
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

        {tab === "tourregs" && (
          <>
            <h3
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "1.15rem",
                marginBottom: ".9rem",
              }}
            >
              Tournament Registrations ({tournRegs.length})
            </h3>

            {!tournRegs.length ? (
              <div className="empty">
                <div className="empty-i">📋</div>
                <p>No tournament registrations yet.</p>
              </div>
            ) : (
              <div className="twrap">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Date</th>
                      <th>Child</th>
                      <th>Age</th>
                      <th>Level</th>
                      <th>Tournament</th>
                      <th>Parent</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tournRegs.map((r, i) => (
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
                        <td>{r.age}</td>
                        <td>
                          <span className="chip">{r.skill}</span>
                        </td>
                        <td style={{ fontSize: ".83rem" }}>{r.tournName}</td>
                        <td>{r.parent}</td>
                        <td style={{ fontSize: ".8rem" }}>{r.email}</td>
                        <td style={{ fontSize: ".8rem" }}>{r.phone}</td>
                        <td
                          style={{ fontSize: ".8rem", color: "var(--muted)" }}
                        >
                          {r.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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

/* ══════════════════════════════════════════
   ROOT
══════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("home");
  const [isAdmin, setIsAdmin] = useState(
    () => !!localStorage.getItem(AUTH_KEY),
  );
  const [toasts, setToasts] = useState([]);

  const [tournaments, setTournaments] = useState(DEF_TOURNAMENTS);
  const [camps, setCamps] = useState(DEF_CAMPS);

  const [tournRegs, setTournRegs] = useState([]);
  const [campRegs, setCampRegs] = useState([]);

  useEffect(() => {
    injectStyles();
  }, []);

  const showToast = useCallback((msg, type = "i") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const loadPublicData = useCallback(async () => {
    try {
      const data = await api("/bootstrap");
      setTournaments(data.tournaments || []);
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
      setTournRegs(data.tournamentRegs || []);
      setCampRegs(data.campRegs || []);
    } catch {
      setIsAdmin(false);
      localStorage.removeItem(AUTH_KEY);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      loadPublicData();
    }, 0);
  }, [loadPublicData]);

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
      if (p === "admin" && !isAdmin) {
        setPage("login");
        return;
      }
      setPage(p);
      window.scrollTo(0, 0);
    },
    [isAdmin],
  );

  const handleLogin = async () => {
    setIsAdmin(true);
    setPage("admin");
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
    setTournRegs([]);
    setCampRegs([]);
    setPage("home");
    showToast("👋 Logged out.", "i");
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#09131E" }}>
      <nav className="nav">
        <div className="nav-logo" onClick={() => go("home")}>
          ♔ MyChessFamily
        </div>
        <div className="nav-links">
          {[
            ["home", "Home"],
            ["tournaments", "Tournaments"],
            ["camp", "Summer Camp"],
            ["about", "About"],
          ].map(([p, l]) => (
            <button
              key={p}
              className={`nb${page === p ? " on" : ""}`}
              onClick={() => go(p)}
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
          >
            {isAdmin ? "Dashboard" : "Admin Login"}
          </button>
        </div>
      </nav>

      {page === "home" && <HomePage onNav={go} />}

      {page === "tournaments" && (
        <TournamentsPage
          tournaments={tournaments}
          onNav={go}
          showToast={showToast}
          onRegistered={loadAdminData}
        />
      )}

      {page === "camp" && (
        <CampPage
          camps={camps}
          onNav={go}
          showToast={showToast}
          onRegistered={loadAdminData}
        />
      )}

      {page === "about" && <AboutPage onNav={go} />}

      {page === "login" && (
        <LoginPage onLogin={handleLogin} showToast={showToast} />
      )}

      {page === "admin" && (
        <AdminPage
          tournaments={tournaments}
          setTournaments={setTournaments}
          camps={camps}
          setCamps={setCamps}
          tournRegs={tournRegs}
          campRegs={campRegs}
          onLogout={handleLogout}
          showToast={showToast}
        />
      )}

      <Toast toasts={toasts} />
    </div>
  );
}
