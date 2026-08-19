// Выравнивание высот стеклянных панелей карточек по ряду сетки.
// Логика 1:1 из dc-runtime (equalizeGlass), селекторы переведены на новые классы.

export function initEqualizeGlass() {
  const grids = Array.prototype.slice.call(document.querySelectorAll('.format-grid'));
  if (!grids.length) return;

  const equalize = () => {
    grids.forEach((grid) => {
      const panels = Array.prototype.slice.call(grid.querySelectorAll('.format-card__glass'));
      panels.forEach((el) => { el.style.minHeight = ''; });
      const rows = {};
      panels.forEach((el) => {
        const key = Math.round(el.parentNode.offsetTop);
        (rows[key] = rows[key] || []).push(el);
      });
      Object.keys(rows).forEach((k) => {
        const max = Math.max.apply(null, rows[k].map((el) => el.getBoundingClientRect().height));
        rows[k].forEach((el) => { el.style.minHeight = Math.ceil(max) + 'px'; });
      });
    });
  };

  window.addEventListener('load', equalize);
  window.addEventListener('resize', equalize);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(equalize);
  equalize();
}
