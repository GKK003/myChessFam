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
            <div className="hc-ring" />

            <div className="hc-main">
              <img
                fetchPriority="high"
                loading="eager"
                src="https://res.cloudinary.com/dlouyotx5/image/upload/f_webp,q_auto,w_700/v1773468259/mychessfamily/gallery/1773468258807-img_8432.jpg"
                alt="Chess class"
              />
            </div>

            <div className="hc-tr">
              <img
                loading="lazy"
                src="https://res.cloudinary.com/dlouyotx5/image/upload/f_webp,q_auto,w_700/v1773468229/mychessfamily/gallery/1773468228941-img_8235.jpg"
                alt="Kids playing chess"
              />
            </div>

            <div className="hc-br">
              <img
                loading="lazy"
                src="https://res.cloudinary.com/dlouyotx5/image/upload/f_webp,q_auto,w_700/v1773413197/mychessfamily/gallery/1773413197476-img_3158.jpg"
                alt="Chess coaching"
              />
            </div>

            <div className="hc-bl">
              <img
                loading="lazy"
                src="https://res.cloudinary.com/dlouyotx5/image/upload/f_webp,q_auto,w_700/v1773468177/mychessfamily/gallery/1773468177011-img_8252.jpg"
                alt="Chess class"
              />
            </div>
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
            <img src="/pieces/logo.webp" alt="About My Chess Family" />
          </div>
        </div>
      </section>
      <Footer onNav={onNav} onContact={onContact} />
    </div>
  );
}
