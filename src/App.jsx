import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import MobileMoverLanding from "./pages/MobileMoverLanding";
import Purchase from "./pages/Purchase";
// すでにヘッダーを共通化しているなら読み込む
import Header from "./components/Header";
import "./styles/mm-pay.css"; // ← ヘッダー等のCSS

// 固定ヘッダーの高さ（px）
const HEADER_HEIGHT = 64;

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    // ルートが変わったら一度トップへ
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }
    // #id を探してスクロール
    const id = location.hash.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    // まず要素にスムーススクロール
    el.scrollIntoView({ behavior: "smooth", block: "start" });

    // 固定ヘッダーぶんオフセット（スクロール後少し待ってから）
    const timer = setTimeout(() => {
      const y = window.scrollY - HEADER_HEIGHT - 8; // 余裕を8px
      window.scrollTo({ top: y < 0 ? 0 : y, behavior: "instant" });
    }, 250);
    return () => clearTimeout(timer);
  }, [location.pathname, location.hash]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Header />
      {/* ハッシュスクロールを全ページに適用 */}
      <ScrollToHash />

      <Routes>
        {/* トップ（ランディング） */}
        <Route path="/" element={<MobileMoverLanding />} />
        {/* 購入ページ */}
        <Route path="/purchase" element={<Purchase />} />
        {/* ほかのページがあれば追加 */}
      </Routes>
    </BrowserRouter>
  );
}
