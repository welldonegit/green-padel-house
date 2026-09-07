// Модалка «Замовити дзвінок»: відкриття по [data-callback-open], закриття по
// хрестику/оверлею/Escape. Валідацію телефону робить initPhoneMask (поле має
// data-phone-mask, кнопка — data-phone-submit у межах data-phone-scope діалогу).

export function initCallbackModal() {
  const modal = document.querySelector('[data-callback]');
  if (!modal) return;

  const dialog = modal.querySelector('.callback__dialog');
  let lastFocused = null;

  const open = () => {
    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    document.documentElement.style.overflow = 'hidden';
    const first = dialog.querySelector('input, button');
    if (first) requestAnimationFrame(() => first.focus());
  };
  const close = () => {
    modal.classList.remove('is-open');
    document.documentElement.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  };

  Array.prototype.slice.call(document.querySelectorAll('[data-callback-open]'))
    .forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); open(); }));
  Array.prototype.slice.call(modal.querySelectorAll('[data-callback-close]'))
    .forEach((b) => b.addEventListener('click', close));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
  });

  // Бекенду поки немає — не даємо формі перезавантажити сторінку.
  const form = modal.querySelector('.callback__form');
  if (form) form.addEventListener('submit', (e) => { e.preventDefault(); });
}
