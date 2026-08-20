// Sticky-пилюли разделов: подсветка активного по скроллу + плавный переход.
// Логика 1:1 из dc-runtime (initNavPills); rAF-цикл заменён обычным scroll-listener
// (тот же результат без постоянного кадрового пересчёта).

export function initNavPills() {
  const nav = document.querySelector('.nav-pills');
  if (!nav || nav._bound) return;
  nav._bound = 1;

  const links = Array.prototype.slice.call(nav.querySelectorAll('[data-navpill]'));
  if (!links.length) return;

  const paint = (idx) => links.forEach((a, i) => a.setAttribute('data-on', i === idx ? '1' : '0'));

  links.forEach((a, i) => a.addEventListener('click', (e) => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    const y = t.getBoundingClientRect().top + window.pageYOffset - 96;
    try { window.scrollTo({ top: y, behavior: 'smooth' }); } catch (err) { window.scrollTo(0, y); }
    paint(i);
  }));

  const spy = () => {
    const mid = window.innerHeight * 0.35;
    let best = 0;
    links.forEach((a, i) => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t && t.getBoundingClientRect().top <= mid) best = i;
    });
    paint(best);
  };
  window.addEventListener('scroll', spy, { passive: true });
  spy();
}
