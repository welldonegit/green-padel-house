// Скролл-сторителлинг: sticky-номер шагов (how-it-works) + кросс-фейд абзацев
// секции about (400vh) + вращение паттерна. Логика 1:1 из dc-runtime (initStory).

export function initStory() {
  const numTrack = document.querySelector('.steps__num-track');
  const cards = Array.prototype.slice.call(document.querySelectorAll('.step-card'));
  const aboutSec = document.querySelector('.about-story');
  const aboutItems = Array.prototype.slice.call(document.querySelectorAll('.about-story__item'));
  const pattern = document.querySelector('.about-story__pattern img');
  if (!cards.length && !aboutSec) return;

  let active = -1, aboutIdx = -1, raf = 0;

  const setActive = (i) => {
    if (i === active) return;
    active = i;
    if (numTrack) numTrack.style.transform = 'translateY(-' + i + 'em)';
  };
  const setAbout = (ai) => {
    if (ai === aboutIdx) return;
    aboutIdx = ai;
    aboutItems.forEach((el, i) => {
      const tf = i === ai ? '0px' : (i < ai ? '-60px' : '60px');
      el.style.transform = 'translateY(' + tf + ')';
      el.style.opacity = i === ai ? '1' : '0';
      el.style.filter = i === ai ? 'blur(0px)' : 'blur(6px)';
    });
  };

  const update = () => {
    raf = 0;
    const mid = window.innerHeight / 2;
    if (cards.length) {
      let idx = active < 0 ? 0 : active;
      cards.forEach((c, i) => { const r = c.getBoundingClientRect(); if (r.top <= mid && r.bottom > mid) idx = i; });
      setActive(idx);
    }
    if (aboutSec) {
      const r = aboutSec.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      setAbout(Math.min(3, Math.floor(p * 4)));
      if (pattern) pattern.style.transform = 'translate(-50%,-50%) scale(' + (0.41 + p * 0.99) + ') rotate(' + (p * 10) + 'deg)';
    }
  };

  const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  setActive(0);
  setAbout(0);
  update();
}
