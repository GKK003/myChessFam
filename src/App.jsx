import { useState, useEffect, useCallback } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import ChatBot from "./ChatBot";
import { useLang } from "./LangContext";
import { api, AUTH_KEY, CONTACT, SOCIALS, DEF_CAMPS } from "./constants";
import { Toast, ContactModal, ReviewModal } from "./components";
import "./index.css";

// Pages — lazy loaded for performance
import { lazy, Suspense } from "react";
const HomePage = lazy(() => import("./pages/HomePage"));
const ProgramsPage = lazy(() => import("./pages/ProgramsPage"));
const CampPage = lazy(() => import("./pages/CampPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const TeamPage = lazy(() => import("./pages/TeamPage"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, setLang, t } = useLang();

  const cleanPath =
    location.pathname.replace(/^\/(en|ru|he)(?=\/|$)/, "") || "/";
  const pathToPage = {
    "/": "home",
    "/programs": "programs",
    "/camp": "camp",
    "/team": "team",
    "/reviews": "reviews",
    "/about": "about",
    "/gallery": "gallery",
    "/contact": "contact",
    "/login": "login",
    "/admin": "admin",
  };
  const page = pathToPage[cleanPath] || "home";

  const [reviews, setReviews] = useState([]);
  const [adminReviews, setAdminReviews] = useState([]);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [camps, setCamps] = useState(DEF_CAMPS);
  const [campRegs, setCampRegs] = useState([]);
  const [langOpen, setLangOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobile = useCallback(() => setMobileOpen((v) => !v), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Update HTML lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setHideHeader(currentScrollY > lastScrollY && currentScrollY > 120);
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showToast = useCallback((msg, type = "i") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const openContact = useCallback(() => setContactOpen(true), []);
  const closeContact = useCallback(() => setContactOpen(false), []);

  const loadPublicData = useCallback(async () => {
    try {
      const data = await api("/bootstrap");
      setCamps(data.camps || []);
    } catch {
      showToast(t.toast.fallbackData, "e");
    }
  }, [showToast, t]);

  const loadAdminData = useCallback(async () => {
    if (!localStorage.getItem(AUTH_KEY)) return;
    try {
      const data = await api("/admin/registrations");
      setCampRegs(data.campRegs || []);
      const rev = await api("/admin/reviews");
      setAdminReviews(rev.reviews || []);
      const gal = await api("/gallery");
      setGalleryPhotos(gal.photos || []);
    } catch {
      localStorage.removeItem(AUTH_KEY);
      setIsAdmin(false);
      setCampRegs([]);
      setAdminReviews([]);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      loadPublicData();
    }, 0);
  }, [loadPublicData]);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_KEY);
    if (!token) return;
    api("/admin/registrations")
      .then((data) => {
        setCampRegs(data.campRegs || []);
        setIsAdmin(true);
        return api("/admin/reviews");
      })
      .then((r) => {
        if (r) setAdminReviews(r.reviews || []);
      })
      .catch(() => {
        localStorage.removeItem(AUTH_KEY);
        setIsAdmin(false);
      });
  }, []);

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
      setMobileOpen(false);

      if (p === "admin" && !isAdmin) {
        navigate(`/${lang}/login`);
        window.scrollTo(0, 0);
        return;
      }

      navigate(p === "home" ? `/${lang}` : `/${lang}/${p}`);
      window.scrollTo(0, 0);
    },
    [isAdmin, navigate, lang],
  );

  const loadGallery = useCallback(async () => {
    try {
      const data = await api("/gallery");
      setGalleryPhotos(data.photos || []);
    } catch {
      console.error("Could not load gallery");
    }
  }, []);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  const loadReviews = useCallback(async () => {
    try {
      const data = await api("/reviews");
      setReviews(data.reviews || []);
    } catch {
      console.error("Could not load reviews");
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleLogin = async () => {
    setIsAdmin(true);
    navigate("/admin");
    await loadAdminData();
  };

  const handleLogout = async () => {
    try {
      await api("/admin/logout", { method: "POST" });
    } catch {}
    localStorage.removeItem(AUTH_KEY);
    setIsAdmin(false);
    setCampRegs([]);
    navigate(`/${lang}`);
    showToast(t.toast.loggedOut, "i");
  };

  const navLinks = [
    ["home", t.nav.home],
    ["programs", t.nav.programs],
    ["camp", t.nav.camp],
    ["team", t.nav.team],
    ["gallery", t.nav.gallery],
    ["reviews", t.nav.reviews],
    ["about", t.nav.about],
    ["contact", t.nav.contact],
  ];

  const LANG_OPTIONS = [
    { code: "en", label: "English", short: "EN", flag: "/flags/us.svg" },
    { code: "ru", label: "Русский", short: "RU", flag: "/flags/ru.svg" },
    { code: "he", label: "עברית", short: "HE", flag: "/flags/il.svg" },
  ];

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#F5F6F8" }}>
      <nav
        className={`nav ${hideHeader ? "nav-hide" : ""} ${page === "home" ? "nav-home" : ""}`}
      >
        <div className="nav-logo" onClick={() => go("home")}>
          <img
            src="/pieces/logo.webp"
            alt="company logo"
            className="nav-logo-img"
            style={{ width: "145px", height: "115px", marginBottom: "10px" }}
          />
        </div>
        <div className="nav-links">
          {navLinks.map(([p, l]) => (
            <button
              key={p}
              className={`nb${page === p ? " on" : ""}`}
              onClick={() => go(p)}
              type="button"
            >
              {l}
            </button>
          ))}
        </div>
        <div className="nav-right">
          {isAdmin && <span className="adm-dot">● Admin</span>}
          <div
            className="lang-drop"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget))
                setLangOpen(false);
            }}
            tabIndex={-1}
          >
            <div
              className={`lang-drop-trigger${langOpen ? " open" : ""}`}
              onClick={() => setLangOpen((v) => !v)}
            >
              <img
                src={LANG_OPTIONS.find((l) => l.code === lang)?.flag}
                alt=""
                className="lang-flag"
              />
              {LANG_OPTIONS.find((l) => l.code === lang)?.short}
              <svg
                className="lang-chevron"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            {langOpen && (
              <div className="lang-drop-menu">
                {LANG_OPTIONS.map((option) => (
                  <div
                    key={option.code}
                    className={`lang-drop-item${lang === option.code ? " selected" : ""}`}
                    onMouseDown={() => {
                      setLang(option.code);
                      setLangOpen(false);
                    }}
                  >
                    <img src={option.flag} alt="" className="lang-flag" />
                    {option.label}
                    {lang === option.code && (
                      <span className="lang-tick">✓</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            className={`nb cta${isAdmin ? " adm" : ""}`}
            onClick={() => (isAdmin ? go("admin") : go("login"))}
            type="button"
          >
            {isAdmin ? t.nav.dashboard : t.nav.adminLogin}
          </button>
          <button
            className={`burger${mobileOpen ? " on" : ""}`}
            onClick={toggleMobile}
            aria-label="Open menu"
            type="button"
          >
            <div className="burger-lines">
              <span />
              <span />
              <span />
            </div>
          </button>
        </div>
      </nav>

      <div
        className={`mnav-ovl${mobileOpen ? " on" : ""}`}
        onClick={closeMobile}
      />
      <div
        className={`mnav${mobileOpen ? " on" : ""} ${page === "home" ? "mnav-home" : ""}`}
      >
        <div className="mnav-h">
          <div
            className="mnav-logo"
            onClick={() => go("home")}
            style={{ cursor: "pointer" }}
          >
            ♔ MyChessFamily
          </div>
          <button
            className="mnav-close"
            onClick={closeMobile}
            aria-label="Close menu"
            type="button"
          >
            ×
          </button>
        </div>
        <div className="mnav-links">
          {navLinks.map(([p, l]) => (
            <button
              key={p}
              className={`mnav-btn${page === p ? " on" : ""}`}
              onClick={() => {
                closeMobile();
                go(p);
              }}
              type="button"
            >
              <span>{l}</span>
              <span style={{ color: "var(--muted)", fontWeight: 600 }}>›</span>
            </button>
          ))}
          <div className="mnav-lang-wrap">
            <div className="mnav-lang-label">Language</div>
            <div className="mnav-lang-row">
              {LANG_OPTIONS.map((option) => (
                <button
                  key={option.code}
                  type="button"
                  className={`mnav-lang-item${lang === option.code ? " active" : ""}`}
                  onClick={() => {
                    setLang(option.code);
                    closeMobile();
                  }}
                >
                  <img src={option.flag} alt="" className="lang-flag" />
                  {option.short}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mnav-cta">
          <button
            className="btn btn-g btn-w"
            onClick={() => {
              closeMobile();
              isAdmin ? go("admin") : go("login");
            }}
            type="button"
          >
            {isAdmin ? t.nav.dashboard : t.nav.adminLogin}
          </button>
        </div>
      </div>

      <Suspense
        fallback={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
              background: "#F5F6F8",
              color: "#586273",
              fontSize: "1rem",
            }}
          >
            Loading...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Navigate to="/en" replace />} />
          <Route
            path="/:lang"
            element={<HomePage onNav={go} onContact={openContact} />}
          />
          <Route
            path="/:lang/programs"
            element={<ProgramsPage onNav={go} onContact={openContact} />}
          />
          <Route
            path="/:lang/camp"
            element={
              <CampPage
                camps={camps}
                onNav={go}
                showToast={showToast}
                onRegistered={loadAdminData}
                onContact={openContact}
              />
            }
          />
          <Route
            path="/:lang/team"
            element={<TeamPage onNav={go} onContact={openContact} />}
          />
          <Route
            path="/:lang/reviews"
            element={
              <ReviewsPage
                reviews={reviews}
                onNav={go}
                openModal={() => setReviewOpen(true)}
                onContact={openContact}
              />
            }
          />
          <Route
            path="/:lang/about"
            element={<AboutPage onNav={go} onContact={openContact} />}
          />
          <Route
            path="/:lang/gallery"
            element={<GalleryPage onNav={go} onContact={openContact} />}
          />
          <Route
            path="/:lang/contact"
            element={<ContactPage onNav={go} showToast={showToast} />}
          />
          <Route
            path="/:lang/login"
            element={<LoginPage onLogin={handleLogin} showToast={showToast} />}
          />
          <Route
            path="/:lang/admin"
            element={
              isAdmin ? (
                <AdminPage
                  camps={camps}
                  setCamps={setCamps}
                  campRegs={campRegs}
                  reloadRegs={loadAdminData}
                  adminReviews={adminReviews}
                  galleryPhotos={galleryPhotos}
                  reloadGallery={loadGallery}
                  onLogout={handleLogout}
                  showToast={showToast}
                />
              ) : (
                <LoginPage onLogin={handleLogin} showToast={showToast} />
              )
            }
          />
          <Route path="*" element={<Navigate to={`/${lang}`} replace />} />
        </Routes>
      </Suspense>

      {contactOpen && (
        <ContactModal onClose={closeContact} showToast={showToast} />
      )}
      {reviewOpen && (
        <ReviewModal
          onClose={() => setReviewOpen(false)}
          showToast={showToast}
          reload={loadReviews}
        />
      )}
      <Toast toasts={toasts} />
      <ChatBot />
    </div>
  );
}
