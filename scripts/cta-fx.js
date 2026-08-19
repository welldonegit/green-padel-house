// Лаймовые «шарики», разлетающиеся при наведении на кнопку-волну.
// Логика 1:1 из dc-runtime, селектор .gph-wave → .btn--wave.

export function initCtaFx() {
  Array.prototype.slice.call(document.querySelectorAll('.btn--wave')).forEach((btn) => {
    if (btn._fx) return;
    btn._fx = 1;
    btn.addEventListener('mouseenter', () => {
      for (let i = 0; i < 3; i++) {
        const b = document.createElement('span');
        const dx = (Math.random() * 2 - 1) * 90, dy = -40 - Math.random() * 70, rot = (Math.random() * 2 - 1) * 220;
        const r = btn.getBoundingClientRect();
        b.style.cssText = 'position:fixed;left:' + (r.left + r.width * (0.2 + Math.random() * 0.6)) + 'px;top:' + (r.bottom - 14) + 'px;width:12px;height:12px;border-radius:50%;background:#E1F07B;box-shadow:inset -2px -2px 0 rgba(9,9,9,0.18);pointer-events:none;z-index:120;';
        b.animate([
          { transform: 'translate(0,0) scale(0.6) rotate(0deg)', opacity: 1 },
          { transform: 'translate(' + dx * 0.6 + 'px,' + dy + 'px) scale(1) rotate(' + rot * 0.6 + 'deg)', opacity: 1, offset: 0.6 },
          { transform: 'translate(' + dx + 'px,' + (dy * 0.4) + 'px) scale(0.7) rotate(' + rot + 'deg)', opacity: 0 }
        ], { duration: 620 + Math.random() * 220, easing: 'cubic-bezier(.25,.6,.3,1)' });
        document.body.appendChild(b);
        window.setTimeout(() => b.remove(), 900);
      }
    });
  });
}
