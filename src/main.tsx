import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { initSmoothScroll } from "./hooks/useLenis";

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
