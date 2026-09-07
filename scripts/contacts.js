// Точка входа скриптов страницы «Контакти».

import { initBurgerMenu } from './burger-menu.js';
import { initLangSwitch } from './lang-switch.js';
import { initFooterAccordion } from './footer-accordion.js';
import { initFootVideo } from './foot-video.js';
import { initCtaBalls } from './cta-balls.js';

function boot() {
  initBurgerMenu();
  initLangSwitch();
  initFooterAccordion();
  initFootVideo();
  initCtaBalls();
}

if (document.readyState !== 'loading') boot();
else document.addEventListener('DOMContentLoaded', boot);
