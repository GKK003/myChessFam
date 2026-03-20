import { useState } from "react";
import { useLang } from "../LangContext";
import { CONTACT } from "../constants";
import { Footer } from "../components";

export default function ProgramsPage({ onNav, onContact }) {
  const { t } = useLang();

  const PROGRAMS = t.programs.programs.map((p, i) => ({
    ...p,
    icon: [
      "/images/schoolprogramsicon.webp",
      "/images/privateicon.webp",
      "/images/tournamentpreparation.webp",
      "/images/teamtrain.webp",
      "/images/chesscamps.webp",
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
              style={{
                background: "rgba(31,168,94,.12)",
                color: "var(--green2)",
                border: "1.5px solid rgba(31,168,94,.35)",
              }}
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
              style={{
                background: "rgba(31,168,94,.12)",
                color: "var(--green2)",
                border: "1.5px solid rgba(31,168,94,.35)",
              }}
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
