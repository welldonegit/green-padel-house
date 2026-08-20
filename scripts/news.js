// Точка входа скриптов страницы «Новина».

import { initBurgerMenu } from './burger-menu.js';
import { initFooterAccordion } from './footer-accordion.js';
import { initFootVideo } from './foot-video.js';
import { initEventRail } from './event-rail.js';
import { initCtaBalls } from './cta-balls.js';

function boot() {
  initBurgerMenu();
  initFooterAccordion();
  initFootVideo();
  initEventRail();
  initCtaBalls();
}

if (document.readyState !== 'loading') boot();
else document.addEventListener('DOMContentLoaded', boot);
