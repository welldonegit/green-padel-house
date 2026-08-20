// Помічник-раккун: показ пика через 5с в зоне #free-play, модалка, док с ответом.
// Логика 1:1 из dc-runtime (initRaccoon); ref'ы → querySelector по новым классам.
// Картинки поз — через Vite-импорт (иначе строковый путь в проде даёт 404).
import raccoonLeft from '../assets/raccoon-left.png';
import raccoonRight from '../assets/raccoon-right.png';

export function initRaccoon() {
  const peek = document.querySelector('.raccoon-peek');
  const bubble = document.querySelector('.raccoon-peek__bubble');
  const modal = document.querySelector('.raccoon-modal');
  const sheet = document.querySelector('.raccoon-sheet');
  const sec = document.getElementById('free-play');
  if (!peek || !modal || !sheet || !sec || peek._bound) return;
  peek._bound = 1;

  const showPeek = () => {
    if (peek._shown) return;
    peek._shown = 1;
    peek.style.transform = 'translateX(0)';
    peek.style.opacity = '1';
    window.setTimeout(() => { if (bubble) { bubble.style.opacity = '1'; bubble.style.transform = 'translateY(0)'; } }, 220);
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting && en.intersectionRatio > 0.25) {
          if (!peek._timer) peek._timer = window.setTimeout(() => { showPeek(); io.disconnect(); }, 5000);
        } else if (peek._timer) { window.clearTimeout(peek._timer); peek._timer = null; }
      });
    }, { threshold: [0, 0.25, 0.5] });
    io.observe(sec);
  } else {
    window.setTimeout(showPeek, 5000);
  }

  const dock = document.querySelector('.raccoon-dock');
  const dockImg = document.querySelector('.raccoon-dock__img');
  const dockBubble = document.querySelector('.raccoon-dock__bubble');

  const open = () => {
    modal.style.display = 'flex';
    requestAnimationFrame(() => { modal.style.opacity = '1'; sheet.style.transform = 'translateY(0) scale(1)'; });
    peek.style.opacity = '0';
    document.documentElement.style.overflow = 'hidden';
  };
  const close = () => {
    modal.style.opacity = '0';
    sheet.style.transform = 'translateY(14px) scale(0.99)';
    document.documentElement.style.overflow = '';
    window.setTimeout(() => {
      modal.style.display = 'none';
      if (dock) { dock.style.display = 'none'; dock.style.opacity = '0'; dock.style.transform = 'translateY(12px)'; }
      if (peek._shown) peek.style.opacity = '1';
    }, 300);
  };
  Array.prototype.slice.call(document.querySelectorAll('[data-rac-open]'))
    .forEach((el) => el.addEventListener('click', (e) => { e.preventDefault(); open(); }));
  Array.prototype.slice.call(sheet.querySelectorAll('[data-rac-close]'))
    .forEach((el) => el.addEventListener('click', (e) => { e.preventDefault(); close(); }));
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.style.display === 'flex') close(); });

  Array.prototype.slice.call(sheet.querySelectorAll('[data-rac-answer]')).forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!dock || !dockImg || !dockBubble) return;
      const pose = btn.getAttribute('data-rac-pose') || 'right';
      const text = btn.getAttribute('data-rac-answer') || '';
      const paint = () => {
        dockImg.src = pose === 'left' ? raccoonLeft : raccoonRight;
        dockBubble.textContent = text;
        const bubbleLeft = pose === 'left';
        dock.style.flexDirection = bubbleLeft ? 'row-reverse' : 'row';
        dockBubble.className = bubbleLeft
          ? 'raccoon-bubble raccoon-dock__bubble raccoon-bubble--right'
          : 'raccoon-bubble raccoon-dock__bubble';
        dock.style.display = 'flex';
        requestAnimationFrame(() => { dock.style.opacity = '1'; dock.style.transform = 'translateY(0)'; });
      };
      if (dock.style.display === 'flex' && dock.style.opacity === '1') {
        dock.style.opacity = '0';
        dock.style.transform = 'translateY(10px)';
        window.setTimeout(paint, 200);
      } else {
        paint();
      }
    });
  });
}
