import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "ja",
    debug: false,
    interpolation: { escapeValue: false },
    backend: { loadPath: "/locales/{{lng}}/translation.json" },
    detection: { order: ["querystring","localStorage","navigator"], caches: ["localStorage"] },

    // 👇 これを入れるとロード中でも描画が止まらない
    react: { useSuspense: false },
    // 空文字を返さずキーを出す（デバッグしやすい）
    returnEmptyString: false,
  });

export default i18n;
