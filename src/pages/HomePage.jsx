import { useState, useEffect, useCallback } from "react";
import { useLang } from "../LangContext";
import {
  SOCIALS,
  CONTACT,
  fmtDShort,
  getImageSrc,
  DEF_CAMPS,
} from "../constants";
import { Footer, ContactModal, Badge } from "../components";

export default function HomePage({ onNav, onContact }) {
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
          <div style={{ position: "relative" }}>
            {/* background knight chess piece */}
            <div className="hero-knight">♞</div>
            <div style={{ position: "relative", zIndex: 1 }}>
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
                  style={{
                    background: "rgba(31,168,94,.12)",
                    color: "var(--green2)",
                    border: "1px solid rgba(31,168,94,.3)",
                  }}
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
          </div>
          <div className="hero-img-wrap hc-wrap">
            {/* dashed ring behind main */}
            <div className="hc-ring" />
            {/* big circle — center left */}
            <div className="hc-main">
              <img
                src="https://res.cloudinary.com/dlouyotx5/image/upload/v1773468259/mychessfamily/gallery/1773468258807-img_8432.jpg"
                alt="Chess class"
                loading="eager"
              />
            </div>
            {/* top-right small */}
            <div className="hc-tr">
              <img
                src="https://res.cloudinary.com/dlouyotx5/image/upload/v1773468229/mychessfamily/gallery/1773468228941-img_8235.jpg"
                alt="Kids playing chess"
                loading="lazy"
              />
            </div>
            {/* bottom-right medium */}
            <div className="hc-br">
              <img
                src="https://res.cloudinary.com/dlouyotx5/image/upload/v1773413197/mychessfamily/gallery/1773413197476-img_3158.jpg"
                alt="Chess coaching"
                loading="lazy"
              />
            </div>
            {/* bottom-left tiny */}
            <div className="hc-bl">
              <img
                src="https://res.cloudinary.com/dlouyotx5/image/upload/v1773468177/mychessfamily/gallery/1773468177011-img_8252.jpg"
                alt="Chess class"
                loading="lazy"
              />
            </div>
            {/* decorative dots — in gaps between circles */}
            <div
              className="hc-dot hc-dot-1"
              style={{
                width: "10px",
                height: "10px",
                background: "var(--green2)",
                top: "38%",
                left: "57%",
                opacity: 0.55,
              }}
            />
            <div
              className="hc-dot hc-dot-2"
              style={{
                width: "7px",
                height: "7px",
                background: "#4AABE8",
                top: "20%",
                left: "56%",
                opacity: 0.5,
              }}
            />
            <div
              className="hc-dot hc-dot-3"
              style={{
                width: "9px",
                height: "9px",
                background: "#F9A825",
                bottom: "24%",
                right: "42%",
                opacity: 0.5,
              }}
            />
            <div
              className="hc-dot"
              style={{
                width: "6px",
                height: "6px",
                background: "#E53E3E",
                top: "52%",
                right: "38%",
                opacity: 0.45,
              }}
            />
            <div
              className="hc-dot"
              style={{
                width: "8px",
                height: "8px",
                background: "var(--green2)",
                top: "72%",
                left: "55%",
                opacity: 0.4,
              }}
            />

            {/* floating chess pieces — strictly in corners/edges away from circles */}
            {/* top-left corner — far from all circles */}
            <div
              className="hc-piece"
              style={{
                top: "2%",
                left: "0%",
                color: "var(--green2)",
                fontSize: "2.4rem",
                opacity: 0.9,
                zIndex: 6,
              }}
            >
              ♟
            </div>
            {/* middle-right edge — between tr and br circles */}
            <div
              className="hc-piece hc-piece-2"
              style={{
                top: "44%",
                right: "2%",
                color: "#1A5EA8",
                fontSize: "2rem",
                opacity: 0.85,
                zIndex: 6,
              }}
            >
              ♞
            </div>
            {/* top-right corner — above tr circle */}
            <div
              className="hc-piece hc-piece-3"
              style={{
                top: "1%",
                right: "1%",
                color: "#F9A825",
                fontSize: "1.8rem",
                opacity: 0.8,
                zIndex: 6,
              }}
            >
              ♝
            </div>
            {/* bottom-left corner — left of bl circle */}
            <div
              className="hc-piece hc-piece-4"
              style={{
                bottom: "2%",
                left: "0%",
                color: "#E53E3E",
                fontSize: "1.9rem",
                opacity: 0.8,
                zIndex: 6,
              }}
            >
              ♜
            </div>
            {/* center-right gap between main and right circles */}
            <div
              className="hc-piece"
              style={{
                top: "28%",
                right: "38%",
                color: "var(--green2)",
                fontSize: "1.5rem",
                opacity: 0.7,
                animation: "hcFloat 6s ease-in-out infinite",
                animationDelay: "1.2s",
                zIndex: 6,
              }}
            >
              ♛
            </div>
            {/* top center gap */}
            <div
              className="hc-piece"
              style={{
                top: "3%",
                left: "52%",
                color: "#4AABE8",
                fontSize: "1.4rem",
                opacity: 0.7,
                animation: "hcFloat 5.5s ease-in-out infinite",
                animationDelay: "2s",
                zIndex: 6,
              }}
            >
              ♚
            </div>

            {/* star bursts — in empty corners */}
            <svg
              className="hc-star"
              style={{
                position: "absolute",
                top: "1%",
                left: "48%",
                width: "26px",
                height: "26px",
              }}
              viewBox="0 0 28 28"
            >
              <polygon
                points="14,2 16.5,10 25,10 18.5,15.5 21,24 14,19 7,24 9.5,15.5 3,10 11.5,10"
                fill="#F9A825"
                opacity=".9"
              />
            </svg>
            <svg
              className="hc-star hc-star-2"
              style={{
                position: "absolute",
                bottom: "2%",
                right: "38%",
                width: "22px",
                height: "22px",
              }}
              viewBox="0 0 28 28"
            >
              <polygon
                points="14,2 16.5,10 25,10 18.5,15.5 21,24 14,19 7,24 9.5,15.5 3,10 11.5,10"
                fill="#1FA85E"
                opacity=".8"
              />
            </svg>
            <svg
              className="hc-star"
              style={{
                position: "absolute",
                top: "42%",
                right: "1%",
                width: "16px",
                height: "16px",
                animationDuration: "5s",
              }}
              viewBox="0 0 28 28"
            >
              <polygon
                points="14,2 16.5,10 25,10 18.5,15.5 21,24 14,19 7,24 9.5,15.5 3,10 11.5,10"
                fill="#4AABE8"
                opacity=".7"
              />
            </svg>
            <svg
              className="hc-star hc-star-2"
              style={{
                position: "absolute",
                top: "2%",
                right: "36%",
                width: "12px",
                height: "12px",
                animationDuration: "7s",
              }}
              viewBox="0 0 28 28"
            >
              <polygon
                points="14,2 16.5,10 25,10 18.5,15.5 21,24 14,19 7,24 9.5,15.5 3,10 11.5,10"
                fill="#E53E3E"
                opacity=".65"
              />
            </svg>

            {/* small plus / cross shapes */}
            <svg
              style={{
                position: "absolute",
                top: "60%",
                right: "36%",
                width: "16px",
                height: "16px",
                zIndex: 4,
                pointerEvents: "none",
                animation: "hcSpin 10s linear infinite",
              }}
              viewBox="0 0 16 16"
            >
              <rect
                x="6"
                y="0"
                width="4"
                height="16"
                rx="2"
                fill="#F9A825"
                opacity=".7"
              />
              <rect
                x="0"
                y="6"
                width="16"
                height="4"
                rx="2"
                fill="#F9A825"
                opacity=".7"
              />
            </svg>
            <svg
              style={{
                position: "absolute",
                top: "10%",
                left: "54%",
                width: "12px",
                height: "12px",
                zIndex: 4,
                pointerEvents: "none",
                animation: "hcSpin 8s linear infinite reverse",
              }}
              viewBox="0 0 16 16"
            >
              <rect
                x="6"
                y="0"
                width="4"
                height="16"
                rx="2"
                fill="#E53E3E"
                opacity=".6"
              />
              <rect
                x="0"
                y="6"
                width="16"
                height="4"
                rx="2"
                fill="#E53E3E"
                opacity=".6"
              />
            </svg>

            {/* wavy bottom SVG accent */}
            <svg
              className="hc-wave"
              viewBox="0 0 600 40"
              preserveAspectRatio="none"
            >
              <path
                d="M0,20 Q75,0 150,20 Q225,40 300,20 Q375,0 450,20 Q525,40 600,20 L600,40 L0,40 Z"
                fill="#1FA85E"
                opacity=".07"
              />
            </svg>
          </div>
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
