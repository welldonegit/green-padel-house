// Покроковий конструктор бронювання (варіант 3).
// Логіка 1:1 з dc-runtime (bBuild): дата+тривалість → корти зі слотами →
// інвентар → синя плашка-сума. Дані слотів детерміновані (aFree/aPrice),
// день рахується від поточної дати. Активний стан — клас .is-active.

const COURTS = 5;

function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}

// Українське відмінювання: 1 вікно / 2-4 вікна / 5+ вікон.
function pl(n, one, few, many) {
  const a = n % 10, b = n % 100;
  if (a === 1 && b !== 11) return one;
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return few;
  return many;
}

// Детермінована «зайнятість»: стабільна для пари (день, корт, година).
function isFree(d, c, h) {
  const x = Math.sin((d + 1) * 37.7 + (c + 1) * 91.3 + (h + 1) * 13.13) * 10000;
  const r = x - Math.floor(x);
  return r > (h >= 17 ? 0.62 : 0.34);
}

function priceAt(h) {
  return h >= 17 ? 1300 : 1100;
}

function dayList() {
  const wd = ['нд', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
  const mo = ['січ', 'лют', 'бер', 'кві', 'тра', 'чер', 'лип', 'сер', 'вер', 'жов', 'лис', 'гру'];
  const mg = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
  const now = new Date();
  const out = [];
  for (let i = 0; i < 10; i++) {
    const dt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    out.push({
      i,
      top: i === 0 ? 'Сьогодні' : (i === 1 ? 'Завтра' : wd[dt.getDay()]),
      bottom: dt.getDate() + ' ' + mo[dt.getMonth()],
      full: dt.getDate() + ' ' + mg[dt.getMonth()],
    });
  }
  return out;
}

function make(tag, cls, html) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
}

export function initBookingBuilder() {
  const root = document.getElementById('booking-builder');
  if (!root) return;

  const daysBox = root.querySelector('[data-bb-days]');
  const dursBox = root.querySelector('[data-bb-durs]');
  const courtsBox = root.querySelector('[data-bb-courts]');
  const racksBox = root.querySelector('[data-bb-racks]');
  const ballsBox = root.querySelector('[data-bb-balls]');
  const cta = root.querySelector('[data-bb-cta]');
  const out = {
    court: root.querySelector('[data-bb-court]'),
    date: root.querySelector('[data-bb-date]'),
    time: root.querySelector('[data-bb-time]'),
    gear: root.querySelector('[data-bb-gear]'),
    coach: root.querySelector('[data-bb-coach-out]'),
    price: root.querySelector('[data-bb-price]'),
  };
  if (!daysBox || !dursBox || !courtsBox) return;

  const days = dayList();
  const state = { date: 0, dur: 60, sel: null, rack: 0, ball: 0, coach: 'Без тренера' };

  // ── Дні (будуються один раз) ──
  days.forEach((d) => {
    const b = make('button', 'booking-builder__day',
      `<span class="booking-builder__day-top">${d.top}</span>` +
      `<span class="booking-builder__day-bottom">${d.bottom}</span>`);
    b.type = 'button';
    b.addEventListener('click', () => { state.date = d.i; state.sel = null; sync(); });
    daysBox.appendChild(b);
  });

  // ── Тривалість ──
  [60, 120].forEach((v) => {
    const b = make('button', 'booking-builder__dur',
      `<span class="booking-builder__dur-title">${v} хв</span>` +
      `<span class="booking-builder__dur-sub">від ${v === 60 ? 1100 : 2200} ₴</span>`);
    b.type = 'button';
    b.dataset.dur = String(v);
    b.addEventListener('click', () => { state.dur = v; state.sel = null; sync(); });
    dursBox.appendChild(b);
  });

  // ── Лічильники інвентарю (0…4) ──
  function buildCounter(box, key) {
    if (!box) return;
    [0, 1, 2, 3, 4].forEach((n) => {
      const b = make('button', 'booking-builder__count', n === 0 ? 'Ні' : '' + n);
      b.type = 'button';
      b.dataset.n = String(n);
      b.addEventListener('click', () => { state[key] = n; sync(); });
      box.appendChild(b);
    });
  }
  buildCounter(racksBox, 'rack');
  buildCounter(ballsBox, 'ball');

  // ── Тренер (статична розмітка з фото; на суму не впливає — оплата в клубі) ──
  const coachBtns = Array.prototype.slice.call(root.querySelectorAll('[data-bb-coach]'));
  coachBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      state.coach = btn.dataset.coachName || 'Без тренера';
      sync();
    });
  });

  // ── Корти зі слотами (перебудовуються при зміні дати/тривалості/вибору) ──
  function renderCourts() {
    courtsBox.innerHTML = '';
    const last = state.dur === 120 ? 21 : 22;
    for (let c = 0; c < COURTS; c++) {
      const card = make('div', 'booking-builder__court');
      const slotsWrap = make('div', 'booking-builder__slots');
      let count = 0;
      for (let h = 7; h <= last; h++) {
        if (!isFree(state.date, c, h)) continue;
        if (state.dur === 120 && !isFree(state.date, c, h + 1)) continue;
        const p = priceAt(h) + (state.dur === 120 ? priceAt(h + 1) : 0);
        const time = pad(h) + ':00';
        const end = pad(h + state.dur / 60) + ':00';
        const id = c + '-' + h;
        const b = make('button', 'booking-builder__slot',
          `<span class="booking-builder__slot-time">${time}</span>` +
          `<span class="booking-builder__slot-price">${p} ₴</span>`);
        b.type = 'button';
        if (state.sel && state.sel.id === id) b.classList.add('is-active');
        b.addEventListener('click', () => {
          state.sel = (state.sel && state.sel.id === id)
            ? null
            : { id, court: 'Корт ' + (c + 1), time, end, price: p };
          sync();
        });
        slotsWrap.appendChild(b);
        count++;
      }
      const freeText = count
        ? count + ' ' + pl(count, 'вільне вікно', 'вільних вікна', 'вільних вікон')
        : 'немає вільних вікон';
      card.appendChild(make('div', 'booking-builder__court-head',
        `<span class="booking-builder__court-name"><span>Корт ${c + 1}</span></span>` +
        `<span class="booking-builder__court-free">${freeText}</span>`));
      if (count) card.appendChild(slotsWrap);
      else card.appendChild(make('div', 'booking-builder__court-empty', 'Оберіть іншу дату або тривалість'));
      courtsBox.appendChild(card);
    }
  }

  function setActive(box, index) {
    if (!box) return;
    Array.prototype.forEach.call(box.children, (c, i) => c.classList.toggle('is-active', i === index));
  }

  function sync() {
    setActive(daysBox, state.date);
    Array.prototype.forEach.call(dursBox.children, (c) => c.classList.toggle('is-active', +c.dataset.dur === state.dur));
    setActive(racksBox, state.rack);
    setActive(ballsBox, state.ball);
    coachBtns.forEach((btn) => btn.classList.toggle('is-active', (btn.dataset.coachName || 'Без тренера') === state.coach));
    renderCourts();

    const sel = state.sel;
    const full = days[state.date] ? days[state.date].full : '';
    const extras = state.rack * 100 + state.ball * 50;
    const gear = [];
    if (state.rack) gear.push(state.rack + ' ' + pl(state.rack, 'ракетка', 'ракетки', 'ракеток'));
    if (state.ball) gear.push(state.ball + ' ' + pl(state.ball, 'тубус', 'тубуси', 'тубусів'));

    if (out.court) out.court.textContent = sel ? sel.court : '—';
    if (out.date) out.date.textContent = full || '—';
    if (out.time) out.time.textContent = sel ? sel.time + '–' + sel.end : '—';
    if (out.gear) out.gear.textContent = gear.length ? gear.join(', ') : 'Без інвентарю';
    if (out.coach) out.coach.textContent = state.coach;
    if (out.price) out.price.textContent = sel ? (sel.price + extras) + ' ₴' : '—';
    if (cta) cta.classList.toggle('is-disabled', !sel);
  }

  sync();
}
