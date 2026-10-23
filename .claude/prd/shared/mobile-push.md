## 12. Native Push on the Mobile App

**Status:** Draft
**Release:** TBD (proposed v1.34)
**Issue:** #876
**Needs:** section 11 (Mobile App) first

**What it is**
The phone app (section 11) gets push straight from Apple and Google through Expo push. It uses the same `notify()`, the same notification list, and the same preferences as the web (section 10). Web push keeps working on browsers.

**What it fixes, honestly:** web push and native push both go through Apple and Google, so the sending itself isn't much faster. What native push fixes:

- Android doesn't hold back browser pushes to save battery.
- iPhone doesn't need the site added to the Home Screen first.
- Important alerts can break through Focus mode on iPhone.
- Pushes still arrive when the app is fully closed.

Alerts that come from a scheduled job (like the restock reminder) still arrive at their scheduled time. The app doesn't change that.

---

### 12.1 How it works

1. After sign-in, the app asks for notification permission once. If I allow it, the app gets an **Expo push token** and registers it as one of my devices (kind `expo`).
2. `notify()` sends to my web devices (web push) and my phone devices (Expo Push API) **at the same time**. A failure on one never blocks the other, and never blocks the notification list.
3. After sending, the server checks Expo's receipts. `DeviceNotRegistered` → the device is removed, the same as a "gone" web device.
4. Every attempt goes into `push_delivery_log`, the same as web push.
5. Opening the app refreshes the token. If it changed, the new one replaces the old one.

---

### 12.2 Priority and channels

- **Android channels:** Running, Inventory, Trading, Account. Sound and vibration for each can be changed in Android settings.
- **Time-sensitive** (iOS interruption level `time-sensitive`, Android high priority): race reminder, anomaly alert, session ended.
- Everything else: normal priority.

---

### 12.3 Tapping a push

- The push carries a `url`, the same as web push.
- If the app has a screen for it (Notifications, Run), that screen opens.
- If it doesn't, the web page opens in the phone's browser.
- The notification is marked read when I open it.

---

### 12.4 Where I see my phones

- **Web → Settings → Push on your devices** (section 10.4): phones show up next to browsers, named "iPhone app" or "Android app" plus the device model. Remove and **Send test notification** work the same.
- **App → Settings:** this phone's push status (On / Off / Blocked in phone settings) and **Send test notification**. When blocked, a button opens the phone's notification settings.

---

### 12.5 User stories

- As the owner, I want pushes on my phone even when the app is closed, so that I don't miss alerts.
- As the owner, I want race reminders and anomaly alerts to break through Focus mode, so that I see the important ones in time.
- As the owner, I want tapping a push to take me to the right place, so that I can act on it right away.
- As the owner, I want my phones in the same device list as my browsers, so that I manage push in one place.

---

### 12.6 Acceptance criteria

- GIVEN I allow notifications in the app WHEN registration finishes THEN this phone shows up in my device list on the web as "iPhone app" or "Android app".
- GIVEN push on in a browser and on my phone WHEN an alert fires THEN both get it.
- GIVEN push off for "Low stock" WHEN stock runs low THEN the notification shows in the list but no push goes to the phone or browser.
- GIVEN the app is fully closed WHEN an alert fires THEN the push still shows on the phone.
- GIVEN a race reminder WHEN Focus mode is on (iPhone) THEN it shows as time-sensitive.
- GIVEN Expo says `DeviceNotRegistered` WHEN receipts are checked THEN that phone is removed and my other devices still get pushes.
- GIVEN Expo is down WHEN an alert fires THEN web devices still get it and the notification is in the list.
- GIVEN I tap a push for the Run tab WHEN the app opens THEN the Run tab is shown.
- GIVEN I tap a push for a trading page WHEN it opens THEN the page opens in the phone's browser.
- GIVEN I deny permission WHEN I open App → Settings THEN I see "Blocked" and a button to the phone's notification settings.
- GIVEN I tap **Send test notification** in the app WHEN it sends THEN the test push arrives on this phone only.
- GIVEN another user's token string WHEN I try to register it THEN nothing changes for that user (the device belongs to me, the signed-in user).

---

### 12.7 Validations

| Field           | Rule                                                | Message                           |
| --------------- | --------------------------------------------------- | --------------------------------- |
| expo_push_token | required, matches `ExponentPushToken[...]`, max 200 | "Invalid push token"              |
| platform        | `ios` or `android`                                  | "Platform must be ios or android" |
| device_name     | optional, max 100                                   | "Device name is too long"         |

---

### 12.8 Error states

| Situation                         | What I see                                                          |
| --------------------------------- | ------------------------------------------------------------------- |
| Permission denied                 | "Blocked" status and **Open phone settings**                        |
| Registration failed (network/500) | "Couldn't turn on push. Try again." and a **Try again** button      |
| Test push failed                  | "Test notification couldn't be sent" with the reason in plain words |
| 401                               | Sent to sign-in (section 11.3)                                      |

---

### 12.9 API

| Method | Path                                            | Notes                                                                                                                               |
| ------ | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| POST   | /api/notifications/v1/push-subscriptions/mobile | body `{ expo_push_token, platform, device_name }` — registers or refreshes this phone. Uses `getServerUser` (it outlives the token) |
| GET    | /api/notifications/v1/push-subscriptions        | existing — now lists phones too, with `kind` and `platform`. Never returns the token                                                |
| DELETE | /api/notifications/v1/push-subscriptions/[id]   | existing — works for phones too                                                                                                     |
| POST   | /api/notifications/v1/push-subscriptions/test   | existing — body `{ endpoint }`; for a phone the endpoint is its Expo token                                                          |

---

### 12.10 Data

- `push_subscriptions`:
  - new column `kind` (text, not null, default `'web'`, check `web` or `expo`)
  - new column `platform` (text, nullable, `ios` or `android`)
  - `p256dh` and `auth` become nullable; a check keeps them required when `kind = 'web'`
  - for `kind = 'expo'`, `endpoint` holds the Expo push token (still unique)
- `push_delivery_log`: new column `channel` (text, `web` or `expo`).
- `isAllowedPushEndpoint` allows the Expo token format only for `kind = 'expo'`.
- New env var `EXPO_ACCESS_TOKEN` (server only, never `NEXT_PUBLIC_`) — needed when Expo push security is turned on.

---

### 12.11 Definition of done

- [ ] App asks for permission, registers and refreshes the Expo token
- [ ] `notify()` sends to web and Expo in parallel; receipts remove dead phones
- [ ] Android channels and time-sensitive alerts set up
- [ ] Tapping a push opens the right screen or web page
- [ ] Phones shown in the web device list; test push works for phones
- [ ] Cypress API tests for the new route and the changed list (headed, 100% pass)
- [ ] Manual check on both phones: app closed, Focus mode, tap routing
- [ ] PRD updated with the final behavior
