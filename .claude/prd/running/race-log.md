## 13. Race Log

### 13.1 Overview

Race Log is a feature for recording and tracking every race you have entered. Unlike Goals (which are forward-looking), the Race Log is a historical record — every completed race can be logged with actual results (finish time, pace, position, etc.).

Two things you can manage here:

1. **Race history** — all completed races, with results and notes
2. **Upcoming race goal** — your next target race, which can also be edited directly from the Activity page (no need to redo onboarding)

### 13.2 User Stories

> As a runner, I want to log every race I've completed so that I can track my race history and see how my performance has improved over time.

> As a runner, I want to record my finish time and official distance for each race so that I can calculate accurate race-day pacing and compare across events.

> As a runner, I want to add a title and personal notes to each race entry so that I can remember the context (weather, conditions, how I felt).

> As a runner, I want to edit my upcoming race goal directly from the Activity page so that I don't have to redo onboarding to update my race target.

> As a runner, I want to see my race history ordered by date so that I can quickly spot trends in my race performance.

### 13.3 Database

#### rt_goals — schema update

Add title and description to the existing goals table (used for upcoming race goal in onboarding and NextRace card):

```sql
ALTER TABLE rt_goals
  ADD COLUMN title TEXT,
  ADD COLUMN description TEXT;
```

- `title` — race name, e.g. "Jakarta Marathon 2027", "BCA Bali Run 10K". Optional. If set, used in the NextRace card instead of the auto-generated distance label.
- `description` — free-form notes about this goal. Optional.

#### rt_race_log — new table

```sql
CREATE TABLE rt_race_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,                    -- race name, e.g. "Jakarta Marathon 2027"
  race_date DATE NOT NULL,
  distance_m NUMERIC(10,2) NOT NULL,      -- official race distance
  finish_time_sec INT,                    -- official finish time, nullable (DNF)
  avg_pace_sec_per_km NUMERIC(6,2),       -- computed: finish_time_sec / (distance_m / 1000)
  avg_hr INT,                             -- average HR during race, nullable
  elevation_gain_m NUMERIC(7,2),          -- nullable
  position_place INT,                     -- finishing position overall (all finishers), nullable
  position_male INT,                      -- finishing position within male category, nullable
  did_not_finish BOOLEAN DEFAULT FALSE,
  activity_id UUID REFERENCES activities(id) ON DELETE SET NULL, -- optional link to Strava activity
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_race_log_user_date ON rt_race_log(user_id, race_date DESC);
```

- `did_not_finish = true` → `finish_time_sec` and `avg_pace_sec_per_km` may be null
- `activity_id` — optional link to a Strava activity. When set, the activity detail page shows a "Raced: [title]" label
- `avg_pace_sec_per_km` is computed server-side on insert/update — client does not need to send it

### 13.4 API Endpoints

```
GET    /api/running/v1/race-log              ← list all race entries, ordered race_date DESC
POST   /api/running/v1/race-log              ← create a new race entry
GET    /api/running/v1/race-log/:id          ← fetch a single race entry (for detail page)
PATCH  /api/running/v1/race-log/:id          ← edit race entry
DELETE /api/running/v1/race-log/:id          ← delete race entry

PATCH  /api/running/v1/goals/:id             ← update upcoming race goal (title, description, target fields)
```

**GET /api/running/v1/race-log**

- Auth required (401 if no session)
- No query params for MVP
- Response: `{ data: [{ id, title, race_date, distance_m, finish_time_sec, avg_pace_sec_per_km, avg_hr, elevation_gain_m, position_place, position_male, did_not_finish, activity_id, notes, created_at }], message }`

**POST /api/running/v1/race-log**

- Auth required
- Body: `{ title, race_date, distance_m, finish_time_sec?, avg_hr?, elevation_gain_m?, position_place?, position_male?, did_not_finish?, activity_id?, notes? }`
- Validated via Zod schema in `schemas/raceLog.js`
- Server computes `avg_pace_sec_per_km = Math.round(finish_time_sec / (distance_m / 1000))` — only when `finish_time_sec` exists and `did_not_finish = false`
- Response: `{ data: <new race log row>, message }`

**GET /api/running/v1/race-log/:id**

- Auth required (401 if no session)
- Ownership check: 404 if entry does not belong to the user
- Response: `{ data: { id, title, race_date, distance_m, finish_time_sec, avg_pace_sec_per_km, avg_hr, elevation_gain_m, position_place, position_male, did_not_finish, activity_id, notes, created_at } }`

**PATCH /api/running/v1/race-log/:id**

- Auth required
- Body: all fields optional, but at least one must be present
- Ownership check: only the entry's owner can edit it (404 if not)
- `avg_pace_sec_per_km` is recomputed when `finish_time_sec` or `distance_m` changes
- Response: `{ data: <updated row>, message }`

**DELETE /api/running/v1/race-log/:id**

- Auth required
- Ownership check: 404 if not the owner
- Response: `{ message: "Deleted" }`

**PATCH /api/running/v1/goals/:id**

- Auth required
- Body: `{ title?, description?, target_date?, target_distance_m?, target_time_sec? }` — all optional, at least one required
- Ownership check: 404 if not the owner
- Response: `{ data: <updated goal row>, message }`

### 13.5 UI — Race Log Page

Race Log has its own page at `/running/race-log`.

**Required states:**

| State    | Display                                                                    |
| -------- | -------------------------------------------------------------------------- |
| Loading  | Skeleton rows inside table (5 rows, animate-pulse)                         |
| Error    | AlertTriangle icon + error message + "Try again" button                    |
| Empty    | Medal icon + "No races logged yet" text + "Log your first race" CTA button |
| Has data | Table of race entries, ordered race_date DESC                              |

**Table layout (implemented as base `<Table>` from `@/components/base/Table/Table`):**

Columns: Race (title + distance label + DNF badge) | Date | Dist | Time | Pace | Place | Male

- Each row is clickable — navigates to `/running/race-log/[id]` detail page
- "Place" column = `position_place`, "Male" column = `position_male`
- DNF badge shows in title cell when `did_not_finish = true`
- `avg_pace_sec_per_km` shown as MM:SS/km; falls back to computing from `finish_time_sec / distance_m` if column is null

**Header buttons (top right):**

- "Add from activity" button (`id="addRaceFromActivityBtn"`) — opens `ActivityPickerDialog` to pick an existing Strava activity; after picking, opens `RaceConfirmDialog` to confirm auto-filling fields from the activity
- "Log race" button (`id="addRaceBtn"`) — opens blank `RaceFormModal`

**Add / Edit form (RaceFormModal):**

- Title (required) — text input
- Race date (required) — date picker (calendar popover)
- Distance (required) — dropdown preset (5K / 10K / 21.1K / 42.2K / Custom) + custom number input when Custom is selected
- Did not finish — checkbox. When checked: hide finish time field
- Finish time — time input (HH:MM:SS), required unless DNF is checked
- Avg HR — number input, optional
- Elevation gain — number input (metres), optional
- Position (place) — number input, optional — maps to `position_place`
- Position (male) — number input, optional — maps to `position_male`
- Notes — textarea, optional
- After save in Add mode: redirects to `/running/race-log/[id]` detail page

**Delete confirmation (on detail page only):**

- Alert dialog: "Delete this race entry? [title] will be permanently deleted. This cannot be undone."
- Confirm delete button + cancel
- After confirm: redirects to `/running/race-log`

**Filtering & Search (client-side, no pagination):**

- Text search input (`id="raceSearchInput"`) — debounced ~400 ms; filters the loaded list by race title (case-insensitive substring match)
- Distance filter chips — a row of pill/chip buttons shown above the table:
  - Chips: **All** | **5K** | **10K** | **21K (Half)** | **42K (Full)** | **Other**
  - "All" chip (`id="raceFilterChip_all"`) is always shown and selected by default
  - The other chips are only rendered when at least one entry in the loaded list matches that distance preset:
    - 5K = distance_m 4500–5499
    - 10K = distance_m 9500–10499
    - 21K (Half) = distance_m 20500–21499
    - 42K (Full) = distance_m 41500–42499
    - Other = any distance that does not fall into the four presets above
  - Only one chip can be active at a time; clicking the active chip resets to "All"
  - Text search and distance chip filter stack — both apply simultaneously
- Filtering runs entirely on the already-loaded list (no extra API call)

### 13.5b UI — Race Log Detail Page

Each race entry has its own detail page at `/running/race-log/[id]`.

- Fetches entry via GET /api/running/v1/race-log/:id
- If `activity_id` is set, also fetches activity detail, splits, laps, best efforts, photos, and health log for that date
- Renders the linked activity's stream data, HR zones, splits, laps, best efforts, and photos via `ActivitySection` component (same as Activities feature)
- Edit button opens `EditRaceModal` (same form fields as RaceFormModal, pre-filled with current values)
- Delete button (`id="deleteRaceBtn_raceDetailPage"`) opens AlertDialog; confirm button `id="deleteRaceConfirmBtn_raceDetailPage"`; after confirm redirects to `/running/race-log`
- Loading state: skeleton matching the detail page structure
- Error state: AlertTriangle + error message + "Try again" link (page reload)

### 13.6 UI — Edit Upcoming Race Goal (from Activity page)

On the Activity page, add a section or button "Edit race goal" that opens an edit goal modal.

Modal fields:

- Race title (text input) — pre-filled from `rt_goals.title` when available
- Target distance — same preset dropdown as Race Log
- Target date — date picker
- Description / notes (textarea) — optional
- Save + Cancel buttons

After saving, the NextRace card on the dashboard reflects the update immediately (via re-fetch or optimistic update).

**Location on Activity page:** below the activity list, in a separate card titled "Your Next Race", or integrated into the sidebar if the layout allows.

### 13.7 Acceptance Criteria

```
GIVEN user navigates to /running/race-log
WHEN page loads
THEN race entries appear ordered by race_date DESC
AND loading skeleton shows while fetching

GIVEN user has no race entries
WHEN page loads
THEN empty state shows with "Log your first race" CTA button

GIVEN user clicks "Log your first race" or the Add button
WHEN form modal opens
THEN title, race_date, distance fields are required and validated before submit

GIVEN user fills title, race_date, distance_m, finish_time_sec and submits
WHEN POST /api/running/v1/race-log is called
THEN new entry appears at top of the list
AND avg_pace_sec_per_km is computed server-side and shown correctly

GIVEN user checks "Did not finish"
WHEN form submits
THEN finish_time_sec and avg_pace_sec_per_km are null in DB
AND entry shows "DNF" badge in the list

GIVEN user clicks the edit icon on a race entry
WHEN edit modal opens
THEN all existing values are pre-filled

GIVEN user edits finish time and submits
WHEN PATCH /api/running/v1/race-log/:id is called
THEN avg_pace_sec_per_km is recomputed server-side

GIVEN user clicks the delete icon on a race entry
WHEN delete confirmation dialog appears and user confirms
THEN DELETE /api/running/v1/race-log/:id is called
AND entry is removed from the list

GIVEN another user's race log ID is used in PATCH or DELETE
WHEN request is made
THEN API returns 404 (ownership check)

GIVEN user navigates to the Activity page and clicks "Edit race goal"
WHEN modal opens
THEN current goal title, target date, distance, and description are pre-filled
AND after save, NextRace card on dashboard reflects the updated data

GIVEN user has race entries loaded on /running/race-log
WHEN user types in the search input
THEN list filters to only entries whose title contains the typed text (case-insensitive)
AND filter is applied after ~400 ms debounce (not on every keystroke)
AND clearing the input restores the full list

GIVEN user has race entries with mixed distances
WHEN page loads
THEN only distance chips for distances present in the data are shown (plus "All" always shown)

GIVEN user clicks a distance chip (e.g. "5K")
WHEN chip becomes active
THEN list filters to entries matching that distance preset
AND clicking the active chip again resets the filter to "All"

GIVEN user has both a search term typed and a distance chip selected
WHEN either filter changes
THEN both filters are applied simultaneously (intersection, not union)
```

### 13.8 Validations & Error States

| Field                        | Validation                                             | Error                                         |
| ---------------------------- | ------------------------------------------------------ | --------------------------------------------- |
| `title`                      | Required, max 200 chars                                | "Race name is required"                       |
| `race_date`                  | Required, valid date, not in future by more than 1 day | "Race date cannot be in the future"           |
| `distance_m`                 | Required, > 0, max 1000000                             | "Distance must be greater than 0"             |
| `finish_time_sec`            | Integer, > 0, required unless `did_not_finish = true`  | "Finish time is required for completed races" |
| `avg_hr`                     | Integer, 1–250                                         | "Heart rate must be between 1 and 250"        |
| `position_place`             | Integer, >= 1                                          | "Position must be 1 or greater"               |
| `position_male`              | Integer, >= 1                                          | "Position must be 1 or greater"               |
| Race not found or wrong user | —                                                      | 404 Not found                                 |
| Server error                 | —                                                      | 500 with message in response                  |

### 13.9 Test IDs

Registered in `cypress/fixtures/app-constants.json` under `test_ids.race_log.*`:

**Race Log list page (`/running/race-log`):**

| ID                        | Element                                                                                                     |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `raceLogPage`             | Page root `<div id="raceLogPage">`                                                                          |
| `raceLogLoadingSkeleton`  | Skeleton wrapper — NOTE: currently missing from rendered HTML (gap — see below)                             |
| `raceLogError`            | Error container `<div id="raceLogError" role="alert">`                                                      |
| `raceLogEmptyState`       | Empty state container `<div id="raceLogEmptyState">`                                                        |
| `raceLogList`             | Table container — NOTE: currently rendered as `<div id="raceLogTable">` not `raceLogList` (gap — see below) |
| `raceLogCard`             | Each table row — NOTE: currently no id on `<TableRow>` (gap — see below)                                    |
| `addRaceBtn`              | "Log race" button in page header                                                                            |
| `addRaceFromActivityBtn`  | "Add from activity" button in page header                                                                   |
| `raceLogFormModal`        | Add/edit modal root `<DialogContent id="raceLogFormModal">`                                                 |
| `raceLogSaveBtn`          | Save button in form modal                                                                                   |
| `raceLogDeleteBtn`        | Delete button — NOTE: delete is on detail page, not list page (gap — see below)                             |
| `raceLogDeleteConfirmBtn` | Confirm button in delete dialog — on detail page                                                            |
| `editGoalBtn`             | "Edit race goal" button on Activity detail page                                                             |
| `editGoalModal`           | Edit goal modal root                                                                                        |
| `editGoalSaveBtn`         | Save button in edit goal modal                                                                              |
| `raceSearchInput`         | Debounced text search input above the race table                                                            |
| `raceFilterChip_all`      | "All" distance filter chip — always rendered                                                                |
| `raceFilterChip_5k`       | "5K" distance filter chip — rendered only when matching entries exist                                       |
| `raceFilterChip_10k`      | "10K" distance filter chip — rendered only when matching entries exist                                      |
| `raceFilterChip_21k`      | "21K (Half)" distance filter chip — rendered only when matching entries exist                               |
| `raceFilterChip_42k`      | "42K (Full)" distance filter chip — rendered only when matching entries exist                               |
| `raceFilterChip_other`    | "Other" distance filter chip — rendered only when at least one non-preset distance exists                   |

**Race Log detail page (`/running/race-log/[id]`):**

| ID                                    | Element                               |
| ------------------------------------- | ------------------------------------- |
| `raceDetailPage`                      | Page root `<div id="raceDetailPage">` |
| `deleteRaceBtn_raceDetailPage`        | Delete race button                    |
| `deleteRaceConfirmBtn_raceDetailPage` | Confirm button in delete dialog       |

**Known gaps between `app-constants.json` registered IDs and actual rendered HTML (Tester to note):**

- `raceLogLoadingSkeleton` — skeleton rows inside `<TableBody>` have no wrapping ID; tests referencing this ID will fail to find the element
- `raceLogList` — table container rendered as `id="raceLogTable"`, not `raceLogList`; Cypress `IDS.list` selector will not find the element
- `raceLogCard` — no ID on individual `<TableRow>` elements; Cypress `IDS.card` selector will not find entries
- `raceLogDeleteBtn` — delete action only exists on the detail page, not on list rows; Cypress tests that click delete on the list will fail

---

### 13.10 Upcoming Races

Users can add races they have not yet run to the Race Log page as a planning list. After the race is completed, the user links a Strava activity to fill in the results, and the race moves to the completed list.

#### Lifecycle

```
User adds upcoming race (title, date, distance, location, notes)
        ↓
Race appears in "Upcoming" section above the race history table
Amber info guide shown, manual result fields disabled
        ↓
User finishes the race → opens Race Log → clicks "Link activity"
User searches and picks the matching Strava activity
        ↓
PATCH /api/running/v1/upcoming-races/:id { linked_activity_id }
Backend copies distance + date from the activity
Manual result fields become enabled
        ↓
User fills in additional data (finishing position, etc.) → clicks "Save as completed"
Race moves from upcoming section to race history table
```

#### Database

New table `rt_upcoming_races`:

| Column               | Type        | Notes                                           |
| -------------------- | ----------- | ----------------------------------------------- |
| `id`                 | uuid        | primary key                                     |
| `user_id`            | uuid        | FK to auth.users, RLS enforced                  |
| `title`              | text        | race name, required                             |
| `race_date`          | date        | must be >= today on create                      |
| `distance_m`         | numeric     | required, > 0                                   |
| `location`           | text        | optional, used for Google Calendar link         |
| `notes`              | text        | optional                                        |
| `linked_activity_id` | uuid        | nullable FK to rt_activities.id                 |
| `finish_position`    | integer     | nullable, can only be set after activity linked |
| `created_at`         | timestamptz | auto                                            |

RLS: `auth.uid() = user_id` — users can only access their own data.

#### API Endpoints

| Method   | Path                                 | Description                                                                                          |
| -------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `GET`    | `/api/running/v1/upcoming-races`     | List all upcoming races, ordered `race_date ASC`                                                     |
| `POST`   | `/api/running/v1/upcoming-races`     | Create a new upcoming race                                                                           |
| `GET`    | `/api/running/v1/upcoming-races/:id` | Fetch a single upcoming race                                                                         |
| `PATCH`  | `/api/running/v1/upcoming-races/:id` | Update. If `linked_activity_id` is set, backend copies `distance_m` + `started_at` from the activity |
| `DELETE` | `/api/running/v1/upcoming-races/:id` | Delete an upcoming race                                                                              |

#### UI — Race Log Page

**Layout:** Upcoming Races section appears above the completed race history table.

**Upcoming race card** (card pattern, not a table row — responsive grid 1/2/3 columns):

- Title, date, distance, location
- Countdown badge: red when ≤7 days, amber when ≤30 days, slate otherwise (reuses logic from NextRace.jsx)
- **Amber info guide** — `bg-amber-50 border border-amber-200`, `Info` icon in `text-amber-500`, text in `text-xs text-amber-800`, `role="note"`:
  > _"This race has not been run yet. Once the race is done, link a Strava activity to complete the results."_
  > Removed from DOM after an activity is linked.
- **Disabled result fields** — shown as metric chips (Finish time, Position, Avg HR, Elevation) with `—` values in `text-slate-300 font-mono` on `bg-slate-50 border border-slate-100`. Tooltip: _"Link a Strava activity to fill in results."_ After linking, chips are replaced with enabled input fields.
- **"Link activity"** button (primary, bottom left) — opens `ActivityPickerDialog` (reused from "Add from activity" flow)
- **"Add to Google Calendar"** button (outline, bottom right) — generates a Google Calendar URL and opens it in a new tab

**After an activity is linked:**

- Amber info guide is removed from the DOM
- Metric chips are replaced with enabled input fields
- **"Save as completed"** button appears — clicking it fades the card out over 300ms and moves the race to the race history table

**Google Calendar URL:**

```
https://calendar.google.com/calendar/render?action=TEMPLATE
  &text={encodeURIComponent(title)}
  &dates={YYYYMMDD}/{YYYYMMDD+1}
  &details={encodeURIComponent(distance + notes)}
  &location={encodeURIComponent(location)}
```

All-day format is used to avoid timezone bugs. Pure frontend — no backend call or API key needed.

**Add upcoming race modal** — fields: title (required), race_date (required, must be a future date), distance (preset Select), location (optional), notes (optional). Zod + react-hook-form, same pattern as existing modals.

**Empty state** — dashed border container (`border-dashed border-slate-200 rounded-xl bg-slate-50`) with a Flag icon, explanatory text, and an "Add a race" button.

#### Acceptance Criteria

```
GIVEN user clicks "Add upcoming race"
WHEN form is filled with title, date (future), distance
THEN upcoming race is saved and appears in the upcoming section

GIVEN upcoming race has not been linked to an activity
WHEN user views the card
THEN amber info guide is shown
AND result fields are displayed as disabled metric chips

GIVEN user clicks "Link activity"
WHEN user selects an activity from the picker
THEN PATCH is called with linked_activity_id
AND amber info guide is removed from the DOM
AND metric chips are replaced with enabled input fields

GIVEN manual fields are now enabled
WHEN user fills in data and clicks "Save as completed"
THEN card fades out over 300ms
AND race appears in the race history table

GIVEN user clicks "Add to Google Calendar"
WHEN the link is generated
THEN a new tab opens with Google Calendar pre-filled

GIVEN race_date has passed but no activity has been linked
WHEN user views the card
THEN amber info guide remains visible (does not auto-expire)
```

#### Validations

| Field             | Rule                                                       |
| ----------------- | ---------------------------------------------------------- |
| `title`           | Required, max 200 chars                                    |
| `race_date`       | Required, must be >= today on create                       |
| `distance_m`      | Required, > 0                                              |
| `location`        | Optional, max 300 chars                                    |
| `finish_position` | Optional, integer > 0, only valid after activity is linked |

#### Test IDs

Registered in `cypress/fixtures/app-constants.json` under `test_ids.upcoming_races.*`:

| ID                                         | Element                                |
| ------------------------------------------ | -------------------------------------- |
| `upcomingRacesSection_raceLogPage`         | Section container on the race-log page |
| `addUpcomingRaceBtn_raceLogPage`           | "Add upcoming race" button             |
| `upcomingRaceCard_raceLogPage`             | Individual race card                   |
| `upcomingRaceInfoGuide_raceLogPage`        | Amber info guide callout               |
| `linkActivityBtn_raceLogPage`              | "Link activity" button per card        |
| `addToCalendarBtn_raceLogPage`             | "Add to Google Calendar" button        |
| `upcomingRaceFormModal_raceLogPage`        | Add/edit modal root                    |
| `upcomingRaceSaveBtn_raceLogPage`          | Save button in modal                   |
| `saveAsCompletedBtn_raceLogPage`           | "Save as completed" button             |
| `deleteUpcomingRaceBtn_raceLogPage`        | Delete button per card                 |
| `deleteUpcomingRaceConfirmBtn_raceLogPage` | Confirm button in delete dialog        |

---
