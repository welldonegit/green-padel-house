# Ссылка на логотип welldone в футере

Логотип welldone (рядом с «Створено з душею») сделан кликабельным → `https://well-done.com.ua/` (открывается в новой вкладке).

## 1. `partials/footer.html` (основной футер, строка ~76)

Обернуть `<img>` логотипа в `<a>`:

```html
<!-- БЫЛО -->
<img class="site-footer__made-logo" src="assets/welldone.svg" alt="welldone">

<!-- СТАЛО -->
<a class="site-footer__made-link" href="https://well-done.com.ua/" target="_blank" rel="noopener noreferrer">
  <img class="site-footer__made-logo" src="assets/welldone.svg" alt="welldone">
</a>
```

## 2. `styles/components/site-footer.css` (рядом с `.site-footer__made-logo`, строка ~184)

Добавить правило для ссылки и `display: block` логотипу (чтобы не было лишнего отступа и сдвига верстки):

```css
.site-footer__made-link {
  display: inline-flex;
}
.site-footer__made-logo {
  height: var(--space-12); /* 14→12 (Δ2) */
  width: auto;
  display: block; /* добавлено */
}
```

## 3. `index-new-block.html` (старый standalone-футер, строка ~969)

То же самое для консистентности (здесь без CSS-классов, инлайн-стили):

```html
<!-- БЫЛО -->
<img src="assets/welldone.svg" alt="welldone" style="height:14px;width:auto;display:block;">

<!-- СТАЛО -->
<a href="https://well-done.com.ua/" target="_blank" rel="noopener noreferrer" style="display:block;">
  <img src="assets/welldone.svg" alt="welldone" style="height:14px;width:auto;display:block;">
</a>
```

> Визуально футер не изменился, дизайн и тексты не трогали — логотип просто стал ссылкой.
