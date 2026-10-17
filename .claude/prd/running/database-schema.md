## 8. Database Schema

### 7.1 Phase 1 tables

```sql
-- ==================== USERS ====================
-- Synced from Supabase auth.users, adds biometric fields
CREATE TABLE users (
  id UUID PRIMARY KEY,               -- same as Supabase auth.users.id
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  birth_date DATE,
  height_cm NUMERIC(5,2),
  weight_kg NUMERIC(5,2),            -- baseline
  max_hr INT,
  resting_hr_baseline INT,
  vo2_max_baseline NUMERIC(4,1),
  sex TEXT,                        -- 'male' | 'female' | null (used for fitness age calculation)
  threshold_pace_sec INT,          -- threshold pace in sec/km (Daniels-style, for pace zones)
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
  webhook_subscription_id BIGINT,
  needs_reconnect BOOLEAN NOT NULL DEFAULT FALSE  -- TRUE when Strava returns 401 on refresh; cleared on successful reconnect
);

-- Migration for existing installations:
-- ALTER TABLE strava_credentials ADD COLUMN needs_reconnect BOOLEAN NOT NULL DEFAULT FALSE;

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
  -- Derived metrics (computed at ingest time — see section 11.4)
  efficiency_factor NUMERIC(6,4),
  aerobic_decoupling NUMERIC(5,2),
  estimated_vo2max NUMERIC(5,2),
  has_heartrate BOOLEAN DEFAULT FALSE,
  device_watts BOOLEAN DEFAULT FALSE,
  avg_watts NUMERIC(7,2),
  weighted_avg_watts NUMERIC(7,2),
  pr_count INT DEFAULT 0,
  relative_effort INT,
  gear_id TEXT,
  enriched_at TIMESTAMPTZ,           -- set after streams + derived metrics are computed
  created_at TIMESTAMPTZ DEFAULT NOW()
  -- dedup via application, not DB constraint — see section 8.3 Deduplication
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
  training_load NUMERIC(6,2),       -- daily TSS or TRIMP
  acute_load_7d NUMERIC(6,2),
  chronic_load_28d NUMERIC(6,2),
  acwr NUMERIC(4,2),
  readiness_score INT,              -- nullable, populated in Phase 2
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
  threshold_hr INT,                        -- set when method = 'threshold'
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

### 7.2 Phase 2 tables (prepared, created when Phase 2 begins)

```sql
-- Garmin credentials (method TBD)
CREATE TABLE garmin_credentials (
  user_id UUID REFERENCES users(id) PRIMARY KEY,
  credentials_data JSONB,            -- encrypted
  last_sync_at TIMESTAMPTZ
);

-- Daily health aggregate from Garmin
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
