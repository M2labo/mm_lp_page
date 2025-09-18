// vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_COGNITO_DOMAIN: string;
  // 追加の環境変数もここに
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}