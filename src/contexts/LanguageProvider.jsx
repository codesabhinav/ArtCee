// src/contexts/LanguageProvider.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import translations from "../i18n/translations.json";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const available = Object.keys(translations).map((code) => ({
    code,
    name: translations[code].meta?.name || code,
    flag: translations[code].meta?.flag || ""
  }));

  const getInitial = () => {
    try {
      const saved = localStorage.getItem("siteLang");
      if (saved && translations[saved]) return saved;
      const nav = (navigator.language || "en").slice(0, 2);
      if (translations[nav]) return nav;
    } catch (e) { /* ignore */ }
    return "en";
  };

  const [lang, setLang] = useState(getInitial);
  const [ready, setReady] = useState(true);

  useEffect(() => {
    try { localStorage.setItem("siteLang", lang); } catch (e) {}
    // handle rtl for Arabic
    if (typeof document !== "undefined") {
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }
  }, [lang]);

  const t = (key, vars = {}) => {
    if (!key) return "";
    const parts = key.split(".");
    let value = translations[lang];
    for (let p of parts) {
      if (value == null) return key;
      value = value[p];
    }
    if (typeof value !== "string") return key;
    Object.keys(vars).forEach((k) => {
      value = value.split(`{${k}}`).join(vars[k]);
    });
    return value;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, languages: available, ready }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useTranslation must be used within LanguageProvider");
  return ctx;
};
