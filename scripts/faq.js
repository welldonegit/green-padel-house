// FAQ-аккордеон: клик раскрывает/сворачивает ответ с height-анимацией.
// Логика 1:1 из dc-runtime (initFaq), ref'ы → querySelector по классам.

export function initFaq() {
  const items = Array.prototype.slice.call(document.querySelectorAll('.faq-item'));
  if (!items.length) return;

  items.forEach((card) => {
    if (card._bound) return;
    card._bound = 1;
    const body = card.querySelector('.faq-item__body');
    const icon = card.querySelector('.faq-item__icon');
    if (!body) return;
    card.addEventListener('click', () => {
      const open = card._open === true;
      card._open = !open;
      if (icon) icon.style.transform = open ? 'rotate(0deg)' : 'rotate(45deg)';
      if (open) {
        body.style.height = body.scrollHeight + 'px';
        requestAnimationFrame(() => { body.style.height = '0px'; body.style.opacity = '0'; });
      } else {
        body.style.opacity = '1';
        body.style.height = body.scrollHeight + 'px';
        const done = () => { if (card._open) body.style.height = 'auto'; body.removeEventListener('transitionend', done); };
        body.addEventListener('transitionend', done);
      }
    });
  });
}
