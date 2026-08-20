// Грид бронирования: выбор дати, выбор слота + обновление сводки,
// появление плавающего CTA в зоне расписания. Логика 1:1 из dc-runtime
// (initSchedule + tickDock); выбор оформлен классами is-active/is-selected,
// hover-подсветка слота — в CSS.

export function initSchedule() {
  // выбор даты
  const dates = Array.prototype.slice.call(document.querySelectorAll('.schedule__date'));
  dates.forEach((b) => b.addEventListener('click', () => {
    dates.forEach((o) => o.classList.toggle('is-active', o === b));
  }));

  // выбор слота
  const slots = Array.prototype.slice.call(document.querySelectorAll('.schedule__slot'));
  const summary = document.querySelector('[data-schedule-summary]');
  let sel = null;
  slots.forEach((b) => b.addEventListener('click', () => {
    if (sel) sel.classList.remove('is-selected');
    sel = b;
    b.classList.add('is-selected');
    if (summary) {
      summary.textContent = 'Обрано: ' + b.getAttribute('data-court') + ' · ' + b.getAttribute('data-time') + ' · ' + b.getAttribute('data-price') + ' ₴/год';
    }
  }));

  // плавающий CTA
  const dock = document.querySelector('.schedule-dock');
  const sec = document.getElementById('schedule');
  const slot = document.querySelector('.schedule__cta-slot');
  if (!dock || !sec) return;
  let raf = 0;
  const tick = () => {
    raf = 0;
    const r = sec.getBoundingClientRect();
    const vh = window.innerHeight;
    const started = r.top < vh * 0.6;
    const passed = slot ? slot.getBoundingClientRect().top < vh - 96 : r.bottom < vh * 0.4;
    const on = started && !passed;
    dock.style.opacity = on ? '1' : '0';
    dock.style.transform = on ? 'translateY(0)' : 'translateY(12px)';
    dock.style.pointerEvents = on ? 'auto' : 'none';
  };
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  tick();
}
