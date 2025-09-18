import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./index.css";     // ← 必ず読み込む
import "./styles/mm-pay.css";
import "./i18n.js";
import { configureAmplify } from "./amplifyConfig";


configureAmplify();
const root = document.getElementById("root");
if (!root) {
  throw new Error('#root element not found');
}
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);