## 12. Gear Management (Shoe Rotation)

### 12.1 Overview

Gear Management tracks the condition of running shoes based on total distance covered. Shoe data syncs automatically from Strava — every shoe recorded in a Strava activity appears here.

The goal is simple: know when a shoe needs to be retired before its performance drops or injury risk increases.

### 12.2 User Stories

> As a runner, I want to see all my shoes with their mileage so that I know which ones are still fresh and which are wearing out.

> As a runner, I want to set a retirement threshold per shoe so that I get a visual warning before I hit the limit.

> As a runner, I want to categorize each shoe by use type (daily, race, trail, etc.) so that I can track rotation correctly.

### 12.3 Data Source

Shoes sync from two places:

1. **Strava activity sync** — every Strava activity with a `gear_id` upserts the gear into `rt_gear`
2. **Athlete sync** — when the user connects Strava, `/api/v3/athlete` is called to immediately fetch all shoes registered on the athlete profile, not just those that appear in activities

Fields synced from Strava: `name`, `brand_name`, `model_name`, `distance_m`, `retired`, `notification_distance_m`.

`notification_distance_m` is the retirement threshold set by the user in Strava (not in this app). Strava returns this value in km via `notification_distance` — the backend converts it to meters on save (`Math.round(notification_distance * 1000)`).

Fields that are **never overwritten** by Strava sync: `category`, `retirement_km` — these are entirely user-managed.

### 12.4 Database

```sql
CREATE TABLE rt_gear (
  id TEXT PRIMARY KEY,              -- Strava gear ID (format: g12345678)
  user_id UUID REFERENCES users(id),
  name TEXT,
  brand_name TEXT,
  model_name TEXT,
  distance_m INTEGER DEFAULT 0,    -- total distance in meters, updated on each sync
  retired BOOLEAN DEFAULT FALSE,
  notification_distance_m INTEGER DEFAULT NULL, -- Strava-managed shoe alert threshold, stored in meters (Strava returns km → converted on save)
  category TEXT DEFAULT NULL,       -- user-managed: daily/tempo/race/trail/recovery/cross-training
  retirement_km INTEGER DEFAULT NULL, -- user-managed retirement threshold in km
  last_fetched_at TIMESTAMPTZ
);
```

### 12.5 API Endpoints

```
GET   /api/running/v1/gear        ← list all gear for the user
PATCH /api/running/v1/gear        ← update category and/or retirement_km for one gear item
```

**GET /api/running/v1/gear**

- Auth required (401 if no session)
- No query params
- Response: `{ data: [{ id, name, brand_name, model_name, distance_m, retired, notification_distance_m, category, retirement_km, last_fetched_at }], message }`
- Order: retired ASC (active first), then name ASC

**PATCH /api/running/v1/gear**

- Auth required
- Body: `{ id: string (required), category?: string|null, retirement_km?: integer|null }`
- Validated via Zod schema in `schemas/runningGear.js`
- Strava sync fields (`name`, `distance_m`, `retired`) cannot be changed via this endpoint
- Response: `{ data: <updated gear row>, message }`
- Error 400 if `id` is missing or field is invalid
- Error 404 if gear is not found or belongs to another user

### 12.6 UI — Shoe Rotation Component

Shoe Rotation appears on the Dashboard page, after the Performance Trends section.

**Required states:**

| State           | Display                                                                      |
| --------------- | ---------------------------------------------------------------------------- |
| Loading         | Skeleton 3 rows (icon + name + bar)                                          |
| Error           | AlertTriangle icon + error message + "Try again" button                      |
| Empty (no gear) | Footprints icon + "No shoes synced yet" text + instruction to connect Strava |
| Has data        | List of active shoes + list of retired shoes (if any)                        |

**Per gear card layout:**

- Header: Footprints icon + shoe name + brand/model (second line, grey) + category badge (if set) + edit button (pencil, active shoes only)
- Body: total km in large text + two-tab limit toggle (see below) + mileage progress bar (violet → amber at >= 70% → red at >= 90%) + "Nearing limit" alert when >= 90% of active-tab limit
- Retired shoes: full card at 60% opacity, "Retired" badge, no edit button, no tab toggle

**Two-tab limit toggle (Strava / Manual):**

Active shoes that have at least one limit set (`notification_distance_m` or `retirement_km`) show two pill-style tab buttons next to the total distance:

- **Strava tab** — shows the `notification_distance_m` value converted to km. Label format: `Strava · {N} km`. If `notification_distance_m` is null: `Strava · —`.
- **Manual tab** — shows the `retirement_km` value. Label format: `Manual · {N} km`. If `retirement_km` is null: `Manual · —`.

Default active tab:

- If `retirement_km` is set → default to **Manual**
- If `retirement_km` is null but `notification_distance_m` is set → default to **Strava**

Switching tabs immediately updates both the progress bar and the "Nearing limit" warning to use that tab's limit value. If the selected tab's limit is null, the progress bar is hidden and "Nearing limit" is not shown even if the other tab's limit is near.

If neither limit is set, no tab toggle is shown and no progress bar is rendered.

**Inline edit form (appears inside the card, not a modal):**

- Category toggle: pill buttons (daily / tempo / race / trail / recovery / cross-training / none)
- "Retire at (km)" input: number input, min 0, max 100,000
- Save + Cancel buttons
- Optimistic update: gearList is updated locally after a successful save — no refetch required
- If save fails: show error message below the form; do not close the form

**Category options:** `daily`, `tempo`, `race`, `trail`, `recovery`, `cross-training`

### 12.7 Acceptance Criteria

```
GIVEN user is authenticated and has shoes synced from Strava
WHEN Shoe Rotation section loads
THEN active shoes appear first, retired shoes appear below with "Retired" badge and 60% opacity

GIVEN shoe has retirement_km set and no notification_distance_m
WHEN card renders
THEN Manual tab is the default active tab
AND progress bar and "Nearing limit" are based on retirement_km

GIVEN shoe has notification_distance_m set and no retirement_km
WHEN card renders
THEN Strava tab is the default active tab
AND progress bar and "Nearing limit" are based on notification_distance_m

GIVEN shoe has both notification_distance_m and retirement_km set
WHEN card renders
THEN Manual tab is the default active tab

GIVEN shoe has at least one limit set (notification_distance_m or retirement_km)
WHEN user clicks the inactive tab button
THEN progress bar and "Nearing limit" recalculate using the newly active tab's limit

GIVEN active tab's limit is null (e.g. Strava tab selected but notification_distance_m is null)
WHEN card renders
THEN no progress bar is shown and "Nearing limit" is not shown

GIVEN shoe has no retirement_km and no notification_distance_m
WHEN card renders
THEN no tab toggle is shown and no progress bar is shown

GIVEN active tab's limit is set and distance_m / active_limit_km >= 90%
WHEN card renders
THEN "Nearing limit" warning badge appears on that card
AND progress bar turns red

GIVEN active tab's limit is set and distance_m / active_limit_km is between 70% and 89%
WHEN card renders
THEN progress bar is amber colored

GIVEN active tab's limit is set and distance_m / active_limit_km is below 70%
WHEN card renders
THEN progress bar is violet colored

GIVEN user clicks the edit icon on an active shoe card
WHEN edit form opens inline
THEN current category and retirement_km are pre-filled

GIVEN user selects a category pill and enters a retirement_km
WHEN user clicks Save
THEN PATCH /api/running/v1/gear is called with { id, category, retirement_km }
AND the card updates immediately (optimistic) without page reload

GIVEN user clicks Save on the edit form
WHEN API returns an error
THEN error message is shown below the form
AND the edit form stays open (not closed)

GIVEN user clicks Cancel on the edit form
WHEN form closes
THEN no changes are saved

GIVEN no shoes are synced (empty list)
WHEN section renders
THEN empty state shows "No shoes synced yet" with instruction to connect Strava

GIVEN API call fails to load gear list
WHEN error state renders
THEN "Try again" button is visible and retries the fetch on click

GIVEN shoe is retired
WHEN edit icon is checked
THEN no edit icon is shown (retired shoes are read-only)
```

### 12.8 Validations & Error States

| Scenario                                                     | Handling                                                               |
| ------------------------------------------------------------ | ---------------------------------------------------------------------- |
| `retirement_km` is not an integer or < 0                     | 400 from API, form shows error message                                 |
| `retirement_km` > 100,000                                    | 400 from API, form shows error message                                 |
| `category` is not one of CATEGORY_OPTIONS and not null       | 400 from API                                                           |
| `id` missing from PATCH body                                 | 400 Validation failed                                                  |
| Gear not found or belongs to another user                    | 404 Not found                                                          |
| Strava sync tries to overwrite `category` or `retirement_km` | Not allowed — sync only updates Strava-managed fields                  |
| PATCH body includes `notification_distance_m`                | Ignored — this field is Strava-managed, never writable by user via API |

### 12.9 Test IDs

Registered in `cypress/fixtures/app-constants.json` under `test_ids.running_gear.*`:

| ID                    | Element                        |
| --------------------- | ------------------------------ |
| `gearPage`            | Section root element           |
| `gearLoadingSkeleton` | Skeleton wrapper while loading |
| `gearError`           | Error container                |
| `gearList`            | `<ul>` active shoes            |
| `gearCard`            | Each `<li>` gear card          |
| `gearSaveBtn`         | Save button in edit form       |

---
