# Соотношение сторон изображений в блоке «Три кроки до гри» (мобайл)

На десктопе картинки карточек (`.step-card__frame`) имеют соотношение `16 / 9`, а в мобильной версии был override на `4 / 5`. Привёл мобайл к тому же соотношению, что и десктоп — `16 / 9`.

## `styles/sections.css` (медиазапрос `@media (max-width: 860px)`, строка ~505)

```css
@media (max-width: 860px) {
  .steps__num-col { display: none; }
  .step-card__num { display: block; }

  /* БЫЛО */
  .step-card__frame { aspect-ratio: 4 / 5; }

  /* СТАЛО */
  .step-card__frame { aspect-ratio: 16 / 9; } /* моб: то же соотношение, что и на десктопе */
}
```

> Десктопное правило не трогали — там `.step-card__frame { aspect-ratio: 16 / 9; }` (строка ~446).
