import { useState, useEffect } from "react";
import { useLang } from "../LangContext";
import { CONTACT } from "../constants";
import { Footer } from "../components";

function Stars({ rating = 0 }) {
  const r = Math.max(0, Math.min(5, Number(rating) || 0));
  return (
    <span style={{ letterSpacing: 1 }}>
      {"★★★★★".slice(0, r)}
      <span style={{ opacity: 0.25 }}>{"★★★★★".slice(r)}</span>
    </span>
  );
}

export default function ReviewsPage({ reviews, openModal, onNav, onContact }) {
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
      </div>
      <Footer onNav={onNav} onContact={onContact} />
    </div>
  );
}
