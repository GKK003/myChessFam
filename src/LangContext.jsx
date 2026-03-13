// LangContext.jsx
// Drop this file in your src/ folder.
// Wrap your app with <LangProvider> in main.jsx, then use useLang() anywhere.

import { createContext, useContext, useState, useCallback } from "react";
import { translations } from "./translations";

const LangCtx = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    // Persist language choice across page reloads
    try {
      return localStorage.getItem("mcf_lang") || "en";
    } catch {
      return "en";
    }
  });

  const switchLang = useCallback((l) => {
    setLang(l);
    try {
      localStorage.setItem("mcf_lang", l);
    } catch {}
  }, []);

  const toggle = useCallback(() => {
    switchLang(lang === "en" ? "ru" : "en");
  }, [lang, switchLang]);

  const t = translations[lang];

  return (
    <LangCtx.Provider value={{ lang, setLang: switchLang, toggle, t }}>
      {children}
    </LangCtx.Provider>
  );
}

// Hook — use anywhere inside the tree
export function useLang() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}
