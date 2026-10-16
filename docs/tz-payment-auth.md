# ТЗ: Оплата брони + SMS-авторизация (API «Абонемент»)

## Цель
Сейчас бронь корта проходит **без оплаты**. Нужно, чтобы после выбора даты/времени/тренера и ввода имени+телефона юзер:
1. авторизовался по SMS (без личного кабинета — токен живёт только в рамках сессии оплаты);
2. видел свои абонементы (остаток часов) и баланс;
3. оплачивал бронь абонементом / балансом / картой;
4. бронь создавалась **только после успешной оплаты**.

---

## Архитектура и безопасность (обязательно)

Внешний API аутентифицируется двумя токенами:

| Токен | Как передаётся | Что это |
|---|---|---|
| **companyToken** | `Authorization: Bearer <token>` | Статический секрет компании. **НЕЛЬЗЯ во фронте.** |
| **clientToken** | `X-Client-Token: <api_token>` | Персональный токен клиента, выдаётся при SMS-логине |

**Правило:** фронт ходит только на наш backend. Backend хранит `companyToken` (env/секрет), подставляет его на сервере и проксирует запросы к API «Абонемент», прокидывая `X-Client-Token` клиента. `companyToken` не должен попадать в клиентский бандл, логи, ответы фронту.

Базовый URL API «Абонемент» и `companyToken` — вынести в переменные окружения backend.

Телефон везде в формате `380XXXXXXXXX`.

---

## Эндпоинты API «Абонемент»

### Авторизация (нужен только companyToken)

**1. Запрос SMS-кода**
```
POST /sms/request
Authorization: Bearer <companyToken>
Body: { "phone": "380681234567" }
→ 200: { message, seconds, channel: "sms"|"telegram" }
→ 429: код уже слали <3 мин назад / слишком много попыток
```

**2. Логин существующего клиента**
```
POST /login
Authorization: Bearer <companyToken>
Body: { "phone", "code", "device_id" }   // device_id — наш идентификатор устройства/сессии
→ 200: { data: { ... , token } }          // token = api_token клиента (это X-Client-Token)
→ 404: { code: "client_not_found" }        // клиента нет → идём на /register
```

**3. Регистрация нового клиента**
```
POST /register
Authorization: Bearer <companyToken>
Body: { "phone", "first_name", "last_name", "code"? }   // code — если компания подтверждает регистрацию по SMS
→ 200: { data: { ... , token } }                        // тот же api_token
```

### Оплата и бронь (нужны companyToken + X-Client-Token)

**4. Способы оплаты, баланс и абонементы клиента**
```
GET /court/lessons/payment-options?sports_hall_id=<id>&total_price=<num>&client_id=<id?>
Authorization: Bearer <companyToken>
X-Client-Token: <api_token>
→ 200: {
    available_methods: ["abonement"|"balance"|"card"|"online"|"cash"],
    balance: number,
    abonement: [ { id, subscription_id, title, lessons_remaining, is_unlimited, available_to } ],
    total_price, sufficient_funds, recommended_method,
    errors: ["NO_ACTIVE_SUBSCRIPTION"|"INSUFFICIENT_BALANCE"|...]
  }
// Если клиент не найден: errors: ["CLIENT_NOT_FOUND"], abonements (мн. ч.!) = []
```
> `abonement[].lessons_remaining` — это и есть «доступные часы по абонементу».

**5. Забронировать + оплатить**
```
POST /court/lessons/schedule
Authorization: Bearer <companyToken>
X-Client-Token: <api_token>
Body: {
  "id_client", "id_zone", "date" (YYYY-MM-DD), "time" (H:i),
  "duration" (1|2), "count_player" (1..4),
  "count_racket"? (0..4), "ball_tube_count"? (0..4), "id_trainer"?,
  "payment_mode": "abonement"|"balance"|"card",   // только эти три; "auto" и "cash" с сайта НЕ отправлять
  "client_subscription_id"?   // обязателен при payment_mode=abonement (id из п.4 abonement[].id)
}
```
> API поддерживает также `auto` и `cash`, но с сайта их **никогда не отправляем**.

Цена считается на сервере (`total_price` игнорируется). Ответ зависит от `payment_mode`:
- **abonement** → бронь + списание занятия: `{ success, lesson, payment_source_used:"abonement", lessons_before, lessons_after }`
- **balance** → бронь + списание с баланса: `{ success, lesson, charged_amount, balance_before, balance_after }`
- **card** → **бронь ещё НЕ подтверждена**: `{ url, order }` — `url` форма оплаты, `order` id заказа. Бронь подтвердится по колбэку шлюза.

**6. Статус онлайн-оплаты (поллинг для card)**
```
GET /order/is-paid/{orderId}
Authorization: Bearer <companyToken>
X-Client-Token: <api_token>
→ 200: { data: { id, status }, response }
// status: 0=CREATED, 1=OK, 2=ERROR, 3=DECLINED
```

---

## Backend-эндпоинты (наш прокси)

Завести тонкие обёртки, которые добавляют `companyToken` и валидируют вход:

| Наш endpoint | Проксирует | Клиентский токен |
|---|---|---|
| `POST /api/auth/sms-request` | `/sms/request` | — |
| `POST /api/auth/verify` | `/login`, при 404 → `/register` | сохраняет `api_token` в сессии |
| `GET  /api/payment/options` | `/court/lessons/payment-options` | из сессии |
| `POST /api/booking/schedule` | `/court/lessons/schedule` | из сессии |
| `GET  /api/payment/status/:orderId` | `/order/is-paid/{orderId}` | из сессии |

`api_token` клиента после верификации хранить на стороне backend-сессии (httpOnly cookie / серверная сессия), фронту наружу не отдавать. Фронт оперирует своей сессией, backend подставляет `X-Client-Token`.

---

## Алгоритм (клиент → backend → API)

1. Юзер выбрал корт, дату, время, тренера, ввёл имя и телефон.
2. **SMS-логин:**
   1. `POST /api/auth/sms-request { phone }` → показать поле ввода кода (таймер = `seconds`). По полю `channel` показать пользователю, куда ушёл код: `telegram` → «код надіслано в Telegram», `sms` → «код надіслано в SMS».
   2. Юзер вводит код → `POST /api/auth/verify { phone, code, first_name, last_name, device_id }`.
      - backend вызывает `/login`; если `404 client_not_found` → вызывает `/register` (передав имя/фамилию и code при необходимости).
      - backend сохраняет `token` в сессии.
3. **Показать оплату:** `GET /api/payment/options?sports_hall_id&total_price` → показать доступные способы. Правила отображения:
   - **Абонемент** — показывать как способ, только если есть абонемент с `is_unlimited === true` **или** `lessons_remaining >= duration` (duration = кол-во часов брони). Иначе способ скрыть/задизейблить.
   - **Баланс** — три состояния по ответу `payment-options`:
     - `balance == 0` → способ не показывать.
     - `balance > 0` и `sufficient_funds == true` → активный вариант: «З балансу — {total_price} грн, залишиться {balance − total_price} грн».
     - `balance > 0` и `sufficient_funds == false` (или `INSUFFICIENT_BALANCE` в `errors`) → показать неактивным с текстом: «На балансі {balance} грн — для цієї броні недостатньо. Часткова оплата з балансу недоступна, кошти можна використати в клубі або на наступну бронь».

     Смешанной оплаты (часть с баланса + часть картой) в API нет — не пытаться реализовать через два запроса.
   - **Карта** — всегда доступна.
   - Показать баланс и для подходящих абонементов — `title` + остаток `lessons_remaining`.
4. **Бронь + оплата** (`payment_mode` только `abonement`|`balance`|`card`): `POST /api/booking/schedule`:
   - `abonement` → передать `client_subscription_id`; успех → показать «списано, остаток `lessons_after`».
   - `balance` → успех → показать `balance_after`.
   - `card` → получить `{ url, order }`, сохранить `order` в сессии → редирект юзера на `url`.
5. **Для card — страница возврата** `/booking/result` (без параметров в URL, `order` читается из сессии):
   - поллить `GET /api/payment/status/:order` (интервал ~2–3 сек, таймаут ~2–3 мин):
     - `1 (OK)` → показать подтверждение брони;
     - `2 (ERROR)` / `3 (DECLINED)` → показать ошибку, предложить повтор;
     - `0 (CREATED)` → продолжать поллинг.
   > Финальный путь/параметры страницы возврата зависят от того, что вернёт платёжный колбэк «Абонемента»; пока фиксируем `/booking/result` c чтением `order` из сессии, уточним при интеграции.
6. Бронь считается состоявшейся: сразу для `abonement`/`balance`; для `card` — только после `status=OK`.
7. **Страница подтверждения** (после оплаты картой или абонементом): если `balance > 0` — показать одну строку «На вашому балансі {balance} грн».

---

## Защита от дублей
- Фронт: блокировать/дизейблить кнопку «Оплатити» сразу после клика до получения ответа `/api/booking/schedule`.
- Backend: не допускать повторный `schedule` в рамках одной сессии — по факту начатой брони ставить в сессии флаг/`order` и на повторный запрос возвращать уже созданный заказ (идемпотентность), а не создавать новый.

## Обработка ошибок / крайние случаи
- `429` на `/sms/request` — показать «код уже отправлен, подождите» + таймер.
- Неверный код на `/login` → `422` — показать ошибку, дать повторить ввод.
- `INSUFFICIENT_BALANCE` / `NO_ACTIVE_SUBSCRIPTION` в `payment-options` — скрыть/задизейблить соответствующий способ.
- `CLIENT_NOT_FOUND` в `payment-options` — значит сессия без валидного `X-Client-Token`; отправить на SMS-логин.
- Онлайн-оплата: до `status=OK` бронь не показывать как подтверждённую.
- Не логировать телефоны/коды/токены.

---

## Правила проекта
- Логику формы (SMS, шаги) держать отдельно от UI-взаимодействий.
- Никаких секретов во фронте; вся интеграция — через backend-эндпоинты.
- Не менять визуал/тексты/адаптив существующей формы брони — только добавить шаги оплаты.
