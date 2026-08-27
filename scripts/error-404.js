// Точка входа скриптов страницы 404.
// Своей логики у страницы нет — только общие модули шапки/меню/футера
// и разлетающиеся мячи на CTA-кнопках с волной.

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
