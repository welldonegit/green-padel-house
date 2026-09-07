// Точка входа скриптов страницы «Бронювання».

import { initBurgerMenu } from './burger-menu.js';
import { initLangSwitch } from './lang-switch.js';
import { initFooterAccordion } from './footer-accordion.js';
import { initFootVideo } from './foot-video.js';
import { initSchedule } from './schedule.js';
import { initBookingBuilder } from './booking-builder.js';
import { initPhoneMask } from './phone-mask.js';
import { initCallbackModal } from './callback-modal.js';
import { initFaq } from './faq.js';
import { initCtaBalls } from './cta-balls.js';

function boot() {
  initBurgerMenu();
  initLangSwitch();
  initFooterAccordion();
  initFootVideo();
  initSchedule();
  initPhoneMask();
  initBookingBuilder();
  initCallbackModal();
  initFaq();
  initCtaBalls();
}

if (document.readyState !== 'loading') boot();
else document.addEventListener('DOMContentLoaded', boot);
