// Маска часу «__:__» (ГГ:ХХ). Логіка форми — окремо від UI, без бібліотек.
//
// Користувач вводить лише цифри; двокрапка додається автоматично після годин.
// М'яке обмеження: години 00–23, хвилини 00–59 (клампимо лише повні групи).
// Плейсхолдер поля: «__:__».

function extractDigits(value) {
  return value.replace(/\D/g, '').slice(0, 4);
}

function format(value) {
  const d = extractDigits(value);
  let hh = d.slice(0, 2);
  let mm = d.slice(2, 4);

  if (hh.length === 2 && Number(hh) > 23) hh = '23';
  if (mm.length === 2 && Number(mm) > 59) mm = '59';

  return d.length > 2 ? hh + ':' + mm : hh;
}

export function initTimeMask() {
  const inputs = Array.prototype.slice.call(document.querySelectorAll('[data-time-mask]'));
  if (!inputs.length) return;

  inputs.forEach((input) => {
    if (input._timeMaskBound) return;
    input._timeMaskBound = 1;

    input.addEventListener('input', () => {
      input.value = format(input.value);
    });
  });
}
