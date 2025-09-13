import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../components/Button";
import Section from "../components/Section";

const IconSparkles = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2l1.6 3.8L18 7.4l-3.4 1.6L12 13l-2.6-4-3.4-1.6 4.4-1.6L12 2zM19 14l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1zM5 14l.7 1.6 1.6.7-1.6.7L5 19l-.7-1.6L2.7 16l1.6-.7L5 14z" />
  </svg>
);

export default function MobileMoverLanding() {
  const { t } = useTranslation();
  const ASSET = import.meta.env.BASE_URL; 
  const [strength, setStrength] = useState(1); // 参考: IntersectionObserver は省略

  return (
    <main className="min-h-screen bg-black text-white pt-16">
      {/* HERO */}
      <section id="hero" className="relative h-[100vh] flex items-center justify-center px-6 overflow-hidden">
        <video className="absolute inset-0 h-full w-full object-cover opacity-25 z-0"
               src={`${ASSET}/videos/hero.mp4`} autoPlay muted loop playsInline />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/85 to-black/95 z-10" />
        <div className="relative z-[80] mx-auto max-w-7xl flex flex-col md:flex-row items-center gap-12">
          <div className="max-w-lg">
            <h1 className="text-5xl md:text-6xl font-light leading-tight">
              {t("hero.catch")}<br/>
              <span className="text-[#cddc39] font-semibold drop-shadow-md">MobileMover</span>
              <span className="inline-flex pl-2 align-middle text-[#cddc39]"><IconSparkles className="h-8 w-8" /></span>
            </h1>
            <p className="mt-6 text-lg text-zinc-300">{t("hero.sub")}</p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Button>{t("cta.demo")}</Button>
              <a href="#video"
                 className="rounded-full px-10 py-3 border border-white text-white hover:bg-white hover:text-black transition shadow-md text-sm md:text-base">
                {t("cta.brochure")}
              </a>
            </div>
          </div>
          <div className="flex-shrink-0">
            <img src={`${ASSET}/images/mobilemover-illustration.png`}
                 alt="MobileMover" className="max-h-[480px] w-auto rounded-2xl shadow-2xl" />
          </div>
        </div>
      </section>

      {/* VIDEO */}
      <Section id="video" bg="light">
        <div className="text-center">
          <h2 className="text-3xl font-semibold">{t("video.title")}</h2>
          <p className="mt-4 text-zinc-400">{t("video.desc")}</p>
          <video className="mx-auto mt-8 w-full max-w-4xl rounded-2xl shadow-2xl" controls>
            <source src={`${ASSET}/videos/hero.mp4`} type="video/mp4" />
          </video>
        </div>
      </Section>

      {/* CASES / SPECS / CONTACT は既存実装を Section で包む形でOK */}
    </main>
  );
}
