// Точка входа скриптов страницы «Дякуємо» (/thanks).
// Своей логики нет — общие модули шапки/меню/футера и мячи на CTA-волне.

import { initBurgerMenu } from './burger-menu.js';
import { initFooterAccordion } from './footer-accordion.js';
import { initFootVideo } from './foot-video.js';
import { initCtaBalls } from './cta-balls.js';

function boot() {
  initBurgerMenu();
  initFooterAccordion();
  initFootVideo();
  initCtaBalls();
}

if (document.readyState !== 'loading') boot();
else document.addEventListener('DOMContentLoaded', boot);
