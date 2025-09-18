// src/pages/PurchaseConfigurator.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import Section from "../components/Section";
import Button from "../components/Button";
import { Input, Textarea } from "../components/Field";
import Modal from "../components/Modal";
import SquareCardWidget from "../components/SquareCardWidget";
import "../styles/mm-pay.css"; // 崩れ防止のガードCSS

export default function PurchaseConfigurator() {
  const ASSET = import.meta.env.BASE_URL;
  const { i18n } = useTranslation();

  // 設定（暫定価格）
  const BASE = 1_000_000;
  const WORKS = {
    mowing: { key: "mowing", labelJa: "草刈り", labelEn: "Mowing", price: 200_000, descJa: "法面・通路などの草刈りを自動化。", descEn: "Automate mowing on slopes and lanes." },
    spray: { key: "spray", labelJa: "散布", labelEn: "Spray", price: 250_000, descJa: "液剤散布（肥料・活力剤等）に対応。", descEn: "Liquid spraying for fertilizers etc." },
    herbicide: { key: "herbicide", labelJa: "除草剤散布", labelEn: "Herbicide", price: 300_000, descJa: "除草剤の安全散布に特化。", descEn: "Specialized in herbicide spraying." },
  };
  const OPTIONS = {
    camera: { key: "camera", labelJa: "見守りカメラ", labelEn: "Monitoring camera", price: 80_000, tipJa: "遠隔で様子を確認", tipEn: "Remote monitoring" },
    tag: { key: "tag", labelJa: "タグ誘導セット", labelEn: "Tag guidance set", price: 120_000, tipJa: "タグでルート誘導", tipEn: "Tag-based guidance" },
    support: { key: "support", labelJa: "リモートサポート", labelEn: "Remote support", price: 60_000, tipJa: "導入後の保守を強化", tipEn: "Post-install support" },
  };
  const COLORS = [
    { key: "leaf", nameJa: "リーフ", nameEn: "Leaf", hex: "#c9da2a" },
    { key: "gray", nameJa: "グレー", nameEn: "Gray", hex: "#6e6e6e" },
  ];

  const [color, setColor] = useState(COLORS[0]);
  const [work, setWork] = useState("mowing");
  const [opts, setOpts] = useState({ camera: true, tag: false, support: true });

  // 合計
  const total = useMemo(() => {
    let t = BASE + WORKS[work].price;
    Object.keys(OPTIONS).forEach((k) => { if (opts[k]) t += OPTIONS[k].price; });
    return t;
  }, [work, opts]);

  const animated = useAnimatedNumber(total);

  // 決済モーダル
  const [payOpen, setPayOpen] = useState(false);

  // 見積フォーム（3DS精度向上に利用）
  const [formCompany, setFormCompany] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formZip, setFormZip] = useState("");
  const [formMsg, setFormMsg] = useState("");

  const formatJPY = (n) =>
    n.toLocaleString(i18n.language === "ja" ? "ja-JP" : "en-US", {
      style: "currency",
      currency: "JPY",
      maximumFractionDigits: 0,
    });
  const label = (ja, en) => (i18n.language === "ja" ? ja : en);

  return (
    // 白ベース化：背景/文字を固定のライト配色に
    <main style={{ minHeight: "100vh", background: "#ffffff", color: "#111827", paddingTop: "4rem" }}>
      {/* ===== HERO ===== */}
      <section className="mm-section-pad" style={{ position: "relative", overflow: "hidden" }}>
        {/* ライト用でもそのまま映える淡い装飾 */}
        <div style={{ position: "absolute", right: "-160px", top: "-80px", width: 420, height: 420, borderRadius: "9999px", background: "rgba(190, 242, 100, 0.12)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", left: 40, bottom: -40, width: 320, height: 320, borderRadius: "9999px", background: "rgba(253, 230, 138, 0.10)", filter: "blur(32px)" }} />
        <div className="mm-two-col" style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div>
            <h1 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 600, letterSpacing: "-0.02em", color: "#0f172a" }}>
              {label("購入", "Purchase")}
            </h1>
            <p style={{ marginTop: 16, color: "#4b5563" }}>
              {label("価格帯は 100〜150万円（税別・構成により変動）。用途に合わせてモジュールをお選びいただけます。", "Price range ¥1.0–1.5M (excl. tax), depending on configuration. Pick modules to fit your use.")}
            </p>

            {/* カラー選択 */}
            <div style={{ marginTop: 32 }}>
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>{label("カラー", "Color")}</div>
              <div style={{ display: "flex", gap: 12 }}>
                {COLORS.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setColor(c)}
                    aria-label={label(c.nameJa, c.nameEn)}
                    style={{
                      width: 36, height: 36, borderRadius: "9999px",
                      background: c.hex,
                      border: `1px solid ${color.key === c.key ? "#cddc39" : "#d1d5db"}`,
                      outline: color.key === c.key ? `2px solid rgba(205,220,57,0.35)` : "none",
                      transform: color.key === c.key ? "scale(1.08)" : "scale(1)",
                      transition: "transform .15s ease"
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* イラスト（白面＋軽い影へ） */}
          <div style={{ position: "relative" }}>
            <motion.div
              key={color.key}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <div style={{
                margin: "0 auto", width: "min(520px,100%)", aspectRatio: "1/1",
                overflow: "hidden", borderRadius: 16,
                boxShadow: "0 18px 40px rgba(0,0,0,.18)", background: "#ffffff", border: "1px solid #e5e7eb"
              }}>
                <img
                  src={`${ASSET}/images/purchase/${color.key}.png`}
                  alt="MobileMover"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== コンフィグセクション ===== */}
      {/* Section 自体の配色はコンポーネント側に依存（ここでは要素の色だけライト化） */}
      <Section bg="light">
        <div className="mm-two-col" style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>
          {/* 左：選択UI */}
          <div>
            {/* ワーク（用途） */}
            <h2 style={{ fontSize: 22, fontWeight: 600, color: "#0f172a" }}>{label("ワーク（用途）", "Work")}</h2>
            <div style={{ marginTop: 16, display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              {Object.keys(WORKS).map((k) => {
                const active = work === k;
                const w = WORKS[k];
                return (
                  <motion.button
                    key={k}
                    onClick={() => setWork(k)}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      textAlign: "left", padding: 16, borderRadius: 16,
                      border: `1px solid ${active ? "#cddc39" : "#e5e7eb"}`,
                      background: "#ffffff",
                      boxShadow: active ? "0 0 0 2px rgba(205,220,57,0.15)" : "0 1px 2px rgba(0,0,0,0.04)",
                      transition: "border .15s ease, box-shadow .15s ease",
                      color: "#111827"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{label(w.labelJa, w.labelEn)}</div>
                        <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{label(w.descJa, w.descEn)}</div>
                        <div style={{ fontSize: 13, color: "#6b7280", marginTop: 6 }}>{formatJPY(w.price)}</div>
                      </div>
                      <div style={{
                        width: 20, height: 20, borderRadius: "9999px",
                        border: `1px solid ${active ? "#cddc39" : "#d1d5db"}`,
                        background: active ? "#cddc39" : "transparent",
                        flex: "0 0 auto"
                      }} />
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* 追加オプション */}
            <h3 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, color: "#0f172a" }}>{label("追加オプション", "Options")}</h3>
            <div style={{ marginTop: 16, display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              {Object.keys(OPTIONS).map((k) => {
                const active = !!opts[k];
                const o = OPTIONS[k];
                return (
                  <motion.button
                    key={k}
                    onClick={() => setOpts((p) => ({ ...p, [k]: !p[k] }))}
                    whileTap={{ scale: 0.98 }}
                    aria-pressed={active}
                    style={{
                      textAlign: "left", padding: 16, borderRadius: 16,
                      border: `1px solid ${active ? "#cddc39" : "#e5e7eb"}`,
                      background: "#ffffff",
                      outline: active ? "1px solid rgba(205,220,57,0.30)" : "none",
                      transition: "border .15s ease, outline .15s ease",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                      color: "#111827"
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{label(o.labelJa, o.labelEn)}</div>
                    <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{formatJPY(o.price)}</div>
                    <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>{label(o.tipJa, o.tipEn)}</div>
                  </motion.button>
                );
              })}
            </div>

            {/* 価格内訳（白面+薄ボーダー） */}
            <div style={{ marginTop: 32, padding: 20, borderRadius: 16, background: "#ffffff", border: "1px solid #e5e7eb", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{label("内訳", "Breakdown")}</div>
              <dl style={{ marginTop: 12, display: "grid", gap: 8 }}>
                <Row label={label("本体価格", "Base price")} value={formatJPY(BASE)} />
                <Row label={label("ワーク", "Work")} value={`${label(WORKS[work].labelJa, WORKS[work].labelEn)} / ${formatJPY(WORKS[work].price)}`} />
                {Object.keys(OPTIONS).map((k) => (
                  <Row key={k} label={label(OPTIONS[k].labelJa, OPTIONS[k].labelEn)} value={opts[k] ? formatJPY(OPTIONS[k].price) : "—"} />
                ))}
              </dl>
            </div>
          </div>

          {/* 右：見積フォーム + 支払いボタン（ポップアップ） */}
          <aside className="mm-sticky-aside">
            <div className="mm-aside-card" style={{ background: "#ffffff", border: "1px solid #e5e7eb", boxShadow: "0 1px 2px rgba(0,0,0,0.04)", color: "#111827" }}>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{label("概算見積", "Estimated total")}</div>
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={animated}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="mm-price"
                  style={{ marginTop: 4, color: "#0f172a" }}
                >
                  {formatJPY(animated)}
                </motion.div>
              </AnimatePresence>

              {/* 見積フォーム */}
              <form style={{ marginTop: 24, display: "grid", gap: 12 }} onSubmit={(e) => e.preventDefault()}>
                <Input placeholder={label("会社名 / 氏名", "Company / Name")} className="mm-input"
                       value={formCompany} onChange={(e) => setFormCompany(e.target.value)} />
                <Input type="email" placeholder="Email" className="mm-input"
                       value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
                <Input placeholder={label("電話番号（任意）", "Phone (optional)")} className="mm-input"
                       value={formPhone} onChange={(e) => setFormPhone(e.target.value)} />
                <Input placeholder={label("郵便番号（任意）", "Postal code (optional)")} className="mm-input"
                       value={formZip} onChange={(e) => setFormZip(e.target.value)} />
                <Textarea rows={4} placeholder={label("ご相談内容・導入時期・ご予算など", "Your request / timeline / budget")} className="mm-textarea"
                          value={formMsg} onChange={(e) => setFormMsg(e.target.value)} />

                <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr" }}>
                  <Button type="submit" className="w-full">{label("この仕様で見積もりを依頼", "Request a quote")}</Button>
                  {/* 決済ボタンは白ベース見た目のみ更新 */}
                  <button type="button" onClick={() => setPayOpen(true)}
                          className="mm-pay-btn"
                          style={{ background: "#111827", color: "#ffffff", borderColor: "#111827" }}>
                    {label("カードで支払う", "Pay by card")}
                  </button>
                </div>
              </form>

              {/* 情報カード：ライト配色へ */}
              <div className="mm-info-card" style={{ marginTop: 24, background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{label("分割・リース相談", "Installments / Lease")}</div>
                <p style={{ color: "#374151", marginTop: 8 }}>
                  {label("分割・リースのご相談も承ります。法人/個人事業主向けのプランをご用意。", "Installment or lease plans are available for companies and sole proprietors.")}
                </p>
              </div>
            </div>

            {/* モーダル（Portal 描画） */}
            <Modal open={payOpen} onClose={() => setPayOpen(false)} title={label("カード決済（Sandbox）", "Card Payment (Sandbox)")}>
              <div style={{ display: "grid", gap: 16, color: "#111827" }}>
                <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
                  {label("下記にカード情報を入力してお支払いください。", "Enter your card details below to complete the purchase.")}
                </p>
                <SquareCardWidget
                  amountJPY={total}
                  email={formEmail || ""}
                  postalCode={formZip || ""}
                  onSuccess={() => { alert(label("決済に成功しました。ありがとうございます！","Payment succeeded. Thank you!")); setPayOpen(false); }}
                  onError={(e) => console.error("square error:", e)}
                />
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  {label("Sandbox環境です。テストカード番号をご利用ください。", "Sandbox environment. Use test card numbers.")}
                </div>
              </div>
            </Modal>
          </aside>
        </div>
      </Section>
    </main>
  );
}

/** 価格の行（内訳） */
function Row({ label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, fontSize: 14 }}>
      <dt style={{ color: "#6b7280" }}>{label}</dt>
      <dd style={{ color: "#111827" }}>{value}</dd>
    </div>
  );
}

/** 数字アニメーション（easeOutCubic） */
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
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(from + diff * eased));
      if (p < 1) ref.current = requestAnimationFrame(tick);
    };
    ref.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current);
  }, [target]);
  return value;
}
