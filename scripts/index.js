// Точка входа скриптов главной. Импортирует общие модули интерактивности.

import { initBurgerMenu } from './burger-menu.js';
import { initFooterAccordion } from './footer-accordion.js';
import { initFootVideo } from './foot-video.js';
import { initHomeHero } from './home-hero.js';
import { initStory } from './story.js';
import { initLightbox } from './lightbox.js';
import { initEventRail } from './event-rail.js';
import { initStickyCta } from './sticky-cta.js';
import { initCtaBalls } from './cta-balls.js';

function boot() {
  initBurgerMenu();
  initFooterAccordion();
  initFootVideo();
  initHomeHero();
  initStory();
  initLightbox();
  initEventRail();
  initStickyCta();
  initCtaBalls();
}

if (document.readyState !== 'loading') boot();
else document.addEventListener('DOMContentLoaded', boot);
