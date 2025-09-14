// src/components/SquareCardWidget.jsx
import { useEffect, useRef, useState } from "react";

export default function SquareCardWidget({ amountJPY, postalCode = "", email = "", onSuccess, onError }) {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null);
  const paymentsRef = useRef(null);
  const cardRef = useRef(null);

  // StrictMode での二重実行対策
  const initializedRef = useRef(false);
  const attachedRef = useRef(false);

  const appId = import.meta.env.VITE_SQUARE_APP_ID;
  const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID;

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        if (initializedRef.current) return;      // ★ 二重初期化ガード
        initializedRef.current = true;

        // SDKロード待ち
        while (!window.Square) { await new Promise(r => setTimeout(r, 30)); }

        const payments = window.Square.payments(appId, locationId);
        paymentsRef.current = payments;

        // 既に子要素があればクリア（再マウント時のゴミ掃除）
        if (containerRef.current) containerRef.current.innerHTML = "";

        const card = await payments.card();
        cardRef.current = card;

        // すでに attach 済みならスキップ
        if (!attachedRef.current && containerRef.current) {
          await card.attach(containerRef.current);
          attachedRef.current = true;
        }

        if (mounted) setReady(true);
      } catch (e) {
        console.error("Square init error:", e);
        onError?.(e);
      }
    })();

    // アンマウント時に破棄（再マウント時の二重表示防止）
    return () => {
      mounted = false;
      try {
        if (cardRef.current?.destroy) cardRef.current.destroy(); // APIにdestroyがある場合
      } catch {}
      // 確実にDOMは空に
      if (containerRef.current) containerRef.current.innerHTML = "";
      paymentsRef.current = null;
      cardRef.current = null;
      attachedRef.current = false;
      // initializedRef は残す（同一マウント内での再初期化を防ぐ）
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appId, locationId]);

  const handlePay = async () => {
    if (!cardRef.current || loading) return;
    setLoading(true);
    try {
      const tokenResult = await cardRef.current.tokenize();
      if (tokenResult.status !== "OK") throw new Error(`Tokenize failed: ${tokenResult.status}`);
      const sourceId = tokenResult.token;

      // 任意: 3DS
      let verificationToken = null;
      try {
        const vr = await paymentsRef.current.verifyBuyer(sourceId, {
          amount: String(amountJPY), currencyCode: "JPY", intent: "CHARGE",
          billingContact: { email, postalCode, countryCode: "JP" },
        });
        verificationToken = vr.token;
      } catch (e) {
        console.warn("verifyBuyer skipped/fallback:", e?.message || e);
      }

      const res = await fetch("/api/square/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceId, amount: amountJPY, verificationToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Payment failed");
      onSuccess?.(data);
    } catch (e) {
      onError?.(e);
      alert("決済エラー: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div ref={containerRef} id="card-container" style={{ width: "100%", minHeight: 48 }} />
      <button
        disabled={!ready || loading}
        onClick={handlePay}
        className="mm-pay-btn"
      >
        {loading ? "処理中..." : "カードで支払う"}
      </button>
    </div>
  );
}
