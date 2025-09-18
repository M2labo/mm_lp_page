// src/components/MobileMoverLanding.jsx
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header.jsx";

const IconSparkles = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2l1.6 3.8L18 7.4l-3.4 1.6L12 13l-2.6-4-3.4-1.6 4.4-1.6L12 2zM19 14l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1zM5 14l.7 1.6 1.6.7-1.6.7L5 19l-.7-1.6L2.7 16l1.6-.7L5 14z" />
  </svg>
);

const Button = ({ children, className = "", ...rest }) => (
  <button
    className={
      "inline-flex items-center justify-center rounded-full px-10 py-3 text-sm md:text-base font-medium shadow-xl bg-[#cddc39] text-black hover:brightness-110 hover:shadow-2xl transition " +
      className
    }
    {...rest}
  >
    {children}
  </button>
);

/* 追従ライト（白ベース用：multiply で白飛び防止） */
function FollowingLight({ strength = 1 }) {
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  const targetRef = useRef({ x: 0.5, y: 0.5 });
  const lastMoveRef = useRef(0);
  const activeRef = useRef(false);
  const rafRef = useRef(0);
  const seedsRef = useRef({
    ax: Math.random() * 1000,
    ay: Math.random() * 1000,
    rx: 0.18,
    ry: 0.12,
    speedX: 0.00035,
    speedY: 0.0005,
  });

  useEffect(() => {
    const setTarget = (cx, cy) => {
      const w = window.innerWidth || 1,
        h = window.innerHeight || 1,
        jitter = 12;
      const tx = (cx + (Math.random() * jitter - jitter / 2)) / w;
      const ty = (cy + (Math.random() * jitter - jitter / 2)) / h;
      targetRef.current = {
        x: Math.min(0.98, Math.max(0.02, tx)),
        y: Math.min(0.95, Math.max(0.05, ty)),
      };
      activeRef.current = true;
      lastMoveRef.current = performance.now();
    };
    const onMove = (e) => setTarget(e.clientX, e.clientY);
    const onTouch = (e) =>
      e.touches?.[0] && setTarget(e.touches[0].clientX, e.touches[0].clientY);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  useEffect(() => {
    const loop = () => {
      const now = performance.now();
      if (now - lastMoveRef.current > 2500) activeRef.current = false;
      const { ax, ay, rx, ry, speedX, speedY } = seedsRef.current;
      let target = targetRef.current;
      if (!activeRef.current) {
        const cx = 0.5,
          cy = 0.55;
        target = {
          x: cx + Math.sin(now * speedX + ax) * rx,
          y: cy + Math.cos(now * speedY + ay) * ry,
        };
        targetRef.current = target;
      }
      setPos((p) => {
        const a = activeRef.current ? 0.18 : 0.06;
        return { x: p.x + (target.x - p.x) * a, y: p.y + (target.y - p.y) * a };
      });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const style = {
    top: `${pos.y * 100}%`,
    left: `${pos.x * 100}%`,
    transform: "translate(-50%, -50%)",
  };
  const outerOpacity = 0.18 * strength; // 白ベースで少し弱め
  const whiteOpacity = Math.max(0.03, 0.06 * strength);
  const coreOpacity = 0.5 * strength;

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 70 }}>
      <div
        className="absolute rounded-full blur-3xl mix-blend-multiply"
        style={{
          ...style,
          width: "44vw",
          height: "44vw",
          backgroundColor: `rgba(205,220,57,${outerOpacity})`,
          animation: "pulse 2s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          ...style,
          width: "28vw",
          height: "28vw",
          backgroundColor: `rgba(0,0,0,${whiteOpacity})`, // 白ベースで軽く陰影寄りに
          backdropFilter: `brightness(115%) contrast(105%)`,
          WebkitBackdropFilter: `brightness(115%) contrast(105%)`,
        }}
      />
      <div
        className="absolute rounded-full blur-xl"
        style={{
          ...style,
          width: "12vw",
          height: "12vw",
          backgroundColor: `rgba(0,0,0,${coreOpacity})`,
        }}
      />
    </div>
  );
}

export default function MobileMoverLanding() {
  const { t, i18n } = useTranslation();
  const ASSET = import.meta.env.BASE_URL;
  const [strength, setStrength] = useState(1);

  // セクション監視（ライト強度）
  const heroRef = useRef(null),
    videoRef = useRef(null),
    casesRef = useRef(null),
    specsRef = useRef(null),
    contactRef = useRef(null);

  useEffect(() => {
    const map = (id) =>
      ({ hero: 1.0, video: 0.75, cases: 0.65, specs: 0.6, contact: 0.7 }[id] ?? 0.75);
    const onI = (es) => {
      let top = { id: null, ratio: 0 };
      es.forEach((e) => {
        const id = e.target.getAttribute("data-sec-id");
        if (e.intersectionRatio > top.ratio) top = { id, ratio: e.intersectionRatio };
      });
      if (top.id) setStrength(map(top.id));
    };
    const io = new IntersectionObserver(onI, {
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });
    [heroRef, videoRef, casesRef, specsRef, contactRef].forEach(
      (r) => r.current && io.observe(r.current)
    );
    return () => io.disconnect();
  }, []);

  const toggleLang = () => i18n.changeLanguage(i18n.language === "ja" ? "en" : "ja");

  // ===== z-index の基準（固定値） =====
  const Z = {
    header: 2000,
    heroOverlay: 10,
    content: 80,
    video: 0,
  };

  // ===== 自動サムネ生成（最初のフレームを poster に） =====
  useEffect(() => {
    const v = document.getElementById("mm-demo-video");
    if (!v) return;

    if (v.getAttribute("poster")) return;

    const onLoaded = async () => {
      try {
        v.currentTime = 0.01;
        await new Promise((r) => v.addEventListener("seeked", r, { once: true }));

        const canvas = document.createElement("canvas");
        canvas.width = v.videoWidth || 1280;
        canvas.height = v.videoHeight || 720;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        v.setAttribute("poster", dataUrl);
        v.load();
      } catch {
        // no-op
      }
    };

    if (v.readyState >= 1) onLoaded();
    else v.addEventListener("loadedmetadata", onLoaded, { once: true });

    return () => v.removeEventListener("loadedmetadata", onLoaded);
  }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Header（別ファイル側で text-zinc-800 / hover:text-black に） */}
      <Header />

      {/* global light */}
      <FollowingLight strength={strength} />

      {/* ===== HERO ===== */}
      <section
        id="hero"
        ref={heroRef}
        data-sec-id="hero"
        className="hash-anchor relative h-[100vh] flex items-center justify-center px-6 overflow-hidden"
        style={{ paddingTop: "64px" }}
      >
        {/* 背景ビデオ */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: 0.22, zIndex: Z.video, background: "#eef1f4" }}
          src={`${ASSET}/videos/hero.mp4`}
          autoPlay
          muted
          loop
          playsInline
          poster={`${ASSET}/images/hero-fallback.jpg`}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        {/* 白グラデ（上：少し濃い→下：薄い） */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.85), rgba(255,255,255,0.92))",
            zIndex: 10,
          }}
        />
        {/* コンテンツ */}
        <div
          className="relative mx-auto max-w-7xl flex flex-col md:flex-row items-center gap-12"
          style={{ zIndex: Z.content }}
        >
          <div className="max-w-lg">
            <h1 className="text-5xl md:text-6xl font-light leading-tight">
              {t("hero.catch")}
              <br />
              <span className="text-[#cddc39] font-semibold drop-shadow-[0_1px_0_rgba(0,0,0,0.08)]">
                MobileMover
              </span>
              <span className="inline-flex pl-2 align-middle text-[#cddc39]">
                <IconSparkles className="h-8 w-8" />
              </span>
            </h1>
            <p className="mt-6 text-lg text-zinc-600">{t("hero.sub")}</p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Button>{t("cta.demo")}</Button>
              <button className="rounded-full px-10 py-3 border border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white transition shadow-sm text-sm md:text-base">
                {t("cta.brochure")}
              </button>
            </div>
          </div>
          <div className="flex-shrink-0">
            <img
              src={`${ASSET}/images/mobilemover-illustration.png`}
              alt="MobileMover"
              className="max-h-[480px] w-auto rounded-2xl shadow-2xl bg-white"
            />
          </div>
        </div>
      </section>

      {/* ===== VIDEO ===== */}
      <section
        id="video"
        ref={videoRef}
        data-sec-id="video"
        className="hash-anchor py-32 bg-zinc-50"
        style={{ position: "relative", zIndex: Z.content }}
      >
        <div className="text-center">
          <h2 className="text-3xl font-semibold">{t("video.title")}</h2>
          <p className="mt-4 text-zinc-600">{t("video.desc")}</p>

          <div className="mx-auto mt-8 w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden bg-white border border-zinc-200">
            <video
              id="mm-demo-video"
              className="w-full h-auto block bg-black"
              style={{ minHeight: 240 }}
              controls
              playsInline
              preload="metadata"
            >
              <source src={`${ASSET}/videos/hero.mp4`} type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* ===== CASES ===== */}
      <section
        id="cases"
        ref={casesRef}
        data-sec-id="cases"
        className="py-32 bg-white hash-anchor"
        style={{ position: "relative", zIndex: Z.content }}
      >
        <div className="text-center">
          <h2 className="text-3xl font-semibold">{t("cases.title")}</h2>
          <p className="mt-4 text-zinc-600">{t("cases.desc")}</p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
            {[
              { k: "mowing", img: `${ASSET}/images/cases/mowing.jpg` },
              { k: "sprayHouse", img: `${ASSET}/images/cases/spray-house.jpg` },
              { k: "herbicideApple", img: `${ASSET}/images/cases/herbicide-apple.jpg` },
            ].map(({ k, img }) => (
              <article
                key={k}
                className="group rounded-2xl overflow-hidden bg-white border border-zinc-200 shadow-md hover:shadow-lg hover:-translate-y-1 transition text-left"
              >
                <div className="relative h-48">
                  <img
                    src={img}
                    alt={t(`cases.${k}.title`)}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-[#cddc39] text-black text-xs font-semibold px-3 py-1 shadow">
                    {t(`cases.${k}.badge`)}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-zinc-900">
                    {t(`cases.${k}.title`)}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600">{t(`cases.${k}.desc`)}</p>
                  <ul className="mt-4 space-y-1 text-sm text-zinc-700">
                    {(t(`cases.${k}.bullets`, { returnObjects: true }) || []).map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-[#cddc39]/70" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center gap-3">
                    <a
                      href="#contact"
                      className="rounded-full px-4 py-2 text-sm font-medium bg-[#cddc39] text-black hover:brightness-110 transition"
                    >
                      {i18n.language === "ja" ? "この事例で相談" : "Consult on this use case"}
                    </a>
                    <a
                      href="#video"
                      className="rounded-full px-4 py-2 text-sm font-medium border border-zinc-300 text-zinc-700 hover:bg-zinc-900 hover:text-white transition"
                    >
                      {i18n.language === "ja" ? "デモ動画を見る" : "Watch demo video"}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SPECS ===== */}
      <section
        id="specs"
        ref={specsRef}
        data-sec-id="specs"
        className="hash-anchor py-32 bg-zinc-50"
        style={{ position: "relative", zIndex: Z.content }}
      >
        <div className="text-center">
          <h2 className="text-3xl font-semibold">{t("specs.title")}</h2>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto px-6 text-left">
          {(t("specs.items", { returnObjects: true }) || []).map(([label, value], i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm border border-zinc-200"
            >
              <div className="h-10 w-10 rounded-full bg-[#cddc39]/20 flex items-center justify-center text-[#cddc39]">
                ★
              </div>
              <div>
                <p className="text-sm text-zinc-600">{label}</p>
                <p className="text-lg font-medium text-zinc-900">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section
        id="contact"
        ref={contactRef}
        data-sec-id="contact"
        className="py-32 bg-zinc-50 hash-anchor"
        style={{ position: "relative", zIndex: Z.content }}
      >
        <div className="text-center">
          <h2 className="text-3xl font-semibold">{t("contact.title")}</h2>
          <p className="mt-4 text-zinc-600">{t("contact.desc")}</p>
          <form className="mt-8 space-y-4 max-w-md mx-auto px-6">
            <input
              type="text"
              placeholder={t("contact.name")}
              className="w-full rounded-md p-3 bg-white text-black placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#cddc39] border border-zinc-200"
            />
            <input
              type="email"
              placeholder={t("contact.email")}
              className="w-full rounded-md p-3 bg-white text-black placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#cddc39] border border-zinc-200"
            />
            <textarea
              placeholder={t("contact.msg")}
              rows={4}
              className="w-full rounded-md p-3 bg-white text-black placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#cddc39] border border-zinc-200"
            />
            <button
              type="submit"
              className="w-full rounded-md bg-[#cddc39] text-black py-3 font-semibold hover:brightness-110"
            >
              {t("contact.send")}
            </button>
          </form>
        </div>
      </section>

      <footer className="py-12 border-t border-zinc-200 bg-white text-center text-zinc-500 text-sm">
        <p>© {new Date().getFullYear()} M2Labo. {t("footer")}</p>
      </footer>
    </div>
  );
}
