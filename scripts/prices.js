// Точка входа скриптов страницы «Ціни». Падение карточек-стопки — CSS-анимация;
// плавный скролл якорей — scroll-behavior + scroll-padding из reset.

import { initBurgerMenu } from './burger-menu.js';
import { initFooterAccordion } from './footer-accordion.js';
import { initFootVideo } from './foot-video.js';
import { initNavPills } from './nav-pills.js';
import { initCtaBalls } from './cta-balls.js';

function boot() {
  initBurgerMenu();
  initFooterAccordion();
  initFootVideo();
  initNavPills();
  initCtaBalls();
}

if (document.readyState !== 'loading') boot();
else document.addEventListener('DOMContentLoaded', boot);
