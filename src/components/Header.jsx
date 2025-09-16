import React from "react";
import { useTranslation } from "react-i18next";
import Button from "./Button";
import { Link } from "react-router-dom";

export default function Header() {
  const { t, i18n } = useTranslation();
  const ASSET = import.meta.env.BASE_URL; 
  const toggleLang = () => i18n.changeLanguage(i18n.language === "ja" ? "en" : "ja");

  return (
    <header className="fixed top-0 inset-x-0 z-[100] backdrop-blur bg-white/80 border-b border-zinc-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/">
            <img src={`${ASSET}/images/logo.jpg`} alt="M2Labo Logo" className="h-8 w-8 object-contain" />
          </Link>
          <Link to="/" className="font-semibold tracking-tight text-zinc-800 hover:text-black">M2Labo / MobileMover</Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-700">
          <Link to="/#hero" className="hover:text-black">{t("nav.features")}</Link>
          <Link to="/#video" className="hover:text-black">{t("nav.video")}</Link>
          <Link to="/#cases" className="hover:text-black">{t("nav.cases")}</Link>
          <Link to="/#specs" className="hover:text-black">{t("nav.specs")}</Link>
          <Link to="/purchase" className="hover:text-black">{t("nav.purchase")}</Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="rounded-full px-4 py-2 border border-white/40 text-white text-sm hover:bg-white hover:text-black transition"
            aria-label="toggle language"
          >
            {i18n.language === "ja" ? "EN" : "JP"}
          </button>
          <Button onClick={() => { location.href = "#contact"; }}>{t("cta.request")}</Button>
          <Link to="/mypage"
             className="rounded-full px-5 py-2 border border-[#cddc39] text-[#cddc39] hover:bg-[#cddc39] hover:text-black transition">
            {t("cta.mypage")}
          </Link>
        </div>
      </div>
    </header>
  );
}
