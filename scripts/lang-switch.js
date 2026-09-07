// Переключатель мови (UA/RU/EN). Открытие/закрытие выпадашки, выбор языка,
// закрытие по клику вне и по Escape. Поддерживает несколько инстансов на
// странице (шапка + меню-бургер) — состояние синхронизируется между ними.
//
// Переключение выбора пока чисто UI-уровня: реального i18n нет, поэтому
// смена языка не трогает контент (бэкенд/словарь подключим отдельно).

export function initLangSwitch() {
  const switches = Array.prototype.slice.call(document.querySelectorAll('[data-lang-switch]'));
  if (!switches.length) return;

  const closeAll = (except) => {
    switches.forEach((el) => {
      if (el === except) return;
      el.classList.remove('is-open');
      const toggle = el.querySelector('[data-lang-toggle]');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  };

  const selectLang = (code) => {
    switches.forEach((el) => {
      const current = el.querySelector('[data-lang-current]');
      if (current) current.textContent = code;
      el.querySelectorAll('.lang-switch__option').forEach((opt) => {
        const active = opt.getAttribute('data-lang-code') === code;
        opt.classList.toggle('is-active', active);
        opt.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    });
  };

  switches.forEach((el) => {
    if (el._langBound) return;
    el._langBound = 1;

    const toggle = el.querySelector('[data-lang-toggle]');
    if (toggle) {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const willOpen = !el.classList.contains('is-open');
        closeAll(willOpen ? el : null);
        el.classList.toggle('is-open', willOpen);
        toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    }

    el.querySelectorAll('.lang-switch__option').forEach((opt) => {
      opt.addEventListener('click', (e) => {
        e.preventDefault();
        selectLang(opt.getAttribute('data-lang-code'));
        closeAll(null);
      });
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-lang-switch]')) closeAll(null);
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll(null);
  });
}
