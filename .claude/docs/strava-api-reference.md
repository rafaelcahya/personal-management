# Strava API v3 Reference

All endpoints require OAuth 2.0 bearer token. Base URL: `https://www.strava.com/api/v3`

---

## Table of Contents

- [Activities](#activities)
- [Athletes](#athletes)
- [Clubs](#clubs)
- [Gear](#gear)
- [Routes](#routes)
- [Segment Efforts](#segment-efforts)
- [Segments](#segments)
- [Streams](#streams)
- [Models](#models)

---

## Activities

### POST `/activities`

Create a manual activity.

**Scope:** `activity:write`

**Body (form):**
| Field | Type | Required | Description |
|---|---|---|---|
| `name` | String | ✅ | Activity name |
| `sport_type` | String | ✅ | e.g. `Run`, `Ride`, `MountainBikeRide` |
| `start_date_local` | Date | ✅ | ISO 8601 datetime |
| `elapsed_time` | Integer | ✅ | Duration in seconds |
| `type` | String | | Deprecated alias for `sport_type` |
| `description` | String | | Activity description |
| `distance` | Float | | Distance in meters |
| `trainer` | Integer | | `1` = trainer activity |
| `commute` | Integer | | `1` = commute |

**Response:** `DetailedActivity`

---

### GET `/activities/{id}`

Get a single activity.

**Scope:** `activity:read` (Everyone/Followers), `activity:read_all` (Only Me)

**Path params:**
| Field | Type | Description |
|---|---|---|
| `id` | Long | Activity identifier |

**Query params:**
| Field | Type | Description |
|---|---|---|
| `include_all_efforts` | Boolean | Include all segment efforts |

**Response:** `DetailedActivity` (full expanded fields including `suffer_score`, `best_efforts`, `splits_metric`, `laps`, `gear`, `photos`)

---

### PUT `/activities/{id}`

Update an activity.

**Scope:** `activity:write`, `activity:read_all` (Only Me)

**Response:** `DetailedActivity`

---

### GET `/athlete/activities`

List authenticated athlete's activities.

**Scope:** `activity:read` (public), `activity:read_all` (private)

**Query params:**
| Field | Type | Description |
|---|---|---|
| `before` | Integer | Epoch timestamp — return activities before this |
| `after` | Integer | Epoch timestamp — return activities after this |
| `page` | Integer | Page number (default: 1) |
| `per_page` | Integer | Items per page (default: 30) |

**Response:** Array of `SummaryActivity`

> **Note:** `suffer_score` is available on `SummaryActivity` from this list endpoint — no need for detail fetch just to get load data.

---

### GET `/activities/{id}/zones`

Get heart rate and power zones for an activity.

**Scope:** `activity:read`

**Note:** Summit (premium) feature. Returns time distribution across zones — no need to compute from HR streams.

**Response:** Array of `ActivityZone`

```json
[
  {
    "type": "heartrate",
    "score": 78,
    "sensor_based": true,
    "custom_zones": false,
    "max": 183,
    "points": 91,
    "distribution_buckets": [
      { "min": 0, "max": 115, "time": 120 },
      { "min": 115, "max": 152, "time": 900 },
      { "min": 152, "max": 171, "time": 1200 },
      { "min": 171, "max": 183, "time": 600 },
      { "min": 183, "max": -1, "time": 180 }
    ]
  }
]
```

---

### GET `/activities/{id}/comments`

List comments on an activity.

**Scope:** `activity:read`

**Query params:** `page_size` (default 30), `after_cursor` (pagination)

**Response:** Array of `Comment`

---

### GET `/activities/{id}/kudos`

List athletes who kudoed an activity.

**Scope:** `activity:read`

**Query params:** `page`, `per_page` (default 30)

**Response:** Array of `SummaryAthlete` (firstname, lastname only)

---

### GET `/activities/{id}/laps`

Get laps for an activity.

**Scope:** `activity:read`

**Response:** Array of `Lap`

---

## Athletes

### GET `/athlete`

Get authenticated athlete profile.

**Response:** `DetailedAthlete`

---

### PUT `/athlete`

Update athlete profile.

**Scope:** `profile:write`

**Body:**
| Field | Type | Description |
|---|---|---|
| `weight` | Float | Weight in kilograms |

**Response:** `DetailedAthlete`

---

### GET `/athlete/zones`

Get authenticated athlete's HR and power zones.

**Response:** `Zones`

```json
{
  "heart_rate": {
    "custom_zones": false,
    "zones": [
      { "min": 0,   "max": 115 },
      { "min": 115, "max": 152 },
      { "min": 152, "max": 171 },
      { "min": 171, "max": 183 },
      { "min": 183, "max": -1  }
    ]
  },
  "power": {
    "zones": [...]
  }
}
```

> Useful for computing time-in-zone from HR streams when `/activities/{id}/zones` is unavailable (non-Summit users).

---

### GET `/athletes/{id}/stats`

Get activity statistics for an athlete.

**Note:** `id` must match the authenticated athlete.

**Response:** `ActivityStats`

```json
{
  "biggest_ride_distance": 174321.0,
  "biggest_climb_elevation_gain": 1882.0,
  "recent_run_totals": { "count": 12, "distance": 98300, "moving_time": 36000, "elapsed_time": 38000, "elevation_gain": 412, "achievement_count": 3 },
  "ytd_run_totals":    { "count": 87, "distance": 720000, ... },
  "all_run_totals":    { "count": 312, "distance": 2800000, ... },
  "recent_ride_totals": { ... },
  "ytd_ride_totals":    { ... },
  "all_ride_totals":    { ... },
  "recent_swim_totals": { ... },
  "ytd_swim_totals":    { ... },
  "all_swim_totals":    { ... }
}
```

---

## Clubs

### GET `/athlete/clubs`

List clubs the authenticated athlete belongs to.

**Response:** Array of `SummaryClub`

---

### GET `/clubs/{id}`

Get a club by ID.

**Response:** `DetailedClub`

---

### GET `/clubs/{id}/members`

List club members.

**Response:** Array of `ClubAthlete`

---

### GET `/clubs/{id}/admins`

List club administrators.

**Response:** Array of `ClubAthlete`

---

### GET `/clubs/{id}/activities`

List recent club activities.

**Response:** Array of `ClubActivity`

---

## Gear

### GET `/gear/{id}`

Get gear (bike or shoe) by ID.

**Response:** `DetailedGear`

```json
{
  "id": "g123456",
  "primary": true,
  "name": "Nike Pegasus 40",
  "resource_state": 3,
  "distance": 487200,
  "brand_name": "Nike",
  "model_name": "Pegasus 40",
  "description": "Daily trainer",
  "weight": 284.0,
  "frame_type": null
}
```

> `distance` is in meters — total mileage on this gear across all activities.

---

## Routes

### GET `/athletes/{id}/routes`

List routes created by an athlete.

**Query params:** `page`, `per_page` (default 30)

**Response:** Array of `Route`

---

### GET `/routes/{id}`

Get a route by ID.

**Response:** `Route` (id, name, distance, elevation_gain, map, segments)

---

### GET `/routes/{id}/export_gpx`

Export route as GPX file.

**Response:** GPX file

---

### GET `/routes/{id}/export_tcx`

Export route as TCX file.

**Response:** TCX file

---

## Segment Efforts

### GET `/segment_efforts/{id}`

Get a specific segment effort.

**Response:** `DetailedSegmentEffort` (id, name, activity, athlete, elapsed_time, moving_time, distance, average_speed, max_speed)

---

### GET `/segments/{id}/all_efforts`

List all efforts on a segment.

**Query params:** `page`, `per_page` (default 30)

**Response:** Array of `SummarySegmentEffort`

---

## Segments

### GET `/segments/{id}`

Get a segment by ID.

**Response:** `DetailedSegment` (id, name, activity_type, distance, average_grade, maximum_grade, elevation_high, elevation_low, start_latlng, end_latlng, climb_category, private, hazardous)

---

### GET `/segments/starred`

List authenticated athlete's starred segments.

**Query params:** `page`, `per_page` (default 30)

**Response:** Array of `DetailedSegment`

---

### POST `/segments/{id}/starred`

Star or unstar a segment.

**Response:** `DetailedSegment`

---

### GET `/segments/explore`

Find top 10 segments in a geographic area.

**Query params:**
| Field | Type | Required | Description |
|---|---|---|---|
| `bounds` | List | ✅ | `sw_lat,sw_lng,ne_lat,ne_lng` |
| `activity_type` | String | | `running` or `riding` |

**Response:** `ExplorerResponse` → array of `ExplorerSegment`

---

## Streams

Stream data is time-series sensor data for an activity, route, or segment effort.

### GET `/activities/{id}/streams`

Get streams for an activity.

**Query params:**
| Field | Type | Description |
|---|---|---|
| `keys` | List | Stream types: `time`, `distance`, `latlng`, `altitude`, `heartrate`, `cadence`, `watts`, `temp`, `moving` |
| `key_by_type` | Boolean | Return object keyed by type instead of array |

**Response:** `StreamSet`

```json
{
  "time":      { "type": "time",      "data": [0, 1, 2, ...],         "series_type": "time", "original_size": 3600, "resolution": "high" },
  "heartrate": { "type": "heartrate", "data": [142, 145, 148, ...],   "series_type": "time", "original_size": 3600, "resolution": "high" },
  "cadence":   { "type": "cadence",   "data": [82, 84, 83, ...],      "series_type": "time", "original_size": 3600, "resolution": "high" },
  "watts":     { "type": "watts",     "data": [220, 235, 218, ...],   "series_type": "time", "original_size": 3600, "resolution": "high" },
  "distance":  { "type": "distance",  "data": [0, 2.8, 5.6, ...],    "series_type": "time", "original_size": 3600, "resolution": "high" },
  "altitude":  { "type": "altitude",  "data": [214, 215, 216, ...],  "series_type": "time", "original_size": 3600, "resolution": "high" },
  "latlng":    { "type": "latlng",    "data": [[-6.2, 106.8], ...],  "series_type": "time", "original_size": 3600, "resolution": "high" },
  "moving":    { "type": "moving",    "data": [true, true, false, ...], "series_type": "time" },
  "temp":      { "type": "temp",      "data": [28, 28, 29, ...],     "series_type": "time" }
}
```

---

### GET `/routes/{id}/streams`

Get streams for a route (elevation, latlng).

---

### GET `/segment_efforts/{id}/streams`

Get streams for a segment effort.

---

### GET `/segments/{id}/streams`

Get streams for a segment (altitude, distance, latlng).

---

## Models

### DetailedActivity

Full activity object. Returned by `GET /activities/{id}` and `POST /activities`.

| Field                       | Type                    | Notes                                                 |
| --------------------------- | ----------------------- | ----------------------------------------------------- |
| `id`                        | Long                    |                                                       |
| `external_id`               | String                  | Upload identifier                                     |
| `upload_id`                 | Long                    |                                                       |
| `athlete`                   | MetaAthlete             | `{ id, resource_state }`                              |
| `name`                      | String                  | Activity title                                        |
| `distance`                  | Float                   | Meters                                                |
| `moving_time`               | Integer                 | Seconds                                               |
| `elapsed_time`              | Integer                 | Seconds                                               |
| `total_elevation_gain`      | Float                   | Meters                                                |
| `elev_high`                 | Float                   | Meters                                                |
| `elev_low`                  | Float                   | Meters                                                |
| `type`                      | String                  | Deprecated — use `sport_type`                         |
| `sport_type`                | String                  | e.g. `Run`, `Ride`, `Swim`                            |
| `workout_type`              | Integer                 | Run: `0`=default, `1`=race, `2`=long run, `3`=workout |
| `start_date`                | Date                    | UTC                                                   |
| `start_date_local`          | Date                    | Local time                                            |
| `timezone`                  | String                  | e.g. `(GMT+07:00) Asia/Jakarta`                       |
| `utc_offset`                | Float                   | Seconds offset                                        |
| `start_latlng`              | [Float]                 | `[lat, lng]`                                          |
| `end_latlng`                | [Float]                 | `[lat, lng]`                                          |
| `location_city`             | String                  |                                                       |
| `location_state`            | String                  |                                                       |
| `location_country`          | String                  |                                                       |
| `achievement_count`         | Integer                 |                                                       |
| `kudos_count`               | Integer                 |                                                       |
| `comment_count`             | Integer                 |                                                       |
| `athlete_count`             | Integer                 | Participants in group activity                        |
| `photo_count`               | Integer                 | Instagram photos                                      |
| `total_photo_count`         | Integer                 | All photos                                            |
| `map`                       | PolylineMap             | Encoded route polyline                                |
| `trainer`                   | Boolean                 | Indoor trainer                                        |
| `commute`                   | Boolean                 |                                                       |
| `manual`                    | Boolean                 | Manually entered                                      |
| `private`                   | Boolean                 |                                                       |
| `flagged`                   | Boolean                 |                                                       |
| `gear_id`                   | String                  | Shoe/bike ID                                          |
| `gear`                      | SummaryGear             | Expanded gear object                                  |
| `average_speed`             | Float                   | m/s                                                   |
| `max_speed`                 | Float                   | m/s                                                   |
| `average_cadence`           | Float                   | RPM                                                   |
| `average_temp`              | Integer                 | °C                                                    |
| `average_watts`             | Float                   | Cycling only                                          |
| `weighted_average_watts`    | Integer                 | Normalized Power (cycling)                            |
| `kilojoules`                | Float                   | Cycling only                                          |
| `max_watts`                 | Integer                 |                                                       |
| `device_watts`              | Boolean                 | `true` = from power meter, `false` = estimated        |
| `has_heartrate`             | Boolean                 |                                                       |
| `average_heartrate`         | Float                   | BPM                                                   |
| `max_heartrate`             | Float                   | BPM                                                   |
| `calories`                  | Float                   | kcal                                                  |
| `suffer_score`              | Integer                 | Strava Relative Effort — HR-based load metric         |
| `pr_count`                  | Integer                 | Personal records in this activity                     |
| `description`               | String                  |                                                       |
| `segment_efforts`           | [DetailedSegmentEffort] |                                                       |
| `splits_metric`             | [Split]                 | Per-km splits                                         |
| `laps`                      | [Lap]                   |                                                       |
| `photos`                    | PhotosSummary           |                                                       |
| `device_name`               | String                  | GPS device model                                      |
| `embed_token`               | String                  |                                                       |
| `perceived_exertion`        | Float                   | RPE 0–10 (DetailedActivity only)                      |
| `prefer_perceived_exertion` | Boolean                 |                                                       |
| `hide_from_home`            | Boolean                 |                                                       |
| `has_kudoed`                | Boolean                 |                                                       |

---

### SummaryActivity

Subset returned by `GET /athlete/activities` (list endpoint).

| Field                | Type    | Available                       |
| -------------------- | ------- | ------------------------------- |
| All core fields      |         | ✅                              |
| `suffer_score`       | Integer | ✅ — available on list endpoint |
| `workout_type`       | Integer | ✅                              |
| `pr_count`           | Integer | ✅                              |
| `gear_id`            | String  | ✅                              |
| `average_watts`      | Float   | ✅                              |
| `device_watts`       | Boolean | ✅                              |
| `segment_efforts`    | Array   | ❌ — DetailedActivity only      |
| `splits_metric`      | Array   | ❌ — DetailedActivity only      |
| `laps`               | Array   | ❌ — DetailedActivity only      |
| `perceived_exertion` | Float   | ❌ — DetailedActivity only      |
| `best_efforts`       | Array   | ❌ — DetailedActivity only      |
| `description`        | String  | ❌ — DetailedActivity only      |
| `photos`             | Object  | ❌ — DetailedActivity only      |

---

### DetailedAthlete

| Field                    | Type          | Notes                              |
| ------------------------ | ------------- | ---------------------------------- |
| `id`                     | Long          |                                    |
| `username`               | String        |                                    |
| `firstname`              | String        |                                    |
| `lastname`               | String        |                                    |
| `city`                   | String        |                                    |
| `state`                  | String        |                                    |
| `country`                | String        |                                    |
| `sex`                    | String        | `M` / `F`                          |
| `premium`                | Boolean       | Strava Summit subscriber           |
| `created_at`             | Date          |                                    |
| `updated_at`             | Date          |                                    |
| `profile_medium`         | String        | Avatar URL (62×62)                 |
| `profile`                | String        | Avatar URL (full size)             |
| `follower_count`         | Integer       |                                    |
| `friend_count`           | Integer       |                                    |
| `athlete_type`           | Integer       | `0`=cyclist, `1`=runner            |
| `date_preference`        | String        | e.g. `%m/%d/%Y`                    |
| `measurement_preference` | String        | `feet` or `meters`                 |
| `ftp`                    | Integer       | Functional Threshold Power (watts) |
| `weight`                 | Float         | kg                                 |
| `clubs`                  | [SummaryClub] |                                    |
| `bikes`                  | [SummaryGear] |                                    |
| `shoes`                  | [SummaryGear] |                                    |

---

### ActivityStats

| Field                          | Type          | Notes        |
| ------------------------------ | ------------- | ------------ |
| `biggest_ride_distance`        | Float         | Meters       |
| `biggest_climb_elevation_gain` | Float         | Meters       |
| `recent_run_totals`            | ActivityTotal | Last 4 weeks |
| `ytd_run_totals`               | ActivityTotal | Year to date |
| `all_run_totals`               | ActivityTotal | All time     |
| `recent_ride_totals`           | ActivityTotal |              |
| `ytd_ride_totals`              | ActivityTotal |              |
| `all_ride_totals`              | ActivityTotal |              |
| `recent_swim_totals`           | ActivityTotal |              |
| `ytd_swim_totals`              | ActivityTotal |              |
| `all_swim_totals`              | ActivityTotal |              |

---

### ActivityTotal

| Field               | Type    | Notes                |
| ------------------- | ------- | -------------------- |
| `count`             | Integer | Number of activities |
| `distance`          | Float   | Meters               |
| `moving_time`       | Integer | Seconds              |
| `elapsed_time`      | Integer | Seconds              |
| `elevation_gain`    | Float   | Meters               |
| `achievement_count` | Integer | Only on `recent_*`   |

---

### ActivityZone

| Field                  | Type             | Notes                                              |
| ---------------------- | ---------------- | -------------------------------------------------- |
| `score`                | Integer          | Overall score (same as `suffer_score` for HR zone) |
| `type`                 | String           | `heartrate` or `power`                             |
| `sensor_based`         | Boolean          | `true` = from HR monitor or power meter            |
| `custom_zones`         | Boolean          | User has custom zone boundaries                    |
| `max`                  | Integer          | Max HR or power observed                           |
| `points`               | Integer          | Load points                                        |
| `distribution_buckets` | [TimedZoneRange] | Time spent per zone                                |

---

### TimedZoneRange

| Field  | Type    | Notes                            |
| ------ | ------- | -------------------------------- |
| `min`  | Integer | Zone lower bound (BPM or watts)  |
| `max`  | Integer | Zone upper bound (`-1` = no cap) |
| `time` | Integer | Seconds spent in this zone       |

---

### Lap

| Field                  | Type         | Notes           |
| ---------------------- | ------------ | --------------- |
| `id`                   | Long         |                 |
| `name`                 | String       | e.g. `Lap 1`    |
| `activity`             | MetaActivity |                 |
| `athlete`              | MetaAthlete  |                 |
| `elapsed_time`         | Integer      | Seconds         |
| `moving_time`          | Integer      | Seconds         |
| `start_date`           | Date         | UTC             |
| `start_date_local`     | Date         |                 |
| `distance`             | Float        | Meters          |
| `start_index`          | Integer      | Index in stream |
| `end_index`            | Integer      | Index in stream |
| `total_elevation_gain` | Float        | Meters          |
| `average_speed`        | Float        | m/s             |
| `max_speed`            | Float        | m/s             |
| `average_cadence`      | Float        | RPM             |
| `average_watts`        | Float        |                 |
| `device_watts`         | Boolean      |                 |
| `lap_index`            | Integer      | Lap number      |
| `split`                | Integer      |                 |

---

### Split (splits_metric)

Per-km split within an activity.

| Field                  | Type    | Notes        |
| ---------------------- | ------- | ------------ |
| `split`                | Integer | Split number |
| `distance`             | Float   | Meters       |
| `elapsed_time`         | Integer | Seconds      |
| `moving_time`          | Integer | Seconds      |
| `elevation_difference` | Float   | Meters       |
| `average_speed`        | Float   | m/s          |
| `pace_zone`            | Integer |              |

---

### StreamSet

| Stream type | Data type        | Description                  |
| ----------- | ---------------- | ---------------------------- |
| `time`      | [Integer]        | Seconds since activity start |
| `distance`  | [Float]          | Cumulative meters            |
| `latlng`    | [[Float, Float]] | GPS coordinates              |
| `altitude`  | [Float]          | Meters above sea level       |
| `heartrate` | [Integer]        | BPM                          |
| `cadence`   | [Integer]        | RPM                          |
| `watts`     | [Integer]        | Power output                 |
| `temp`      | [Integer]        | °C                           |
| `moving`    | [Boolean]        | Whether athlete was moving   |

Each stream also includes: `series_type`, `original_size`, `resolution` (`low`/`medium`/`high`)

---

### SummaryGear

| Field            | Type    | Notes                               |
| ---------------- | ------- | ----------------------------------- |
| `id`             | String  | e.g. `g123456`                      |
| `primary`        | Boolean | Default gear for this activity type |
| `name`           | String  | User-defined name                   |
| `resource_state` | Integer |                                     |
| `distance`       | Float   | Total meters logged on this gear    |

---

### DetailedGear

Extends `SummaryGear` with:

| Field         | Type    | Notes      |
| ------------- | ------- | ---------- |
| `brand_name`  | String  |            |
| `model_name`  | String  |            |
| `description` | String  |            |
| `weight`      | Float   | Grams      |
| `frame_type`  | Integer | Bikes only |

---

### PolylineMap

| Field              | Type    | Notes                                         |
| ------------------ | ------- | --------------------------------------------- |
| `id`               | String  |                                               |
| `polyline`         | String  | Full encoded polyline (DetailedActivity only) |
| `summary_polyline` | String  | Simplified polyline (SummaryActivity)         |
| `resource_state`   | Integer |                                               |

---

## OAuth Scopes

| Scope               | Access                            |
| ------------------- | --------------------------------- |
| `read`              | Public data                       |
| `read_all`          | Private data visible to followers |
| `profile:read_all`  | Full athlete profile              |
| `profile:write`     | Update athlete profile            |
| `activity:read`     | Read public/followers activities  |
| `activity:read_all` | Read private activities           |
| `activity:write`    | Create/update activities          |

---

## Rate Limits

| Window     | Limit          |
| ---------- | -------------- |
| 15 minutes | 200 requests   |
| Daily      | 2,000 requests |

Exceeded limits return `429 Too Many Requests`.
