// Выезжающее меню-бургер. Логика перенесена из dc-runtime без изменений,
// ref'ы заменены на querySelector по классам/дата-атрибутам.

export function initBurgerMenu() {
  const ov = document.querySelector('.burger-menu__overlay');
  const panel = document.querySelector('.burger-menu');
  if (!ov || !panel || panel._bound) return;
  panel._bound = 1;

  const items = Array.prototype.slice.call(panel.querySelectorAll('.burger-menu__item'));

  const open = () => {
    ov.style.display = 'block';
    requestAnimationFrame(() => { ov.style.opacity = '1'; panel.style.transform = 'translateX(0)'; });
    document.documentElement.style.overflow = 'hidden';
    items.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateX(-10px)';
      window.setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateX(0)'; }, 120 + i * 35);
    });
  };
  const close = () => {
    ov.style.opacity = '0';
    panel.style.transform = 'translateX(-102%)';
    document.documentElement.style.overflow = '';
    window.setTimeout(() => { if (ov.style.opacity === '0') ov.style.display = 'none'; }, 320);
  };

  Array.prototype.slice.call(document.querySelectorAll('[data-menu-open]'))
    .forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); open(); }));
  Array.prototype.slice.call(panel.querySelectorAll('[data-menu-close]'))
    .forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); close(); }));
  ov.addEventListener('click', close);
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && ov.style.display === 'block') close(); });
}
