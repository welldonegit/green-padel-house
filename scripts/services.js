// Точка входа скриптов страницы «Послуги». Импортирует общие модули
// интерактивности и инициализирует их. Логика — внутри модулей.

import { initBurgerMenu } from './burger-menu.js';
import { initLangSwitch } from './lang-switch.js';
import { initRaccoon } from './raccoon.js';
import { initCtaFx } from './cta-fx.js';
import { initFooterAccordion } from './footer-accordion.js';
import { initFootVideo } from './foot-video.js';
import { initEqualizeGlass } from './equalize-glass.js';
import { initPhoneMask } from './phone-mask.js';
import { initTimeMask } from './time-mask.js';
import { initCallbackModal } from './callback-modal.js';

function boot() {
  initBurgerMenu();
  initLangSwitch();
  initRaccoon();
  initCtaFx();
  initFooterAccordion();
  initFootVideo();
  initEqualizeGlass();
  initPhoneMask();
  initTimeMask();
  initCallbackModal();
}

if (document.readyState !== 'loading') boot();
else document.addEventListener('DOMContentLoaded', boot);
