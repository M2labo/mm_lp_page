import { useEffect } from "react";
import { signInWithRedirect } from "aws-amplify/auth";

export default function Login() {
  useEffect(() => {
    // ここで Hosted UI へ飛ばす（PKCE/Code Flow）
    signInWithRedirect();
  }, []);
  return null; // 画面は不要
}