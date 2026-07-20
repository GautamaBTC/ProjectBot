import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { initSmoothScroll } from "./hooks/useLenis";

// Глобальный перехват ошибок — показываем на экране, чтобы видеть причину сбоя
window.addEventListener('error', (e) => {
  const msg = (e.error && e.error.stack) ? e.error.stack : e.message;
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:999999;background:#400;color:#fff;font:12px monospace;padding:10px;white-space:pre-wrap;max-height:40vh;overflow:auto;';
  el.textContent = 'ERROR: ' + msg;
  document.body.appendChild(el);
});
window.addEventListener('unhandledrejection', (e) => {
  const msg = (e.reason && e.reason.stack) ? e.reason.stack : String(e.reason);
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:999999;background:#400;color:#fff;font:12px monospace;padding:10px;white-space:pre-wrap;max-height:40vh;overflow:auto;';
  el.textContent = 'PROMISE ERROR: ' + msg;
  document.body.appendChild(el);
});

// Initialize Lenis before React mount for seamless scroll from first paint
initSmoothScroll();

// Убираем статический прелоадер (виден был до загрузки JS) — React-прелоадер его заменяет
const boot = document.getElementById('boot-preloader');
if (boot) boot.remove();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
