import {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { translations } from "./translations";

const LangCtx = createContext(null);

const SUPPORTED_LANGS = ["en", "ru", "he"];
const DEFAULT_LANG = "en";

function getLangFromPath(pathname) {
  const first = pathname.split("/").filter(Boolean)[0];
  return SUPPORTED_LANGS.includes(first) ? first : null;
}

export function LangProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const pathLang = getLangFromPath(location.pathname);

  const lang = pathLang || DEFAULT_LANG;
  const t = translations[lang] || translations[DEFAULT_LANG];

  useEffect(() => {
    try {
      localStorage.setItem("mcf_lang", lang);
    } catch {}
  }, [lang]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    if (pathLang) return;

    let savedLang = DEFAULT_LANG;
    try {
      const stored = localStorage.getItem("mcf_lang");
      if (SUPPORTED_LANGS.includes(stored)) savedLang = stored;
    } catch {}

    const cleanPath = location.pathname === "/" ? "" : location.pathname;
    const nextPath = `/${savedLang}${cleanPath}${location.search}${location.hash}`;

    navigate(nextPath, { replace: true });
  }, [pathLang, location.pathname, location.search, location.hash, navigate]);

  const switchLang = useCallback(
    (newLang) => {
      if (!SUPPORTED_LANGS.includes(newLang)) return;

      const parts = location.pathname.split("/").filter(Boolean);

      if (parts.length && SUPPORTED_LANGS.includes(parts[0])) {
        parts[0] = newLang;
      } else {
        parts.unshift(newLang);
      }

      navigate(`/${parts.join("/")}${location.search}${location.hash}`);
    },
    [location.pathname, location.search, location.hash, navigate],
  );

  const value = useMemo(
    () => ({
      lang,
      setLang: switchLang,
      t,
    }),
    [lang, switchLang, t],
  );

  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}
