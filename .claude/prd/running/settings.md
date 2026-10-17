### 11.7 Running Settings page

**Route:** `/main/running/settings`
**Component:** `app/main/running/(app)/settings/page.jsx`

> As a runner, I want to manage my profile, HR zones, pace zones, notifications, and Strava connection in one place so that the app calculates zones and sends alerts accurately.

The Settings page is divided into six sections, each as its own `<section>` component. Sections load independently — a failure in one section does not blank the others.

---

#### 11.7.1 Profile (`ProfileSection.jsx`)

API: `GET /api/running/v1/user/profile`, `PATCH /api/running/v1/user/profile`

Fields:

- Display Name (`displayNameInput_settingsPage`) — text, max 100 chars
- Date of Birth (`birthDateInput_settingsPage`) — calendar popover, used for age-graded performance and fitness age chart
- Height in cm (`heightInput_settingsPage`) — positive number
- Weight in kg (`weightInput_settingsPage`) — positive number, step 0.1
- Sex (`sexSelect_settingsPage`) — Male / Female / Prefer not to say (maps to `null`)

**BMI chip (`bmiChip_settingsPage`):** computed live from weight + height. Shows category (Underweight / Normal / Overweight / Obese) with colour (violet for Normal, amber for others). When either weight or height is missing, a contextual prompt (`bmiMissingPrompt_settingsPage`) shows a link to the missing field.

**Save behaviour:** `PATCH /api/running/v1/user/profile` with changed fields only. Success toast: `profileSaveSuccess_settingsPage`. Error inline: `profileSaveError_settingsPage`. Save button: `profileSaveBtn_settingsPage`. Loading skeleton: `profileLoading_settingsPage`.

Validations (Zod, `schemas/runningProfile.js`): `display_name` min 1 / max 100, `birth_date` ISO date format, `height_cm` positive, `weight_kg` positive, `sex` must be `'male'` | `'female'` | null.

---

#### 11.7.2 HR Zones (`HrZonesSection.jsx`)

API: `GET /api/running/v1/user/hr-zones`, `PATCH /api/running/v1/user/hr-zones`

Fields:

- Max HR (`maxHrInput_settingsPage`) — integer 60–250. "Detect" button (`detectMaxHrBtn_settingsPage`) calls `GET /api/running/v1/user/max-hr-detect` to find the highest recorded HR across all activities. On success: `maxHrDetectedHint_settingsPage`. On no data: `maxHrNoDataHint_settingsPage`. On error: `maxHrDetectError_settingsPage`.
- Resting HR (`restingHrInput_settingsPage`) — integer 30–120. Required for Karvonen method.
- Threshold HR (`thresholdHrInput_settingsPage`) — integer 100–220. Required for Lactate Threshold method. Info tooltip explains LTHR. "85% of Max HR" auto-fill button (`thresholdHrAutoFillBtn_settingsPage`) — disabled until Max HR is set; shows `thresholdHrNoMaxHr_settingsPage` when unavailable.
- Calculation Method (`hrZonesMethodSelect_settingsPage`) — dropdown: Max HR (default), Karvonen (Heart Rate Reserve), Lactate Threshold. Zone boundaries documented in section 21a.

Save: `hrZonesSaveBtn_settingsPage`. Success: `hrZonesSaveSuccess_settingsPage`. Error: `hrZonesSaveError_settingsPage`. Loading: `hrZonesLoading_settingsPage`.

---

#### 11.7.3 Pace Zones (`PaceZonesSection.jsx`)

API: `GET /api/running/v1/user/settings`, `PATCH /api/running/v1/user/settings`; auto-detect: `GET /api/running/v1/user/threshold-pace-detect`

Two modes for setting the threshold pace:

- **Manual** (`paceZonesMode_manual_settingsPage`): type MM:SS directly (`thresholdPaceInput_settingsPage`). Validates 2:00–15:00 /km.
- **From Activity** (`paceZonesMode_activity_settingsPage`): "Detect Threshold Pace" button (`detectThresholdPaceBtn_settingsPage`) calls the auto-detect endpoint (see section 21b for algorithm). Requires Threshold HR to be set first.

Zone boundaries displayed as a reference table in the section (see section 21b). Zone Analytics on the Analytics page uses these zones for the Pace Zone breakdown card.

---

#### 11.7.4 Notifications (`NotificationsSection.jsx`)

API: `GET /api/running/v1/user/settings`, `PATCH /api/running/v1/user/settings`, `POST/DELETE /api/running/v1/user/push-subscription`

**Master push toggle (`pushNotificationsToggle_settingsPage`):**

- When enabled: requests `Notification.requestPermission()` → registers service worker → subscribes via `PushManager.subscribe` with VAPID key → POSTs subscription object to `/api/running/v1/user/push-subscription`
- When disabled: unsubscribes from `PushManager` → sends `null` to push-subscription endpoint
- Shows `pushNotificationsError_settingsPage` on failure. Disabled if `serviceWorker` or `PushManager` not supported.
- Beta disclaimer banner shown above the card.

**Per-notification toggles (optimistic save — each toggle immediately calls PATCH):**

| Toggle                               | Test ID                                 | `user_settings` column |
| ------------------------------------ | --------------------------------------- | ---------------------- |
| Post-activity insight                | `notifyPostActivityToggle_settingsPage` | `notify_post_activity` |
| Weekly review                        | `notifyWeeklyReviewToggle_settingsPage` | `notify_weekly_review` |
| Friday race prep                     | `notifyFridayPrepToggle_settingsPage`   | `notify_friday_prep`   |
| Anomaly alerts                       | `notifyAnomalyToggle_settingsPage`      | `notify_anomaly`       |
| Race reminders (14/7/3/1 day before) | `notifyRaceReminderToggle_settingsPage` | `notify_race_reminder` |

Toggle save error (optimistic rollback): `notifyToggleError_settingsPage`. Loading skeleton: `notificationsLoading_settingsPage`.

---

#### 11.7.5 Strava Connection (`StravaConnectionSection.jsx`)

This section implements the full connection state machine described in section 5.8.

Section root ID: `stravaConnectionSection_settings`. Loading: `stravaConnectionLoading_settings`.

**States:**

| State                             | Container ID                       | Actions                                                                          |
| --------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------- |
| Not connected                     | `stravaDisconnectedState_settings` | "Connect Strava" button → Strava OAuth flow                                      |
| Connected (healthy)               | `stravaConnectedState_settings`    | Shows athlete ID + last sync time. "Disconnect" (`stravaDisconnectBtn_settings`) |
| Broken (`needs_reconnect = true`) | `stravaBrokenState_settings`       | Warning message + "Reconnect" button (`stravaReconnectBtn_settings`)             |

Data source: `GET /api/running/v1/user/strava-status` → `{ connected, athlete_id, last_sync_at, needs_reconnect }`.

---

#### 11.7.6 Danger Zone (`DangerZoneSection.jsx`)

API: `DELETE /api/running/v1/user/activities`

A red-bordered section (`bg-red-50 border border-red-200`) with a single destructive action: "Delete All" (`dangerZoneDeleteBtn_settingsPage`).

Clicking opens a confirmation dialog (`dangerZoneDialog_settingsPage`) that requires typing `DELETE` verbatim into a text input (`dangerZoneConfirmInput_settingsPage`) before the confirm button (`dangerZoneConfirmBtn_settingsPage`) becomes enabled.

On success: dialog closes, success message shown. On error: `dangerZoneError_settingsPage` shown inside dialog; dialog stays open. The confirm button is disabled while deleting.

This action permanently deletes all activity data for the user. It cannot be undone. Historical data retained after Strava disconnect (see section 5.7) is also deleted by this action.

---
