// Полноэкранная галерея мозаики клуба. Логика 1:1 из dc-runtime
// (initLightbox/lbShow/lbOpen/lbClose/lbStep), ref → querySelector.

export function initLightbox() {
  const grid = document.querySelector('.club-mosaic');
  const box = document.querySelector('.lightbox');
  const img = box && box.querySelector('.lightbox__img');
  if (!grid || !box || !img) return;

  const tiles = Array.prototype.slice.call(grid.querySelectorAll('img'));
  if (!tiles.length) return;
  const items = tiles.map((t) => ({ src: t.getAttribute('src'), alt: t.getAttribute('alt') || '' }));
  const count = box.querySelector('.lightbox__count');
  let index = 0, open = false;

  const show = (i) => {
    const n = items.length;
    index = ((i % n) + n) % n;
    const it = items[index];
    img.style.opacity = '0';
    img.style.transform = 'scale(0.98)';
    const reveal = () => { img.style.opacity = '1'; img.style.transform = 'scale(1)'; };
    window.setTimeout(() => {
      img.setAttribute('src', it.src);
      img.setAttribute('alt', it.alt);
      if (img.complete) reveal(); else img.addEventListener('load', reveal, { once: true });
    }, 140);
    if (count) count.textContent = (index + 1) + ' / ' + n;
  };
  const openLb = (i) => { open = true; box.style.display = 'flex'; requestAnimationFrame(() => { box.style.opacity = '1'; }); show(i); };
  const closeLb = () => { open = false; box.style.opacity = '0'; window.setTimeout(() => { if (!open) box.style.display = 'none'; }, 300); };
  const step = (d) => show(index + d);

  tiles.forEach((t, i) => {
    const host = t.parentElement || t;
    if (host._lbBound) return;
    host._lbBound = 1;
    host.addEventListener('click', () => openLb(i));
  });
  box.addEventListener('click', (e) => { if (e.target === box) closeLb(); });
  const closeBtn = box.querySelector('.lightbox__close');
  const prevBtn = box.querySelector('.lightbox__prev');
  const nextBtn = box.querySelector('.lightbox__next');
  if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeLb(); });
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); step(-1); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); step(1); });
  window.addEventListener('keydown', (e) => {
    if (!open) return;
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  });
}
