import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
// 既存のUI部品がある場合は活用。ない場合でも動くようにフォールバック。
import Section from "../components/Section";
import Button from "../components/Button";
import { Input, Textarea } from "../components/Field";

/**
 * MobileMover 購入コンフィギュレータ（iPhone風）
 * - カラー/ワーク/オプション選択でイラストが切り替わり、合計がリアルタイム更新
 * - 価格はふわっとカウントアップ、選択時にカードが微妙に拡大
 * - 右側に sticky の見積もり＆見積依頼フォーム
 */
export default function PurchaseConfigurator() {
    const ASSET = import.meta.env.BASE_URL; 
  const { t, i18n } = useTranslation();

  // 設定（暫定価格）
  const BASE = 1_000_000;
  const WORKS = {
    mowing: { labelJa: "草刈り", labelEn: "Mowing", price: 200_000 },
    spray: { labelJa: "散布", labelEn: "Spray", price: 250_000 },
    herbicide: { labelJa: "除草剤散布", labelEn: "Herbicide", price: 300_000 },
  };

  const OPTIONS = {
    camera: { labelJa: "見守りカメラ", labelEn: "Monitoring camera", price: 80_000 },
    tag: { labelJa: "タグ誘導セット", labelEn: "Tag guidance set", price: 120_000 },
    support: { labelJa: "リモートサポート", labelEn: "Remote support", price: 60_000 },
  };

  const COLORS = [
    { key: "leaf", nameJa: "リーフ", nameEn: "Leaf", hex: "#c9da2a" },
    { key: "gray", nameJa: "グレー", nameEn: "Gray", hex: "#6e6e6e" },

  ];

  const [color, setColor] = useState(COLORS[0]);
  const [work, setWork] = useState("mowing");
  const [opts, setOpts] = useState({ camera: true, tag: false, support: true });

  // 合計計算
  const total = useMemo(() => {
    let t = BASE + WORKS[work].price;
    Object.keys(OPTIONS).forEach((k) => {
      if (opts[k]) t += OPTIONS[k].price;
    });
    return t;
  }, [work, opts]);

  // 数字アニメーション
  const animated = useAnimatedNumber(total);

  const formatJPY = (n) =>
    n.toLocaleString(i18n.language === "ja" ? "ja-JP" : "en-US", {
      style: "currency",
      currency: "JPY",
      maximumFractionDigits: 0,
    });

  const label = (ja, en) => (i18n.language === "ja" ? ja : en);

  return (
    <main className="min-h-screen bg-black text-white pt-16">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute -right-40 -top-20 size-[420px] rounded-full bg-lime-300/20 blur-3xl" />
        <div className="absolute left-10 -bottom-10 size-[320px] rounded-full bg-yellow-200/10 blur-3xl" />
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              {label("購入", "Purchase")}
            </h1>
            <p className="mt-4 text-zinc-300">
              {label(
                "価格帯は 100〜150万円（税別・構成により変動）。用途に合わせてモジュールをお選びいただけます。",
                "Price range ¥1.0–1.5M (excl. tax), depending on configuration. Pick modules to fit your use."
              )}
            </p>

            {/* カラー選択 */}
            <div className="mt-8">
              <div className="text-sm text-zinc-400 mb-2">{label("カラー", "Color")}</div>
              <div className="flex gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setColor(c)}
                    className={`relative size-9 rounded-full border transition-transform ${
                      color.key === c.key ? "ring-2 ring-lime-400 scale-110" : "hover:scale-105 border-white/20"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    aria-label={label(c.nameJa, c.nameEn)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* イラストプレビュー */}
          <div className="relative">
            <motion.div
              key={color.key}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative mx-auto w-full max-w-[520px] aspect-square overflow-hidden rounded-2xl shadow-2xl">
                <img src={`${ASSET}/images/purchase/${color.key}.png`} alt="MobileMover" className="w-full h-full object-cover object-center" />
                {/* カラーオーバーレイ（色替え演出） */}

              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* コンフィグセクション */}
      <Section bg="light">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[minmax(0,1fr)_420px] gap-10 px-6">
          {/* 左：選択UI */}
          <div>
            {/* ワーク */}
            <h2 className="text-2xl font-semibold">{label("ワーク（用途）", "Work")}</h2>
            <div className="mt-4 grid sm:grid-cols-3 gap-4">
              {Object.keys(WORKS).map((k) => {
                const active = work === k;
                const w = WORKS[k];
                return (
                  <motion.button
                    key={k}
                    onClick={() => setWork(k)}
                    whileTap={{ scale: 0.98 }}
                    className={`group text-left p-4 rounded-2xl border bg-zinc-900/60 backdrop-blur-sm hover:border-white/30 transition ${
                      active ? "border-lime-400 shadow-[0_0_0_2px_rgba(163,230,53,0.15)]" : "border-white/10"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-medium">
                          {label(w.labelJa, w.labelEn)}
                        </div>
                        <div className="text-sm text-zinc-400 mt-1">{formatJPY(w.price)}</div>
                      </div>
                      <div className={`size-5 rounded-full border ${active ? "bg-lime-400 border-lime-300" : "border-white/20"}`} />
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* オプション */}
            <h3 className="text-xl font-semibold mt-10">{label("追加オプション", "Options")}</h3>
            <div className="mt-4 grid sm:grid-cols-3 gap-4">
              {Object.keys(OPTIONS).map((k) => {
                const active = !!opts[k];
                const o = OPTIONS[k];
                return (
                  <motion.button
                    key={k}
                    onClick={() => setOpts((p) => ({ ...p, [k]: !p[k] }))}
                    whileTap={{ scale: 0.98 }}
                    className={`text-left p-4 rounded-2xl border bg-zinc-900/60 hover:border-white/30 transition ${
                      active ? "border-lime-400 ring-1 ring-lime-300/30" : "border-white/10"
                    }`}
                    aria-pressed={active}
                  >
                    <div className="font-medium">{label(o.labelJa, o.labelEn)}</div>
                    <div className="text-sm text-zinc-400 mt-1">{formatJPY(o.price)}</div>
                    <div className="mt-3 text-xs text-zinc-500">
                      {label("タップで切替", "Tap to toggle")}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* 価格内訳 */}
            <div className="mt-10 p-5 rounded-2xl bg-zinc-900/70 border border-white/10">
              <div className="text-sm text-zinc-400">{label("内訳", "Breakdown")}</div>
              <dl className="mt-3 space-y-2">
                <Row label={label("本体価格", "Base price")} value={formatJPY(BASE)} />
                <Row label={label("ワーク", "Work")} value={`${label(WORKS[work].labelJa, WORKS[work].labelEn)} / ${formatJPY(WORKS[work].price)}`} />
                {Object.keys(OPTIONS).map((k) => (
                  <Row
                    key={k}
                    label={label(OPTIONS[k].labelJa, OPTIONS[k].labelEn)}
                    value={opts[k] ? formatJPY(OPTIONS[k].price) : "—"}
                  />
                ))}
              </dl>
            </div>
          </div>

          {/* 右：見積フォーム（sticky） */}
          <aside className="lg:sticky lg:top-24 self-start">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-zinc-900/80 to-zinc-900/40 border border-white/10 shadow-2xl">
              <div className="text-sm text-zinc-400">{label("概算見積", "Estimated total")}</div>
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={animated}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="text-4xl font-semibold mt-1 tracking-tight"
                >
                  {formatJPY(animated)}
                </motion.div>
              </AnimatePresence>

              <form className="mt-6 space-y-3">
                <Input placeholder={label("会社名 / 氏名", "Company / Name")} />
                <Input type="email" placeholder="Email" />
                <Input placeholder={label("電話番号（任意）", "Phone (optional)" )} />
                <Textarea rows={4} placeholder={label("ご相談内容・導入時期・ご予算など", "Your request / timeline / budget")} />

                <Button type="submit" className="w-full">
                  {label("この仕様で見積もりを依頼", "Request a quote")}
                </Button>
              </form>

              <div className="mt-6 p-4 rounded-xl bg-zinc-800/70 border border-white/10">
                <div className="text-sm text-zinc-400">{label("分割・リース相談", "Installments / Lease")}</div>
                <p className="text-zinc-300 mt-2">
                  {label(
                    "分割・リースのご相談も承ります。法人/個人事業主向けのプランをご用意。",
                    "Installment or lease plans are available for companies and sole proprietors."
                  )}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </main>
  );
}

/** 内訳行 */
function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-6 text-sm">
      <dt className="text-zinc-400">{label}</dt>
      <dd className="text-zinc-200">{value}</dd>
    </div>
  );
}

/** 数字を滑らかにアニメーションさせる */
function useAnimatedNumber(target, duration = 500) {
  const [value, setValue] = useState(target);
  const ref = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const from = value;
    const diff = target - from;

    if (diff === 0) return;
    cancelAnimationFrame(ref.current);

    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setValue(Math.round(from + diff * eased));
      if (p < 1) ref.current = requestAnimationFrame(tick);
    };

    ref.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current);
  }, [target]);

  return value;
}