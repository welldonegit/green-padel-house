// Маска телефону +38 (XXX) XXX-XX-XX + перевірка коду оператора.
// Логіка форми — окремо від UI. Без зовнішніх бібліотек валідації.
//
// Prefix «+38 (» фіксований; користувач вводить 10 цифр (код оператора 0XX +
// 7 абонентських) — код набирається повністю, тож його можна стерти.
// Роздільники НЕ додаються в кінці (лише перед заповненою групою), щоб
// backspace не застрягав на «)» чи «-». Плейсхолдер: «+38 (___) ___-__-__».

// Дозволені коди операторів (мобільні коди України).
// ОНОВЛЮЙТЕ цей список за потреби — оператори час від часу отримують нові
// коди (напр., 075 і 077 з'явилися у 2024 році).
const ALLOWED_OPERATOR_CODES = [
  '039', '050', '063', '066', '067', '068', '073', '075', '077',
  '091', '092', '093', '094', '095', '096', '097', '098', '099',
];

function extractVars(value) {
  let d = value.replace(/\D/g, '');
  if (d.startsWith('38')) d = d.slice(2); // код країни
  return d.slice(0, 10);
}

function format(vars) {
  if (!vars) return '';
  const op = vars.slice(0, 3);   // 0XX
  const a = vars.slice(3, 6);    // XXX
  const b = vars.slice(6, 8);    // XX
  const c = vars.slice(8, 10);   // XX
  let s = '+38 (' + op;
  if (a) s += ') ' + a;
  if (b) s += '-' + b;
  if (c) s += '-' + c;
  return s;
}

// Код оператора — перші 3 цифри (0XX). Довжину/формат уже гарантує маска.
function operatorCode(input) {
  return extractVars(input.value).slice(0, 3);
}

// Помилка коду: код введено повністю (3 цифри) і його немає у списку.
function hasCodeError(input) {
  const code = operatorCode(input);
  return code.length === 3 && ALLOWED_OPERATOR_CODES.indexOf(code) === -1;
}

function errorEl(input) {
  const field = input.closest('.field');
  return field ? field.querySelector('[data-phone-error]') : null;
}

// Показ/приховування повідомлення про помилку та стану поля (обводка).
function toggleMessage(input, on) {
  input.classList.toggle('is-invalid', on);
  const err = errorEl(input);
  if (err) err.hidden = !on;
}

// Область форми (щоб різні форми не впливали одна на одну). За замовчуванням —
// весь документ, якщо контейнер [data-phone-scope] не заданий.
function scopeOf(el) {
  return el.closest('[data-phone-scope]') || document;
}

export function initPhoneMask() {
  const inputs = Array.prototype.slice.call(document.querySelectorAll('[data-phone-mask]'));
  if (!inputs.length) return;

  const submits = Array.prototype.slice.call(document.querySelectorAll('[data-phone-submit]'));

  // Кнопка відправки неактивна, поки в її ОБЛАСТІ хоч один код не зі списку.
  const refreshSubmit = () => {
    submits.forEach((btn) => {
      const scoped = Array.prototype.slice.call(scopeOf(btn).querySelectorAll('[data-phone-mask]'));
      btn.classList.toggle('is-phone-invalid', scoped.some(hasCodeError));
    });
  };

  inputs.forEach((input) => {
    if (input._maskBound) return;
    input._maskBound = 1;

    input.addEventListener('input', () => {
      input.value = format(extractVars(input.value));
      // Помилку НЕ показуємо під час набору; але якщо код став валідним —
      // прибираємо вже показане повідомлення.
      if (!hasCodeError(input)) toggleMessage(input, false);
      refreshSubmit();
    });

    // Перевірка коду — на blur (коли номер уже, ймовірно, дописано).
    input.addEventListener('blur', () => {
      if (!extractVars(input.value)) input.value = ''; // лишився тільки префікс
      toggleMessage(input, hasCodeError(input));
      refreshSubmit();
    });

    // Каре в кінець — щоб переформатування не «стрибало».
    input.addEventListener('focus', () => {
      if (input.value) requestAnimationFrame(() => {
        const end = input.value.length;
        input.setSelectionRange(end, end);
      });
    });
  });

  // Перевірка перед відправкою: якщо код невалідний — блокуємо і показуємо помилку.
  submits.forEach((btn) => {
    if (btn._maskSubmitBound) return;
    btn._maskSubmitBound = 1;
    btn.addEventListener('click', (e) => {
      const scoped = Array.prototype.slice.call(scopeOf(btn).querySelectorAll('[data-phone-mask]'));
      const bad = scoped.filter(hasCodeError);
      if (bad.length) {
        e.preventDefault();
        bad.forEach((i) => toggleMessage(i, true));
        refreshSubmit();
      }
    });
  });

  refreshSubmit();
}
