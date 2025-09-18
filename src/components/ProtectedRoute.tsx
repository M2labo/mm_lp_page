// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [ok, setOk] = React.useState<boolean | null>(null);
  const location = useLocation();

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const s = await fetchAuthSession();
        mounted && setOk(!!s.tokens?.idToken);
      } catch {
        mounted && setOk(false);
      }
    })();
    return () => { mounted = false; };
  }, [location.key]);

  if (ok === null) return null; // ローディング中はスピナー等を表示しても良い
  if (!ok) return <Navigate to="/auth/login" replace state={{ from: location }} />;
  return children;
}
