// src/components/AuthButtons.tsx
import { signInWithRedirect, signOut } from "aws-amplify/auth";

export function LoginButton({ className="" }) {
  return (
    <button className={`px-4 py-2 bg-[#cddc39] text-black rounded ${className}`} 
            onClick={() => signInWithRedirect()}>
      ログイン
    </button>
  );
}

export function LogoutButton({ className="" }) {
  return (
    <button className={`px-4 py-2 border rounded ${className}`} 
            onClick={() => signOut({ global: true })}>
      ログアウト
    </button>
  );
}
