#### 3.2.3 Event (`/main/trading/event`)

**Description:** Record and manage market events that affect trading decisions. Events support favoriting, filtering, search, pagination, a detail page, and AI analysis.

**Route:** `/main/trading/event` (list), `/main/trading/event/:id` (detail)

**User Stories:**

> As a user, I want to record market events with links and impact direction, so that I can track what happened and why.

> As a user, I want to filter events by type and search by title or description, so that I can quickly find relevant events.

> As a user, I want to favorite events, so that I can easily revisit the most important ones.

> As a user, I want to open a detail page for each event, so that I can read full notes, view links, and see AI analysis.

**Features:**

- Display all events with pagination (10 per page)
- Search by title and description (case-insensitive)
- Filter: All / Bullish / Bearish / Favorites / Upcoming / Past — persisted to localStorage
- Add event, Edit event, Delete event (soft-delete)
- Favorite toggle per event
- Summary cards: total events, bullish count, bearish count, favorites count
- Event detail page (`/main/trading/event/:id`) with full description (markdown rendered), reference links, tags, AI analysis panel

**Field Definitions:**

| Field            | Required    | Constraints                                                                          |
| ---------------- | ----------- | ------------------------------------------------------------------------------------ |
| Title            | Yes         | 1–100 characters                                                                     |
| Description      | No          | Max 2000 characters, markdown supported                                              |
| Event Type       | No          | Earnings / Central Bank / Macro / Corporate Action / Geopolitical / Personal / Other |
| Impact Direction | Yes         | UP (Bullish) or DOWN (Bearish)                                                       |
| Actual Outcome   | No          | UP or DOWN — what actually happened                                                  |
| Event Date       | Yes         | Stored as `yyyy-MM-dd` string (no timezone shift)                                    |
| Tags             | No          | Array of free-text tag strings                                                       |
| Links            | Yes (min 1) | Array of `{ hyperlink, link }` objects; each link must be a valid URL                |

**Links Sub-Component (`EventLinksInput`):**

- Inline sub-form inside the Add/Edit dialog
- User fills Hyperlink (display label) + Link (URL), presses Add → entry appended to list below
- Each entry in the list can be deleted individually
- No maximum number of links
- Form cannot be submitted if the links list is empty
- On edit, existing links are pre-loaded into the list

**Tags Sub-Component (`EventTagsInput`):**

- Inline free-text tag input inside the Add/Edit dialog
- User types a tag and presses Enter or comma to add it to the tag list
- Each tag can be removed individually
- Tags are stored as a plain string array in the database

**Delete Behavior:**

- Confirmation dialog before delete
- Soft-delete only — sets `deleted_at` on the row; data is not removed from the database
- Delete dialog copy does not mention "archived records" (no restore UI exists)

**Event Detail Page (`/main/trading/event/:id`):**

- Shows event title, impact badge, actual outcome badge (if set), event date, tags
- Markdown-rendered description (left column, ~67% width)
- Right sidebar: Analyze with AI button, reference links
- AI analysis panel below body (if an analysis exists for this event)
- Edit and Delete actions via icon buttons (desktop) or dropdown menu (mobile)
- Not-found state with back button if the event does not exist or is soft-deleted

**UI States:**

| State          | Behavior                                          |
| -------------- | ------------------------------------------------- |
| Loading        | Skeleton on table and summary cards               |
| Empty (all)    | Empty state message                               |
| Empty (filter) | Empty state message specific to the active filter |
| Error          | Toast error if fetch/save/delete fails            |
| Pagination     | Prev/Next buttons + page indicator                |

**API Endpoints:**

| Method | Path                               | Description                                                          |
| ------ | ---------------------------------- | -------------------------------------------------------------------- |
| GET    | `/api/trade/v1/event/list`         | Paginated event list; params: `page`, `limit=10`, `search`, `filter` |
| POST   | `/api/trade/v1/event/create`       | Create event (including links JSONB and tags array)                  |
| PUT    | `/api/trade/v1/event/update/:id`   | Update event (including links JSONB and tags array)                  |
| DELETE | `/api/trade/v1/event/delete/:id`   | Soft-delete event                                                    |
| GET    | `/api/trade/v1/event/summary`      | Summary counts: total, bullish, bearish, favorites                   |
| GET    | `/api/trade/v1/event/:id`          | Fetch single event detail                                            |
| PATCH  | `/api/trade/v1/event/favorite/:id` | Toggle favorite status                                               |
| GET    | `/api/trade/v1/event/tags`         | Fetch all distinct tags for autocomplete                             |

**Links data model (JSONB):**

```json
[
  { "hyperlink": "Reuters article", "link": "https://reuters.com/..." },
  { "hyperlink": "BI Rate Decision", "link": "https://bi.go.id/..." }
]
```

**Acceptance Criteria:**

```
GIVEN the user opens /main/trading/event
WHEN data loads
THEN summary cards and paginated event list are shown

GIVEN the user types in the search bar
WHEN the input changes
THEN events are filtered by title and description match

GIVEN the user selects "Bullish" filter
WHEN the filter is applied
THEN only events with impact_direction = "UP" are shown

GIVEN the user refreshes the page after selecting "Favorites" filter
WHEN the page loads
THEN the Favorites filter is still active (persisted in localStorage)

GIVEN the user clicks "Add Event"
WHEN the form opens and is submitted with all required fields
THEN the event is created and appears in the list

GIVEN the user submits the form with no links added
WHEN validation runs
THEN the form shows a validation error and does not submit

GIVEN the user adds a link entry and both Hyperlink and Link fields are filled
WHEN Add is clicked in EventLinksInput
THEN the entry appears in the list below the input

GIVEN the user selects a date of June 2
WHEN the event is saved and displayed
THEN the stored and displayed date is June 2 (no UTC timezone shift)

GIVEN the user clicks the favorite icon on an event
WHEN the toggle completes
THEN the event's favorite state is flipped and the summary card count updates

GIVEN the user opens a specific event row
WHEN the detail page loads
THEN title, date, impact badge, description (markdown rendered), and reference links are shown

GIVEN the user clicks the delete button and confirms
WHEN the delete completes
THEN the event is soft-deleted and removed from the list; the delete dialog does not mention "archived records"

GIVEN the event list has more than 10 events
WHEN the page renders
THEN pagination controls are shown; Previous is disabled on page 1
```

---
