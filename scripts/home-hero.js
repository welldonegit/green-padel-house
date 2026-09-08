// Видео-фон hero. Автозапуск для обоих видео (десктоп + моб).
// Важно: src берём из разметки (Vite хеширует пути) и НЕ перезаписываем —
// иначе десктопное IMG_9579 затиралось бы старым hero.mp4.

export function initHomeHero() {
  const videos = document.querySelectorAll('.hero-home__video');
  videos.forEach((v) => {
    if (!v || v._init) return;
    v._init = 1;
    v.muted = true; v.defaultMuted = true; v.playsInline = true; v.loop = true;
    const start = () => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
    try { v.load(); } catch (e) {}
    v.addEventListener('loadeddata', start, { once: true });
    start();
  });
}
