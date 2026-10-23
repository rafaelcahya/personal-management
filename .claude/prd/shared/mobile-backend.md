## 14. Mobile Backend (API contract for the mobile app)

**Status:** Draft
**Release:** TBD (proposed v1.34)
**Issues:** #874, #876, #877, #920

**What it is**
The mobile app lives in its own repo. This file is the part that stays here: everything the server must do so the app works. The app's screens, flows, and behavior are in the mobile repo's PRD.

The section numbers below are the original ones from the mobile PRD (sections 11, 12, 13, and 3.3.6), so issues and commits still point to the right place.

| Mobile feature        | App side (mobile repo) | Server side (this file)                 |
| --------------------- | ---------------------- | --------------------------------------- |
| App, sign in, session | sections 11, 3.3.6     | sections 11.4, 11.10, 3.3.6 config      |
| Native push           | section 12             | sections 12.1 server, 12.7, 12.9, 12.10 |
| Home screen widgets   | section 13             | section 13.7                            |
| Run Mode              | section 25             | no server changes                       |

---

### 11.4 Accept a Bearer token

Today every API route reads the session from cookies. The app has no cookies, so the server also needs to accept a Bearer token.

- `lib/supabase/server.ts` → `createClient()`: when the request has `Authorization: Bearer <token>`, build the Supabase client from that token instead of cookies. Every route already calls `createClient()`, so all routes support the app **without per-route changes**.
- `middleware.js`: for `/api/*`, a valid Bearer token passes, just like a valid cookie session. Pages (`/main/*`) stay cookie-only.
- When both are sent, the Bearer token wins.
- Missing, expired, or fake token on `/api/*` → `401` JSON. Never a redirect to `/login`.
- Ownership checks don't change — a token only ever sees its own user's data.
- The token is never logged and never accepted in a URL or query string.
- Rate limits work per user, the same as today.
- The web cookie flow doesn't change at all.

**Acceptance criteria**

- GIVEN a valid Bearer token WHEN the app calls any `/api/*` route THEN it gets the same response the web gets with a cookie session.
- GIVEN no token, an expired token, or a fake token WHEN the app calls `/api/*` THEN it gets `401` JSON, not a redirect.
- GIVEN user A's token WHEN the app asks for user B's record by id THEN it gets the same 403/404 the web gets.
- GIVEN I use the web with a cookie WHEN I do anything THEN it works exactly as before (web regression passes).
- GIVEN a Bearer token WHEN the app calls `POST /api/auth/logout` THEN it gets `200` and the session is ended on the server.

---

### 11.10 API

No new endpoints for section 11. Every existing `/api/*` route also accepts `Authorization: Bearer <access token>` (section 11.4).

---

### 3.3.6 Config for mobile sign-in

- Supabase Auth, URL configuration: add `pmapp://auth/callback` to the allowed redirect URLs. Keep the existing web callback.
- The Google provider stays the same one the web uses. No new Google client.
- The app only gets the Supabase URL and the public anon key. No secrets go to the app.

---

### 12.1 Native push — server side

1. `POST /api/notifications/v1/push-subscriptions/mobile` registers the phone as one of my devices (kind `expo`). It returns the device `id` (never the token). The app keeps this id so it can remove the phone with `DELETE /api/notifications/v1/push-subscriptions/[id]` on sign out — it can't look it up later, because the device list never returns the token.
2. `notify()` sends to my web devices (web push) and my phone devices (Expo Push API) **at the same time**. A failure on one never blocks the other, and never blocks the notification list.
3. After sending, the server checks Expo's receipts. `DeviceNotRegistered` → the device is removed, the same as a "gone" web device.
4. Every attempt goes into `push_delivery_log`, the same as web push.
5. When the app sends a new token for the same phone, the new one replaces the old one. The response has the `id` of the row that's kept.
6. Priority: race reminder, anomaly alert, and session ended are sent as time-sensitive (iOS interruption level `time-sensitive`, Android high priority). Everything else is normal. The Android channel id comes from the notification's module: `running`, `inventory`, `trading`, `account`.
7. The push data carries the `url` (the same as web push) and the notification `id`. When I open the push, the app marks it read with `PUT /api/notifications/v1/read` (`{ id }`).
8. Web → Settings → Push on your devices (section 10.4) lists phones next to browsers, named "iPhone app" or "Android app" plus the device model.

**Acceptance criteria**

- GIVEN push on in a browser and on my phone WHEN an alert fires THEN both get it.
- GIVEN push off for "Low stock" WHEN stock runs low THEN the notification shows in the list but no push goes to the phone or browser.
- GIVEN Expo says `DeviceNotRegistered` WHEN receipts are checked THEN that phone is removed and my other devices still get pushes.
- GIVEN Expo is down WHEN an alert fires THEN web devices still get it and the notification is in the list.
- GIVEN another user's token string WHEN I try to register it THEN nothing changes for that user (the device belongs to me, the signed-in user).
- GIVEN a phone is registered WHEN I open the device list on the web THEN it shows as "iPhone app" or "Android app", and the token is never in the response.
- GIVEN I register a phone WHEN `POST /api/notifications/v1/push-subscriptions/mobile` succeeds THEN the response has the device `id` and never the token.
- GIVEN a refresh with a new token for the same phone WHEN it replaces the old one THEN the response has the `id` of the row that's kept.
- GIVEN `notify()` sends to a phone WHEN the push arrives THEN its data has both `url` and the notification `id`.

---

### 12.7 Validations (register phone)

| Field           | Rule                                                | Message                           |
| --------------- | --------------------------------------------------- | --------------------------------- |
| expo_push_token | required, matches `ExponentPushToken[...]`, max 200 | "Invalid push token"              |
| platform        | `ios` or `android`                                  | "Platform must be ios or android" |
| device_name     | optional, max 100                                   | "Device name is too long"         |

---

### 12.9 API (push)

| Method | Path                                            | Notes                                                                                                                                                                            |
| ------ | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | /api/notifications/v1/push-subscriptions/mobile | body `{ expo_push_token, platform, device_name }` — registers or refreshes this phone. Uses `getServerUser` (it outlives the token). Returns `{ data: { id } }`, never the token |
| GET    | /api/notifications/v1/push-subscriptions        | existing — now lists phones too, with `kind` and `platform`. Never returns the token                                                                                             |
| DELETE | /api/notifications/v1/push-subscriptions/[id]   | existing — works for phones too                                                                                                                                                  |
| POST   | /api/notifications/v1/push-subscriptions/test   | existing — body `{ endpoint }`; for a phone the endpoint is its Expo token                                                                                                       |

---

### 12.10 Data (push)

- `push_subscriptions`:
  - new column `kind` (text, not null, default `'web'`, check `web` or `expo`)
  - new column `platform` (text, nullable, `ios` or `android`)
  - `p256dh` and `auth` become nullable; a check keeps them required when `kind = 'web'`
  - for `kind = 'expo'`, `endpoint` holds the Expo push token (still unique)
- `push_delivery_log`: new column `channel` (text, `web` or `expo`).
- `isAllowedPushEndpoint` allows the Expo token format only for `kind = 'expo'`.
- New env var `EXPO_ACCESS_TOKEN` (server only, never `NEXT_PUBLIC_`) — needed when Expo push security is turned on.

---

### 13.7 API (widgets)

| Method | Path                   | Notes                                                                                                                                                        |
| ------ | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| GET    | /api/mobile/v1/widgets | Owner only. Returns `{ generated_at, running, trading, inventory }`. Each section can be `null` with an `error` code when it fails — the others still return |

Built from the existing home highlight services (`lib/services/home/getRunningHighlights.js`, `getTradingHighlights.js`, `getInventoryHighlights.js`). Add missing fields there if needed (weekly goal, top mover). Small payload, standard rate-limit tier.

Response shape:

```json
{
  "data": {
    "generated_at": "2026-10-19T07:05:00Z",
    "running": {
      "week_km": 32.4,
      "goal_km": 40,
      "runs": 3,
      "next_race": { "name": "Jakarta 10K", "date": "2026-11-02", "days_left": 14 }
    },
    "trading": {
      "total_value": 152300000,
      "currency": "IDR",
      "day_change": 1250000,
      "day_change_pct": 0.83,
      "top_mover": { "symbol": "BBCA", "change_pct": 2.1 }
    },
    "inventory": { "low_stock_count": 4, "top": [{ "name": "Shampoo", "days_left": 3 }] }
  }
}
```

**Acceptance criteria**

- GIVEN a valid token WHEN the app calls `GET /api/mobile/v1/widgets` THEN it gets all three sections for the signed-in user only.
- GIVEN the trading part fails WHEN the app calls it THEN `trading` is `null` with an `error` code, and `running` and `inventory` still return.
- GIVEN no token WHEN the app calls it THEN it gets `401` JSON.

**Background refresh (iOS)**

Low stock and race reminder pushes to `ios` phones set `_contentAvailable: true` in the Expo message (`content-available: 1`). This lets iOS wake the app in the background to refresh the Low stock and Running week widgets. The push still shows as a normal alert. Android doesn't need it, and web push doesn't change.

- GIVEN a low stock or race reminder alert WHEN it goes to an `ios` phone THEN the Expo message has `_contentAvailable: true` and still shows as a normal alert.
- GIVEN any other alert, or an `android` phone WHEN the push is sent THEN there's no `content-available` flag.
- GIVEN web push WHEN any alert fires THEN it works exactly as before.

---

### 14.1 Testing

- Cypress API tests: call a sample of routes per module with a Bearer token (valid → 200, missing/expired/fake → 401, other user's id → 403/404). Plus the full web regression to prove cookies still work.
- Cypress API tests for `push-subscriptions/mobile` (validation, owner only, refresh replaces the token) and the changed device list (phones listed, token never returned).
- Cypress API tests for `GET /api/mobile/v1/widgets` (owner only, partial failure, 401).
- All headed, 100% pass.

---

### 14.2 Definition of done

- [ ] Bearer token accepted on `/api/*`; cookie flow unchanged
- [ ] `pmapp://auth/callback` added to Supabase redirect URLs
- [ ] Push: migration for `push_subscriptions` and `push_delivery_log`, new register route, `notify()` sends to web and Expo in parallel, receipts remove dead phones
- [ ] Phones shown in the web device list; test push works for phones
- [ ] `GET /api/mobile/v1/widgets` built from the home highlight services
- [ ] Cypress tests in section 14.1 pass (headed) and web regression passes
- [ ] PRD updated with the final behavior
