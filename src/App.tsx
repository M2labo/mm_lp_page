import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import MobileMoverLanding from "./pages/MobileMoverLanding";
import Purchase from "./pages/Purchase";
import Header from "./components/Header";
import "./styles/mm-pay.css"; // ← ヘッダー等のCSS
import MyPage from "./pages/MyPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/auth/Login";
import Callback from "./pages/auth/Callback";


// 固定ヘッダーの高さ（px）
const HEADER_HEIGHT = 64;

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    // ルートが変わったら一度トップへ
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: "auto" });
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
      window.scrollTo({ top: y < 0 ? 0 : y, behavior: "auto" });
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
        <Route path="/" element={<MobileMoverLanding />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/callback" element={<Callback />} />


        {/* ほかのページがあれば追加 */}
        <Route path="/mypage" element={
        <ProtectedRoute>
        <MyPage />
        </ProtectedRoute>
        }/>
      </Routes>
    </BrowserRouter>
  );
}
