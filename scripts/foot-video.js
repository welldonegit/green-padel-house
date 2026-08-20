// Видео в футере (offer-карточка). Логика 1:1 из dc-runtime.
// Путь к ассету — через Vite-импорт, чтобы в сборке подставился хешированный URL
// (строковый fetch('assets/hero.mp4') в проде даёт 404 — Vite его не переписывает).
import heroVideoUrl from '../assets/hero.mp4';

export function initFootVideo() {
  const v = document.querySelector('.site-footer__offer-video');
  if (!v || v._init) return;
  v._init = 1;
  v.muted = true; v.defaultMuted = true; v.playsInline = true; v.loop = true;
  v.src = heroVideoUrl;
  try { v.load(); } catch (e) {}
  const pr = v.play();
  if (pr && pr.catch) pr.catch(() => {});
}
