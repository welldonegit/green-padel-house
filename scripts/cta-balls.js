// Разлетающиеся тенісні м'ячі при наведении на кнопку-волну.
// Перенос assets/ball-fx.js без изменений логики, селектор .gph-wave → .btn--wave.
// Картинка мяча — через Vite-импорт (строковый путь в проде даёт 404).
import tennisBall from '../assets/tennis-ball.svg';

export function initCtaBalls() {
  if (window.__gphBalls) return;
  window.__gphBalls = 1;
  const LIFE = 1000, PER_VOLLEY = 3, COOLDOWN = 1000;
  let last = null;

  function spawn(btn) {
    const now = Date.now();
    if (window.__gphVolleyUntil && now < window.__gphVolleyUntil) return;
    window.__gphVolleyUntil = now + COOLDOWN;

    const r = btn.getBoundingClientRect();
    for (let i = 0; i < PER_VOLLEY; i++) {
      const ball = document.createElement('img');
      ball.src = tennisBall; ball.alt = ''; ball.setAttribute('data-gph-ball', '1');
      const size = 12 + Math.random() * 9;
      const dx = (Math.random() - 0.5) * 190, dy = -(64 + Math.random() * 86), rot = (Math.random() - 0.5) * 560;
      const s = ball.style;
      s.position = 'fixed';
      s.left = (r.left + r.width * (0.18 + Math.random() * 0.64)) + 'px';
      s.top = (r.top + r.height * (0.35 + Math.random() * 0.4)) + 'px';
      s.width = size + 'px'; s.height = size + 'px'; s.zIndex = '2147483000'; s.pointerEvents = 'none';
      s.setProperty('--dx', dx.toFixed(1) + 'px');
      s.setProperty('--dy', dy.toFixed(1) + 'px');
      s.setProperty('--rot', rot.toFixed(0) + 'deg');
      s.animation = 'gphBallFly ' + (0.62 + Math.random() * 0.22).toFixed(2) + 's cubic-bezier(.22,.72,.32,1) ' + (i * 55) + 'ms both';
      document.body.appendChild(ball);
      ((el) => { window.setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, LIFE); })(ball);
    }
  }

  document.addEventListener('mouseover', (e) => {
    const t = e.target; if (!t || !t.closest) return;
    const btn = t.closest('.btn--wave'); if (!btn || btn === last) return;
    last = btn; spawn(btn);
  }, true);
  document.addEventListener('mouseout', (e) => {
    const t = e.target; if (!t || !t.closest) return;
    const btn = t.closest('.btn--wave'); if (!btn || btn !== last) return;
    const to = e.relatedTarget;
    if (to && btn.contains(to)) return;
    last = null;
  }, true);
}
