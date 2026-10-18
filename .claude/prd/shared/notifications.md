## 10. Notifications and Push (v1.33, #856 and #857)

One notification system for the whole app. Any module can notify you, and you choose where pushes go and which alerts you get — in one place: the **Settings** page (`/main/settings`), in two sections right under Profile.

### 10.1 How it works

Every alert goes through one function, `notify()`:

1. It saves the notification in the **notification list** (the bell). This always happens.
2. It sends a **push** to every device you turned push on for — unless you turned push off for that type.
3. A push that can't be delivered never breaks step 1. Failures are recorded in `push_delivery_log`; dead devices (the push service says "gone") are removed on their own.

Used by: the 7 Running alerts (post-activity, weekly review, Friday prep, anomaly, race reminder, personal record, gear mileage) and Inventory low stock.

### 10.2 Devices

- Each browser you turn push on for is one **device**. Turning it on in your phone doesn't turn it off on your laptop.
- A device has: name (from the browser, e.g. "Chrome on Android"), when it was added, when it was last opened, when a push last reached it.
- Removing a device here stops pushes to it. It doesn't clear the permission inside that browser.
- If you sign in with another account on the same browser, that browser's device moves to the account that is signed in now (it's one physical browser).
- Opening the app refreshes this browser's device. If the browser changed its subscription, the new one replaces the old. If push stopped because _this_ browser's subscription expired, it subscribes again by itself. A device you removed from another browser stays removed.

### 10.3 Preferences

- Every notification type has a **push** switch, default on. The notification list is not affected — alerts always show there.
- Types: post-activity insight, weekly review, Friday race prep, anomaly alerts, race reminders, personal records, gear mileage, Strava disconnected (Running); low stock, restock reminder (Inventory); event analysis ready (Trading); weekly summary (Home); session ended (Account); product updates.
- Before v1.33 these switches lived on Running Settings. They now live only on the Settings page; Running Settings has no notification section.

### 10.4 On the Settings page

Two sections, directly under Profile (there is no separate notifications page):

**Push on your devices**

| State         | What you see                                                                                             |
| ------------- | -------------------------------------------------------------------------------------------------------- |
| Loading       | Skeleton rows                                                                                            |
| Error         | "Couldn't load your devices." and a Try again button                                                     |
| No devices    | Empty state: "No devices yet — turn on push on a device to receive notifications there."                 |
| Has devices   | One row per device with a "This device" tag, dates, and a remove button; a Send test notification button |
| Blocked       | Steps to allow notifications in the browser, because the switch can't help                               |
| Not supported | The switch is off and disabled; the browser permission line says it's not supported                      |

Also shown: browser permission (Allowed / Blocked / Not asked yet), last delivered push, last problem (in plain words, e.g. "the subscription expired").

**What to notify** — switches grouped by module (Running, Inventory). Saves on each change; if saving fails the switch goes back and an error shows.

Mobile: single column, remove and test buttons at least 44px tall.

### 10.5 API

| Method | Path                                          | Notes                                                                                                    |
| ------ | --------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| GET    | /api/notifications/v1/push-subscriptions      | `{ user_id, devices[], last_success, last_failure }` — never returns keys                                |
| POST   | /api/notifications/v1/push-subscriptions      | body `{ subscription }` — registers or refreshes a device; 400 if the endpoint isn't a real push service |
| DELETE | /api/notifications/v1/push-subscriptions/[id] | 400 not a uuid, 404 not found or not yours                                                               |
| POST   | /api/notifications/v1/push-subscriptions/test | body `{ endpoint }` — only a device of yours; 404 otherwise. Limited to 15 per 10 minutes                |
| GET    | /api/notifications/v1/preferences             | every type with `push_enabled`                                                                           |
| PATCH  | /api/notifications/v1/preferences             | body `{ type, push_enabled }`                                                                            |

### 10.6 Data

- `push_subscriptions` — one row per device: `user_id`, `endpoint` (unique), `p256dh`, `auth`, `user_agent`, `created_at`, `last_seen_at`, `last_success_at`. You can read and delete your own rows; the server writes them.
- `notification_preferences` — `user_id` + `type` → `push_enabled`. No row means on.
- `push_delivery_log` — one row per push attempt (kept 30 days).
- The old columns `rt_user_settings.push_subscription`, `push_notifications_enabled`, and `notify_*` are no longer used. They stay for now and get removed in a later cleanup.

### 10.7 Acceptance criteria

- GIVEN I turn push on in two browsers WHEN an alert fires THEN both get a push.
- GIVEN I turn push off for "Low stock" WHEN stock runs low THEN the notification shows in the list but no push is sent.
- GIVEN a device's subscription is gone WHEN a push is sent THEN that device is removed and my other devices still get it.
- GIVEN the push service is down WHEN an alert fires THEN the notification still shows in the list.
- GIVEN I remove a device here WHEN the next alert fires THEN that device gets nothing.
- GIVEN another account's device id WHEN I try to remove it THEN I get "not found" and it stays.

### 10.8 New alerts (v1.33, #857)

All times are **WIB (Asia/Jakarta, UTC+7)**. Every alert below also shows in the notification list, and each has a push switch (default on) on the Settings page.

| Alert                    | When it fires                                                                                                   | Opens                                                    |
| ------------------------ | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| **Strava disconnected**  | The moment the Strava link breaks (Strava rejects the token). Once per break — nothing more until you reconnect | Running Settings                                         |
| **Low stock**            | Stock drops below 5 (already existed; now also a push)                                                          | Product detail                                           |
| **Restock reminder**     | Every day 09:00. A product will run out in 14 days or less, going by how fast you use it                        | Product detail                                           |
| **Event analysis ready** | When the AI analysis of a trading event is saved                                                                | The event (or the event list for a multi-event analysis) |
| **Weekly summary**       | Every Monday 08:00                                                                                              | Home                                                     |
| **Session ended**        | You were signed out by accident while this tab was in the background. Shown by your browser, not by the server  | Login                                                    |

**Restock reminder rules**

- Same math as the Inventory dashboard's Restock Prediction: `days_until_empty = avg_days × quantity`.
- Only active products with stock left, and only when there is enough history: **at least 3 usage sessions** (two gaps to average).
- Remind when `days_until_empty` is **14 days or less** (the dashboard's "Soon" level).
- **Once per stock cycle**: after a reminder, that product stays quiet until you add new stock.
- At most 5 reminders per day, most urgent first.
- Products already at zero are not covered here; Low stock handles those.

**Weekly summary rules**

- A rolling look at the last 7 days (and the next 7 days for events). Lines for modules with nothing to say are left out. If every module is empty, nothing is sent.
- **Running:** number of runs and total km; the next race if it is within 14 days.
- **Trading:** trades closed (by sell date) and their realized P&L in IDR; number of events in the next 7 days.
- **Inventory:** number of products low and out of stock; this month's spend against the total monthly budget (the month follows WIB).
- One per week. It complements Running's Weekly Review (the AI analysis on Sunday evening); it doesn't replace it.
- Example: `Running: 2 runs, 20.0 km · Trading: 3 trades closed, +Rp. 1.840.171 · Inventory: 4 low, 8 out of stock`.

**Copy**

| Alert                | Title                   | Message                                                              |
| -------------------- | ----------------------- | -------------------------------------------------------------------- |
| Strava disconnected  | Strava disconnected     | Reconnect Strava so your new runs keep syncing.                      |
| Restock reminder     | Restock soon: {product} | {product} will run out in about {n} days ({q} left). Plan a restock. |
| Event analysis ready | Event analysis ready    | The AI analysis of "{event}" is ready.                               |
| Weekly summary       | Your week at a glance   | the lines above, joined with " · "                                   |
| Session ended        | You were signed out     | Your session ended. Tap to sign in again.                            |

**Session ended, in detail**

- Only for an unintended sign-out (session expired or refresh failed), never when you press Sign out.
- Only when the page is hidden and the browser allows notifications. A visible page just goes to the login screen.
- It never reaches the notification list or other devices, because the server can't know a session ended. If the whole browser is closed, nothing can be shown.
- The switch is remembered in this browser while you're signed in, because after sign-out it can't be read from the server.

**Acceptance criteria**

- GIVEN Strava rejects my token at the same time in two jobs WHEN the link breaks THEN I get one notification, and none again until I reconnect.
- GIVEN a product has fewer than 3 usage sessions WHEN the daily check runs THEN it is never reminded.
- GIVEN I got a restock reminder for a product WHEN I add new stock and it runs low again THEN I get a new reminder.
- GIVEN an AI event analysis finishes WHEN it is saved THEN I get the notification, not when I press Analyze.
- GIVEN a week with no runs, trades, events, or stock trouble WHEN Monday 08:00 comes THEN nothing is sent.
- GIVEN I press Sign out WHEN the session ends THEN no "signed out" notification appears.

---
