/*
  HeroSwiper — clean auto-looping swiper, no arrows, no dots
  ─────────────────────────────────────────────
  Usage in App.jsx — inside HomePage, replace the hero image div with:

    import HeroSwiper from "./HeroSwiper";
    <HeroSwiper />

  Custom photos:
    <HeroSwiper photos={[{ src: "...", alt: "..." }]} />
*/

import { useState, useEffect } from "react";

const DEFAULT_PHOTOS = [
  {
    src: "https://res.cloudinary.com/dlouyotx5/image/upload/v1773468663/mychessfamily/gallery/1773468663062-img_8369.jpg",
    alt: "MyChessFamily",
  },
  {
    src: "https://res.cloudinary.com/dlouyotx5/image/upload/v1773468643/mychessfamily/gallery/1773468643209-img_8480.jpg",
    alt: "MyChessFamily",
  },
  {
    src: "https://res.cloudinary.com/dlouyotx5/image/upload/v1773468259/mychessfamily/gallery/1773468258807-img_8432.jpg",
    alt: "MyChessFamily",
  },
  {
    src: "https://res.cloudinary.com/dlouyotx5/image/upload/v1773468229/mychessfamily/gallery/1773468228941-img_8235.jpg",
    alt: "MyChessFamily",
  },
  {
    src: "https://res.cloudinary.com/dlouyotx5/image/upload/v1773468177/mychessfamily/gallery/1773468177011-img_8252.jpg",
    alt: "MyChessFamily",
  },
  {
    src: "https://res.cloudinary.com/dlouyotx5/image/upload/v1773413197/mychessfamily/gallery/1773413197476-img_3158.jpg",
    alt: "MyChessFamily",
  },
];

const HERO_SWIPER_CSS = `
  .hero-swiper {
    position: relative;
    width: 100%;
    height: 420px;
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,.12);
    border: 1px solid #E2E8F0;
    align-self: center;
    animation: fu .6s ease .2s both;
  }
  .hero-swiper-slide {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 1s ease;
  }
  .hero-swiper-slide.active {
    opacity: 1;
  }
  .hero-swiper-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }
`;

export default function HeroSwiper({ photos = DEFAULT_PHOTOS }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((i) => (i + 1) % photos.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [photos.length]);

  return (
    <>
      <style>{HERO_SWIPER_CSS}</style>
      <div className="hero-swiper hero-img-wrap">
        {photos.map((photo, i) => (
          <div
            key={i}
            className={`hero-swiper-slide${i === current ? " active" : ""}`}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              loading={i === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>
    </>
  );
}
