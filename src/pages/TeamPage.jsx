import { useLang } from "../LangContext";
import { CONTACT, TEAM } from "../constants";
import { Footer } from "../components";

export default function TeamPage({ onNav, onContact }) {
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
      <div className="pg" style={{ background: "#F5F6F8" }}>
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
                style={{
                  background: "rgba(31,168,94,.12)",
                  color: "var(--green2)",
                  border: "1.5px solid rgba(31,168,94,.35)",
                }}
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
                    background: "rgba(31,168,94,.12)",
                    color: "var(--green2)",
                    border: "1.5px solid rgba(31,168,94,.35)",
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
