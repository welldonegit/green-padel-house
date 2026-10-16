# Правки: мобайл блока «Три кроки до гри» + ссылка welldone в футере

Собрано из трёх мелких правок. Дизайн и тексты не трогали; десктоп блока «Три кроки» без изменений.

---

## 1. Блок «Три кроки до гри» — мобильная раскладка карточек

На десктопе каждая карточка (`.step-card`) — фото (`.step-card__frame`) с тёмным градиентом (`.step-card__scrim`) и стеклянной плашкой текста (`.step-card__chip` → `.step-card__glass`), наложенной поверх картинки снизу.

В мобайле (≤860px) стекло наезжало на фото и белый текст не читался. Переделали так: плашка идёт **под** изображением, без стекла, но с тёмным фоном для читаемости. Соотношение сторон фото привели к десктопному `16 / 9` (был `4 / 5`), отступ между карточками — как в блоке «Простір поза кортом».

### `styles/sections.css` — `@media (max-width: 860px)` (строка ~502)

```css
@media (max-width: 860px) {
  .steps__num-col { display: none; }
  .step-card__num { display: block; }
  .step-card__frame { aspect-ratio: 16 / 9; } /* было 4 / 5 → как на десктопе */

  /* Отступ между карточками как в блоке «Простір поза кортом» (.lounge__grid моб) */
  .steps__list { gap: calc(clamp(14px, 1.6vw, 20px) + var(--space-32)); }

  /* Плашка с текстом — под изображением, без стекла и затемнения картинки */
  .step-card__scrim { display: none; }
  .step-card__chip {
    position: static;      /* было absolute — выводим из наложения под фото */
    inset: auto;
    margin-top: var(--space-16);
  }
  .step-card__glass {
    display: block;
    max-width: none;
    padding: clamp(14px, 2.4vw, 22px) clamp(16px, 3vw, 26px);
    background: var(--color-ink); /* фон как у футера — белый текст читается */
    border: none;
    box-shadow: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border-radius: var(--radius-xl);
  }
}
```

Суть (моб ≤860px):
1. **Фото `16 / 9`** вместо `4 / 5` — как на десктопе (десктопное правило на строке ~446 не трогали).
2. **Плашка под фото** — `.step-card__chip`: `position: static` + `inset: auto` + `margin-top: var(--space-16)`.
3. **Стекло убрано** — у `.step-card__glass` сброшены `border`, `box-shadow`, `backdrop-filter`; `display: block`, `max-width: none`.
4. **Затемнение фото убрано** — `.step-card__scrim { display: none }` (был нужен только для текста поверх фото).
5. **Фон плашки = цвет футера** — `background: var(--color-ink)` + `padding` и `border-radius: var(--radius-xl)`, чтобы белый текст читался.
6. **Отступ между карточками** как в «Простір поза кортом»: `gap: calc(clamp(14px, 1.6vw, 20px) + var(--space-32))`.

---

## 2. Логотип welldone в футере — кликабельная ссылка

Логотип welldone (рядом с «Створено з душею») сделан ссылкой → `https://well-done.com.ua/` (новая вкладка). Визуально футер не изменился.

### `partials/footer.html` (строка ~76)

```html
<!-- БЫЛО -->
<img class="site-footer__made-logo" src="assets/welldone.svg" alt="welldone">

<!-- СТАЛО -->
<a class="site-footer__made-link" href="https://well-done.com.ua/" target="_blank" rel="noopener noreferrer">
  <img class="site-footer__made-logo" src="assets/welldone.svg" alt="welldone">
</a>
```

### `styles/components/site-footer.css` (рядом с `.site-footer__made-logo`, строка ~184)

```css
.site-footer__made-link {
  display: inline-flex;
}
.site-footer__made-logo {
  height: var(--space-12);
  width: auto;
  display: block; /* добавлено — убирает лишний отступ/сдвиг */
}
```

### `index-new-block.html` (старый standalone-футер, строка ~969)

То же самое, но инлайн-стилями:

```html
<!-- БЫЛО -->
<img src="assets/welldone.svg" alt="welldone" style="height:14px;width:auto;display:block;">

<!-- СТАЛО -->
<a href="https://well-done.com.ua/" target="_blank" rel="noopener noreferrer" style="display:block;">
  <img src="assets/welldone.svg" alt="welldone" style="height:14px;width:auto;display:block;">
</a>
```
