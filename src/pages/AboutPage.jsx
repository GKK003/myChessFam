import { useState } from "react";
import { useLang } from "../LangContext";
import { CONTACT } from "../constants";
import { Footer } from "../components";

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

export default function AboutPage({ onNav, onContact }) {
  const { t } = useLang();
  return (
    <div className="pg" style={{ background: "#F5F6F8" }}>
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
              style={{
                background: "rgba(31,168,94,.12)",
                color: "var(--green2)",
                border: "1.5px solid rgba(31,168,94,.35)",
              }}
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
      </section>
      <AboutFaqSection />
      <Footer onNav={onNav} onContact={onContact} />
    </div>
  );
}
