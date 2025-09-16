// src/pages/Purchase.jsx
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const AccentButton = ({ children, className = "", ...rest }) => (
  <button
    className={
      "inline-flex items-center justify-center rounded-full px-8 py-3 text-sm md:text-base font-medium shadow-md bg-[#cddc39] text-black hover:brightness-110 hover:shadow-lg transition " +
      className
    }
    {...rest}
  >
    {children}
  </button>
);

const OutlineButton = ({ children, className = "", ...rest }) => (
  <button
    className={
      "inline-flex items-center justify-center rounded-full px-8 py-3 text-sm md:text-base font-medium border border-zinc-300 text-zinc-700 hover:bg-zinc-900 hover:text-white transition " +
      className
    }
    {...rest}
  >
    {children}
  </button>
);

// カード（白地・薄いボーダー・弱い影）
const Card = ({ active = false, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      "text-left w-full rounded-2xl p-4 md:p-5 bg-white border transition",
      "shadow-sm hover:shadow-md hover:-translate-y-0.5",
      active
        ? "border-lime-400 shadow-[0_0_0_2px_rgba(163,230,53,0.15)]"
        : "border-zinc-200",
    ].join(" ")}
  >
    {children}
  </button>
);

export default function Purchase() {
  const { t, i18n } = useTranslation();

  // 価格・SKU 定義（例）
  const PLANS = useMemo(
    () => [
      {
        id: "basic",
        title: i18n.language === "ja" ? "ベーシック" : "Basic",
        price: 9800,
        bullets: [
          i18n.language === "ja" ? "月次レポート" : "Monthly report",
          i18n.language === "ja" ? "標準サポート" : "Standard support",
        ],
      },
      {
        id: "pro",
        title: i18n.language === "ja" ? "プロ" : "Pro",
        price: 19800,
        bullets: [
          i18n.language === "ja" ? "週次レポート" : "Weekly report",
          i18n.language === "ja" ? "優先サポート" : "Priority support",
        ],
      },
      {
        id: "enterprise",
        title: i18n.language === "ja" ? "エンタープライズ" : "Enterprise",
        price: 49800,
        bullets: [
          i18n.language === "ja" ? "専任担当" : "Dedicated manager",
          i18n.language === "ja" ? "SLA/導入支援" : "SLA / onboarding",
        ],
      },
    ],
    [i18n.language]
  );

  const COLORS = [
    { k: "black", label: i18n.language === "ja" ? "ブラック" : "Black" },
    { k: "gray", label: i18n.language === "ja" ? "グレー" : "Gray" },
    { k: "white", label: i18n.language === "ja" ? "ホワイト" : "White" },
  ];

  const [plan, setPlan] = useState(PLANS[1].id); // 既定: Pro
  const [color, setColor] = useState(COLORS[1].k); // 既定: Gray
  const [qty, setQty] = useState(1);

  const selectedPlan = PLANS.find((p) => p.id === plan);
  const total = (selectedPlan?.price ?? 0) * qty;

  return (
    <main className="min-h-screen bg-white text-zinc-900 pt-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* 見出し */}
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-semibold">
            {i18n.language === "ja" ? "購入" : "Purchase"}
          </h1>
          <p className="mt-3 text-zinc-600">
            {i18n.language === "ja"
              ? "白ベースの新デザインで見やすく。プランとカラーを選択してください。"
              : "Clean, white-based layout. Choose your plan and color."}
          </p>
        </header>

        {/* グリッド */}
        <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左カラム：構成選択 */}
          <div className="lg:col-span-2 space-y-8">
            {/* プラン */}
            <div>
              <h2 className="text-lg font-semibold">
                {i18n.language === "ja" ? "プラン" : "Plan"}
              </h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {PLANS.map((p) => (
                  <Card key={p.id} active={plan === p.id} onClick={() => setPlan(p.id)}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-base font-semibold">{p.title}</div>
                        <div className="mt-1 text-sm text-zinc-600">
                          ¥{p.price.toLocaleString()}
                          <span className="text-xs text-zinc-500">
                            {i18n.language === "ja" ? " / 月" : " / mo"}
                          </span>
                        </div>
                      </div>
                      {plan === p.id && (
                        <span className="mt-1 inline-flex items-center rounded-full bg-[#cddc39] text-black text-xs font-semibold px-2 py-0.5">
                          {i18n.language === "ja" ? "選択中" : "Selected"}
                        </span>
                      )}
                    </div>
                    <ul className="mt-3 space-y-1 text-sm text-zinc-700">
                      {p.bullets.map((b, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#cddc39]/80" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </div>

            {/* カラー */}
            <div>
              <h2 className="text-lg font-semibold">
                {i18n.language === "ja" ? "カラー" : "Color"}
              </h2>
              <div className="mt-4 grid grid-cols-3 gap-4">
                {COLORS.map((c) => (
                  <Card key={c.k} active={color === c.k} onClick={() => setColor(c.k)}>
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-block h-6 w-6 rounded-full border border-zinc-300"
                        style={{
                          background:
                            c.k === "black" ? "#0a0a0a" : c.k === "gray" ? "#bdbdbd" : "#ffffff",
                        }}
                      />
                      <span className="text-sm">{c.label}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* 数量 */}
            <div>
              <h2 className="text-lg font-semibold">
                {i18n.language === "ja" ? "数量" : "Quantity"}
              </h2>
              <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-2 shadow-sm">
                <button
                  type="button"
                  className="h-9 w-9 rounded-md border border-zinc-200 hover:bg-zinc-100"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <input
                  type="number"
                  className="w-16 text-center outline-none"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                />
                <button
                  type="button"
                  className="h-9 w-9 rounded-md border border-zinc-200 hover:bg-zinc-100"
                  onClick={() => setQty((q) => q + 1)}
                >
                  ＋
                </button>
              </div>
            </div>
          </div>

          {/* 右カラム：サマリー */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">
                {i18n.language === "ja" ? "注文内容" : "Summary"}
              </h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-zinc-600">{i18n.language === "ja" ? "プラン" : "Plan"}</dt>
                  <dd className="font-medium">{selectedPlan?.title}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-zinc-600">{i18n.language === "ja" ? "カラー" : "Color"}</dt>
                  <dd className="font-medium">
                    {COLORS.find((c) => c.k === color)?.label}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-zinc-600">{i18n.language === "ja" ? "数量" : "Qty"}</dt>
                  <dd className="font-medium">{qty}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-zinc-600">
                    {i18n.language === "ja" ? "小計 (税抜)" : "Subtotal (excl.)"}
                  </dt>
                  <dd className="font-semibold">
                    ¥{(selectedPlan?.price ?? 0).toLocaleString()}
                    <span className="text-xs text-zinc-500"> × {qty}</span>
                  </dd>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-zinc-200">
                  <dt className="text-zinc-600">{i18n.language === "ja" ? "合計" : "Total"}</dt>
                  <dd className="text-2xl font-bold">
                    ¥{total.toLocaleString()}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-col gap-3">
                <AccentButton>
                  {i18n.language === "ja" ? "購入手続きへ進む" : "Proceed to checkout"}
                </AccentButton>
                <OutlineButton>
                  {i18n.language === "ja" ? "見積PDFをダウンロード" : "Download quote PDF"}
                </OutlineButton>
              </div>

              <p className="mt-4 text-xs text-zinc-500 leading-relaxed">
                {i18n.language === "ja"
                  ? "表示価格は税抜です。実際の配送費・税は次のステップで計算されます。"
                  : "Prices exclude tax. Shipping and taxes are calculated at the next step."}
              </p>
            </div>
          </aside>
        </section>

        {/* FAQ（例） */}
        <section className="mt-14 border-t border-zinc-200 pt-10">
          <h2 className="text-lg font-semibold">FAQ</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-zinc-700">
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h3 className="font-medium">
                {i18n.language === "ja" ? "納期は？" : "What is the lead time?"}
              </h3>
              <p className="mt-2 text-sm text-zinc-600">
                {i18n.language === "ja"
                  ? "在庫状況により2〜3週間程度での出荷を予定しています。"
                  : "Typically ships within 2–3 weeks depending on stock."}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h3 className="font-medium">
                {i18n.language === "ja" ? "請求書払いは可能？" : "Invoice payment?"}
              </h3>
              <p className="mt-2 text-sm text-zinc-600">
                {i18n.language === "ja"
                  ? "法人向けに請求書払いにも対応可能です。お問い合わせください。"
                  : "Invoice is available for business customers. Contact us."}
              </p>
            </div>
          </div>
        </section>

        <footer className="py-12 text-center text-sm text-zinc-500">
          © {new Date().getFullYear()} M2Labo
        </footer>
      </div>
    </main>
  );
}
