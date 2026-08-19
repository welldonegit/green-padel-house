// Аккордеон-колонки футера на мобайле. Поведение то же, что в dc-runtime
// (на десктопе всё раскрыто; ≤860 — сворачивается, тап переключает).
// Показ/скрытие делает CSS по data-open; здесь только переключение состояния.

export function initFooterAccordion() {
  const cols = Array.prototype.slice.call(document.querySelectorAll('.site-footer__col'));
  if (!cols.length) return;

  const mq = window.matchMedia('(max-width: 860px)');

  const apply = () => {
    cols.forEach((col) => {
      if (mq.matches) {
        if (!col.dataset.userToggled) col.dataset.open = 'false';
      } else {
        col.dataset.open = 'true';
      }
    });
  };

  cols.forEach((col) => {
    const head = col.querySelector('.site-footer__col-head');
    if (!head) return;
    head.addEventListener('click', () => {
      if (!mq.matches) return;
      col.dataset.userToggled = '1';
      col.dataset.open = col.dataset.open === 'true' ? 'false' : 'true';
    });
  });

  apply();
  mq.addEventListener('change', apply);
}
