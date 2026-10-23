## 11. Mobile App (Android + iOS)

> **Moving to the mobile repo (2026-10-23).** The app part of this file now lives in the mobile repo PRD (`app.md`). Server parts are in `mobile-backend.md` (section 14). Don't edit this file anymore. It becomes a short pointer once the move is done.

**Status:** Draft
**Release:** TBD (proposed v1.34)
**Issue:** #874

**What it is**
A companion app for my Android phone and iPhone. It does the things a browser can't do well: live pace guidance while I run (running section 25), home screen widgets (section 13), and native push (section 12). It is **not** a copy of the web app — heavy screens stay on the web.

It's for personal use only. It gets installed straight onto my own phones and is never published on the Play Store or App Store.

---

### 11.1 Scope

| In the app (v1)                                          | Stays on the web                                               |
| -------------------------------------------------------- | -------------------------------------------------------------- |
| Sign in with Google (same account as the web)            | Inventory management (products, brands, history, budget)       |
| Run Mode — live pace guidance (running section 25)       | Trading (trades, portfolio, valuation, research, events)       |
| Notification list (the same list as the bell on the web) | Running analytics, activities, race log, gear, AI coach chat   |
| Native push (section 12)                                 | Route Simulator setup (plans are made on the web, used in app) |
| Home screen widgets (section 13)                         | Notification preferences (section 10.3)                        |
| Settings: account, this phone's push, sign out           | Everything else                                                |

Anything that isn't in the app has an **Open on web** link that opens the page in the phone's browser.

---

### 11.2 Tech decisions

| Topic                 | Decision                                                                                                                                                                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Framework             | **Expo (React Native)**, JavaScript only — same as the web, no TypeScript                                                                                                                                                                              |
| Why not a web wrapper | Run Mode needs GPS and our pace logic to keep running when the screen is locked. `expo-location` + `expo-task-manager` do that. A WebView wrapper (Capacitor) gets paused by iOS in the background, which breaks Run Mode                              |
| Where it lives        | `mobile/` folder in this repo with its own `package.json`. The web build, lint, Storybook, and Cypress ignore it                                                                                                                                       |
| Builds                | Expo **development build** (not Expo Go), because widgets need native code. Built with EAS Build or locally                                                                                                                                            |
| Android install       | APK installed straight onto the phone (internal distribution)                                                                                                                                                                                          |
| iOS install           | Paid Apple Developer account. Install with ad hoc distribution (registered device) or TestFlight internal testing — neither is an App Store release. A free account isn't enough: no push, no App Groups for widgets, and the app expires every 7 days |
| Updates               | JS-only changes ship with EAS Update (over the air). A new build is only needed when native code or permissions change                                                                                                                                 |
| Look                  | Follows the phone's light/dark mode. Colors copied from the web palette (`app/tokens.css`) into `mobile/src/theme`                                                                                                                                     |

---

### 11.3 Sign in and session

> Full detail (flows, messages, acceptance criteria): `auth/mobile-authentication.md`, section 3.3.6.

- **Continue with Google**, through Supabase — the same account and data as the web.
- Google opens in the system browser and comes back to the app with a deep link (`pmapp://auth/callback`).
- The session is kept in secure storage (iOS Keychain / Android Keystore). I stay signed in; the app refreshes the token by itself.
- Every API call sends `Authorization: Bearer <access token>`.
- If a call gets 401, the app refreshes the token and tries **once** more. If the refresh fails, I'm sent back to the sign-in screen.
- **Sign out** clears secure storage, removes this phone from my push devices (section 12), and clears the widget data (section 13).

---

### 11.4 Backend: accept a Bearer token

Today every API route reads the session from cookies. The app has no cookies, so the server also needs to accept a Bearer token.

- `lib/supabase/server.ts` → `createClient()`: when the request has `Authorization: Bearer <token>`, build the Supabase client from that token instead of cookies. Every route already calls `createClient()`, so all routes support the app **without per-route changes**.
- `middleware.js`: for `/api/*`, a valid Bearer token passes, just like a valid cookie session. Pages (`/main/*`) stay cookie-only.
- When both are sent, the Bearer token wins.
- Missing, expired, or fake token on `/api/*` → `401` JSON. Never a redirect to `/login`.
- Ownership checks don't change — a token only ever sees its own user's data.
- The token is never logged and never accepted in a URL or query string.
- Rate limits work per user, the same as today.
- The web cookie flow doesn't change at all.

---

### 11.5 Screens

Bottom tab bar: **Run · Notifications · Settings**.

| Screen        | What I see                                                                                                                                                      |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sign in       | App name and icon, **Continue with Google** button                                                                                                              |
| Run           | Run Mode (running section 25)                                                                                                                                   |
| Notifications | The same list as the web bell, newest first, unread marked. Tapping one opens the matching app screen, or the web page when the app has no screen for it        |
| Settings      | Account (name, email, photo) · This phone's push status and **Send test notification** · Widgets help · **Open web app** · App version and build · **Sign out** |

**States for every screen that loads data**

| State   | What I see                                                          |
| ------- | ------------------------------------------------------------------- |
| Loading | Skeleton rows                                                       |
| Error   | "Couldn't load this." and a **Try again** button                    |
| Offline | The last loaded data with an "Offline" banner at the top            |
| Empty   | A short line that says why it's empty (e.g. "No notifications yet") |

Touch targets are at least 44 × 44. Text follows the phone's font size setting.

---

### 11.6 User stories

- As the owner, I want to sign in once with Google on my phone, so that I don't have to sign in every time I open the app.
- As the owner, I want the app to use my existing data, so that I don't have to set anything up twice.
- As the owner, I want a quick link to the web for everything else, so that the app stays small and I still reach every feature.
- As the owner, I want to install the app straight onto my phones, so that I don't have to deal with store reviews.

---

### 11.7 Acceptance criteria

- GIVEN I'm not signed in WHEN I open the app THEN I see the sign-in screen with **Continue with Google**.
- GIVEN I finish Google sign-in WHEN the browser sends me back THEN I land on the Run tab, and I'm still signed in after I close and reopen the app.
- GIVEN I cancel Google sign-in WHEN I come back to the app THEN I stay on the sign-in screen and see "Sign in cancelled".
- GIVEN a valid Bearer token WHEN the app calls any `/api/*` route THEN it gets the same response the web gets with a cookie session.
- GIVEN no token, an expired token, or a fake token WHEN the app calls `/api/*` THEN it gets `401` JSON, not a redirect.
- GIVEN user A's token WHEN the app asks for user B's record by id THEN it gets the same 403/404 the web gets.
- GIVEN I use the web with a cookie WHEN I do anything THEN it works exactly as before (web regression passes).
- GIVEN my access token expired WHEN the app calls an API THEN it refreshes and retries once without me noticing; if the refresh fails, I'm sent to sign-in.
- GIVEN I tap **Sign out** WHEN it finishes THEN secure storage is empty, this phone no longer gets pushes, and widgets show "Sign in to see data".
- GIVEN I'm offline WHEN I open a screen I've opened before THEN I see its last data with the "Offline" banner.
- GIVEN a notification for a page the app doesn't have WHEN I tap it THEN the page opens in the phone's browser.

---

### 11.8 Validations

None for the user — there are no forms in this part. The server validates the Bearer token (signature, expiry, real user).

---

### 11.9 Error states

| Situation                | What I see                                                    |
| ------------------------ | ------------------------------------------------------------- |
| Google sign-in cancelled | "Sign in cancelled" on the sign-in screen                     |
| Google sign-in failed    | "Couldn't sign in. Try again." and the button stays available |
| Token refresh failed     | Sent to sign-in with "Your session ended. Sign in again."     |
| Network or 500           | "Couldn't load this." and **Try again**                       |
| No internet              | "Offline" banner and the last loaded data                     |

---

### 11.10 API

No new endpoints. Every existing `/api/*` route also accepts `Authorization: Bearer <access token>` (section 11.4).

---

### 11.11 Testing

- Cypress API tests: call a sample of routes per module with a Bearer token (valid → 200, missing/expired/fake → 401, other user's id → 403/404). Plus the full web regression to prove cookies still work.
- Mobile app: manual checklist on one Android phone and one iPhone (sign in, restart, sign out, offline). Cypress can't drive a native app.

---

### 11.12 Definition of done

- [ ] `mobile/` Expo app builds and installs on Android (APK) and iPhone (ad hoc or TestFlight internal)
- [ ] Google sign-in, session kept in secure storage, refresh, sign out
- [ ] Bearer token accepted on `/api/*`; cookie flow unchanged
- [ ] Notifications and Settings tabs with loading, error, offline, and empty states
- [ ] Web build, lint, and Storybook ignore `mobile/`
- [ ] Cypress Bearer tests pass (headed) and web regression passes
- [ ] Manual checklist done on both phones
- [ ] PRD updated with the final behavior

---

### 11.13 Roadmap

**Status:** Draft — direction only. Each phase gets its own PRD file and issue before work starts.

**How I pick what goes into the app**
A web feature moves to the app only if I use it away from my laptop: a quick log, a quick check, or something I use while running. Everything else keeps the **Open on web** link (section 11.1).

Once section 11.4 (Bearer token) is done, every `/api/*` route already works for the app. So most phases are app UI only, with no new backend.

#### Phase overview

| Phase | Theme           | What's in it                                                        | Needs backend? | Effort | Depends on     |
| ----- | --------------- | ------------------------------------------------------------------- | -------------- | ------ | -------------- |
| 1     | Foundation (v1) | Sign in, Run Mode, Notifications, Native push, Widgets, Settings    | Yes (11.4)     | High   | —              |
| 2     | After the run   | Activities list + detail, Run calculator, Next race card            | No             | Medium | Phase 1        |
| 3     | Quick log       | Inventory quick stock update, Trading quick add trade               | No             | Medium | Phase 1        |
| 4     | Glance and ask  | Running dashboard summary, Trading portfolio summary, Gear, AI chat | Maybe (AI)     | High   | Phases 2 and 3 |

Release numbers are set when a phase is planned. Phase 1 is proposed for v1.34.

---

#### Phase 1 — Foundation (v1)

Already specified in sections 11.1–11.12, push in section 12, widgets in section 13, sign-in detail in `auth/mobile-authentication.md` (section 3.3.6).

**Done when:** the section 11.12 checklist is complete on both phones.

---

#### Phase 2 — After the run

The first thing I do after a run is check how it went. This phase keeps me in the app instead of opening the web.

| Feature         | Web source                               | What I get in the app                                                               |
| --------------- | ---------------------------------------- | ----------------------------------------------------------------------------------- |
| Activities list | `/main/running/activities`               | Newest first, with distance, time, pace, and date. Pull to refresh. Read-only       |
| Activity detail | `/main/running/activities/[id]`          | Route map, splits per km, heart rate summary, AI insight if there is one. Read-only |
| Run calculator  | `/main/running/run-calculator`           | Pace / time / distance calculator. Runs on the phone, no API needed                 |
| Next race card  | `/main/running/race-log` (upcoming race) | Race name, countdown, goal time. Tap opens the race on the web                      |

- Run tab becomes **Run · Activities** (top switch) or Activities gets its own tab. Decide in the Phase 2 design spec.
- Charts are simple (bars for splits). Full analytics stays on the web.

**Done when:** I can finish a run in Run Mode and see it in Activities after Strava sync, without opening the web.

---

#### Phase 3 — Quick log

Two things I want to log the moment they happen, not later at my laptop.

| Feature                      | Web source                     | What I get in the app                                                                                   |
| ---------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------- |
| Inventory quick stock update | `/main/inventory/product-list` | Search products, tap **+ / −** to change stock, mark as "out of stock". Low stock items show at the top |
| Trading quick add trade      | `/main/trading/trade`          | One short form: ticker, buy/sell, lots, price, date. Fee uses my saved settings                         |

- Same validation and error messages as the web forms (same Zod rules on the server).
- Adding products, brands, and editing full trade details stays on the web.
- Bottom tab bar gets one new tab, **Log**, with Inventory and Trading inside it.

**Done when:** I can update stock in the shop and log a trade right after I place it, and both show on the web right away.

---

#### Phase 4 — Glance and ask

Quick summaries and the AI chats. Comes last because AI chat streaming in React Native needs a check first, and summaries depend on what I actually use from phases 2 and 3.

| Feature                      | Web source                    | What I get in the app                                                     |
| ---------------------------- | ----------------------------- | ------------------------------------------------------------------------- |
| Running dashboard summary    | `/main/running/dashboard`     | This week's distance, training load, next race. Cards only, no big charts |
| Trading portfolio summary    | `/main/trading/dashboard`     | Portfolio value and today's P&L. Read-only                                |
| Gear                         | Running settings (gear)       | Shoe mileage and "replace soon" warning. Read-only                        |
| AI Coach chat                | `/main/running/ai`            | Chat with the running coach                                               |
| AI chat (Inventory, Trading) | Inventory and Trading AI chat | Same chats as the web                                                     |

- Before this phase: a short research task on streaming chat in Expo (`researcher-agent`).
- AI rate limits stay the same per user, web and app together.

**Done when:** I can check my week, my portfolio, and ask the coach a question from the phone.

---

#### Stays on the web (not planned for the app)

| Feature                                                               | Why                                                                                     |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Running Analytics, Zone analytics, Trading Valuation, Investment flow | Heavy charts. Recharts doesn't run in React Native, so every chart would need a rewrite |
| Route Builder                                                         | Drawing a route on a map is much easier with a mouse                                    |
| Route Simulator setup                                                 | Plans are made on the web and used in Run Mode (section 11.1)                           |
| Trading Research, Fee, Currency holdings                              | Wide tables, rarely opened                                                              |
| Inventory master data (Product name, Brand, History)                  | Rarely changed                                                                          |
| Security (2FA), Onboarding, Strava connect, Notification preferences  | Set once, rarely touched                                                                |

If I find myself opening one of these on the phone often, it moves into a future phase.
