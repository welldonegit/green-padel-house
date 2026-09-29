// Точка входа скриптов страницы-заглушки «Падел у Кам'янському».
// Один блок (hero) + попап «залиште номер» — переиспользуем callback-modal.

import { initBurgerMenu } from './burger-menu.js';
import { initLangSwitch } from './lang-switch.js';
import { initFooterAccordion } from './footer-accordion.js';
import { initFootVideo } from './foot-video.js';
import { initCtaBalls } from './cta-balls.js';
import { initPhoneMask } from './phone-mask.js';
import { initCallbackModal } from './callback-modal.js';

function boot() {
  initBurgerMenu();
  initLangSwitch();
  initFooterAccordion();
  initFootVideo();
  initCtaBalls();
  initPhoneMask();
  initCallbackModal();
}

if (document.readyState !== 'loading') boot();
else document.addEventListener('DOMContentLoaded', boot);
