## 23. Route Builder

**Page:** `/running/route-builder`
**Status:** MVP shipped (no prior PRD). This section is the first formal spec.

---

### 23.1 Overview

The Route Builder lets the user plan a running route on an interactive map, see the estimated distance and time, save the route for future reference, and (v2) export it as GPX for use on a GPS watch.

The feature is intentionally simple — no social sharing, no road-snapping, no GPS watch sync beyond GPX export. The map uses MapLibre GL JS with Jawg Lagoon vector tiles.

---

### 23.2 User Stories

> As a runner, I want to plan a route on a map by clicking waypoints so that I know approximately how far I will run before I head out.

> As a runner, I want to see an estimated finish time based on my pace so that I can plan my schedule around a planned run.

> As a runner, I want to save a named route so that I can revisit and reuse routes I have planned.

> As a runner, I want to export a saved route as a GPX file so that I can load it onto my Garmin or other GPS watch.

> As a runner, I want to remove a single misplaced waypoint without losing the rest of the route so that I can correct mistakes mid-plan.

---

### 23.3 Current State (as-built)

| Component                         | What it does                                                                                                                    |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `RouteBuilderMap.jsx`             | MapLibre GL JS map (Jawg Lagoon vector tiles), click to add waypoints, straight-line segments between points, violet route line |
| `RouteStats.jsx`                  | Shows distance (km) and waypoint count; Undo last / Clear all buttons; route name input + Save button                           |
| `page.jsx`                        | Layout: builder card (map + stats panel) + saved routes card + route preview modal                                              |
| `lib/api/running.js`              | `fetchSavedRoutes`, `saveRoute`, `deleteSavedRoute`, `updateSavedRoute`                                                         |
| `app/api/map-match/route.js`      | OSRM map-matching proxy (exists, currently unused)                                                                              |
| `app/api/map-directions/route.js` | OSRM directions proxy (exists, currently unused)                                                                                |

**DB table (inferred from save payload):**

```sql
CREATE TABLE rt_saved_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  waypoints JSONB NOT NULL,
  encoded_polyline TEXT NOT NULL,
  distance_m NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_saved_routes_user ON rt_saved_routes(user_id, created_at DESC);
```

**Known limitations of current state:**

- Distance is straight-line (Haversine) — under-reports actual road distance meaningfully on any route with turns. No disclaimer is shown.
- Estimated time is not shown — stats panel only shows distance and waypoint count.
- Cannot remove a single waypoint — only undo-last or clear-all.
- No empty state hint on the map — first-time users see a blank map with no call to action.
- Saved routes empty state has no CTA button.

---

### 23.4 API Endpoints

**Existing:**

```
GET    /api/running/v1/routes              <- list saved routes for authenticated user
POST   /api/running/v1/routes              <- save a new route
PATCH  /api/running/v1/routes/:id          <- rename a saved route
DELETE /api/running/v1/routes/:id          <- delete a saved route
```

**v2 — to add:**

```
GET    /api/running/v1/routes/:id/export/gpx   <- generate and return GPX file
```

Response: `Content-Type: application/gpx+xml`, `Content-Disposition: attachment; filename="{name}.gpx"`. Decodes `encoded_polyline` server-side, generates standard GPX 1.1 with one `<trkpt>` per waypoint. No elevation in v1 of export.

---

### 23.5 v1 Improvements

These improvements require no new DB schema or backend endpoints.

#### 23.5.1 Empty State Hint on Map

When `waypoints.length === 0`, overlay a centered hint pill on the map:

- Positioned: `absolute top-4 left-1/2 -translate-x-1/2`
- Tailwind: `bg-white/95 border border-slate-200 rounded-full px-4 py-2 text-sm font-medium text-slate-600 shadow-sm pointer-events-none z-10`
- Text: "Click the map to add your first waypoint"
- Disappears when `waypoints.length > 0`
- Crosshair cursor on map container at all times: `cursor-crosshair` class

**Test ID:** `mapHintPill_routeBuilderPage`

#### 23.5.2 Custom Pace Input + Estimated Time

Add pace input and estimated time to `RouteStats.jsx`.

- Default pace: computed from last 10 activities — `sum(moving_time_sec) / sum(distance_km)` (state only, resets on mount — not persisted)
- Pace input (`id="paceInput_routeBuilderPage"`): accepts `mm:ss` format, regex `/^[0-9]{1,2}:[0-5][0-9]$/`; `0:00` is invalid (shows `—`)
- Est. Time: displayed via `fmtDuration(sec)` — format `M:SS` or `H:MM:SS`
- Est. Time test ID: `estimatedTime_routeBuilderPage`
- Stats grid: 2x2 layout — Distance / Waypoints / Pace / Est. Time

#### 23.5.3 Distance Disclaimer

Add a `<button>` wrapping an `Info` icon (size-3, text-slate-300) next to the "Distance" label. On click:

> "Straight-line estimate; actual road distance will be longer"

- Component: custom `<Popover>` / `<PopoverContent>` (click to open, not hover) from `@/components/base/Popover/Popover`
- Trigger element: `<button>` wrapping `<Info>` — keyboard accessible
- Test ID: `distanceTooltip_routeBuilderPage`

#### 23.5.4 Delete Individual Waypoint (Right-click)

Right-clicking any waypoint marker removes it and reconnects the route line between its neighbors.

- Hover on marker: cursor changes to `pointer`, marker scales up to 1.15x
- Right-click removes the waypoint at that index from the array
- On first waypoint ever placed (localStorage `routeBuilder_deleteHintSeen` not set): show tooltip "Right-click a point to remove it" for 5 seconds, then set flag
- Delete hint test ID: `waypointDeleteHint_routeBuilderPage`

#### 23.5.5 Last Waypoint Visual Highlight

The most recently placed waypoint shows a pulsing violet ring (reuse `routePing` keyframe from `RouteMap.jsx`).

- Ring: outer div, color `#7c3aed`, opacity 0.4
- Moves to the new last marker on each waypoint add
- Start marker (green) never gets the ring

#### 23.5.6 Floating Undo Button on Mobile

On screens below `lg` breakpoint, pin a floating Undo button to the bottom-right of the map.

- Tailwind: `absolute bottom-3 right-12 z-10 lg:hidden`
- Size: `size-11` (44x44px minimum touch target)
- Style: `bg-white/95 shadow-md rounded-full flex items-center justify-center border border-slate-200`
- Icon: `Undo2` (size-4, text-slate-600)
- Disabled when `waypoints.length === 0`
- Test ID: `undoFloatingBtn_routeBuilderPage`

#### 23.5.7 Route Line Border

Add `route-border` layer underneath `route-line` in `RouteBuilderMap.jsx` for consistency with `RouteMap.jsx`:

- `route-border`: `line-color: '#000000'`, `line-width: 6`, `line-opacity: 0.75`
- `route-line`: `line-color: '#7c3aed'`, `line-width: 4`, `line-opacity: 0.9`

#### 23.5.8 Saved Routes Empty State CTA

Replace text-only empty state with icon + message + CTA:

- Icon: `MapPinned` (size-8, text-slate-300)
- Message: "No saved routes yet."
- Button (`id="goToBuilderBtn_routeBuilderPage"`): "Build your first route" — scrolls to `routeBuilderCard_routeBuilderPage`

---

### 23.6 v2 Improvements

These require additional backend work and are planned for a later milestone.

#### 23.6.1 GPX Export

Add "Export GPX" button to each `SavedRouteRow` and to the route preview modal.

**GPX format (standard 1.1):**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Running Tracker"
     xmlns="http://www.topografix.com/GPX/1/1">
  <trk>
    <name>{route.name}</name>
    <trkseg>
      <trkpt lat="{lat}" lon="{lng}" />
    </trkseg>
  </trk>
</gpx>
```

- Filename: `{name-kebab-case}.gpx`
- Row button test ID: `exportGpxBtn_{id}_routeBuilderPage`
- Modal button test ID: `exportGpxBtnModal_routeBuilderPage`

**Backend:** `GET /api/running/v1/routes/:id/export/gpx` — auth-gated (401), ownership check (403), not found (404).

#### 23.6.2 Fullscreen Drawing Mode

Add `Maximize2` button (`id="expandMapBtn_routeBuilderPage"`) to the map container. In fullscreen, map fills the viewport and a compact bottom bar shows distance + waypoint count + Undo.

- Fullscreen modal test ID: `fullscreenMapModal_routeBuilderPage`
- Bottom bar: `fixed bottom-0 left-0 right-0 bg-white/95 border-t border-slate-200 px-4 py-3`
- Exit: Escape key or close button

---

### 23.7 Validations

| Field      | Rule                                    |
| ---------- | --------------------------------------- |
| Route name | Required, 1–100 characters, trimmed     |
| Waypoints  | Minimum 2 to enable Save                |
| Pace input | Format `mm:ss`, range 1:00–15:00/km     |
| GPX export | Route must belong to authenticated user |

---

### 23.8 Error States

| Scenario                  | Handling                                                         |
| ------------------------- | ---------------------------------------------------------------- |
| Load saved routes fails   | `savedRoutesError_routeBuilderPage` — AlertCircle + Retry button |
| Save route fails          | `toast.error` with API message                                   |
| Rename route fails        | `toast.error`, input reverts to original name                    |
| Delete route fails        | `toast.error`, route stays in list                               |
| GPX export fails          | `toast.error('Failed to export GPX')`                            |
| GPX export — not found    | 404 response — `toast.error('Route not found')`                  |
| GPX export — unauthorized | 403 response — `toast.error('Access denied')`                    |

---

### 23.9 Test IDs

| ID                                         | Component         | Description                              |
| ------------------------------------------ | ----------------- | ---------------------------------------- |
| `routeBuilderCard_routeBuilderPage`        | Builder card      | Container for map + stats panel          |
| `routeBuilderMap_routeBuilderPage`         | Map container     | MapLibre GL JS canvas wrapper            |
| `mapHintPill_routeBuilderPage`             | Hint overlay      | Shown when 0 waypoints                   |
| `undoWaypointBtn_routeBuilderPage`         | Undo button       | Removes last waypoint                    |
| `undoFloatingBtn_routeBuilderPage`         | Floating Undo     | Mobile-only, pinned to map               |
| `clearRouteBtn_routeBuilderPage`           | Clear button      | Removes all waypoints                    |
| `distanceInfoIcon_routeBuilderPage`        | Info icon         | Disclaimer tooltip trigger               |
| `estTime_routeBuilderPage`                 | Est. Time stat    | Computed from distance x pace            |
| `paceInput_routeBuilderPage`               | Pace input        | User-editable, persisted to localStorage |
| `waypointDeleteHint_routeBuilderPage`      | Delete hint       | One-time right-click tooltip             |
| `routeNameInput_routeBuilderPage`          | Name input        | Route name field                         |
| `saveRouteBtn_routeBuilderPage`            | Save button       | Disabled until name + 2 waypoints        |
| `savedRoutesCard_routeBuilderPage`         | Saved routes card | Container for saved routes               |
| `savedRoutesLoading_routeBuilderPage`      | Loading skeleton  | 3 skeleton rows                          |
| `savedRoutesError_routeBuilderPage`        | Error state       | AlertCircle + Retry                      |
| `savedRoutesEmpty_routeBuilderPage`        | Empty state       | Icon + message + CTA                     |
| `savedRoutesList_routeBuilderPage`         | Routes list       | List of SavedRouteRow                    |
| `savedRoute_{id}_routeBuilderPage`         | Route row         | Per-route container                      |
| `viewRouteBtn_{id}_routeBuilderPage`       | View button       | Opens preview modal                      |
| `renameRouteBtn_{id}_routeBuilderPage`     | Rename button     | Starts inline rename                     |
| `editRouteNameInput_{id}_routeBuilderPage` | Rename input      | Inline name input                        |
| `confirmRenameBtn_{id}_routeBuilderPage`   | Confirm rename    | Saves new name                           |
| `cancelRenameBtn_{id}_routeBuilderPage`    | Cancel rename     | Reverts name                             |
| `deleteRouteBtn_{id}_routeBuilderPage`     | Delete button     | Deletes with toast                       |
| `exportGpxBtn_{id}_routeBuilderPage`       | GPX export row    | Downloads GPX (v2)                       |
| `goToBuilderBtn_routeBuilderPage`          | Empty CTA         | Scrolls to builder card                  |
| `routePreviewModal_routeBuilderPage`       | Preview modal     | RouteMap for saved route                 |
| `exportGpxBtnModal_routeBuilderPage`       | GPX export modal  | Downloads GPX from modal (v2)            |
| `expandMapBtn_routeBuilderPage`            | Fullscreen button | Opens fullscreen mode (v2)               |
| `fullscreenMapModal_routeBuilderPage`      | Fullscreen modal  | Full-viewport drawing mode (v2)          |

---

### 23.10 Acceptance Criteria

**23.10.1 Empty State**

```
GIVEN user opens Route Builder with no waypoints placed
WHEN the map renders
THEN mapHintPill_routeBuilderPage is visible
AND the map container has cursor-crosshair class

GIVEN user places the first waypoint
THEN mapHintPill_routeBuilderPage is no longer visible
```

**23.10.2 Pace and Estimated Time**

```
GIVEN user has not set a custom pace
WHEN RouteStats renders
THEN paceInput_routeBuilderPage shows "6:00"
AND estTime_routeBuilderPage shows "0 min"

GIVEN user sets pace to "5:30" and places waypoints totalling 5.0 km
THEN estTime_routeBuilderPage shows "27 min"

GIVEN user sets a custom pace and refreshes the page
THEN paceInput_routeBuilderPage retains the previously set pace
```

**23.10.3 Distance Disclaimer**

```
GIVEN Route Builder is rendered
WHEN user hovers or focuses distanceInfoIcon_routeBuilderPage
THEN tooltip appears: "Straight-line distance between waypoints — actual road distance may be higher."
```

**23.10.4 Delete Individual Waypoint**

```
GIVEN user has placed 3+ waypoints
WHEN user right-clicks the second waypoint marker
THEN that waypoint is removed from the array
AND route line reconnects between waypoint 1 and waypoint 3
AND waypoint count decreases by 1

GIVEN first waypoint ever placed (localStorage routeBuilder_deleteHintSeen not set)
THEN waypointDeleteHint_routeBuilderPage appears for 5 seconds
AND localStorage routeBuilder_deleteHintSeen is set to "true"

GIVEN localStorage routeBuilder_deleteHintSeen is "true"
WHEN user places a waypoint
THEN waypointDeleteHint_routeBuilderPage does not appear
```

**23.10.5 Last Waypoint Highlight**

```
GIVEN user has placed 2+ waypoints
THEN the last waypoint has a pulsing violet ring animation
AND the start (green) marker has no ring
AND Undo removes the highlighted waypoint
```

**23.10.6 Mobile Floating Undo**

```
GIVEN viewport width < 1024px AND waypoints.length >= 1
THEN undoFloatingBtn_routeBuilderPage is visible on the map
AND clicking it removes the last waypoint
AND the button is at least 44x44px

GIVEN waypoints.length === 0
THEN undoFloatingBtn_routeBuilderPage is visible but disabled
```

**23.10.7 Route Line Border**

```
GIVEN user has placed 2+ waypoints
WHEN the route renders
THEN route-border MapLibre layer exists (black, width 6, opacity 0.75)
AND route-line layer is violet, width 4, opacity 0.9
```

**23.10.8 Saved Routes Empty CTA**

```
GIVEN user has no saved routes
THEN savedRoutesEmpty_routeBuilderPage shows icon + message + goToBuilderBtn_routeBuilderPage
AND clicking goToBuilderBtn_routeBuilderPage scrolls to routeBuilderCard_routeBuilderPage
```

**23.10.9 GPX Export (v2)**

```
GIVEN user clicks exportGpxBtn_{id}_routeBuilderPage
WHEN API call succeeds
THEN browser downloads "{route-name}.gpx"
AND file is valid GPX 1.1 with one <trk> containing one <trkpt> per waypoint

GIVEN route does not belong to authenticated user
THEN API returns 403 AND toast.error('Access denied') is shown

GIVEN route id does not exist
THEN API returns 404 AND toast.error('Route not found') is shown
```

---
