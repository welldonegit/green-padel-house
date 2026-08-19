// Видео-фон hero. Логика 1:1 из dc-runtime (initVideo), ref → querySelector.

export function initHomeHero() {
  const v = document.querySelector('.hero-home__video');
  if (!v || v._init) return;
  v._init = 1;
  v.muted = true; v.defaultMuted = true; v.playsInline = true; v.loop = true;
  const start = () => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
  fetch('assets/hero.mp4?v=2').then((r) => {
    if (!r.ok) throw new Error('http ' + r.status);
    return r.blob();
  }).then((b) => {
    v.src = URL.createObjectURL(b);
    try { v.load(); } catch (e) {}
    v.addEventListener('loadeddata', start, { once: true });
    start();
  }).catch(() => {});
}
