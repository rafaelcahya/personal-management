# Product Requirements Document (PRD)

## Personal Running & Health Performance Platform

**Version:** 2.2
**Last Updated:** 2026-05-25
**Owner:** Rafael Cahya
**Stack:** Next.js 15 App Router · JavaScript/JSX · Supabase (shared auth) · PostgreSQL · Tailwind CSS · shadcn/ui · Claude AI (Sonnet 4.6) · Strava API

---

## 1. Overview

Running Tracker adalah aplikasi web personal untuk monitoring performa lari. Bukan aplikasi sosial, bukan pengganti Strava — ini **personal analytics layer** di atas data Strava yang sudah ada, dilengkapi AI Coach berbasis Claude yang punya akses ke seluruh history workout kamu.

**Dua hal yang tidak bisa kamu dapat di Strava/Garmin Connect:**

- AI Coach yang benar-benar tahu context history kamu dan bisa reason berdasarkan data spesifik
- Analytics cross-metric yang custom sesuai kebutuhan kamu (bukan generik)

**Hubungan dengan Personal Management:**

- Aplikasi terpisah (repo sendiri), tapi pakai **Supabase project yang sama** untuk auth
- User login sekali via Google OAuth di Supabase → session berlaku di kedua app
- Tidak ada perubahan di codebase Personal Management

---

## 2. Users & Access

| Role               | Akses                      |
| ------------------ | -------------------------- |
| Authenticated User | Full access ke semua fitur |
| Unauthenticated    | Redirect ke login          |

- Auth via Supabase (Google OAuth only) — shared dengan Personal Management
- Strava OAuth terpisah, hanya untuk data sync (bukan identity)
- Single user app — tidak ada multi-user, tidak ada fitur sosial

---

## 3. Integration dengan Personal Management

### 3.1 Auth sharing

Running Tracker dan Personal Management pakai Supabase project yang **sama**. Artinya:

```
User login via Google OAuth
        ↓
Supabase (shared project) issue session
        ↓
Session cookie valid di Personal Management DAN Running Tracker
```

**Yang dibutuhkan di Running Tracker:**

- `NEXT_PUBLIC_SUPABASE_URL` — sama dengan Personal Management
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — sama dengan Personal Management
- Supabase `@supabase/ssr` package untuk session management

**Yang TIDAK perlu dilakukan:**

- Tidak perlu modifikasi kode Personal Management
- Tidak perlu endpoint baru di Personal Management
- Tidak perlu sync user data antar dua sistem

### 3.2 User ID

User ID di Supabase adalah UUID. Semua tabel di Running Tracker DB pakai `user_id UUID` sebagai foreign key yang merujuk ke `auth.users.id` di Supabase.

---

## 4. Onboarding Flow

User baru yang pertama kali login perlu melewati setup singkat sebelum bisa pakai app. Tanpa ini, AI Coach tidak punya data biometric dan tidak bisa berikan rekomendasi yang akurat.

```
Login via Google OAuth (Supabase)
        ↓
Middleware cek: apakah user sudah ada di tabel users?
        ↓ tidak
Create row baru di users + user_settings (dengan default values)
        ↓
Redirect ke /onboarding
        ↓
Step 1 — Biometric setup (wajib)
  - Max heart rate (bisa input manual atau pakai formula 220 - umur)
  - Resting heart rate baseline
  - Height + current weight
  - Birth date (untuk kalkulasi age-based max HR)
        ↓
Step 2 — Connect Strava (wajib untuk data otomatis, bisa skip untuk manual-only)
  - Tombol "Connect Strava" → trigger OAuth flow
  - Atau "Skip for now, I'll add manually"
        ↓
Step 3 — Set first goal (opsional, bisa skip)
  - Upcoming race? Target distance + date
  - Atau "No race planned yet"
        ↓
Redirect ke /dashboard
  - Kalau Strava connected → tampilkan progress backfill
  - Kalau skip Strava → tampilkan empty state dengan CTA manual entry
```

**Kapan onboarding dianggap selesai:**

- Biometric step selesai → flag `onboarding_complete = true` di `users` table
- Strava dan goal bersifat opsional, tidak block akses ke dashboard

Tambah kolom di schema:

```sql
ALTER TABLE users ADD COLUMN onboarding_complete BOOLEAN DEFAULT FALSE;
```

---

## 5. Strava OAuth Flow

### 5.1 Gambaran umum

Strava OAuth dipakai **hanya untuk sync data workout**, bukan untuk identity. User sudah punya akun via Google/Supabase — Strava adalah integrasi data source.

```
[Connect Strava Button]
        ↓
Redirect ke https://www.strava.com/oauth/authorize
  ?client_id={STRAVA_CLIENT_ID}
  &response_type=code
  &redirect_uri={APP_URL}/api/auth/strava/callback
  &approval_prompt=auto
  &scope=read,activity:read_all,profile:read_all
        ↓
User approve di Strava
        ↓
Strava redirect ke /api/auth/strava/callback?code=...
        ↓
Server exchange code:
  POST https://www.strava.com/oauth/token
  body: { client_id, client_secret, code, grant_type: 'authorization_code' }
        ↓
Response: { access_token, refresh_token, expires_at, athlete }
        ↓
Encrypt tokens → simpan di tabel strava_credentials
        ↓
Trigger background job: initial backfill semua aktivitas
```

### 5.2 Token refresh

Token Strava expire tiap **6 jam**. Sebelum setiap call ke Strava API:

```javascript
// Cek apakah token akan expire dalam 5 menit ke depan
if (Date.now() / 1000 > credentials.expires_at - 300) {
  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: credentials.refresh_token,
    }),
  })
  const { access_token, refresh_token, expires_at } = await res.json()
  // Update encrypted values di DB
}
```

### 5.3 Webhook subscription

Real-time sync via Strava webhook — lebih efisien dari polling:

```
POST https://www.strava.com/api/v3/push_subscriptions
  body: {
    client_id,
    client_secret,
    callback_url: {APP_URL}/api/sync/webhook,
    verify_token: {WEBHOOK_VERIFY_SECRET}
  }
```

Strava akan kirim GET ke callback URL dulu untuk verifikasi (lihat Section 8.6 untuk detail implementasi), lalu POST setiap ada event:

```json
{
  "aspect_type": "create",
  "event_time": 1747890000,
  "object_id": 12345678,
  "object_type": "activity",
  "owner_id": 987654
}
```

### 5.4 Initial backfill strategy

```
1. Fetch GET https://www.strava.com/api/v3/athlete/activities
     ?per_page=200&page=1
2. Loop semua page sampai response kosong
3. Per aktivitas → insert ke tabel activities
4. Queue background job per aktivitas: fetch streams (HR, GPS, pace, cadence)
5. Throttle ke ~80 req/15min untuk aman dari rate limit (100/15min hard limit)
6. Setelah selesai → subscribe webhook + set last_sync_at
```

### 5.5 Rate limiting

| Limit        | Value                       | Strategi                                     |
| ------------ | --------------------------- | -------------------------------------------- |
| Per 15 menit | 100 request                 | Throttle ke 80, queue sisanya                |
| Per hari     | 1000 request                | Monitor via Redis counter                    |
| Backfill     | Bisa ratusan                | Inngest step functions + exponential backoff |
| Webhook      | Tidak terbatas untuk terima | Proses async, tidak block response           |

### 5.6 Data Flow: Strava ke Dashboard

Ini gambaran end-to-end bagaimana data lari dari Strava sampai ke dashboard — mulai dari event masuk sampai insight muncul di layar.

```
Strava (event baru)
        ↓
POST /api/sync/webhook
  └─ Terima event JSON dari Strava (aspect_type, object_id, owner_id)
  └─ Langsung return 200 OK
  └─ Kirim event ke Inngest: strava/handle-webhook-event
        ↓
Inngest: strava/handle-webhook-event
  └─ create  → fetch detail aktivitas dari Strava API
  └─ update  → re-fetch dan update row di tabel activities
  └─ delete  → hapus row dari tabel activities
        ↓
Inngest: strava/fetch-streams
  └─ Fetch time-series HR/GPS/pace dari Strava API
  └─ Downsample ke 10s resolution (default)
  └─ Insert ke tabel activity_streams
  └─ Trigger: ai/anomaly-detector
        ↓
Inngest: ai/anomaly-detector
  └─ Ambil aktivitas terbaru + baseline 30 hari aktivitas sejenis
  └─ Rules-based check: ACWR spike, HR drift, pace drop, konsistensi
  └─ Kalau ada anomali → insert ke ai_insights (insight_type = 'anomaly')
  └─ Trigger: ai/generate-post-activity-insight
        ↓
Inngest: ai/generate-post-activity-insight
  └─ Build context: aktivitas + splits + baseline + health log + goals + profil
  └─ Call Claude API (Sonnet 4.6, temp 0.3, max 700 token)
  └─ Validasi output (panjang + section headers)
  └─ Insert ke ai_insights (insight_type = 'post_activity')
  └─ Trigger push notification kalau notify_post_activity = true
        ↓
Dashboard (user buka app)
  └─ GET /api/activities        → recent activities list
  └─ GET /api/analytics/summary → weekly stats + training load
  └─ GET /api/ai/insights       → AI insight cards (post-activity + anomaly)
  └─ Render semua data di UI
```

**Titik-titik yang bisa gagal dan cara recovernya:**

| Titik                      | Failure mode                         | Recovery                                      |
| -------------------------- | ------------------------------------ | --------------------------------------------- |
| Webhook tidak terima event | Strava missed delivery               | Polling fallback setiap 1 jam via Vercel Cron |
| Strava API timeout         | fetch-streams gagal                  | Inngest auto-retry dengan exponential backoff |
| Claude API timeout/error   | insight tidak ter-generate           | Inngest retry 1x setelah 5 menit, lalu skip   |
| Output AI invalid          | konten terlalu pendek / format salah | Retry 1x, kalau tetap gagal: is_valid=false   |

**Latency tipikal (estimasi):**

- Webhook masuk → data tersimpan di DB: **~3–5 detik**
- Data tersimpan → insight tersedia di dashboard: **~15–30 detik** (tergantung antrian Inngest + Claude latency)
- Total dari selesai lari (Garmin/Strava sync) → insight di dashboard: **~2–5 menit** (tergantung kecepatan device sync ke Strava)

### 5.7 Disconnect Strava

```
1. Revoke token: DELETE https://www.strava.com/oauth/deauthorize
2. Unsubscribe webhook dari Strava
3. Hapus row di strava_credentials
4. Data historis di tabel activities TETAP ADA (default retain)
5. Sync berhenti — tidak ada aktivitas baru yang masuk
6. Dashboard tetap bisa dipakai dengan data yang sudah ada
```

User yang ingin hapus data historis juga bisa melakukannya secara manual via halaman Settings → Danger Zone → "Delete all activity data".

---

## 6. Tech Stack

| Layer           | Teknologi                 | Catatan                                                             |
| --------------- | ------------------------- | ------------------------------------------------------------------- |
| Framework       | Next.js 15 App Router     | JavaScript/JSX — match dengan Personal Management                   |
| UI              | Tailwind CSS + shadcn/ui  | Match dengan Personal Management untuk konsistensi visual           |
| Charts          | Recharts (Phase 1)        | Visx untuk correlation view di Phase 2                              |
| Map             | Leaflet + OpenStreetMap   | Render rute aktivitas                                               |
| Database        | PostgreSQL 16             | Regular PG dengan indexing yang proper — no TimescaleDB             |
| ORM             | Drizzle ORM               | Lightweight, cocok dengan Next.js API routes                        |
| Auth            | Supabase SSR              | Shared project dengan Personal Management                           |
| Data sync       | Strava API                | OAuth + webhook + polling fallback                                  |
| AI              | Claude API (Sonnet 4.6)   | Running coach, tool use, streaming SSE — Sonnet untuk semua query   |
| Background jobs | Inngest                   | Serverless-native job queue — backfill, sync, AI insight generation |
| Cache           | Redis (Upstash)           | Rate limit counter, AI context cache                                |
| File storage    | Cloudflare R2             | GPX/FIT file upload + backup                                        |
| Deployment      | Vercel                    | Web app + API routes — serverless                                   |
| Monitoring      | Sentry + Vercel Analytics |                                                                     |

---

## 7. Fitur & Scope per Phase

### 6.1 Phase 1 — MVP (target 6–7 minggu)

**Module yang wajib ada:**

| Module          | Deskripsi                                                       |
| --------------- | --------------------------------------------------------------- |
| Auth & setup    | Supabase shared auth + Strava connect flow                      |
| Strava sync     | OAuth, webhook, backfill, polling fallback, rate limit handling |
| File upload     | GPX/FIT parser, dedup logic, batch upload                       |
| Manual entry    | Workout form + daily health log (mood, sleep, energy, weight)   |
| Dashboard       | Weekly summary + training load indicator + recent activities    |
| Activity detail | Chart pace, HR, elevation, splits table, map, HR zones          |
| Activity list   | Filter by date/type, search                                     |
| Analytics       | Trend charts, training load (ACWR), race predictor, PR tracking |
| AI Coach        | Chat + 5 mode + 8 tools + insight generation                    |

**Tidak masuk Phase 1:**

- Garmin integration
- HRV/sleep auto-sync
- Correlation view (butuh data lebih dari 1 bulan)
- Readiness score composite

### 6.2 Phase 2 — Health integration (4–6 minggu setelah MVP)

| Module             | Deskripsi                                                       |
| ------------------ | --------------------------------------------------------------- |
| Garmin integration | Official API (kalau approved) atau unofficial library           |
| Health metrics     | Sleep stages, HRV, RHR, steps, body battery, stress, SpO2       |
| Health dashboard   | Daily health card + mini trends                                 |
| Correlation view   | 2-metric overlay interactive (3-month rolling)                  |
| Readiness score    | Composite score harian (sleep + HRV + training load)            |
| AI Coach advanced  | Cross-metric reasoning, anomaly detection, readiness-based plan |

### 6.3 Phase 3 — Future (TBD)

- Hydration tracking + reminder
- Nutrition logging
- Race calendar integration
- PDF weekly report export
- Voice AI Coach
- Weather-adjusted analysis

---

## 8. Database Schema

### 7.1 Phase 1 tables

```sql
-- ==================== USERS ====================
-- Sync dari Supabase auth.users, tambah biometric
CREATE TABLE users (
  id UUID PRIMARY KEY,               -- sama dengan Supabase auth.users.id
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  birth_date DATE,
  height_cm NUMERIC(5,2),
  weight_kg NUMERIC(5,2),            -- baseline
  max_hr INT,
  resting_hr_baseline INT,
  vo2_max_baseline NUMERIC(4,1),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== STRAVA CREDENTIALS ====================
CREATE TABLE strava_credentials (
  user_id UUID REFERENCES users(id) PRIMARY KEY,
  athlete_id BIGINT,
  access_token TEXT,                 -- encrypted AES-256
  refresh_token TEXT,                -- encrypted AES-256
  expires_at TIMESTAMPTZ,
  scope TEXT,
  last_sync_at TIMESTAMPTZ,
  webhook_subscription_id BIGINT
);

-- ==================== ACTIVITIES ====================
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  source TEXT CHECK (source IN ('strava','gpx_upload','fit_upload','manual')),
  external_id TEXT,                  -- Strava activity ID
  started_at TIMESTAMPTZ NOT NULL,
  duration_sec INT NOT NULL,
  moving_time_sec INT,
  distance_m NUMERIC(10,2) NOT NULL,
  avg_pace_sec_per_km NUMERIC(6,2),
  max_pace_sec_per_km NUMERIC(6,2),
  avg_hr INT,
  max_hr INT,
  avg_cadence INT,
  elevation_gain_m NUMERIC(7,2),
  elevation_loss_m NUMERIC(7,2),
  calories INT,
  activity_type TEXT,                -- easy/tempo/interval/long/race/recovery
  perceived_exertion INT,            -- RPE 1–10
  notes TEXT,
  weather_summary JSONB,
  raw_data JSONB,                    -- backup raw Strava response
  created_at TIMESTAMPTZ DEFAULT NOW()
  -- dedup via aplikasi, bukan DB constraint — lihat Section 8.3 Deduplication
);

CREATE INDEX idx_activities_user_date ON activities(user_id, started_at DESC);
CREATE INDEX idx_activities_external ON activities(source, external_id);

-- ==================== ACTIVITY STREAMS (time-series) ====================
CREATE TABLE activity_streams (
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ NOT NULL,
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  altitude_m NUMERIC(7,2),
  heart_rate INT,
  cadence INT,
  pace_sec_per_km NUMERIC(6,2),
  distance_m NUMERIC(10,2),
  velocity_m_s NUMERIC(5,2),
  PRIMARY KEY (activity_id, timestamp)
);

-- ==================== SPLITS ====================
CREATE TABLE activity_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  split_number INT,
  distance_m NUMERIC(10,2),
  duration_sec INT,
  pace_sec_per_km NUMERIC(6,2),
  avg_hr INT,
  elevation_gain_m NUMERIC(7,2)
);
CREATE INDEX idx_splits_activity ON activity_splits(activity_id);

-- ==================== SUBJECTIVE HEALTH LOG ====================
CREATE TABLE subjective_health_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  log_date DATE NOT NULL,
  sleep_hours NUMERIC(3,1),
  sleep_quality TEXT,                -- 'good', 'ok', 'bad'
  morning_energy INT,                -- 1–5
  mood TEXT,
  soreness_level INT,                -- 1–5
  manual_rhr INT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, log_date)
);

-- ==================== WEIGHT LOGS ====================
CREATE TABLE weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  measured_at TIMESTAMPTZ NOT NULL,
  weight_kg NUMERIC(5,2),
  body_fat_pct NUMERIC(4,1),
  notes TEXT
);
CREATE INDEX idx_weight_user_date ON weight_logs(user_id, measured_at DESC);

-- ==================== TRAINING METRICS ====================
CREATE TABLE daily_training_metrics (
  user_id UUID REFERENCES users(id),
  date DATE NOT NULL,
  training_load NUMERIC(6,2),       -- TSS atau TRIMP harian
  acute_load_7d NUMERIC(6,2),
  chronic_load_28d NUMERIC(6,2),
  acwr NUMERIC(4,2),
  readiness_score INT,              -- nullable, diisi Phase 2
  PRIMARY KEY (user_id, date)
);

-- ==================== AI COACH ====================
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT,
  mode TEXT DEFAULT 'default',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user','assistant','system','tool')),
  content TEXT,
  tool_calls JSONB,
  context_refs JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ai_messages_conversation ON ai_messages(conversation_id, created_at);

CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  insight_type TEXT,                -- 'weekly_review', 'anomaly', 'recommendation'
  severity TEXT,                    -- 'info', 'attention', 'warning'
  title TEXT,
  content TEXT,
  data_refs JSONB,
  acknowledged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ai_insights_user_unread ON ai_insights(user_id, acknowledged, created_at DESC);

-- ==================== USER SETTINGS ====================
CREATE TABLE user_settings (
  user_id UUID REFERENCES users(id) PRIMARY KEY,
  hr_zones_method TEXT DEFAULT 'max_hr',   -- 'max_hr', 'karvonen', 'threshold'
  threshold_hr INT,                        -- diisi kalau method = 'threshold'
  push_notifications_enabled BOOLEAN DEFAULT FALSE,
  push_subscription JSONB,                 -- Web Push subscription object
  notify_post_activity BOOLEAN DEFAULT TRUE,
  notify_weekly_review BOOLEAN DEFAULT TRUE,
  notify_anomaly BOOLEAN DEFAULT TRUE,
  notify_friday_prep BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== GOALS ====================
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  goal_type TEXT,                   -- 'race', 'distance_weekly', 'pace_target'
  target_date DATE,
  target_distance_m NUMERIC(10,2),
  target_time_sec INT,
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 7.2 Phase 2 tables (disiapkan, dibuat saat Phase 2 dimulai)

```sql
-- Garmin credentials (method TBD)
CREATE TABLE garmin_credentials (
  user_id UUID REFERENCES users(id) PRIMARY KEY,
  credentials_data JSONB,            -- encrypted
  last_sync_at TIMESTAMPTZ
);

-- Aggregate health harian dari Garmin
CREATE TABLE daily_health (
  user_id UUID REFERENCES users(id),
  date DATE NOT NULL,
  steps INT,
  active_calories INT,
  total_calories INT,
  resting_hr INT,
  hrv_overnight_avg NUMERIC(5,2),
  body_battery_max INT,
  body_battery_min INT,
  stress_avg INT,
  spo2_avg NUMERIC(4,1),
  respiratory_rate_avg NUMERIC(4,1),
  source TEXT,
  PRIMARY KEY (user_id, date)
);

-- Sleep records
CREATE TABLE sleep_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  date DATE NOT NULL,
  sleep_start TIMESTAMPTZ,
  sleep_end TIMESTAMPTZ,
  total_sleep_sec INT,
  deep_sleep_sec INT,
  rem_sleep_sec INT,
  light_sleep_sec INT,
  awake_sec INT,
  sleep_score INT,
  source TEXT,
  UNIQUE(user_id, date)
);

-- HRV time-series
CREATE TABLE hrv_records (
  user_id UUID REFERENCES users(id),
  timestamp TIMESTAMPTZ NOT NULL,
  hrv_value NUMERIC(5,2)
);
CREATE INDEX idx_hrv_user_time ON hrv_records(user_id, timestamp);
```

---

## 9. API Endpoints

### 8.1 Auth

```
POST  /api/auth/login                  ← trigger Supabase Google OAuth
GET   /api/auth/me                     ← return user session info (id, email, name, avatar)
POST  /api/auth/strava/connect         ← redirect ke Strava authorize URL
GET   /api/auth/strava/callback        ← terima code, exchange token, trigger backfill
POST  /api/auth/strava/disconnect      ← revoke Strava token, retain data historis
POST  /api/auth/logout                 ← clear Supabase session
```

### 8.2 User Profile & Settings

```
GET    /api/user/profile               ← baca biometric (max_hr, height, weight, dll)
PATCH  /api/user/profile               ← update biometric + display name
GET    /api/user/settings              ← baca preferences (HR zones method, notif, dll)
PATCH  /api/user/settings              ← update preferences
GET    /api/user/strava-status         ← cek apakah Strava sudah connected + last_sync_at
DELETE /api/user/activities            ← hapus semua activity data (Danger Zone)
```

### 8.3 Activities

```
GET    /api/activities                 ← list, filter: ?from=&to=&type=&page=
GET    /api/activities/:id             ← detail lengkap
GET    /api/activities/:id/streams     ← time-series HR/GPS/pace/cadence
                                       ← ?resolution=raw|1s|5s|10s|30s (default: 10s)
POST   /api/activities                 ← manual entry
POST   /api/activities/upload          ← GPX atau FIT file upload
PATCH  /api/activities/:id             ← edit notes, type, RPE
DELETE /api/activities/:id
```

### 8.3.1 Deduplication strategy

Ada tiga skenario duplikat yang mungkin terjadi:

**Skenario A — Strava sync aktivitas yang sama dua kali**
Bisa terjadi kalau polling dan webhook sama-sama aktif, atau backfill overlap dengan sync normal.

Solusi: cek berdasarkan `external_id` (Strava activity ID) sebelum insert.

```javascript
// Sebelum insert aktivitas dari Strava
const existing = await db
  .select()
  .from(activities)
  .where(and(eq(activities.source, 'strava'), eq(activities.external_id, stravaActivityId)))
  .limit(1)

if (existing.length > 0) return // skip, sudah ada
```

**Skenario B — User manual entry aktivitas yang sama sudah ada di Strava**
Contoh: user input manual lari treadmill, lalu sadar sudah sync dari Strava.

Solusi: cek fuzzy match saat manual entry — `started_at` dalam toleransi ±5 menit DAN `distance_m` dalam toleransi ±200m.

```javascript
async function findPotentialDuplicate(userId, startedAt, distanceM) {
  const fiveMinutes = 5 * 60 * 1000
  const from = new Date(new Date(startedAt).getTime() - fiveMinutes).toISOString()
  const to = new Date(new Date(startedAt).getTime() + fiveMinutes).toISOString()

  return await db
    .select()
    .from(activities)
    .where(
      and(
        eq(activities.user_id, userId),
        between(activities.started_at, from, to),
        between(activities.distance_m, distanceM - 200, distanceM + 200)
      )
    )
    .limit(1)
}
```

Kalau match ditemukan → tampilkan warning ke user: _"Sepertinya aktivitas ini sudah ada dari Strava. Tetap simpan?"_. User yang memutuskan, bukan sistem.

**Skenario C — GPX/FIT upload aktivitas yang sudah ada di Strava**
User upload file GPX dari Garmin untuk aktivitas yang sudah auto-sync via Strava.

Solusi: sama dengan Skenario B — fuzzy match `started_at` ±5 menit dan `distance_m` ±200m. Tambah cek `source != 'manual'` supaya tidak block upload yang memang intended.

**Summary toleransi dedup:**

| Field         | Toleransi   | Alasan                                                        |
| ------------- | ----------- | ------------------------------------------------------------- |
| `started_at`  | ±5 menit    | GPS start dan manual start bisa beda beberapa menit           |
| `distance_m`  | ±200m       | Strava dan Garmin sering beda kecil di kalkulasi GPS distance |
| `external_id` | exact match | Strava ID unik — tidak ada toleransi                          |

### 8.4 Health (Phase 1 — manual input)

```
GET    /api/health/subjective          ← list log, filter: ?from=&to=
POST   /api/health/subjective          ← post daily log (sleep, energy, mood, dll)
PATCH  /api/health/subjective/:id      ← edit log yang sudah ada
DELETE /api/health/subjective/:id      ← hapus log satu hari

GET    /api/health/weight              ← list weight entries
POST   /api/health/weight              ← tambah weight entry
PATCH  /api/health/weight/:id          ← koreksi entry yang salah input
DELETE /api/health/weight/:id          ← hapus entry
```

### 8.5 Streams downsampling strategy

Strava menyimpan stream data dengan resolusi 1 data point per detik. Lari 1 jam = **3.600 rows**, lari 3 jam = **10.800 rows**. Mengirim semua ini ke browser untuk render chart adalah pemborosan — chart dengan 3.600 titik dan 300 titik terlihat sama secara visual.

**Pendekatan:** server-side downsampling berdasarkan parameter `resolution`:

| Resolution | Interval | Titik untuk lari 1 jam | Cocok untuk                        |
| ---------- | -------- | ---------------------- | ---------------------------------- |
| `raw`      | 1 detik  | ~3.600                 | Export / analysis berat            |
| `1s`       | 1 detik  | ~3.600                 | Sama dengan raw                    |
| `5s`       | 5 detik  | ~720                   | Detail view dengan zoom            |
| `10s`      | 10 detik | ~360                   | **Default** — activity detail page |
| `30s`      | 30 detik | ~120                   | Overview / thumbnail               |

**Implementasi di server:**

```javascript
// Ambil data dari DB, lalu sample setiap N detik
function downsample(streams, intervalSeconds) {
  if (intervalSeconds <= 1) return streams

  const result = []
  let lastTimestamp = null

  for (const point of streams) {
    const t = new Date(point.timestamp).getTime() / 1000
    if (lastTimestamp === null || t - lastTimestamp >= intervalSeconds) {
      result.push(point)
      lastTimestamp = t
    }
  }
  return result
}
```

**Aturan:**

- Default response selalu `10s` — tidak perlu client kirim parameter kalau tidak perlu detail
- `raw` hanya boleh dipakai untuk export, bukan untuk chart rendering
- Response selalu include `meta.total_points` dan `meta.resolution` supaya client tahu sedang pakai resolusi apa

### 8.6 Sync

```
POST   /api/sync/strava                ← manual trigger sync (polling)
GET    /api/sync/status                ← cek status sync + last_sync_at
GET    /api/sync/webhook               ← Strava challenge verification (lihat detail di bawah)
POST   /api/sync/webhook               ← Strava kirim event create/update/delete
POST   /api/sync/webhook/subscribe     ← register webhook ke Strava
DELETE /api/sync/webhook/subscribe     ← unsubscribe webhook
```

#### Webhook verification flow (GET /api/sync/webhook)

Saat pertama kali register webhook ke Strava, Strava langsung kirim GET request ke callback URL untuk memverifikasi bahwa endpoint kita valid dan milik kita. Kalau kita tidak balas dengan benar, pendaftaran webhook gagal.

**Request dari Strava:**

```
GET /api/sync/webhook
  ?hub.mode=subscribe
  &hub.challenge=abc123randomstring
  &hub.verify_token=WEBHOOK_VERIFY_SECRET
```

**Yang harus dilakukan endpoint:**

```javascript
// app/api/sync/webhook/route.js
export async function GET(request) {
  const { searchParams } = new URL(request.url)

  const mode = searchParams.get('hub.mode')
  const challenge = searchParams.get('hub.challenge')
  const token = searchParams.get('hub.verify_token')

  // Verifikasi bahwa request ini memang dari Strava dengan token yang kita set
  if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_SECRET) {
    return Response.json({ 'hub.challenge': challenge })
  }

  return new Response('Forbidden', { status: 403 })
}
```

**Yang harus dilakukan endpoint saat POST (event masuk):**

```javascript
export async function POST(request) {
  const event = await request.json()
  // { aspect_type: 'create'|'update'|'delete', object_id, object_type, owner_id }

  // Langsung return 200 dulu — Strava expects fast response (< 2 detik)
  // Proses event secara async via Inngest
  await inngest.send({
    name: 'strava/handle-webhook-event',
    data: event,
  })

  return new Response('OK', { status: 200 })
}
```

**Penting:** Endpoint POST webhook harus langsung return `200 OK` dan lempar ke Inngest. Kalau response > 2 detik, Strava anggap gagal dan akan retry. Jangan proses sync di dalam handler ini.

### 8.7 Analytics

```
GET   /api/analytics/summary           ← ?period=week|month|year
GET   /api/analytics/trends            ← ?metric=pace|distance|hr&period=12w
GET   /api/analytics/training-load     ← ACWR, acute 7d, chronic 28d
GET   /api/analytics/race-predictor    ← prediksi semua distance dari PR terbaru
GET   /api/analytics/prs               ← best time per distance (1K/5K/10K/half/full)
GET   /api/analytics/vo2               ← estimasi VO2 max dari HR + pace
```

### 8.8 AI Insight Engine

```
GET   /api/ai/insights                 ← list semua insights, filter: ?type=&acknowledged=
GET   /api/ai/insights/:id             ← detail satu insight
PATCH /api/ai/insights/:id/ack         ← tandai insight sudah dibaca
POST  /api/ai/insights/generate        ← trigger on-demand analysis (body: { activity_id, type })

-- Ditunda ke Phase 2 (Chat Coach):
-- POST  /api/ai/chat
-- GET   /api/ai/conversations
-- GET   /api/ai/conversations/:id
-- DELETE /api/ai/conversations/:id
```

---

## 10. AI Insight Engine

> Detail implementasi lengkap ada di `running/05_AI_Coach_Implementation_Spec.md`. Section ini adalah ringkasan untuk konteks PRD.

### 10.1 Pendekatan

AI tidak berjalan sebagai chat — AI berjalan **otomatis di background** setiap ada aktivitas baru atau sesuai jadwal. Hasilnya berupa kartu insight terstruktur yang langsung muncul di dashboard dan halaman detail aktivitas.

Kamu tidak perlu tanya apa-apa. AI yang notice, AI yang analisis, AI yang kasih tahu.

> **Chat Coach** ditunda ke Phase 2 — setelah Insight Engine sudah berjalan dan ada cukup data untuk validasi kualitas insight.

---

### 10.2 Lima jenis insight

#### 10.2.1 Post-activity insight

**Trigger:** setelah setiap aktivitas selesai di-sync dari Strava (streams sudah masuk DB)
**Tampil di:** halaman detail aktivitas + dashboard (kartu terbaru)
**Notifikasi:** ✅ Ya — judul + 1 kalimat pertama ringkasan

Input: detail aktivitas, splits per km, baseline 4 minggu, training load, health log hari itu, goals, profil.

Output format (markdown):

```
## Ringkasan
## Highlight
## Yang Perlu Diperhatikan  ← hanya kalau ada
## Rekomendasi Sesi Berikutnya
```

Contoh output:

> "Easy run 10km kamu hari ini solid — pace 5:55/km konsisten di semua splits dengan variasi hanya ±8 detik/km. HR rata-rata 138 bpm, turun 4 bpm dibanding easy run minggu lalu di pace yang sama, tanda adaptasi aerobik yang baik."

#### 10.2.2 Weekly review

**Trigger:** Vercel Cron setiap Minggu 19:00
**Tampil di:** dashboard (kartu mingguan)
**Notifikasi:** ✅ Ya

Input: semua aktivitas minggu ini, training load, health log minggu ini, ringkasan 4 minggu sebelumnya, goals.

Output format (markdown, maks 300 kata):

```
## Ringkasan Minggu Ini
## Balance Training
## Vs Minggu Lalu
## Fokus Minggu Depan
```

#### 10.2.3 Anomaly alert

**Trigger:** setelah setiap post-activity insight selesai (programmatic check, no Claude)
**Tampil di:** dashboard (kartu warning)
**Notifikasi:** ✅ Ya — hanya severity ≥ `attention`

Empat kondisi yang dicek secara rules-based:

- ACWR > 1.5 → severity `warning`
- HR avg > baseline × 1.10 di pace yang sama → severity `attention`
- Pace > baseline × 1.08 untuk tipe yang sama → severity `attention`
- Tidak ada aktivitas > 10 hari padahal biasanya ≥ 3x/minggu → severity `info`

Claude dipanggil **hanya untuk menulis deskripsi personal** setelah anomali terdeteksi.

#### 10.2.4 Daily insight

**Trigger:** Vercel Cron daily 06:00
**Tampil di:** dashboard (kartu harian)
**Notifikasi:** ❌ Tidak — hanya muncul di dashboard

Fokus ditentukan otomatis: race dekat → taper/readiness, ACWR tinggi → recovery, gap panjang → motivational, default → general training tip.

Skip kalau user punya < 3 aktivitas tersimpan.

#### 10.2.5 On-demand activity analysis

**Trigger:** user klik tombol "Analyze" di halaman detail aktivitas
**Tampil di:** halaman detail aktivitas, di bawah charts
**Notifikasi:** ❌ Tidak

```
POST /api/ai/insights/generate
body: { activity_id: "uuid", type: "post_activity" }
```

---

### 10.3 Context injection

AI tidak punya akses langsung ke DB. Semua data disiapkan sebelum call ke Claude API dalam format **plain text terstruktur** (bukan JSON mentah).

```javascript
async function buildInsightContext(activityId) {
  const [activity, splits, recentActivities, trainingLoad, healthLog, goals, profile] =
    await Promise.all([
      getActivity(activityId),
      getSplits(activityId),
      getRecentActivities(userId, { days: 28, type: activity.activity_type, limit: 5 }),
      getTrainingLoad(userId), // dari Redis cache (TTL 5 menit)
      getSubjectiveHealthLog(userId, activity.started_at),
      getActiveGoals(userId), // dari Redis cache (TTL 1 jam)
      getUserProfile(userId), // dari Redis cache (TTL 1 jam)
    ])

  return serializeToPlainText({
    activity,
    splits,
    recentActivities,
    trainingLoad,
    healthLog,
    goals,
    profile,
  })
}
```

**Token budget:** ~950 input token per call (jauh lebih efisien dari estimasi awal).
**Hard limit:** 6.000 token. Kalau mendekati limit, baseline activities dipangkas: 5 → 3 → 1.

Tidak pakai tool use untuk Insight Engine — semua data sudah tersedia saat call dibuat. Tool use disimpan untuk Chat Coach Phase 2.

---

### 10.4 Claude API config

| Parameter         | Value                                                                  |
| ----------------- | ---------------------------------------------------------------------- |
| Model             | `claude-sonnet-4-6`                                                    |
| Temperature       | `0.3`                                                                  |
| Max tokens output | Post-activity/on-demand: 700 · Weekly: 500 · Anomaly: 250 · Daily: 400 |
| Streaming         | Tidak — output disimpan lengkap ke DB                                  |
| Timeout           | 30 detik                                                               |

---

### 10.5 Output schema (tersimpan di DB)

```javascript
{
  insight_type: 'post_activity',   // 'post_activity' | 'weekly_review' | 'anomaly' | 'daily' | 'on_demand'
  severity: 'info',                // 'info' | 'attention' | 'warning'
  status: 'completed',             // 'pending' | 'completed' | 'failed'
  is_valid: true,
  title: 'Easy run 10km — adaptasi aerobik baik',
  content: '...teks markdown dari AI...',
  data_refs: {
    activity_id: 'uuid',           // untuk post_activity dan on_demand
    week_start: '2026-05-13',      // untuk weekly_review
  },
  acknowledged: false,
}
```

Schema tambahan dari PRD awal:

```sql
ALTER TABLE ai_insights
  ADD COLUMN status TEXT DEFAULT 'completed'
    CHECK (status IN ('pending', 'completed', 'failed')),
  ADD COLUMN is_valid BOOLEAN DEFAULT TRUE,
  ADD COLUMN error_message TEXT,
  ADD COLUMN retry_count INT DEFAULT 0;
```

---

### 10.6 Guardrails

- Output dalam **Bahasa Indonesia**
- Selalu referensikan data nyata — tidak boleh generik
- Tidak boleh diagnosis medis
- Keluhan fisik serius → sarankan ke dokter/physio
- User dengan < 3 aktivitas → prompt disesuaikan, jangan sebut baseline yang tidak ada
- Output validation: cek panjang minimum + section headers. Kalau invalid → retry 1x → kalau tetap gagal → `is_valid=false`, tidak tampil di UI

---

### 10.7 Error handling

| Skenario                        | Handling                                              |
| ------------------------------- | ----------------------------------------------------- |
| Claude timeout (>30s)           | Inngest retry 1x setelah 5 menit                      |
| Claude rate limit               | Backoff: 1 menit → 5 menit → 15 menit → drop          |
| Output terlalu pendek / invalid | Retry 1x → kalau tetap → `is_valid=false`             |
| Claude API down                 | Skip insight, jangan block sync flow, log ke Sentry   |
| Max retry terlampaui            | `status='failed'`, `content=null`, tidak tampil di UI |

---

### 10.8 Cost estimate (revised)

| Job                   | Frekuensi/bulan | Input token     | Output token | Biaya/bulan      |
| --------------------- | --------------- | --------------- | ------------ | ---------------- |
| Post-activity insight | ~20x            | ~950            | ~500         | ~$0.18           |
| Weekly review         | 4x              | ~2.000          | ~500         | ~$0.07           |
| Anomaly description   | ~8x             | ~600            | ~200         | ~$0.03           |
| Daily insight         | ~22x            | ~700            | ~400         | ~$0.09           |
| On-demand             | ~10x            | ~950            | ~500         | ~$0.09           |
| Friday prep           | 4x              | 0 (rules-based) | 0            | $0               |
| **Total**             |                 |                 |              | **~$0.46/bulan** |

---

## 11. Dashboard & Statistik

### 10.1 Dashboard utama (Phase 1)

**Header stats (weekly):**

- Total distance, total time, activity count, avg pace minggu ini
- Comparison vs minggu lalu (delta %)

**Training load card:**

- ACWR gauge — hijau (0.8–1.3), kuning (1.3–1.5), merah (>1.5)
- Acute load 7d vs chronic load 28d bar comparison
- Status label: "Build phase" / "Optimal" / "Caution" / "Danger zone"

**Activity mini-calendar:**

- Calendar view bulan ini, highlight hari ada lari
- Warna per activity type (easy = hijau, tempo = kuning, interval = merah)

**Recent activities list:**

- 5 aktivitas terakhir dengan quick stats
- Thumbnail mini-map kalau ada GPS data

**AI insight card:**

- 1 insight harian dari AI Coach
- Quick prompts: "Analyze last run", "Plan this week", "How am I doing?", "Should I rest?"

**Manual health quick log:**

- Shortcut input mood, sleep, energy untuk hari ini
- Status indicator apakah sudah log hari ini atau belum

### 10.2 Analytics page

**Tier 1 — Paling valuable:**

| Chart                             | Data                                             | Insight                      |
| --------------------------------- | ------------------------------------------------ | ---------------------------- |
| Weekly distance trend (12 minggu) | `activities.distance_m`                          | Konsistensi vs gap training  |
| Pace per workout type trend       | `avg_pace_sec_per_km` grouped by `activity_type` | Fitness progression per zone |
| HR zone distribution              | `activity_streams.heart_rate`                    | Apakah training balance      |
| Training load history             | `acwr` + `acute/chronic`                         | Injury risk over time        |
| PR progression timeline           | Computed per distance                            | Improvement trajectory       |
| Race predictor                    | Riegel formula dari PR terbaru                   | Target race planning         |

**Tier 2 — Deeper insights:**

| Chart                       | Data                              | Insight                               |
| --------------------------- | --------------------------------- | ------------------------------------- |
| Pace vs HR scatter          | Per aktivitas, same type          | Running economy improvement           |
| Cardiac drift per run       | HR awal vs akhir per split        | Fatigue indicator                     |
| Cadence trend               | `avg_cadence` over time           | Form development (target 170–180 spm) |
| Long run pacing consistency | `splits.pace_sec_per_km` variance | Positive vs negative split pattern    |
| VO2 max trend               | Estimated dari HR + pace          | Fitness level over time               |

**Tier 3 — Dengan manual health data:**

| Chart                          | Data                                    | Insight                         |
| ------------------------------ | --------------------------------------- | ------------------------------- |
| Sleep quality vs next-day pace | `subjective_health_logs` + `activities` | Recovery impact on performance  |
| Energy level vs training load  | `morning_energy` + `acwr`               | Overreaching early warning      |
| Activity consistency heatmap   | `activities.started_at`                 | GitHub-style, visual motivation |

### 10.3 Activity detail page

- Summary header: distance, duration, avg/max pace, avg/max HR, elevation, calories
- Pace per km chart + elevation overlay
- HR over time dengan zone coloring (Z1–Z5)
- Map rute (Leaflet + OSM)
- Splits table (km, pace, HR, elevation gain)
- HR zones distribution (donut chart)
- Cadence chart (kalau data ada)
- Notes editable + AI auto-summary button
- Pre-activity context: energy/sleep dari log hari tersebut

---

## 12. Gear Management (Shoe Rotation)

### 12.1 Overview

Gear Management adalah fitur untuk melacak kondisi sepatu lari berdasarkan total jarak yang sudah dipakai. Data sepatu di-sync otomatis dari Strava — setiap sepatu yang terekam di aktivitas Strava akan muncul di sini.

Tujuannya sederhana: kamu tahu kapan sepatu harus pensiun sebelum performanya drop atau risiko cedera naik.

### 12.2 User Stories

> As a runner, I want to see all my shoes with their mileage so that I know which ones are still fresh and which are wearing out.

> As a runner, I want to set a retirement threshold per shoe so that I get a visual warning before I hit the limit.

> As a runner, I want to categorize each shoe by use type (daily, race, trail, etc.) so that I can track rotation correctly.

### 12.3 Data Source

Sepatu di-sync dari dua tempat:

1. **Strava activity sync** — setiap aktivitas dari Strava yang punya `gear_id` akan upsert gear ke tabel `rt_gear`
2. **Athlete sync** — saat user connect Strava, endpoint `/api/v3/athlete` di-call untuk langsung fetch semua sepatu yang terdaftar di profil athlete, bukan hanya yang muncul di aktivitas

Field yang di-sync dari Strava: `name`, `brand_name`, `model_name`, `distance_m`, `retired`, `notification_distance_m`.

`notification_distance_m` adalah batas pensiun yang di-set user di Strava (bukan di app ini). Strava returns this value in km via `notification_distance` — backend converts it to meters on save (`Math.round(notification_distance * 1000)`).

Field yang **tidak pernah** di-overwrite oleh sync Strava: `category`, `retirement_km` — ini sepenuhnya user-managed.

### 12.4 Database

```sql
CREATE TABLE rt_gear (
  id TEXT PRIMARY KEY,              -- Strava gear ID (format: g12345678)
  user_id UUID REFERENCES users(id),
  name TEXT,
  brand_name TEXT,
  model_name TEXT,
  distance_m INTEGER DEFAULT 0,    -- total jarak dalam meter, di-update tiap sync
  retired BOOLEAN DEFAULT FALSE,
  notification_distance_m INTEGER DEFAULT NULL, -- Strava-managed shoe alert threshold, stored in meters (Strava returns km → converted on save)
  category TEXT DEFAULT NULL,       -- user-managed: daily/tempo/race/trail/recovery/cross-training
  retirement_km INTEGER DEFAULT NULL, -- user-managed threshold dalam km
  last_fetched_at TIMESTAMPTZ
);
```

### 12.5 API Endpoints

```
GET   /api/running/v1/gear        ← list semua gear user
PATCH /api/running/v1/gear        ← update category dan/atau retirement_km satu gear
```

**GET /api/running/v1/gear**

- Auth required (401 kalau tidak ada session)
- No query params
- Response: `{ data: [{ id, name, brand_name, model_name, distance_m, retired, notification_distance_m, category, retirement_km, last_fetched_at }], message }`
- Urutan: retired asc (active dulu), lalu name asc

**PATCH /api/running/v1/gear**

- Auth required
- Body: `{ id: string (required), category?: string|null, retirement_km?: integer|null }`
- Validasi via Zod schema di `schemas/runningGear.js`
- Strava sync fields (`name`, `distance_m`, `retired`) tidak bisa diubah via endpoint ini
- Response: `{ data: <updated gear row>, message }`
- Error 400 kalau `id` tidak ada atau field tidak valid
- Error 404 kalau gear tidak ditemukan atau milik user lain

### 12.6 UI — Shoe Rotation Component

Shoe Rotation muncul di halaman Dashboard, setelah section Performance Trends.

**States yang harus ada:**

| State           | Tampilan                                                                |
| --------------- | ----------------------------------------------------------------------- |
| Loading         | Skeleton 3 rows (ikon + nama + bar)                                     |
| Error           | AlertTriangle icon + pesan error + tombol "Try again"                   |
| Empty (no gear) | Footprints icon + teks "No shoes synced yet" + instruksi connect Strava |
| Has data        | List active + list retired (kalau ada)                                  |

**Layout per gear card:**

- Header: ikon Footprints + nama sepatu + brand/model (baris kedua, abu) + category badge (kalau ada) + tombol edit (pensil, hanya untuk active)
- Body: total km besar-besar + two-tab limit toggle (see below) + mileage progress bar (ungu → amber >= 70% → merah >= 90%) + alert "Nearing limit" kalau >= 90% active-tab limit
- Retired shoes: seluruh card opacity 60%, badge "Retired", tidak ada tombol edit, tidak ada tab toggle

**Two-tab limit toggle (Strava / Manual):**

Active shoes that have at least one limit set (`notification_distance_m` or `retirement_km`) show two pill-style tab buttons next to the total distance:

- **Strava tab** — shows the `notification_distance_m` value converted to km. Label format: `Strava · {N} km`. If `notification_distance_m` is null: `Strava · —`.
- **Manual tab** — shows the `retirement_km` value. Label format: `Manual · {N} km`. If `retirement_km` is null: `Manual · —`.

Default active tab:

- If `retirement_km` is set → default to **Manual**
- If `retirement_km` is null but `notification_distance_m` is set → default to **Strava**

Switching tabs immediately updates both the progress bar and the "Nearing limit" warning to use that tab's limit value. If the selected tab's limit is null, the progress bar is hidden and "Nearing limit" is not shown even if the other tab's limit is near.

If neither limit is set, no tab toggle is shown and no progress bar is rendered.

**Inline edit form (muncul di dalam card, bukan modal):**

- Toggle kategori: pill buttons (daily / tempo / race / trail / recovery / cross-training / none)
- Input "Retire at (km)": number input, min 0, max 100000
- Tombol Save + Cancel
- Optimistic update: gearList di-update secara lokal setelah save berhasil — tidak perlu refetch
- Kalau save gagal: tampilkan error message di bawah form, jangan tutup form

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

| Scenario                                                         | Handling                                                               |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `retirement_km` bukan integer atau < 0                           | 400 dari API, form shows error message                                 |
| `retirement_km` > 100000                                         | 400 dari API, form shows error message                                 |
| `category` bukan salah satu dari CATEGORY_OPTIONS dan bukan null | 400 dari API                                                           |
| `id` tidak ada di body PATCH                                     | 400 Validation failed                                                  |
| Gear tidak ditemukan atau milik user lain                        | 404 Not found                                                          |
| Sync otomatis override `category` atau `retirement_km`           | Tidak boleh — sync hanya update Strava fields                          |
| PATCH body includes `notification_distance_m`                    | Ignored — this field is Strava-managed, never writable by user via API |

### 12.9 Test IDs

Terdaftar di `cypress/fixtures/app-constants.json` under `test_ids.running_gear.*`:

| ID                    | Element                       |
| --------------------- | ----------------------------- |
| `gearPage`            | Section root element          |
| `gearLoadingSkeleton` | Skeleton wrapper saat loading |
| `gearError`           | Error container               |
| `gearList`            | `<ul>` active shoes           |
| `gearCard`            | Setiap `<li>` gear card       |
| `gearSaveBtn`         | Save button di edit form      |

---

## 13. Race Log

### 13.1 Overview

Race Log adalah fitur untuk mencatat dan melacak semua race yang pernah kamu ikuti. Berbeda dari Goals (yang forward-looking), Race Log adalah catatan historis — setiap race yang sudah selesai bisa dicatat dengan hasil aktual (finish time, pace, posisi, dll).

Dua hal yang bisa kamu kelola di sini:

1. **Race history** — semua race yang sudah selesai, lengkap dengan hasil dan catatan
2. **Upcoming race goal** — goal race berikutnya yang juga bisa di-edit langsung dari halaman Activity (bukan harus lewat onboarding ulang)

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
  position_overall INT,                   -- finishing position overall, nullable
  position_category INT,                  -- finishing position in age group / category, nullable
  did_not_finish BOOLEAN DEFAULT FALSE,
  activity_id UUID REFERENCES activities(id) ON DELETE SET NULL, -- optional link to Strava activity
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_race_log_user_date ON rt_race_log(user_id, race_date DESC);
```

- `did_not_finish = true` → `finish_time_sec` dan `avg_pace_sec_per_km` boleh null
- `activity_id` — opsional link ke aktivitas Strava. Kalau ada, activity detail page bisa tampilkan "Raced: [title]" label
- `avg_pace_sec_per_km` dihitung otomatis di server saat insert/update — tidak perlu dikirim dari client

### 13.4 API Endpoints

```
GET    /api/running/v1/race-log              ← list semua race entries, urut race_date DESC
POST   /api/running/v1/race-log              ← tambah race entry baru
PATCH  /api/running/v1/race-log/:id          ← edit race entry
DELETE /api/running/v1/race-log/:id          ← hapus race entry

PATCH  /api/running/v1/goals/:id             ← update upcoming race goal (title, description, target fields)
```

**GET /api/running/v1/race-log**

- Auth required (401 kalau tidak ada session)
- No query params untuk MVP
- Response: `{ data: [{ id, title, race_date, distance_m, finish_time_sec, avg_pace_sec_per_km, avg_hr, elevation_gain_m, position_overall, position_category, did_not_finish, activity_id, notes, created_at }], message }`

**POST /api/running/v1/race-log**

- Auth required
- Body: `{ title, race_date, distance_m, finish_time_sec?, avg_hr?, elevation_gain_m?, position_overall?, position_category?, did_not_finish?, activity_id?, notes? }`
- Validasi via Zod schema di `schemas/raceLog.js`
- Server computes `avg_pace_sec_per_km = Math.round(finish_time_sec / (distance_m / 1000))` — hanya kalau `finish_time_sec` ada dan `did_not_finish = false`
- Response: `{ data: <new race log row>, message }`

**PATCH /api/running/v1/race-log/:id**

- Auth required
- Body: semua field opsional kecuali setidaknya satu field harus ada
- Ownership check: hanya bisa edit entry milik user sendiri (404 kalau bukan milik user)
- `avg_pace_sec_per_km` recomputed kalau `finish_time_sec` atau `distance_m` berubah
- Response: `{ data: <updated row>, message }`

**DELETE /api/running/v1/race-log/:id**

- Auth required
- Ownership check: 404 kalau bukan milik user
- Response: `{ message: "Deleted" }`

**PATCH /api/running/v1/goals/:id**

- Auth required
- Body: `{ title?, description?, target_date?, target_distance_m?, target_time_sec? }` — semua opsional, minimal satu
- Ownership check: 404 kalau bukan milik user
- Response: `{ data: <updated goal row>, message }`

### 13.5 UI — Race Log Page

Race Log punya halaman sendiri di `/running/race-log`.

**States yang harus ada:**

| State    | Tampilan                                                                   |
| -------- | -------------------------------------------------------------------------- |
| Loading  | Skeleton 3 rows (title + date + distance + time)                           |
| Error    | AlertTriangle icon + pesan error + tombol "Try again"                      |
| Empty    | Medal icon + teks "No races logged yet" + CTA button "Log your first race" |
| Has data | List race entries, urut terbaru dulu                                       |

**Layout per race entry card:**

- Header: nama race (title) + tanggal + distance label (5K / 10K / Half / Full / Ultra / Custom)
- Body: finish time (format HH:MM:SS) + avg pace (format MM:SS/km) + posisi kalau ada
- Footer: tombol edit (pensil) + tombol delete (trash)
- DNF badge kalau `did_not_finish = true`
- Link ke activity detail kalau `activity_id` ada

**Add / Edit form (modal):**

- Title (required) — text input
- Race date (required) — date picker
- Distance (required) — dropdown preset (5K / 10K / 21.1K / 42.2K / Custom) + custom number input kalau Custom
- Finish time — time input (HH:MM:SS), optional kalau DNF
- Did not finish — checkbox. Kalau dicentang: disable finish time input
- Avg HR — number input, optional
- Elevation gain — number input (meter), optional
- Overall position — number input, optional
- Category position — number input, optional
- Notes — textarea, optional
- Link to activity — searchable dropdown dari recent activities (opsional)

**Delete confirmation:**

- Alert dialog: "Hapus race ini? Data tidak bisa dikembalikan."
- Konfirmasi delete button + cancel

### 13.6 UI — Edit Upcoming Race Goal (dari Activity page)

Di halaman Activity, tambahkan section atau button "Edit race goal" yang membuka modal edit goal.

Modal berisi:

- Race title (text input) — pre-fill dari `rt_goals.title` kalau ada
- Target distance — dropdown preset sama dengan Race Log
- Target date — date picker
- Description / notes (textarea) — opsional
- Save + Cancel buttons

Setelah save, NextRace card di dashboard langsung reflect perubahan (dengan re-fetch atau optimistic update).

**Lokasi di Activity page:** di bawah activity list, dalam card tersendiri bertitel "Your Next Race" atau terintegrasi di sidebar kalau layout memungkinkan.

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
```

### 13.8 Validations & Error States

| Field                        | Validation                                             | Error                                         |
| ---------------------------- | ------------------------------------------------------ | --------------------------------------------- |
| `title`                      | Required, max 200 chars                                | "Race name is required"                       |
| `race_date`                  | Required, valid date, not in future by more than 1 day | "Race date cannot be in the future"           |
| `distance_m`                 | Required, > 0, max 1000000                             | "Distance must be greater than 0"             |
| `finish_time_sec`            | Integer, > 0, required unless `did_not_finish = true`  | "Finish time is required for completed races" |
| `avg_hr`                     | Integer, 1–250                                         | "Heart rate must be between 1 and 250"        |
| `position_overall`           | Integer, >= 1                                          | "Position must be 1 or greater"               |
| `position_category`          | Integer, >= 1                                          | "Position must be 1 or greater"               |
| Race not found or wrong user | —                                                      | 404 Not found                                 |
| Server error                 | —                                                      | 500 with message in response                  |

### 13.9 Test IDs

Registered in `cypress/fixtures/app-constants.json` under `test_ids.race_log.*`:

| ID                        | Element                                  |
| ------------------------- | ---------------------------------------- |
| `raceLogPage`             | Page root element                        |
| `raceLogLoadingSkeleton`  | Skeleton wrapper saat loading            |
| `raceLogError`            | Error container                          |
| `raceLogEmptyState`       | Empty state container                    |
| `raceLogList`             | `<ul>` race entries list                 |
| `raceLogCard`             | Each `<li>` race entry card              |
| `addRaceBtn`              | Add race button (opens modal)            |
| `raceLogFormModal`        | Add/edit modal root                      |
| `raceLogSaveBtn`          | Save button in form modal                |
| `raceLogDeleteBtn`        | Delete icon on each card                 |
| `raceLogDeleteConfirmBtn` | Confirm button in delete dialog          |
| `editGoalBtn`             | "Edit race goal" button on Activity page |
| `editGoalModal`           | Edit goal modal root                     |
| `editGoalSaveBtn`         | Save button in edit goal modal           |

---

## 14. Computed Metrics Formulas

### Training Stress Score (rTSS)

```
rTSS = (duration_sec × NGS × IF) / (threshold_pace × 3600) × 100
NGS  = avg pace (simplifikasi)
IF   = avg_pace / threshold_pace
```

### TRIMP (alternatif berbasis HR)

```
TRIMP = duration_min × HRr × 0.64 × e^(1.92 × HRr)
HRr   = (avg_hr - resting_hr) / (max_hr - resting_hr)
```

### ACWR

```
ACWR = avg_load_last_7d / avg_load_last_28d
Optimal: 0.8 – 1.3
Warning: 1.3 – 1.5
Danger:  > 1.5 (injury risk naik signifikan)
```

### Race predictor (Riegel formula)

```
T2 = T1 × (D2 / D1)^1.06
Contoh: PR 5K 22:45 → Half marathon ≈ 1:47:xx
```

### VO2 max estimation

```
Dari PR dan distance pakai VDOT lookup table (Jack Daniels methodology)
Atau dari HR + pace pakai Firstbeat approximation
```

---

## 15. Background Workers

Semua background jobs dijalankan via **Inngest** — serverless-native, tidak butuh persistent server.

Ada dua jenis job:

- **Event-driven** — dipanggil oleh trigger (misal: user connect Strava, webhook masuk)
- **Scheduled (Vercel Cron)** — dipanggil otomatis berdasarkan jadwal, cocok untuk job yang cepat (< 60 detik)

```
INNGEST FUNCTIONS (event-driven + long-running):

strava/backfill                (trigger: user connect Strava)
  └─ Step 1: fetch semua halaman /athlete/activities (paginated)
  └─ Step 2: per aktivitas → fan-out ke strava/fetch-streams
  └─ Inngest handles retry otomatis kalau gagal

strava/fetch-streams           (trigger: setiap aktivitas dari backfill atau webhook)
  └─ Fetch time-series HR/GPS/pace dari Strava API
  └─ Insert ke activity_streams
  └─ Trigger anomaly-detector setelah selesai

strava/handle-webhook-event    (trigger: POST /api/sync/webhook)
  └─ create → fetch detail aktivitas baru + streams
  └─ update → re-fetch dan update data
  └─ delete → soft delete atau hapus dari DB

ai/anomaly-detector            (trigger: setelah strava/fetch-streams selesai)
  └─ Ambil aktivitas terbaru + baseline 30 hari aktivitas sejenis
  └─ Cek metrik berikut:

  ACWR spike
    kondisi  : acwr > 1.5
    severity : warning
    contoh   : "Training load minggu ini 1.8x lebih tinggi dari rata-rata 4 minggu terakhir"

  HR drift tidak normal
    kondisi  : avg_hr aktivitas terbaru > (baseline avg_hr × 1.10) pada pace yang sama (±10%)
    severity : attention
    contoh   : "HR rata-rata 162 bpm di easy run hari ini, 12% lebih tinggi dari biasanya di pace yang sama"

  Pace drop signifikan
    kondisi  : avg_pace > (baseline avg_pace × 1.08) untuk activity_type yang sama
    severity : attention
    contoh   : "Pace tempo run hari ini 8% lebih lambat dari rata-rata 4 minggu terakhir"

  Konsistensi terganggu
    kondisi  : tidak ada aktivitas dalam 10 hari (padahal sebelumnya rata-rata ≥ 3x/minggu)
    severity : info
    contoh   : "Kamu belum lari 10 hari — ingatkan goal race kamu masih X minggu lagi"

  └─ Kalau ada anomali → insert ke ai_insights dengan insight_type = 'anomaly'
  └─ Kalau tidak ada → tidak insert, tidak ada notifikasi

ai/generate-daily-insight      (trigger: Vercel Cron daily 06:00)
  └─ AI generate 1 insight card untuk hari ini

ai/weekly-review               (trigger: Vercel Cron Sunday 19:00)
  └─ AI generate comprehensive week summary

VERCEL CRON (scheduled, < 60 detik):

compute-daily-metrics          (daily 03:00)
  └─ Hitung TSS, ACWR, training load aggregation dari aktivitas kemarin

strava-sync-poll               (setiap 1 jam)
  └─ Fallback kalau webhook Strava missed — check aktivitas baru sejak last_sync_at
  └─ Kalau ada yang baru → trigger strava/fetch-streams via Inngest
```

### Inngest setup

Inngest butuh satu endpoint di app untuk menerima function invocations:

```
POST  /api/inngest    ← Inngest server kirim job ke sini untuk dieksekusi
```

Semua Inngest functions didaftarkan di endpoint ini. Inngest free tier: 50.000 event/bulan — cukup untuk personal app.

---

## 16. Push Notification (PWA)

### 15.1 Setup overview

Push notification di PWA bekerja lewat tiga komponen:

```
Browser (Service Worker)  ←→  Push Service (browser vendor)  ←→  App Server
```

- **VAPID keys** — sepasang public/private key yang membuktikan notifikasi benar-benar dari server kita
- **Service Worker** — script yang jalan di background di browser, terima push event bahkan saat app tidak dibuka
- **Push subscription** — object dari browser berisi endpoint unik per device, disimpan di DB

### 15.2 Setup flow

```
1. User buka app → browser minta izin notifikasi
2. User klik "Allow"
3. Browser daftarkan service worker → dapat PushSubscription object
   {
     endpoint: "https://fcm.googleapis.com/...",
     keys: { p256dh: "...", auth: "..." }
   }
4. App kirim subscription ke server:
   POST /api/user/push-subscription
   body: { subscription }
5. Server simpan di user_settings.push_subscription
6. Sekarang server bisa kirim notifikasi ke device ini kapan saja
```

### 15.3 Server-side: kirim notifikasi

```javascript
import webpush from 'web-push'

webpush.setVapidDetails(
  'mailto:' + process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

async function sendPushNotification(userId, payload) {
  const settings = await getUserSettings(userId)
  if (!settings.push_notifications_enabled) return
  if (!settings.push_subscription) return

  await webpush.sendNotification(settings.push_subscription, JSON.stringify(payload))
}

// Contoh payload
const payload = {
  title: 'Weekly Review siap',
  body: 'Minggu ini: 42km, ACWR 1.1 — performa terbaik bulan ini.',
  icon: '/icon-192.png',
  url: '/analytics',
}
```

### 15.4 Trigger notifikasi

| Event                         | Trigger                                     | Kondisi kirim                                    | Setting  |
| ----------------------------- | ------------------------------------------- | ------------------------------------------------ | -------- |
| Post-activity insight selesai | Inngest `ai/generate-post-activity-insight` | `notify_post_activity = true`                    | Settings |
| Weekly review selesai         | Vercel Cron Minggu 19:00                    | `notify_weekly_review = true`                    | Settings |
| Anomali terdeteksi            | Inngest `ai/check-anomaly`                  | `notify_anomaly = true` + severity ≥ `attention` | Settings |
| Friday prep                   | Vercel Cron Jumat 15:00                     | `notify_friday_prep = true`                      | Settings |

**Friday prep** adalah notifikasi gabungan: training load minggu ini + status health log + rekomendasi sesi weekend. Dibuat secara rules-based, tidak call Claude.

Semua setting default `true`. User bisa matikan satu per satu di halaman Settings.

### 15.5 Environment variables yang dibutuhkan

```
VAPID_PUBLIC_KEY=    ← generate sekali pakai: npx web-push generate-vapid-keys
VAPID_PRIVATE_KEY=   ← simpan di .env, jangan commit
VAPID_EMAIL=         ← email kontak untuk push service
```

### 15.6 Endpoint tambahan

```
POST   /api/user/push-subscription    ← simpan subscription object dari browser
DELETE /api/user/push-subscription    ← hapus subscription (user matikan notif)
```

### 15.7 Service worker (public/sw.js)

```javascript
self.addEventListener('push', (event) => {
  const data = event.data.json()
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      data: { url: data.url },
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(clients.openWindow(event.notification.data.url))
})
```

---

## 17. Encryption Strategy

### 16.1 Apa yang dienkripsi

| Data                                  | Lokasi       | Alasan                                                        |
| ------------------------------------- | ------------ | ------------------------------------------------------------- |
| `strava_credentials.access_token`     | DB           | Token aktif — kalau bocor, attacker bisa baca semua aktivitas |
| `strava_credentials.refresh_token`    | DB           | Lebih kritis — berlaku lama, bisa generate access token baru  |
| `garmin_credentials.credentials_data` | DB (Phase 2) | Credential Garmin, tergantung metode integrasi                |

### 16.2 Algoritma

**AES-256-GCM** — pilihan yang tepat karena:

- 256-bit key — kuat
- GCM mode — authenticated encryption, sekaligus deteksi tampering
- Built-in di Node.js `crypto` module — tidak butuh library tambahan

### 16.3 Implementasi

```javascript
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex') // 32 bytes = 64 hex chars

export function encrypt(plaintext) {
  const iv = randomBytes(12) // 96-bit IV untuk GCM
  const cipher = createCipheriv(ALGORITHM, KEY, iv)

  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag() // 16-byte auth tag

  // Simpan sebagai: iv(12) + authTag(16) + ciphertext — semua dalam hex
  return iv.toString('hex') + authTag.toString('hex') + encrypted.toString('hex')
}

export function decrypt(ciphertext) {
  const iv = Buffer.from(ciphertext.slice(0, 24), 'hex') // 12 bytes
  const authTag = Buffer.from(ciphertext.slice(24, 56), 'hex') // 16 bytes
  const content = Buffer.from(ciphertext.slice(56), 'hex')

  const decipher = createDecipheriv(ALGORITHM, KEY, iv)
  decipher.setAuthTag(authTag)

  return decipher.update(content) + decipher.final('utf8')
}
```

IV (Initialization Vector) di-generate baru tiap kali enkripsi — tidak pernah reuse. IV tidak perlu dirahasiakan, cukup disimpan bersama ciphertext.

### 16.4 Key management

```
ENCRYPTION_KEY=   ← 64 karakter hex (= 32 bytes)
                  ← generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
                  ← simpan di .env.local dan Vercel environment variables
                  ← JANGAN commit ke git
```

Key rotation: kalau `ENCRYPTION_KEY` perlu diganti, perlu migration — decrypt semua token dengan key lama, encrypt ulang dengan key baru. Proses ini harus atomic dan dilakukan saat maintenance window.

### 16.5 Di mana encrypt/decrypt dipanggil

| Operasi                  | Kapan                                                                |
| ------------------------ | -------------------------------------------------------------------- |
| `encrypt(access_token)`  | Saat simpan ke DB — setelah OAuth callback dan setelah token refresh |
| `decrypt(access_token)`  | Sesaat sebelum call ke Strava API                                    |
| `encrypt(refresh_token)` | Sama seperti access_token                                            |
| `decrypt(refresh_token)` | Saat proses token refresh                                            |

Tidak pernah log token dalam bentuk plaintext — bahkan di error logs sekalipun.

---

## 18. Non-functional Requirements

### Performance

- Dashboard load < 2 detik
- Activity detail render < 1 detik
- AI streaming: first token < 2 detik
- Strava sync: background, non-blocking

### Security

- Strava tokens encrypted AES-256-GCM at rest (lihat Section 15 untuk detail implementasi)
- HTTPS only, HSTS enabled
- Semua API key di environment variables, tidak di code
- Session via Supabase SSR (httpOnly cookie)
- Strava token refresh + rotation di setiap call
- Tidak kirim personal data ke AI sebagai training data

### Reliability

- Graceful degradation kalau Strava API down (cache data terakhir)
- Retry dengan exponential backoff untuk semua external calls
- Polling fallback kalau webhook gagal
- Daily encrypted DB backup
- Manual entry selalu bisa dilakukan terlepas dari Strava status

---

## 19. Development Phases & Timeline

### Phase 1 — MVP

| #   | Phase                       | Scope                                                                                                                 | Estimasi      |
| --- | --------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------- |
| 1   | **Setup**                   | Scaffold Next.js, Supabase auth (shared), Drizzle + DB schema, Vercel deploy, Inngest setup, env vars                 | 1 minggu      |
| 2   | **Onboarding**              | Onboarding wizard (biometric + Strava connect + goal), `/api/user/profile`, `/api/user/settings`, middleware redirect | 0.5 minggu    |
| 3   | **Strava ingestion**        | OAuth flow, webhook (GET verify + POST handler), backfill via Inngest, polling fallback, rate limit, token encryption | 1.5 minggu    |
| 4   | **Upload & manual entry**   | GPX/FIT parser, dedup logic, manual workout form, daily health log                                                    | 1 minggu      |
| 5   | **Dashboard & activity UI** | Dashboard, activity list, activity detail + map + charts, streams downsampling                                        | 1.5 minggu    |
| 6   | **Analytics**               | Trend charts, training load (ACWR), race predictor, PR tracking, VO2 max estimation                                   | 1 minggu      |
| 7   | **AI Insight Engine**       | Post-activity insight, weekly review, anomaly detector, on-demand analysis                                            | 1 minggu      |
| 8   | **PWA + push notification** | Service worker, VAPID setup, push subscription flow, 3 notification triggers                                          | 0.5 minggu    |
|     | **— MVP shipped —**         |                                                                                                                       | **~7 minggu** |

### Phase 2 — Health integration

| #   | Phase                  | Scope                                                                      | Estimasi               |
| --- | ---------------------- | -------------------------------------------------------------------------- | ---------------------- |
| 9   | **Garmin integration** | Strategi TBD (official API / unofficial), credentials, sync job            | 2 minggu               |
| 10  | **Health UI**          | Health tabs, daily health card, mini trends per metrik                     | 1.5 minggu             |
| 11  | **Advanced analytics** | Correlation view (2-metric overlay), readiness score composite             | 1.5 minggu             |
| 12  | **AI Coach advanced**  | Cross-metric reasoning, anomaly detection berbasis HRV/RHR, readiness mode | 1.5 minggu             |
| 13  | **Chat Coach**         | Live chat interface, conversation history, tool use, streaming SSE         | 1.5 minggu             |
|     | **— Full platform —**  |                                                                            | **~15.5 minggu total** |

### Catatan urutan

- Phase 1 #2 (Onboarding) **harus selesai sebelum** #3 (Strava ingestion) — karena backfill butuh user yang sudah punya row di DB
- Phase 1 #3 (Strava ingestion) **harus selesai sebelum** #5 (Dashboard) — tidak ada data = tidak bisa test UI
- Phase 1 #8 (PWA) bisa dikerjakan paralel dengan #7 (AI Coach) kalau mau lebih cepat
- Phase 2 boleh dimulai setelah MVP sudah stabil minimal 4 minggu real usage

---

## 20. Risks

| Risk                                        | Kemungkinan | Dampak | Mitigasi                                                                     |
| ------------------------------------------- | ----------- | ------ | ---------------------------------------------------------------------------- |
| Strava rate limit hit saat backfill         | Medium      | Low    | Throttle 80/15min, queue dengan Inngest/QStash                               |
| Webhook missed events                       | Medium      | Low    | Polling fallback setiap 1 jam                                                |
| Inngest free tier limit terlampaui          | Low         | Low    | 50k event/bulan cukup untuk personal app. Monitor usage di Inngest dashboard |
| Garmin Phase 2 lebih kompleks dari estimasi | Medium      | Medium | Schema sudah disiapkan, bisa fallback ke unofficial library                  |
| AI cost membengkak                          | Medium      | Medium | Monitor token usage, cache context                                           |
| Data loss                                   | Low         | High   | Daily encrypted backup                                                       |
| Strava policy berubah                       | Low         | Medium | Simpan raw data di `activities.raw_data`, bisa re-process                    |

---

## 21. Architectural Decisions (sudah final)

| #   | Pertanyaan           | Keputusan                               | Implikasi                                                                                                               |
| --- | -------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 1   | Deployment           | **Vercel**                              | Serverless — API routes di Vercel Functions. Long-running jobs via Inngest. Scheduled jobs via Vercel Cron              |
| 2   | Database time-series | **Regular PostgreSQL** (no TimescaleDB) | Pakai proper index di kolom `timestamp` + `activity_id`. Cukup untuk volume personal app                                |
| 3   | AI model             | **Sonnet 4.6 untuk semua query**        | Tidak perlu routing logic. Estimasi biaya tetap ~$6.3/bulan                                                             |
| 4   | HR zones methodology | **Semua tiga metode**                   | User bisa pilih metodologi di settings. Default: % max HR (paling simpel). Karvonen dan threshold tersedia sebagai opsi |
| 5   | Garmin Phase 2       | **Wait** sampai Phase 1 stable          | Tidak perlu apply Garmin API sekarang. Fokus ke Strava dulu                                                             |
| 6   | Notification         | **Push notification (PWA)**             | Perlu service worker + Web Push API. Untuk alert: weekly review ready, anomali training, reminder log harian            |
| 7   | Strava disconnect    | **Default retain data historis**        | Saat user disconnect Strava, workout data tetap ada di DB. User bisa pilih hapus manual kalau mau                       |

### Catatan: Inngest + Vercel Cron

Vercel serverless tidak support long-running background workers secara native. Solusinya:

- **Inngest** untuk semua job yang event-driven dan bisa berjalan lama (Strava backfill, stream fetching, anomaly detection, weekly review AI)
- **Vercel Cron** untuk scheduled jobs yang cepat (< 60 detik): compute daily metrics, polling fallback setiap 1 jam

Inngest bekerja dengan cara mengirim job invocation ke endpoint `/api/inngest` di app — Vercel function yang menjalankannya, tapi Inngest yang mengatur retry, fan-out, dan step execution.

---

### HR Zones Detail

Ketiga metodologi tersedia, user pilih di settings:

| Metodologi                | Formula                                 | Kapan dipakai                                             |
| ------------------------- | --------------------------------------- | --------------------------------------------------------- |
| **% Max HR**              | Zone = HR / max_hr × 100                | Default. Paling simpel, tidak butuh RHR                   |
| **HR Reserve (Karvonen)** | HRR = (HR - RHR) / (max_HR - RHR) × 100 | Lebih akurat untuk endurance. Butuh RHR input             |
| **Threshold-based**       | Zone relative ke lactate threshold HR   | Paling akurat. Butuh threshold HR dari test atau estimate |

Zone boundaries (% dari masing-masing metodologi):

| Zone | Nama         | % (Max HR) | % (Karvonen) |
| ---- | ------------ | ---------- | ------------ |
| Z1   | Recovery     | < 60%      | < 50%        |
| Z2   | Aerobic base | 60–70%     | 50–65%       |
| Z3   | Tempo        | 70–80%     | 65–75%       |
| Z4   | Threshold    | 80–90%     | 75–90%       |
| Z5   | VO2 max      | > 90%      | > 90%        |

---

_End of document. Version 2.2 — Section 12 Gear Management updated: added `notification_distance_m` column to rt_gear schema and sync fields, documented two-tab limit toggle (Strava / Manual) in UI spec and acceptance criteria, updated GET response shape, added PATCH validation note for Strava-managed field._
