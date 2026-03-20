import { useState, useEffect } from "react";
import { useLang } from "../LangContext";
import { fmtDShort, getImageSrc, DEF_CAMPS } from "../constants";
import { Footer, CampRegModal, Badge } from "../components";

export default function CampPage({
  camps,
  onNav,
  showToast,
  onRegistered,
  onContact,
}) {
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
