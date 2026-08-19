// Появление закреплённой CTA-плашки по скроллу. Логика 1:1 (initStickyCta).
// Показ/скрытие делает CSS по data-off; здесь только переключение атрибута.

export function initStickyCta() {
  const el = document.querySelector('.sticky-cta');
  if (!el) return;
  let raf = 0;
  const tick = () => {
    raf = 0;
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    const foot = document.getElementById('contacts');
    const atFoot = foot ? foot.getBoundingClientRect().top < window.innerHeight - 40 : false;
    el.setAttribute('data-off', (y > window.innerHeight * 0.55 && !atFoot) ? '0' : '1');
  };
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('scroll', onScroll, true);
  tick();
}
