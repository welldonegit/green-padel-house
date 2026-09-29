// Переключатели в шапке/бургере: мова (UA/RU) и місто (Львів/Камʼянське).
// Оба используют один визуальный компонент .lang-switch; независимые группы
// различаются атрибутом-обёрткой (data-lang-switch / data-city-switch).
// Логика общая: открытие/закрытие выпадашки, выбор, закрытие по клику вне и по
// Escape. Несколько инстансов одной группы (шапка + бургер) синхронизируются.
//
// Пока чисто UI-уровень: реального i18n / смены города нет, поэтому выбор не
// трогает контент (бэкенд/словарь/маршрут подключим отдельно).

export function initLangSwitch() {
  const GROUPS = [
    { root: 'data-lang-switch', code: 'data-lang-code' },
    { root: 'data-city-switch', code: 'data-city-code' },
  ];
  const allSelector = GROUPS.map((g) => '[' + g.root + ']').join(',');
  const all = Array.prototype.slice.call(document.querySelectorAll(allSelector));
  if (!all.length) return;

  // Закрыть все выпадашки обеих групп (кроме указанной).
  const closeAll = (except) => {
    all.forEach((el) => {
      if (el === except) return;
      el.classList.remove('is-open');
      const toggle = el.querySelector('.lang-switch__toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  };

  GROUPS.forEach((group) => {
    const instances = Array.prototype.slice.call(document.querySelectorAll('[' + group.root + ']'));
    if (!instances.length) return;

    // Синхронный выбор по всем инстансам группы (шапка + бургер).
    const select = (code) => {
      instances.forEach((el) => {
        const current = el.querySelector('.lang-switch__current');
        if (current) current.textContent = code;
        el.querySelectorAll('.lang-switch__option').forEach((opt) => {
          const active = opt.getAttribute(group.code) === code;
          opt.classList.toggle('is-active', active);
          opt.setAttribute('aria-selected', active ? 'true' : 'false');
        });
      });
    };

    instances.forEach((el) => {
      if (el._switchBound) return;
      el._switchBound = 1;

      const toggle = el.querySelector('.lang-switch__toggle');
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
          select(opt.getAttribute(group.code));
          closeAll(null);
        });
      });
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest(allSelector)) closeAll(null);
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll(null);
  });
}
