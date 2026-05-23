# Strava API — Complete Endpoint Reference

Dokumentasi **semua endpoint** Strava API v3. Untuk konteks Running Tracker app, setiap endpoint diberi flag:

- 🟢 **USED** — Akan dipakai di Running Tracker
- 🟡 **OPTIONAL** — Bisa dipakai future, depends on scope
- 🔴 **NOT USED** — Tidak relevan untuk use case kita
- ⚠️ **SCOPE/PERMISSION ISSUE** — Butuh write scope atau Summit subscription

**Base URL:** `https://www.strava.com/api/v3`
**Total endpoints:** 31 (across 8 categories)
**Source:** https://developers.strava.com/docs/reference/

---

## Daftar isi

1. [Activities](#1-activities) — 8 endpoints
2. [Athletes](#2-athletes) — 4 endpoints
3. [Clubs](#3-clubs) — 5 endpoints
4. [Gears](#4-gears) — 1 endpoint
5. [Routes](#5-routes) — 4 endpoints
6. [Segment Efforts](#6-segment-efforts) — 2 endpoints
7. [Segments](#7-segments) — 4 endpoints
8. [Streams](#8-streams) — 4 endpoints
9. [Uploads](#9-uploads) — 2 endpoints
10. [Summary table](#10-summary-table)

---

## 1. Activities

8 endpoints terkait aktivitas.

### 1.1 Create an Activity 🔴 NOT USED

```
POST /activities
```

**Purpose:** Create manual activity di Strava.

**Required scope:** `activity:write`

**Why NOT USED:** Running Tracker tidak push data ke Strava (read-only architecture). Manual activity di-create di Running Tracker DB lokal.

---

### 1.2 Get Activity 🟢 USED

```
GET /activities/{id}
```

**Purpose:** Get detail lengkap satu activity.

**Required scope:** `activity:read` (untuk Everyone & Followers) atau `activity:read_all` (untuk private)

**Use case di Running Tracker:** Saat user buka activity detail page. Dipanggil on-demand.

**Query params:**

- `include_all_efforts` (bool) — include segment efforts

**Response:** `DetailedActivity` — lihat dokumentasi sebelumnya untuk schema lengkap.

---

### 1.3 List Activity Comments 🔴 NOT USED

```
GET /activities/{id}/comments
```

**Purpose:** List comments di activity.

**Required scope:** `activity:read` atau `activity:read_all`

**Why NOT USED:** Running Tracker bukan social platform. Comment dari Strava tidak relevan untuk personal analytics.

**Catatan:** Endpoint ini support cursor-based pagination (`after_cursor`).

---

### 1.4 List Activity Kudoers 🔴 NOT USED

```
GET /activities/{id}/kudos
```

**Purpose:** List athletes yang kudos activity.

**Required scope:** `activity:read` atau `activity:read_all`

**Why NOT USED:** Social feature, tidak relevan personal analytics.

**Query params:**

- `page` (int, default 1)
- `per_page` (int, default 30)

**Response example:**

```json
[{ "firstname": "Peter", "lastname": "S" }]
```

⚠️ Response untuk kudoers **sangat minimal** — hanya nama. Tidak ada athlete ID.

---

### 1.5 List Activity Laps 🟡 OPTIONAL

```
GET /activities/{id}/laps
```

**Purpose:** Get laps (auto-lap dari watch atau manual button).

**Required scope:** `activity:read` atau `activity:read_all`

**Status untuk Running Tracker:** OPTIONAL. Laps sudah include di response `GET /activities/{id}` (field `laps`). Endpoint ini cuma ambil laps saja tanpa data lain.

**Use case:** Kalau hanya butuh laps tanpa overhead activity detail full.

---

### 1.6 List Athlete Activities 🟢 USED (HEAVILY)

```
GET /athlete/activities
```

**Purpose:** List activities user yang sedang authenticated.

**Required scope:** `activity:read` (filter out Only Me) atau `activity:read_all` (include Only Me)

**Use case di Running Tracker:** **CORE ENDPOINT**. Dipakai untuk:

- Initial backfill (semua activities saat first connect)
- Periodic polling (fallback kalau webhook miss)

**Query params:**

- `before` (Unix timestamp) — activities sebelum tanggal
- `after` (Unix timestamp) — activities setelah tanggal
- `page` (int, default 1)
- `per_page` (int, default 30, **max 200**)

**Response:** Array of `SummaryActivity`.

**Penting:**

- Tidak ada filter by sport_type di server side — filter di client
- Untuk efficient backfill, pakai `per_page=200` + paginate

---

### 1.7 Get Activity Zones 🟡 OPTIONAL (SUMMIT FEATURE)

```
GET /activities/{id}/zones
```

**Purpose:** HR/Power zones distribution untuk activity.

**Required scope:** `activity:read` atau `activity:read_all`

⚠️ **Summit feature** — Hanya tersedia kalau user punya Strava Summit subscription.

**Status untuk Running Tracker:** OPTIONAL. Bisa **calculate sendiri** dari stream data (lebih reliable, tidak depends Summit).

**Response example:**

```json
[
  {
    "score": 0,
    "sensor_based": true,
    "custom_zones": true,
    "max": 1,
    "distribution_buckets": "",
    "type": "heartrate",
    "points": 6
  }
]
```

---

### 1.8 Update Activity 🔴 NOT USED

```
PUT /activities/{id}
```

**Purpose:** Update activity name, description, type, dll.

**Required scope:** `activity:write`

**Why NOT USED:** Running Tracker tidak modify data di Strava. Note edit dilakukan di Running Tracker DB lokal.

---

## 2. Athletes

4 endpoints terkait athlete profile.

### 2.1 Get Authenticated Athlete 🟢 USED

```
GET /athlete
```

**Purpose:** Get profile athlete yang authenticated.

**Required scope:** `read` (summary) atau `profile:read_all` (detailed)

**Use case di Running Tracker:** First-time setup setelah OAuth — populate user profile dengan biometric data dari Strava (weight, gear, dll).

**Response:** `DetailedAthlete` dengan field:

- Profile basic (id, username, name, profile pic)
- Location (city, state, country)
- Preferences (measurement_preference, date_preference)
- Biometric (weight, FTP)
- Gear (shoes[], bikes[])
- Stats (follower_count, friend_count)

---

### 2.2 Get Athlete Zones 🟡 OPTIONAL

```
GET /athlete/zones
```

**Purpose:** HR & Power zones yang user setup di Strava.

**Required scope:** `profile:read_all`

**Status:** OPTIONAL. Running Tracker bisa setup HR zones sendiri (% of max_hr atau Karvonen) yang lebih fleksibel.

**Use case alternative:** Sync user's existing zones dari Strava untuk consistency.

**Response:** `Zones` object dengan `heart_rate` dan `power` zones.

---

### 2.3 Get Athlete Stats 🟢 USED

```
GET /athletes/{id}/stats
```

**Purpose:** Lifetime stats (total distance, count, duration) per sport type.

**Required scope:** `read` minimum (limited untuk Everyone visibility)

⚠️ **Catatan:** Hanya include data dari activities dengan visibility "Everyone". Untuk private activities, calculate sendiri dari local DB.

**Use case di Running Tracker:** Dashboard "lifetime summary" widget — total km, jumlah activities, hours.

**Response fields:**

- `recent_run_totals` — 4 minggu terakhir
- `ytd_run_totals` — year to date
- `all_run_totals` — lifetime
- (Sama untuk ride, swim)
- `biggest_ride_distance` — single longest ride
- `biggest_climb_elevation_gain`

---

### 2.4 Update Athlete 🔴 NOT USED

```
PUT /athlete
```

**Purpose:** Update profile (weight, FTP).

**Required scope:** `profile:write`

**Why NOT USED:** Running Tracker tidak modify profile Strava.

---

## 3. Clubs

5 endpoints. **SEMUA NOT USED** untuk Running Tracker.

### 3.1 List Club Activities 🔴 NOT USED

```
GET /clubs/{id}/activities
```

Club activities feed. Tidak relevan untuk personal tool.

---

### 3.2 List Club Administrators 🔴 NOT USED

```
GET /clubs/{id}/admins
```

Tidak relevan.

---

### 3.3 Get Club 🔴 NOT USED

```
GET /clubs/{id}
```

Club detail. Tidak relevan.

---

### 3.4 List Club Members 🔴 NOT USED

```
GET /clubs/{id}/members
```

Tidak relevan.

---

### 3.5 List Athlete Clubs 🔴 NOT USED

```
GET /athlete/clubs
```

Tidak relevan.

---

## 4. Gears

### 4.1 Get Equipment 🟡 OPTIONAL

```
GET /gear/{id}
```

**Purpose:** Detail gear (shoes/bikes) — distance, retired status, etc.

**Required scope:** `read`

**Use case OPTIONAL:**

- Track running shoes mileage (untuk replace timing)
- Display di activity detail "Ran with: Nike Pegasus 40 (542km)"

**Response:**

```json
{
  "id": "g1234567",
  "primary": true,
  "name": "Nike Pegasus 40",
  "nickname": "Daily trainer",
  "resource_state": 3,
  "retired": false,
  "distance": 542123, // meter total
  "brand_name": "Nike",
  "model_name": "Pegasus 40",
  "frame_type": null, // for bikes
  "description": ""
}
```

**Untuk Phase 3 di Running Tracker:** Gear tracking feature.

---

## 5. Routes

4 endpoints. **SEMUA NOT USED** untuk Running Tracker.

### 5.1 Export Route GPX 🔴 NOT USED

```
GET /routes/{id}/export_gpx
```

### 5.2 Export Route TCX 🔴 NOT USED

```
GET /routes/{id}/export_tcx
```

### 5.3 Get Route 🔴 NOT USED

```
GET /routes/{id}
```

### 5.4 List Athlete Routes 🔴 NOT USED

```
GET /athletes/{id}/routes
```

**Why ALL NOT USED:** "Routes" di Strava adalah pre-planned route, bukan completed activities. Running Tracker fokus ke activities aktual yang sudah dijalani, bukan planning.

---

## 6. Segment Efforts

2 endpoints. **NOT USED** untuk MVP, mungkin OPTIONAL future.

### 6.1 List Segment Efforts 🟡 OPTIONAL (ADVANCED)

```
GET /segment_efforts
```

**Purpose:** List efforts user di segment tertentu (with date range).

**Required scope:** `activity:read_all` + **specific permission** untuk segment leaderboard

⚠️ **Endpoint ini return 403** untuk most apps (butuh special access).

**Use case kalau accessible:** Track progress di "your local hill" — apakah PR improving over time.

---

### 6.2 Get Segment Effort 🟡 OPTIONAL

```
GET /segment_efforts/{id}
```

**Purpose:** Detail satu effort.

**Status:** OPTIONAL. Segment data sudah include di activity detail (`segment_efforts[]`).

---

## 7. Segments

4 endpoints. **NOT USED** untuk MVP.

### 7.1 Explore Segments 🟡 OPTIONAL

```
GET /segments/explore
```

**Purpose:** Discover popular segments di area geografis.

**Use case future:** "Find popular running routes near you".

**Query params:**

- `bounds` (required) — `SW_lat,SW_lng,NE_lat,NE_lng`
- `activity_type` — `running` atau `riding`
- `min_cat`, `max_cat` — climb category

---

### 7.2 List Starred Segments 🔴 NOT USED

```
GET /athlete/segments/starred
```

User's favorited segments. Tidak relevant untuk personal analytics.

---

### 7.3 Get Segment 🔴 NOT USED

```
GET /segments/{id}
```

Segment detail. Tidak relevant.

---

### 7.4 Star Segment 🔴 NOT USED

```
PUT /segments/{id}/starred
```

Star/unstar segment. Write operation, NOT USED.

---

## 8. Streams ⭐

**KATEGORI PALING PENTING** untuk visualization.

### 8.1 Get Activity Streams 🟢 USED (CRITICAL)

```
GET /activities/{id}/streams
```

**Purpose:** Time-series data per detik untuk activity (HR, GPS, pace, dll).

**Required scope:** `activity:read` atau `activity:read_all`

**Use case di Running Tracker:** **PALING PENTING UNTUK CHART VISUALIZATION**:

- Pace chart per km
- HR chart sepanjang activity
- Elevation profile
- Map route (dari latlng)

**Query params:**

- `keys` (comma-separated) — stream types to fetch
- `key_by_type` (bool) — return as keyed object (recommended `true`)

**Available stream keys:**
| Key | Description |
|---|---|
| `time` | Detik dari start (X-axis) |
| `latlng` | `[[lat,lng], ...]` untuk map |
| `distance` | Meter cumulative |
| `altitude` | Meter |
| `heartrate` | BPM |
| `cadence` | Steps/min (per foot, ×2 for running) |
| `velocity_smooth` | m/s smoothed |
| `watts` | Watts (cycling) |
| `temp` | Celsius |
| `moving` | Boolean (excluding pauses) |
| `grade_smooth` | Grade % |

**Performance considerations:**

- Stream response **paling besar** dari Strava (KB-MB per activity)
- 1 request per activity (rate limit consideration)
- Strategy: Fetch on-demand, **cache permanent** di local DB
- Tidak perlu fetch di backfill (terlalu mahal)

---

### 8.2 Get Route Streams 🔴 NOT USED

```
GET /routes/{id}/streams
```

Streams untuk planned route. NOT USED karena Running Tracker tidak handle routes.

---

### 8.3 Get Segment Effort Streams 🟡 OPTIONAL

```
GET /segment_efforts/{id}/streams
```

Streams untuk specific segment effort. OPTIONAL, untuk segment-focused analysis.

---

### 8.4 Get Segment Streams 🔴 NOT USED

```
GET /segments/{id}/streams
```

Streams template untuk segment definition. NOT USED.

---

## 9. Uploads

### 9.1 Upload Activity 🔴 NOT USED

```
POST /uploads
```

**Purpose:** Upload file (GPX/TCX/FIT) ke Strava untuk create activity.

**Required scope:** `activity:write`

**Why NOT USED:** Running Tracker handle upload **internally**. Kalau user upload GPX/FIT di Running Tracker, dia di-parse lokal, **TIDAK** di-forward ke Strava (mencegah duplicate dan menjaga simplicity).

---

### 9.2 Get Upload 🔴 NOT USED

```
GET /uploads/{uploadId}
```

**Purpose:** Check status upload (processing/success/error).

**Why NOT USED:** Sejalan dengan 9.1, NOT USED.

---

## 10. Summary table

### Yang DIPAKAI Running Tracker (USED)

| #   | Endpoint                   | Method | Purpose                | Frequency           |
| --- | -------------------------- | ------ | ---------------------- | ------------------- |
| 1   | `/oauth/authorize`         | GET    | OAuth start            | Per user (once)     |
| 2   | `/oauth/token`             | POST   | Token exchange/refresh | Per session + 6h    |
| 3   | `/athlete`                 | GET    | User profile           | Once after connect  |
| 4   | `/athletes/{id}/stats`     | GET    | Lifetime stats         | Periodic (daily?)   |
| 5   | `/athlete/activities`      | GET    | List activities        | Backfill + periodic |
| 6   | `/activities/{id}`         | GET    | Activity detail        | On-demand           |
| 7   | `/activities/{id}/streams` | GET    | Time-series viz        | On-demand + cache   |
| 8   | `/push_subscriptions`      | POST   | Setup webhook          | Once                |

**Total: 8 endpoints actively used.**

---

### OPTIONAL (mungkin future)

| Endpoint                 | Use case                                 |
| ------------------------ | ---------------------------------------- |
| `/athlete/zones`         | Sync user's HR zones from Strava         |
| `/activities/{id}/zones` | Use Strava's pre-computed zones (Summit) |
| `/activities/{id}/laps`  | Laps-only fetch (kalau butuh efficient)  |
| `/gear/{id}`             | Shoes mileage tracking (Phase 3)         |
| `/segments/explore`      | Discover routes feature (Phase 3)        |
| `/segment_efforts/*`     | Track segment PR over time (Phase 3)     |

---

### NOT USED (out of scope)

| Category                 | Reason                             |
| ------------------------ | ---------------------------------- |
| Activity write/update    | Read-only architecture             |
| Comments & Kudos         | No social features                 |
| Clubs (all 5 endpoints)  | Personal tool, no club integration |
| Routes (all 4 endpoints) | Tidak handle pre-planned routes    |
| Star Segments            | No social features                 |
| Uploads to Strava        | Internal upload only               |

---

## 11. Decision rationale

### Kenapa scope di-limit?

**Read-only architecture** — Running Tracker tidak push apapun ke Strava karena:

1. **Simplicity** — Tidak perlu manage state sync
2. **Safety** — Tidak ada risiko corrupt data Strava user
3. **Scope minimum** — Tidak butuh `activity:write` atau `profile:write` di OAuth
4. **API Agreement** — Lebih mudah comply

**Tidak ada social features** karena Running Tracker designed untuk **personal analytics**, bukan community engagement (yang sudah dihandle Strava sendiri).

**Tidak handle routes/segments** karena fokus pada **completed activities** yang ada data lengkap. Routes adalah planning, segments adalah competitive feature — both out of scope untuk personal coaching tool.

---

## 12. Scope yang dibutuhkan di OAuth

Berdasarkan endpoint USED di atas, scope minimum yang perlu di OAuth request:

```
scope=read,activity:read_all,profile:read_all
```

**Breakdown:**

- `read` — public profile (`/athlete`), stats, gear
- `activity:read_all` — semua activities termasuk private (`/athlete/activities`, `/activities/{id}`, `/activities/{id}/streams`)
- `profile:read_all` — full profile data (`/athlete`)

**Yang TIDAK perlu request:**

- `activity:write` — read-only
- `profile:write` — read-only

---

## 13. Endpoint patterns & best practices

### 13.1 Pagination

Endpoints yang return list pakai pagination:

- `?page=N&per_page=M`
- `per_page` max 200 untuk most endpoints, 30 default
- Cursor-based untuk comments (`after_cursor`)

### 13.2 Date filtering

Untuk `/athlete/activities`:

- `before=UNIX_TIMESTAMP`
- `after=UNIX_TIMESTAMP`
- Both untuk range query

### 13.3 Response inclusion

Beberapa endpoint punya query untuk include detail:

- `?include_all_efforts=true` di `/activities/{id}`
- `?key_by_type=true` di streams

### 13.4 Resource states

Strava response include `resource_state`:

- `1` = meta (minimal, e.g. just ID)
- `2` = summary
- `3` = detail (full)

Endpoint berbeda return resource_state berbeda. List endpoints biasanya return state 2, detail endpoints return state 3.

---

## 14. Endpoint coverage di Postman Collection

Postman Collection yang sudah dibuat sebelumnya (`Strava_API_Postman_Collection.json`) cover:

| #   | Request               | Endpoint               | Status |
| --- | --------------------- | ---------------------- | ------ |
| 01  | Authorization URL     | `/oauth/authorize`     | ✅     |
| 02  | Exchange Code         | `/oauth/token`         | ✅     |
| 03  | Get Athlete Profile   | `/athlete`             | ✅     |
| 04  | List Activities       | `/athlete/activities`  | ✅     |
| 05  | Filter Run Activities | `/athlete/activities`  | ✅     |
| 06  | Get Activity Detail   | `/activities/{id}`     | ✅     |
| 07  | Get Athlete Stats     | `/athletes/{id}/stats` | ✅     |
| 08  | Refresh Token         | `/oauth/token`         | ✅     |

**Yang belum di Postman Collection (untuk ditambah nanti):**

- Get Activity Streams (`/activities/{id}/streams`)
- Webhook subscription (`/push_subscriptions`)

---

## 15. Reference

- **Full reference:** https://developers.strava.com/docs/reference/
- **Swagger Playground:** https://developers.strava.com/playground
- **Authentication guide:** https://developers.strava.com/docs/authentication/
- **Webhooks guide:** https://developers.strava.com/docs/webhooks/
- **Rate limits:** https://developers.strava.com/docs/rate-limits/
- **Upload guide:** https://developers.strava.com/docs/uploads/

---

_Document end. Updated 19 Mei 2026._
