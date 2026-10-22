# QA Coverage Report

**Last Updated:** 2026-10-22 (Summary counts #900 — 1 test each for Brand and Name summary, both specs 14/14)
**Branch:** fix/issue-900-summary-counts

---

## Summary

| Type      | Tests  | %    |
| --------- | ------ | ---- |
| API       | 1,959  | 54%  |
| UI        | 594    | 25%  |
| **Total** | **2,548** | 100% |

> **UI reconciliation (2026-10-19, #850)** — counted with `npm run cy:coverage -- --it-counts` (it() per spec, UI = `*-ui.cy.js` or a `ui/` folder). Only 18 UI specs exist: Auth 107, Inventory 454, Landing 33 = 594 it(). The old Trading (254), Running (695) and Shared (8) UI numbers had no UI spec behind them and were removed. The Trading Fee/Trade detail tables below still show UI columns for `add-fee`, `summary-fee`, `add-trade` and the other fee/trade specs; those files are API-style specs (a few UI describes inside `add-fee`, `summary-fee`, `add-trade`), so their numbers are not split here. The script's raw API it() total is 2,054 (66 specs), which does not match the 1,810 above (it() inside loops, mixed specs); API numbers were NOT changed and need a separate reconcile.

---

## Module Overview

| Module               | API   | UI    | Total |
| -------------------- | ----- | ----- | ----- |
| Auth + User Settings | 74    | 107   | 181   |
| Inventory Management | 730   | 454   | 1,184 |
| Trading Management   | 369   | 0     | 369   |
| Running Tracker      | 687   | 0     | 687   |
| Notifications        | 72    | 0     | 72    |
| Home (cross-domain)  | 22    | 0     | 22    |
| Landing Page         | 0     | 33    | 33    |
| Shared               | 0     | 0     | 0     |
| **Total**            | **1,954** | **594** | **2,548** |

---

## Detailed Breakdown

### Auth + User Settings

| Feature       | API | UI | Total |
| ------------- | --- | -- | ----- |
| Auth Guard    | 6   | 0  | 6     |
| Login         | 9   | 58 | 67    |
| Logout        | 3   | 32 | 35    |
| Session       | 4   | 17 | 21    |
| User Settings | 13  | 0  | 13    |
| Bearer Auth (#881) | 39 | 0 | 39 |
| **Subtotal**  | **74** | **107** | **181** |

> **User Settings** — `cypress/e2e/settings/settings-api.cy.js` (13 API tests, all passing)
> Covers `GET /api/user` (4), `PUT /api/user` (7), `POST /api/user/avatar` (2): auth guards, response shape, username/nickname persistence, avatar→`avatar_url` roundtrip, partial update, and no-file validation.

> **Bearer Auth (#881)** — `cypress/e2e/auth/bearer/bearer-api.cy.js` (39 API tests, all passing, headed Chrome, 19 s)
> Sample of 6 GET routes (hr-zones, activities, products, fees, notifications, /api/user): valid Bearer vs cookie body shape, no header / fake token = 401 JSON. Also: refresh token, Basic scheme, two tokens, query-string token, exp moved to the past, unknown kid, HS256 header, bad Bearer + good cookie = 401, good Bearer + garbage cookie = 200, page + Bearer = redirect to /login, forged x-auth-source (normal route and /api/.../x.png), PUT /api/user with Bearer (200 / 400 / 400 / 400 / valid and restored), other user activity id = 404 (Bearer and cookie). Not covered: truly expired token (the exp-edit case covers the signature check), `/auth/v1/user` call count (needs Supabase edge logs).

---

### Inventory Management

#### Dashboard

| Feature       | API | UI | Total |
| ------------- | --- | -- | ----- |
| Dashboard     | 54  | 95 | 149   |
| Summary       | 17  | 0  | 17    |
| **Subtotal**  | **71** | **95** | **166** |

#### Product

| Feature              | API | UI | Total |
| -------------------- | --- | -- | ----- |
| Auth Guard           | 26  | 0  | 26    |
| Add Product          | 40  | 60 | 100   |
| Create Stock         | 40  | 0  | 40    |
| Delete Product       | 23  | 0  | 23    |
| Edit Product         | 13  | 0  | 13    |
| Edit Stock Entry     | 19  | 0  | 19    |
| Delete Stock Entry   | 6   | 0  | 6     |
| Favorite Product     | 27  | 0  | 27    |
| Last Price           | 17  | 0  | 17    |
| List Product         | 43  | 98 | 141   |
| Product Detail       | 25  | 35 | 60    |
| Product Filter       | 0   | 9  | 9     |
| Product History      | 25  | 0  | 25    |
| Product List Image   | 0   | 9  | 9     |
| Restock Predictions  | 16  | 0  | 16    |
| Product Summary      | 16  | 0  | 16    |
| Update Product       | 39  | 0  | 39    |
| **Subtotal**         | **375** | **211** | **586** |

#### Product Brand

| Feature          | API | UI | Total |
| ---------------- | --- | -- | ----- |
| Add Brand        | 24  | 23 | 47    |
| Delete Brand     | 17  | 0  | 17    |
| List Brand       | 14  | 26 | 40    |
| Brand Detail     | 20  | 0  | 20    |
| Brand Summary    | 14  | 0  | 14    |
| Update Brand     | 30  | 13 | 43    |
| **Subtotal**     | **119** | **62** | **181** |

#### Product History

| Feature          | API | UI | Total |
| ---------------- | --- | -- | ----- |
| Product History  | 40  | 28 | 68    |
| **Subtotal**     | **40** | **28** | **68** |

#### Product Name

| Feature          | API | UI | Total |
| ---------------- | --- | -- | ----- |
| Add Name         | 23  | 13 | 36    |
| Bulk Name        | 6   | 16 | 22    |
| Delete Name      | 15  | 0  | 15    |
| List Name        | 18  | 15 | 33    |
| Name Detail      | 20  | 0  | 20    |
| Name Summary     | 14  | 0  | 14    |
| Update Name      | 29  | 14 | 43    |
| **Subtotal**     | **125** | **58** | **183** |

**Inventory Total — API: 730 | UI: 454 | Total: 1,184**

---

### Trading Management

#### Dashboard

| Feature          | API | UI | Total |
| ---------------- | --- | -- | ----- |
| Dashboard API    | 27  | 0  | 27    |
| Daily PnL        | 16  | 0  | 16    |
| **Subtotal**     | **43** | **0** | **43** |

#### Trade

| Feature       | API | UI  | Total |
| ------------- | --- | --- | ----- |
| Auth Guard    | 24  | 0   | 24    |
| Add Trade     | 43  | 63  | 106   |
| Delete Trade  | 0   | 6   | 6     |
| List Trade    | 12  | 0   | 12    |
| Option Trade  | 0   | 7   | 7     |
| Trade Summary | 13  | 0   | 13    |
| Trade Detail  | 0   | 15  | 15    |
| Update Trade  | 0   | 32  | 32    |
| **Subtotal**  | **92** | **123** | **215** |

#### Fee

| Feature      | API | UI | Total |
| ------------ | --- | -- | ----- |
| Add Fee      | 0   | 62 | 62    |
| Delete Fee   | 0   | 6  | 6     |
| Fee Detail   | 0   | 15 | 15    |
| List Fee     | 13  | 6  | 19    |
| Fee Summary  | 0   | 23 | 23    |
| Update Fee   | 0   | 19 | 19    |
| **Subtotal** | **13** | **131** | **144** |

#### Event

| Feature        | API | UI | Total |
| -------------- | --- | -- | ----- |
| List Event     | 6   | 0  | 6     |
| Event Summary  | 4   | 0  | 4     |
| Event Detail   | 5   | 0  | 5     |
| Create Event   | 8   | 0  | 8     |
| Update Event   | 5   | 0  | 5     |
| Delete Event   | 4   | 0  | 4     |
| Favorite Event | 5   | 0  | 5     |
| Event Tags     | 4   | 0  | 4     |
| **Subtotal**   | **41** | **0** | **41** |

#### Settings

| Feature          | API | UI | Total |
| ---------------- | --- | -- | ----- |
| Trading Settings | 16  | 0  | 16    |
| **Subtotal**     | **16** | **0** | **16** |

#### Currency Investment

| Feature              | API | UI | Total |
| -------------------- | --- | -- | ----- |
| List Investments     | 9   | 0  | 9     |
| Create Investment    | 15  | 0  | 15    |
| Delete Investment    | 4   | 0  | 4     |
| Holdings List        | 5   | 0  | 5     |
| Holdings Detail      | 5   | 0  | 5     |
| Forex Rates          | 6   | 0  | 6     |
| Forex History        | 9   | 0  | 9     |
| Forex Currencies     | 7   | 0  | 7     |
| **Subtotal**         | **60** | **0** | **60** |

#### Valuation

| Feature              | API | UI | Total |
| -------------------- | --- | -- | ----- |
| Watchlist List       | 2   | 0  | 2     |
| Watchlist Create     | 6   | 0  | 6     |
| Watchlist Delete     | 5   | 0  | 5     |
| Valuation Detail     | 4   | 0  | 4     |
| **Subtotal**         | **17** | **0** | **17** |

#### Research

| Feature              | API | UI | Total |
| -------------------- | --- | -- | ----- |
| Symbol Search        | 3   | 0  | 3     |
| Overview             | 3   | 0  | 3     |
| Technicals           | 3   | 0  | 3     |
| Corporate Events     | 3   | 0  | 3     |
| **Subtotal**         | **12** | **0** | **12** |

#### Investment Flow

| Feature              | API | UI | Total |
| -------------------- | --- | -- | ----- |
| List/Create/Update/Delete Node | 35 | 0 | 35 |
| Move Node             | 7   | 0  | 7     |
| Uninvested Cash       | 11  | 0  | 11    |
| Cash Categories       | 17  | 0  | 17    |
| Highlights            | 11  | 0  | 11    |
| **Subtotal**         | **81** | **0** | **81** |

**Trading Total — API: 369 | UI: 0 | Total: 369** (see UI reconciliation note at the top)

---

### Running Tracker

#### Activities

| Feature                  | API | UI | Total |
| ------------------------ | --- | -- | ----- |
| Activity List            | 28  | 21 | 49    |
| Activity Page Title      | 0   | 10 | 10    |
| Activity Detail          | 23  | 41 | 64    |
| AI Insight               | 8   | 0  | 8     |
| AI Coach Improvements    | 0   | 23 | 23    |
| Cadence Chart            | 0   | 16 | 16    |
| Compare Runs             | 0   | 19 | 19    |
| HR Chart                 | 0   | 18 | 18    |
| HR Zones AI Insight      | 0   | 24 | 24    |
| HR Zones                 | 6   | 0  | 6     |
| Lazy Compute Metrics     | 3   | 0  | 3     |
| Map Style Toggle         | 0   | 14 | 14    |
| Racing Weight Profile    | 12  | 0  | 12    |
| RPE Section              | 0   | 12 | 12    |
| Satellite Map            | 0   | 13 | 13    |
| Splits Bar Chart         | 0   | 24 | 24    |
| Stream Charts            | 7   | 14 | 21    |
| **Subtotal**             | **87** | **249** | **336** |

#### Dashboard

| Feature              | API | UI | Total |
| -------------------- | --- | -- | ----- |
| AI Coach             | 0   | 20 | 20    |
| Dashboard            | 48  | 28 | 76    |
| Dashboard Extended   | 0   | 14 | 14    |
| Gear                 | 6   | 18 | 24    |
| Streak               | 11  | 0  | 11    |
| Weekly Stats Filter  | 21  | 0  | 21    |
| Calendar (#843)      | 20  | 0  | 20    |
| Performance Trends (#843) | 9 | 0 | 9   |
| **Subtotal**         | **115** | **80** | **195** |

#### AI Coach

| Feature              | API | UI | Total |
| -------------------- | --- | -- | ----- |
| AI Coach Page        | 0   | 56 | 56    |
| Friday Prep Card     | 0   | 44 | 44    |
| AI Coach API         | 44  | 0  | 44    |
| **Subtotal**         | **44** | **100** | **144** |

#### Analytics

| Feature                | API | UI | Total |
| ---------------------- | --- | -- | ----- |
| Activity Series        | 8   | 0  | 8     |
| Analytics AI           | 15  | 20 | 35    |
| Analytics              | 0   | 9  | 9     |
| Analytics Overview     | 13  | 0  | 13    |
| Endurance Score        | 9   | 0  | 9     |
| Fitness Age            | 10  | 0  | 10    |
| Gear Analytics         | 10  | 0  | 10    |
| Performance Trends     | 5   | 0  | 5     |
| Personal Bests         | 7   | 19 | 26    |
| Qualifying Run Count   | 0   | 8  | 8     |
| Session Profile        | 18  | 0  | 18    |
| Temperature Efficiency | 24  | 0  | 24    |
| VO2Max Target Effort   | 4   | 31 | 35    |
| VO2max Target (personal) | 14 | 0  | 14    |
| Zone Analytics         | 24  | 0  | 24    |
| **Subtotal**           | **161** | **87** | **248** |

#### Injury AI

| Feature          | API | UI | Total |
| ---------------- | --- | -- | ----- |
| Friday Prep      | 0   | 0  | 0     |
| Injury Coach     | 0   | 12 | 12    |
| Symptom Log      | 0   | 0  | 0     |
| **Subtotal**     | **0** | **12** | **12** |

#### Race Log

| Feature                      | API | UI | Total |
| ---------------------------- | --- | -- | ----- |
| Race Log + Upcoming Races    | 60  | 89 | 149   |
| Upcoming Races Target Time   | 0   | 19 | 19    |
| **Subtotal**                 | **60** | **108** | **168** |

#### Route Builder

| Feature        | API | UI | Total |
| -------------- | --- | -- | ----- |
| Route Builder  | 43  | 0  | 43    |
| **Subtotal**   | **43** | **0** | **43** |

#### Route Simulator

| Feature          | API | UI | Total |
| ---------------- | --- | -- | ----- |
| Route Simulator  | 78  | 0  | 78    |
| **Subtotal**     | **78** | **0** | **78** |

> **Route Simulator and Route Builder (#846)** — `running/route-builder/route-builder-api.cy.js` (43, moved from `running/route-builder.cy.js`) and `running/route-simulator/route-simulator-api.cy.js` (78). 121 API tests, all passing, headed Chrome, 1 min 1 s. Covered: 401 on all 7 simulation endpoints and the route, GPX and map endpoints; 400/422 validation (every superRefine branch, malformed JSON, bad UUID, bad `limit`); 404 for unknown ids and for another user's activity, simulation (GET) and route (GPX export), checked read-only with ids read through a service-role DB task; list/detail/preview/create shape and numbers-as-numbers (Run Mode contract); GPX export (content type, filename, no `<ele>`, XML-escaped name); GPX limits (100,000 points, 4 MB schema cap); CB-1 with a 1,500-row seeded stream (full distance); Bearer spot check on list and detail. Not covered: ai-strategy 200 path (calls Claude), the 413 body guard (needs a 5 MB body), successful map-directions and map-match calls (public OSRM server), PATCH/DELETE/ai-strategy on another user's real simulation or route (random UUIDs used; the `user_id` filter is reviewed in code). Validation on simulation create, preview and PATCH is still 422 (#849). The old Route Builder assertions for PATCH 500 and DELETE 200 on an unknown id were updated to 404, and the list test no longer expects `waypoints`.

#### Manual Entry

| Feature        | API | UI | Total |
| -------------- | --- | -- | ----- |
| Manual Entry   | 0   | 0  | 0     |
| **Subtotal**   | **0** | **0** | **0** |

#### Onboarding

| Feature      | API | UI | Total |
| ------------ | --- | -- | ----- |
| Onboarding   | 12  | 38 | 50    |
| **Subtotal** | **12** | **38** | **50** |

#### Settings

| Feature                  | API | UI | Total |
| ------------------------ | --- | -- | ----- |
| HR Zones                 | 20  | 0  | 20    |
| Settings                 | 21  | 21 | 42    |
| Health Logs (subjective + weight, #845) | 22 | 0 | 22 |
| Strava Auth Routes + OAuth state (#845) | 13 | 0 | 13 |
| HR Zones / Profile / Threshold / Delete guard extras (#845) | 9 | 0 | 9 |
| Threshold Pace Detect    | 6   | 0  | 6     |
| **Subtotal**             | **91** | **21** | **112** |

**Running Total — API: 687 | UI: 0 | Total: 687** (no Running UI specs exist)

> **Settings, Health & Strava (#845)** — `cypress/e2e/running/settings/settings-api.cy.js` (65 tests). Added health subjective/weight (auth, CRUD, 400 validation, malformed id 400, unknown uuid 404), Strava connect redirect and `strava_oauth_state` cookie, callback state rejection (no Strava call), not-connected sync/re-enrich/disconnect, seeded `needs_reconnect` (409) and disconnect, hr-zones read/validate/update+restore, threshold-pace-detect 422, profile 400, and the `DELETE /user/activities` confirmation guard only. The real-Strava callback test was removed (CB-4).
> **Not covered:** IDOR on health `[id]` (no second-user credentials; the Cypress DB client is RLS-bound so it cannot seed another user row), `DELETE /user/activities` success path and `last_sync_at` reset (test account owns 13 real activities), threshold-pace-detect with seeded streams, `re-enrich-metrics`.
> **Open bugs:** `GET /health/{subjective,weight}?page=<past last page>` returns 500 (Supabase PGRST103) instead of an empty page - 2 failing tests. The sync rate-limit tier is 15/hour per user and one spec run uses about 5, so a 4th run inside an hour returns 429.

> **Running Dashboard review (#843)** — `cypress/e2e/running/dashboard/dashboard-api.cy.js` (132 tests, was 93; all passing, 57 s vs 59 s). New: `GET /calendar` (auth 401, month YYYY-MM 400 + message, empty `month=` = current month, tz_offset 400, type letters-only 400, shape) and `GET /performance-trends` (401, limit default 25 / cap 100 / abc,0,negative,decimal 400, empty `limit=`, type, oldest-to-newest, fields). Dashboard and weekly-stats: `tz_offset` outside -840..840 and `weeks_ago` outside 0..4 return 400, empty values are treated as missing, `type=Run1` 400, `health_today` removed, `recent_activities[]` carries gear_name, avg_temp_c, avg_watts, weighted_avg_watts, device_watts. Seeded block (tag `cy843`, 5 rows, deleted in `after()`, pre-existing activity count asserted unchanged): month edges for tz_offset 0 and -420 (end-exclusive), and CB-2 dashboard calendar equals /calendar for a seeded unique type and for Run. Speed-up: repeated GETs reuse one response per query (`cached`).
> **Not covered:** CB-1 (sync then fresh dashboard) — `/auth/strava/sync` is rate-limited to 15/hour and the stub returns before any insert; production-build baseline re-measure (needs a browser session). **Note:** `/dashboard` uses stale-while-revalidate, so the first call after a deploy or code change can return the old payload once (seen: stale `health_today` on the first run).

> **Streak Counter (#820)** — `cypress/e2e/running/dashboard/dashboard-api.cy.js` (11 API tests, all passing).
> Weekly streak folded into `GET /dashboard`. Covers the `streak` object shape/keys, integer & boolean field types, `unit === 'week'`, the `best_weeks >= current_weeks` invariant, at-risk logic (only with a live streak in the last 2 days, mutually exclusive with `active_this_week`), streak being identical across activity-type filters (habit metric ignores type), and invalid `tz_offset` fallback. Data-independent assertions — no seeding required.

---

### Notifications

| Feature                 | API | UI | Total |
| ----------------------- | --- | -- | ----- |
| List + Pagination/Filter | 15  | 0  | 15    |
| Unread Count            | 4   | 0  | 4     |
| Mark Read (+ IDOR/validation) | 10 | 0 | 10   |
| Mark All Read           | 5   | 0  | 5     |
| Realtime Bell (contract + live-update) | 4 | 0 | 4 |
| Settings page notifications: auth guard | 6 | 0 | 6 |
| Push devices (list, register, 2nd device, validation, remove, IDOR, key-proof on move) | 16 | 0 | 16 |
| Push test (validation, not my device) | 4 | 0 | 4 |
| Preferences (incl. new types and browser-only session_ended) | 7 | 0 | 7 |
| `notify()` keeps the in-app row (low stock path) | 1 | 0 | 1 |
| **Subtotal**            | **72** | **0** | **72** |

**Notifications Total — API: 72 | UI: 0 | Total: 72**

> **Notification section on Settings (#856)** — `cypress/e2e/notifications/settings/notification-settings-api.cy.js` (34 API tests). The push tests that lived in `running/settings/settings-api.cy.js` moved here (16 removed there). The success path of the test push needs a real browser subscription and is checked by hand.

> **Realtime Bell (#818)** — `cypress/e2e/notifications/notifications-api.cy.js` (4 API tests, all passing).
> Realtime is websocket-based, so these cover the data contract the bell relies on: list row shape + `data`/`read_at` invariants (2), and a seeded unread notification raising unread-count / sorting newest-first then returning to baseline on mark-read (2). Seeds via `seedNotification`/`deleteNotification` cy.tasks.

---

### Home (cross-domain)

| Feature              | API | UI | Total |
| -------------------- | --- | -- | ----- |
| Inventory highlights | 6   | 0  | 6     |
| Trading highlights   | 5   | 0  | 5     |
| Running highlights   | 11  | 0  | 11    |
| **Subtotal**         | **22** | **0** | **22** |

**Home Total — API: 22 | UI: 0 | Total: 22**

> **Unified Home Dashboard (#821)** — `cypress/e2e/home/home-api.cy.js` (22 API tests, all passing).
> Three independent authenticated highlight endpoints (`/api/home/v1/{inventory,trading,running}`), response shape `{ data }`. Covers per-endpoint auth guard (401), field shape/types, and invariants: inventory active/favorite ≤ total and `lowStockItems` ≤ 3 & ≤ `lowStockCount`; trading `winRate` 0–100 and `tradesLastMonth` ≤ `totalTrades`; running `best_weeks` ≥ `current_weeks`, `unit==='week'`, `nextRace.days_until` ≥ 0, and `tz_offset` clamp/invalid fallback. Data-independent — no seeding required.

---

### Landing Page

| Feature        | API | UI | Total |
| -------------- | --- | -- | ----- |
| Landing Page   | 0   | 33 | 33    |
| **Subtotal**   | **0** | **33** | **33** |

---

### Shared

| Feature   | API | UI | Total |
| --------- | --- | -- | ----- |
| Sidebar   | 0   | 8  | 8     |
| **Subtotal** | **0** | **8** | **8** |

---

## Grand Total

| Module               | API   | UI    | Total |
| -------------------- | ----- | ----- | ----- |
| Auth + User Settings | 35    | 107   | 142   |
| Inventory Management | 730   | 454   | 1,184 |
| Trading Management   | 374   | 254   | 628   |
| Running Tracker      | 579   | 695   | 1,274 |
| Notifications        | 72    | 0     | 72    |
| Home (cross-domain)  | 22    | 0     | 22    |
| Landing Page         | 0     | 33    | 33    |
| Shared               | 0     | 8     | 8     |
| **Total**            | **1,810** | **1,551** | **3,361** |
