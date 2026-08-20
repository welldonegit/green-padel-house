// Фильтр карточек блога по категории (табы).
// Порт dc-runtime initTabs: активная вкладка — класс .is-active, карточки
// показываются/прячутся со staggered-анимацией по data-cat.

export function initBlogTabs(root = document) {
  const tabs = root.querySelector('.blog-tabs');
  const grid = root.querySelector('.blog-grid');
  if (!tabs || !grid || tabs.dataset.bound === '1') return;
  tabs.dataset.bound = '1';

  const btns = Array.prototype.slice.call(tabs.querySelectorAll('[data-tab]'));
  const cards = Array.prototype.slice.call(grid.querySelectorAll('[data-cat]'));

  const paint = (key, animate) => {
    btns.forEach((b) => {
      b.classList.toggle('is-active', b.getAttribute('data-tab') === key);
    });

    let shown = 0;
    cards.forEach((c) => {
      const show = key === 'all' || c.getAttribute('data-cat') === key;
      if (show) {
        const delay = 30 + shown * 40;
        shown++;
        c.style.display = 'flex';
        if (!animate) {
          c.style.opacity = '1';
          c.style.transform = 'translateY(0)';
          return;
        }
        c.style.opacity = '0';
        c.style.transform = 'translateY(14px)';
        window.setTimeout(() => {
          c.style.opacity = '1';
          c.style.transform = 'translateY(0)';
        }, delay);
      } else {
        c.style.opacity = '0';
        c.style.transform = 'translateY(8px)';
        window.setTimeout(() => {
          if (c.style.opacity === '0') c.style.display = 'none';
        }, 300);
      }
    });
  };

  btns.forEach((b) => b.addEventListener('click', (e) => {
    e.preventDefault();
    paint(b.getAttribute('data-tab'), true);
  }));

  const initial = btns.find((b) => b.classList.contains('is-active')) || btns[0];
  if (initial) paint(initial.getAttribute('data-tab'), false);
}
