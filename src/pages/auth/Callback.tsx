// src/pages/auth/Callback.tsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";

export default function Callback() {
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    (async () => {
      try {
        // Amplify がリダイレクトURLを解釈してトークンを保存するのを待つ
        const deadline = Date.now() + 8000; // 最大8秒待機（環境次第で余裕を）
        while (Date.now() < deadline) {
          const s = await fetchAuthSession();
          if (s.tokens?.idToken) break;       // セッションができたらOK
          await new Promise(r => setTimeout(r, 150));
        }
        const to = (loc.state as any)?.from?.pathname || "/mypage";
        nav(to, { replace: true });
      } catch (e) {
        nav("/", { replace: true });
      }
    })();
  }, []);

  return null;
}
