// Ленивая подгрузка видео в футере (offer-карточка). Логика 1:1 из dc-runtime.
// Путь к ассету оставлен строкой — файл берётся из assets/ как есть.

export function initFootVideo() {
  const v = document.querySelector('.site-footer__offer-video');
  if (!v || v._init) return;
  v._init = 1;
  v.muted = true; v.defaultMuted = true; v.playsInline = true; v.loop = true;
  fetch('assets/hero.mp4?v=2').then((r) => r.blob()).then((b) => {
    v.src = URL.createObjectURL(b);
    try { v.load(); } catch (e) {}
    const pr = v.play();
    if (pr && pr.catch) pr.catch(() => {});
  }).catch(() => {});
}
