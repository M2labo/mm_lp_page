// src/pages/MyPage.tsx
import React, { useEffect, useState } from "react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { LogoutButton } from "../components/AuthButtons";

export default function MyPage() {
  const [claims, setClaims] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const s = await fetchAuthSession();
      setClaims(s.tokens?.idToken?.payload || {});
      try {
        const u = await getCurrentUser();
        setUser(u);
      } catch {}
    })();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">MyPage</h1>
      {user && <p>ログイン中: {user.username}</p>}
      {claims && <pre className="bg-zinc-100 p-4 rounded">{JSON.stringify(claims, null, 2)}</pre>}
      <LogoutButton className="mt-6" />
    </main>
  );
}
