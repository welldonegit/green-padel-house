// Видео-фон hero. Логика 1:1 из dc-runtime (initVideo), ref → querySelector.
// Ассет через Vite-импорт (корректный хешированный URL в сборке).
import heroVideoUrl from '../assets/hero.mp4';

export function initHomeHero() {
  const v = document.querySelector('.hero-home__video');
  if (!v || v._init) return;
  v._init = 1;
  v.muted = true; v.defaultMuted = true; v.playsInline = true; v.loop = true;
  const start = () => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
  v.src = heroVideoUrl;
  try { v.load(); } catch (e) {}
  v.addEventListener('loadeddata', start, { once: true });
  start();
}
