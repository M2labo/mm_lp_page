// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

const BASE = import.meta.env.BASE_URL || "/"; // ← Viteのbase。Pagesで /<repo>/ になる

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "ja",
    interpolation: { escapeValue: false },
    backend: {
      loadPath: `${BASE}locales/{{lng}}/translation.json`  // ★ここ
    },
    detection: { order: ["querystring", "localStorage", "navigator"], caches: ["localStorage"] },
  });

export default i18n;
