// Drag-скролл ленты событий и ig-грида + видео в ig-плитке.
// Логика 1:1 из dc-runtime (bindDragScroll / initFeed).
// Ассет видео — через Vite-импорт (корректный хешированный URL в сборке).
import heroVideoUrl from '../assets/hero.mp4';

function bindDragScroll(g) {
  if (!g || g._dragBound) return;
  g._dragBound = 1;
  let down = false, sx = 0, sl = 0, moved = 0;
  g.addEventListener('pointerdown', (e) => { down = true; moved = 0; sx = e.clientX; sl = g.scrollLeft; g.style.cursor = 'grabbing'; });
  const end = () => { down = false; g.style.cursor = 'grab'; };
  g.addEventListener('pointerup', end);
  g.addEventListener('pointerleave', end);
  g.addEventListener('pointermove', (e) => {
    if (!down) return;
    const d = e.clientX - sx;
    moved = Math.abs(d);
    if (moved > 4) { g.scrollLeft = sl - d; e.preventDefault(); }
  });
  g.addEventListener('click', (e) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
}

// Прокрутка ленты стрелками: шаг = ширина карточки + промежуток.
function bindRailNav(rail, prevBtn, nextBtn) {
  if (!rail || rail._navBound) return;
  rail._navBound = 1;
  const step = () => {
    const card = rail.firstElementChild;
    const gap = parseFloat(getComputedStyle(rail).columnGap) || 24;
    return card ? card.getBoundingClientRect().width + gap : rail.clientWidth * 0.8;
  };
  if (prevBtn) prevBtn.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: 'smooth' }));
  if (nextBtn) nextBtn.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: 'smooth' }));
}

export function initEventRail() {
  bindDragScroll(document.querySelector('.event-rail'));
  bindDragScroll(document.querySelector('.coach-rail'));
  bindDragScroll(document.querySelector('.insta-grid'));
  bindRailNav(
    document.querySelector('.coach-rail'),
    document.querySelector('[data-coach-prev]'),
    document.querySelector('[data-coach-next]')
  );

  const v = document.querySelector('.insta-tile--video video');
  if (v && !v._igSrc) {
    v._igSrc = 1;
    v.muted = true; v.defaultMuted = true; v.playsInline = true; v.loop = true;
    v.src = heroVideoUrl;
    try { v.load(); } catch (e) {}
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  }
}
