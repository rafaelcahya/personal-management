## 11. Mobile App (Android + iOS)

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
