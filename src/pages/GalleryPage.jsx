import { useState, useEffect, useRef, useCallback } from "react";
import { useLang } from "../LangContext";
import {
  CONTACT,
  getGalleryImageSrc,
  api,
  optimizeCloudinaryUrl,
} from "../constants";
import { Footer } from "../components";

const GALLERY_CSS = `
/* ── GALLERY PAGE ── */
.gallery-hero{background:#F5F6F8;border-bottom:1px solid #E2E8F0;padding:5rem 0 4rem;position:relative;overflow:hidden;}
.gallery-hero::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 30% 50%,rgba(31,168,94,.05) 0%,transparent 55%);pointer-events:none;}
.gallery-hero-inner{width:100%;max-width:1200px;margin:0 auto;padding:0 2.5rem;position:relative;z-index:1;text-align:center;}
.gallery-kicker{display:inline-block;font-size:.75rem;letter-spacing:2px;text-transform:uppercase;color:var(--green2);font-weight:700;margin-bottom:1rem;}
.gallery-title{font-family:'Playfair Display',serif;font-size:clamp(2.4rem,4.5vw,4rem);line-height:1.08;color:#1F2B3A;margin-bottom:1rem;}
.gallery-sub{max-width:700px;margin:0 auto;color:#586273;line-height:1.8;font-size:1rem;}
.gallery-hero-actions{margin-top:1.8rem;display:flex;justify-content:center;gap:.8rem;flex-wrap:wrap;}
.gallery-wrap{background:#F5F6F8;padding:3rem 0 4rem;}
.gallery-inner{width:100%;max-width:1200px;margin:0 auto;padding:0 2.5rem;}
.gallery-filters{display:flex;gap:.6rem;flex-wrap:wrap;justify-content:center;margin-bottom:2.5rem;}
.gf-btn{background:#fff;border:1.5px solid #E2E8F0;border-radius:999px;padding:.5rem 1.2rem;font-family:'DM Sans',sans-serif;font-size:.85rem;font-weight:700;color:#3A4A5B;cursor:pointer;transition:.2s;}
.gf-btn:hover{border-color:#2E7D5B;color:#2E7D5B;}
.gf-btn.on{background:#2E7D5B;border-color:#2E7D5B;color:#fff;}
.gallery-grid{columns:3;column-gap:1.1rem;}
@media(max-width:900px){.gallery-grid{columns:2;}}
@media(max-width:550px){.gallery-grid{columns:1;}}
.gallery-item{break-inside:avoid;margin-bottom:1.1rem;border-radius:18px;overflow:hidden;position:relative;cursor:pointer;background:linear-gradient(135deg,#13263B,#0F3A28);border:1px solid #E2E8F0;box-shadow:0 8px 24px rgba(15,23,42,.07);transition:.28s;}
.gallery-item:hover{transform:translateY(-5px);box-shadow:0 20px 44px rgba(15,23,42,.14);}
.gallery-item:hover .gallery-overlay{opacity:1;}
.gallery-item:hover .gallery-img{transform:scale(1.04);}
.gallery-img-wrap{
  overflow:hidden;
  width:100%;
  position:relative;
  background:linear-gradient(135deg,#13263B,#0F3A28);
}

.gallery-img{
  width:100%;
  display:block;
  object-fit:cover;
  transition:transform .45s ease, opacity .25s ease;
  will-change:transform, opacity;
  backface-visibility:hidden;
  -webkit-backface-visibility:hidden;
}


.gallery-placeholder{
  width:100%;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  padding:2.5rem 1rem;
  text-align:center;
  min-height:220px;
  background:linear-gradient(135deg,#13263B,#0F3A28);
}
.lightbox-img{
  width:100%;
  max-height:75vh;
  object-fit:contain;
  border-radius:14px;
  box-shadow:0 30px 80px rgba(0,0,0,.8);
  display:block;
}  

.gallery-placeholder-icon{font-size:3rem;margin-bottom:.6rem;}
.gallery-placeholder-label{font-size:.8rem;font-weight:700;color:rgba(220,233,245,.5);letter-spacing:1px;text-transform:uppercase;}
.gallery-overlay{position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(9,19,30,.88) 100%);opacity:0;transition:.3s;display:flex;flex-direction:column;justify-content:flex-end;padding:1.2rem;}
.gallery-overlay-tag{font-size:.7rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--green2);margin-bottom:.3rem;}
.gallery-overlay-caption{font-size:.92rem;font-weight:700;color:#EEF5FF;line-height:1.4;}
.lightbox-inner{position:relative;max-width:900px;width:100%;display:flex;flex-direction:column;align-items:center;}
.lightbox-placeholder{width:100%;min-height:300px;border-radius:14px;background:linear-gradient(135deg,#13263B,#0F3A28);display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:5rem;}
.lightbox-caption{margin-top:1.1rem;text-align:center;color:rgba(220,233,245,.85);font-size:.95rem;line-height:1.6;}
.lightbox-tag{display:inline-block;font-size:.72rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--green2);background:rgba(31,168,94,.12);border:1px solid rgba(45,204,116,.25);padding:.25rem .7rem;border-radius:999px;margin-bottom:.5rem;}
.lightbox-close{position:fixed;top:1.5rem;right:1.5rem;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.2);color:#EEF5FF;font-size:1.2rem;width:40px;height:40px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.18s;z-index:2001;box-shadow:0 4px 16px rgba(0,0,0,.4);}
.lightbox-close:hover{background:rgba(255,255,255,.25);}
.lightbox-nav{display:flex;gap:1rem;margin-top:1.2rem;}
.lightbox-nav-btn{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);color:#EEF5FF;font-size:1.2rem;width:48px;height:48px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.18s;}
.lightbox-nav-btn:hover{background:rgba(255,255,255,.18);}
.lightbox-counter{color:rgba(220,233,245,.5);font-size:.85rem;display:flex;align-items:center;padding:0 .5rem;}
.lightbox-ovl{position:fixed;inset:0;z-index:2000;background:rgba(0,0,0,.95);backdrop-filter:blur(18px);display:flex;align-items:center;justify-content:center;padding:1.5rem;animation:fu .2s ease;overflow:visible;}
.gallery-cta{margin-top:3rem;background:linear-gradient(135deg,#12253B,#143524);border-radius:26px;padding:2rem;text-align:center;color:#EEF5FF;}
.gallery-cta h3{font-family:'Playfair Display',serif;font-size:2rem;margin-bottom:.65rem;}
.gallery-cta p{color:rgba(220,233,245,.78);line-height:1.8;max-width:700px;margin:0 auto;}
.gallery-cta-actions{margin-top:1.3rem;display:flex;justify-content:center;gap:.8rem;flex-wrap:wrap;}
@media(max-width:850px){.gallery-hero-inner,.gallery-inner{padding-left:1.2rem;padding-right:1.2rem;}}


/* ── CUSTOM FILE INPUT ── */
.file-upload{
  width:100%;
}

.file-upload-input{
  display:none;
}

.file-upload-box{
  width:100%;
  display:flex;
  align-items:center;
  gap:.75rem;
  padding:.78rem .95rem;
  background:rgba(26,94,168,.09);
  border:1.5px solid rgba(74,171,232,.18);
  border-radius:8px;
  color:var(--cream);
  cursor:pointer;
  transition:.2s;
  min-height:48px;
}

.file-upload-box:hover{
  border-color:rgba(74,171,232,.35);
  background:rgba(26,94,168,.14);
}

.file-upload-box:focus-within{
  border-color:var(--green2);
  background:rgba(21,122,69,.09);
  box-shadow:0 0 0 3px rgba(45,204,116,.12);
}

.file-upload-btn{
  flex-shrink:0;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:.55rem .9rem;
  border-radius:7px;
  background:var(--green2);
  color:#fff;
  font-size:.82rem;
  font-weight:700;
  line-height:1;
  white-space:nowrap;
}

.file-upload-name{
  min-width:0;
  flex:1;
  color:rgba(220,233,245,.78);
  font-size:.88rem;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}


/* ── 404 PAGE ── */
.notfound-pg{width:100%;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#F5F6F8;position:relative;overflow:hidden;padding:8rem 2rem 4rem;}
.notfound-pg::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 68% 50%,rgba(21,122,69,.08) 0%,transparent 55%),radial-gradient(ellipse at 20% 75%,rgba(26,94,168,.1) 0%,transparent 50%);}
.notfound-inner{position:relative;z-index:2;text-align:center;max-width:640px;margin:0 auto;}
.notfound-board{display:grid;grid-template-columns:repeat(8,1fr);width:min(300px,75vw);margin:0 auto 2.5rem;border-radius:12px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.7);opacity:.55;}
.notfound-sq{aspect-ratio:1;}
.notfound-sq-l{background:#C8E6C0;}
.notfound-sq-d{background:#2D6A4F;}
.notfound-code{font-family:'Playfair Display',serif;font-size:clamp(5rem,18vw,9rem);font-weight:900;line-height:1;color:transparent;background:linear-gradient(135deg,var(--green2),var(--blue3));-webkit-background-clip:text;background-clip:text;margin-bottom:.5rem;animation:fu .6s ease both;}
.notfound-title{font-family:'Playfair Display',serif;font-size:clamp(1.5rem,4vw,2.2rem);color:#EEF5FF;margin-bottom:1rem;animation:fu .6s ease .1s both;}
.notfound-sub{color:rgba(180,210,240,.65);line-height:1.8;font-size:.97rem;margin-bottom:2rem;animation:fu .6s ease .2s both;}
.notfound-piece{font-size:3.5rem;margin-bottom:1rem;display:block;animation:float 3s ease-in-out infinite;}
.notfound-actions{display:flex;gap:.9rem;flex-wrap:wrap;justify-content:center;animation:fu .6s ease .3s both;}
.notfound-links{margin-top:2.5rem;display:flex;gap:.5rem;flex-wrap:wrap;justify-content:center;animation:fu .6s ease .4s both;}
.notfound-link{background:rgba(26,94,168,.09);border:1px solid var(--border);color:rgba(220,233,245,.7);font-family:'DM Sans',sans-serif;font-size:.82rem;font-weight:600;padding:.45rem 1rem;border-radius:999px;cursor:pointer;transition:.18s;}
.notfound-link:hover{color:var(--green2);border-color:rgba(45,204,116,.3);background:rgba(21,122,69,.1);}
@keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-12px);}}
`;

const injectGalleryStyles = () => {
  if (document.getElementById("mcf-gallery-css")) return;
  const el = document.createElement("style");
  el.id = "mcf-gallery-css";
  el.textContent = GALLERY_CSS;
  document.head.appendChild(el);
};

function SmartGalleryImage({
  src,
  alt,
  className = "",
  wrapperClassName = "gallery-img-wrap",
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imgRef = useCallback(
    (node) => {
      if (!node) return;
      // Image may already be cached — complete fires before onLoad is attached
      if (node.complete && node.naturalWidth > 0) {
        setLoaded(true);
      } else if (node.complete && node.naturalWidth === 0) {
        setFailed(true);
      }
    },
    [src],
  );

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  return (
    <div
      className={wrapperClassName}
      style={{ position: "relative", minHeight: 220 }}
    >
      {!loaded && !failed && (
        <div
          className="gallery-placeholder"
          style={{ position: "absolute", inset: 0, minHeight: "unset" }}
        >
          <div className="gallery-placeholder-icon">♟</div>
          <div className="gallery-placeholder-label">Loading photo</div>
        </div>
      )}

      {failed && (
        <div
          className="gallery-placeholder"
          style={{ position: "absolute", inset: 0, minHeight: "unset" }}
        >
          <div className="gallery-placeholder-icon">📷</div>
          <div className="gallery-placeholder-label">Image unavailable</div>
        </div>
      )}

      {!failed && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={className}
          loading="eager"
          decoding="sync"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          style={{
            width: "100%",
            display: "block",
            objectFit: "cover",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.35s ease",
            position: loaded ? "relative" : "absolute",
            top: 0,
            left: 0,
          }}
        />
      )}
    </div>
  );
}

export default function GalleryPage({ onNav, onContact }) {
  const { t } = useLang();
  const GALLERY_CATS = [
    { id: "all", label: t.gallery.filterAll },
    { id: "camps", label: t.gallery.filterCamps },
    { id: "lessons", label: t.gallery.filterLessons },
    { id: "community", label: t.gallery.filterCommunity },
  ];

  const BASE = import.meta.env.VITE_API_URL || "";

  const [filter, setFilter] = useState("all");
  const [lightbox, setLightbox] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    injectGalleryStyles();
  }, []);

  const loadGallery = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api("/gallery");
      setItems(data.photos || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  const filtered =
    filter === "all" ? items : items.filter((i) => i.category === filter);

  const closeLightbox = () => setLightbox(null);
  const prevItem = () =>
    setLightbox((i) => (i - 1 + filtered.length) % filtered.length);
  const nextItem = () => setLightbox((i) => (i + 1) % filtered.length);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevItem();
      if (e.key === "ArrowRight") nextItem();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, filtered.length]);

  const current = lightbox !== null ? filtered[lightbox] : null;

  return (
    <div className="pg" style={{ background: "#F5F6F8" }}>
      <section className="gallery-hero">
        <div className="gallery-hero-inner">
          <div className="gallery-kicker">{t.gallery.kicker}</div>
          <h1 className="gallery-title">{t.gallery.heroTitle}</h1>
          <p className="gallery-sub">{t.gallery.heroSub}</p>
          <div className="gallery-hero-actions">
            <button className="btn btn-g" onClick={() => onNav("camp")}>
              {t.common.joinSummerCamp}
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
              {t.common.contactUs}
            </button>
          </div>
        </div>
      </section>

      <section className="gallery-wrap">
        <div className="gallery-inner">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
              gap: "1rem",
              marginBottom: "2.5rem",
            }}
          >
            {[
              [t.gallery.stat1n, t.gallery.stat1l],
              [t.gallery.stat2n, t.gallery.stat2l],
              [t.gallery.stat3n, t.gallery.stat3l],
            ].map(([n, l]) => (
              <div
                key={l}
                style={{
                  background: "#fff",
                  border: "1px solid #E2E8F0",
                  borderRadius: 16,
                  padding: "1.1rem",
                  textAlign: "center",
                  boxShadow: "0 8px 20px rgba(15,23,42,.05)",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: "1.8rem",
                    color: "#2E7D5B",
                    fontWeight: 900,
                  }}
                >
                  {n}
                </div>
                <div
                  style={{
                    fontSize: ".8rem",
                    color: "#5C6B7C",
                    marginTop: ".2rem",
                  }}
                >
                  {l}
                </div>
              </div>
            ))}
          </div>

          <div className="gallery-filters">
            {GALLERY_CATS.map((c) => (
              <button
                key={c.id}
                className={`gf-btn${filter === c.id ? " on" : ""}`}
                onClick={() => {
                  setFilter(c.id);
                  setLightbox(null);
                }}
              >
                {c.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "4rem",
                color: "var(--muted)",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: ".8rem" }}>⏳</div>
              <p>{t.gallery.loading}</p>
            </div>
          ) : !filtered.length ? (
            <div
              style={{
                textAlign: "center",
                padding: "4rem 2rem",
                background: "#fff",
                borderRadius: 22,
                border: "1px solid #E2E8F0",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: ".8rem" }}>📸</div>
              <h3 style={{ color: "#1F2B3A", marginBottom: ".5rem" }}>
                {t.gallery.noPhotos}
              </h3>
              <p style={{ color: "#5C6B7C" }}>{t.gallery.noPhotosSub}</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {filtered.map((item, idx) => (
                <div
                  key={item.id}
                  className="gallery-item"
                  onClick={() => setLightbox(idx)}
                >
                  <SmartGalleryImage
                    src={optimizeCloudinaryUrl(
                      getGalleryImageSrc(item.imageUrl, BASE),
                      800,
                    )}
                    alt={item.caption}
                    className="gallery-img"
                    loading="lazy"
                  />
                  <div className="gallery-overlay">
                    <div className="gallery-overlay-tag">
                      {item.tag || item.category}
                    </div>
                    <div className="gallery-overlay-caption">
                      {item.caption}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="gallery-cta">
            <h3>{t.gallery.ctaTitle}</h3>
            <p>{t.gallery.ctaText}</p>
            <div className="gallery-cta-actions">
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
                onClick={() => onNav("camp")}
              >
                {t.common.summerCamp}
              </button>
            </div>
          </div>
        </div>
      </section>

      {lightbox !== null && current && (
        <div
          className="lightbox-ovl"
          onClick={(e) => e.target === e.currentTarget && closeLightbox()}
        >
          <div className="lightbox-inner">
            <button className="lightbox-close" onClick={closeLightbox}>
              ×
            </button>
            <SmartGalleryImage
              src={optimizeCloudinaryUrl(
                getGalleryImageSrc(current.imageUrl, BASE),
                1200,
              )}
              alt={current.caption}
              className="lightbox-img"
              wrapperClassName="lightbox-img-wrap"
            />
            <div className="lightbox-caption">
              <div className="lightbox-tag">
                {current.tag || current.category}
              </div>
              <div>{current.caption}</div>
            </div>
            <div className="lightbox-nav">
              <button className="lightbox-nav-btn" onClick={prevItem}>
                ‹
              </button>
              <span className="lightbox-counter">
                {lightbox + 1} / {filtered.length}
              </span>
              <button className="lightbox-nav-btn" onClick={nextItem}>
                ›
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer onNav={onNav} onContact={onContact} />
    </div>
  );
}
