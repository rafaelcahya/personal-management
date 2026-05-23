# AI Coach — Technical Implementation Spec

**Version:** 1.1
**Last Updated:** 2026-05-20
**Status:** Final — siap untuk coding

---

## 0. Flow Overview

### Flow 1 — Setelah Selesai Lari

```
Kamu selesai lari
       ↓
Strava detect aktivitas baru → kirim webhook ke app
       ↓
POST /api/sync/webhook → return 200 immediately → emit ke Inngest
       ↓
Inngest: strava/fetch-streams
  → Fetch detail aktivitas + streams dari Strava API
  → Simpan ke DB (activities + activity_streams + splits)
       ↓
Inngest: ai/generate-post-activity-insight
  → Parallel fetch semua context data
  → Serialize → Call Claude → Validate → Simpan ke ai_insights
  → Kirim push notification
       ↓
Inngest: ai/check-anomaly
  → Rules-based check: ACWR spike, HR drift, pace drop, gap konsistensi
  → Kalau ada anomali → Call Claude untuk pesan personal → simpan → notif
  → Kalau tidak ada → selesai
```

### Flow 2 — Jumat 15:00

```
Vercel Cron → ai/friday-prep-notification
  → Fetch training load + health log status + jumlah sesi
  → Rules-based (no Claude) → compose notifikasi
  → Kirim push notification:
    "Load minggu ini: 38km, ACWR 1.1 (Optimal)
     Belum log hari ini
     Sabtu/Minggu: kondisi bagus untuk long run"
```

### Flow 3 — Minggu 19:00

```
Vercel Cron → ai/weekly-review
  → Fetch semua aktivitas + metrics + health log minggu ini
  → Call Claude → weekly review ~300 kata
  → Simpan ke ai_insights → kirim push notification
```

### Flow 4 — Setiap Hari 06:00

```
Vercel Cron → ai/generate-daily-insight
  → Cek: sudah ada insight hari ini? atau < 3 aktivitas? → abort
  → Tentukan fokus (race dekat / ACWR tinggi / gap / default)
  → Call Claude → simpan ke ai_insights
  → Tidak kirim notifikasi — hanya muncul di dashboard
```

### Di mana insight muncul di UI

| Insight       | Tampil di                                            |
| ------------- | ---------------------------------------------------- |
| Post-activity | Halaman detail aktivitas + dashboard (kartu terbaru) |
| Weekly review | Dashboard (kartu mingguan)                           |
| Anomaly       | Dashboard (kartu warning)                            |
| Daily insight | Dashboard (kartu harian)                             |
| On-demand     | Halaman detail aktivitas (tombol "Analyze")          |
| Friday prep   | Push notification saja — tidak disimpan ke DB        |

### Claude dipanggil untuk

- Post-activity insight
- Weekly review
- Anomaly description (setelah anomali terdeteksi secara programmatic)
- Daily insight
- On-demand analysis

### Tidak pakai Claude

- Friday prep — rules-based sepenuhnya
- Anomaly detection logic — rules-based, Claude hanya untuk tulis deskripsinya

---

## 1. Claude API Configuration

| Parameter         | Value                                                                 | Alasan                                                  |
| ----------------- | --------------------------------------------------------------------- | ------------------------------------------------------- |
| Model             | `claude-sonnet-4-6`                                                   | Sudah diputuskan di PRD                                 |
| Temperature       | `0.3`                                                                 | Konsisten, tidak terlalu robotic. Lower = lebih faktual |
| Max tokens output | Post-activity: `700`, Weekly: `500`, Anomaly: `250`, On-demand: `700` |                                                         |
| Streaming         | **Tidak** untuk Insight Engine                                        | Output disimpan lengkap ke DB dulu, baru ditampilkan    |
| Top-p             | Default (`1.0`)                                                       | Tidak perlu diubah                                      |
| Timeout           | `30 detik`                                                            | Cukup untuk non-streaming call                          |

Streaming hanya dipakai di Phase 2 Chat Coach.

---

## 2. Context Serialization Format & Token Budget

**Format: plain text terstruktur** (bukan JSON mentah)

JSON mentah ke Claude boros token dan sulit dibaca model. Plain text terstruktur lebih efisien dan lebih mudah di-reason oleh AI.

### Estimasi token aktual

| Section                                  | Token est.      |
| ---------------------------------------- | --------------- |
| System prompt                            | ~300            |
| Profil atlet                             | ~80             |
| Kondisi hari ini (health log)            | ~60             |
| Detail aktivitas + splits                | ~280            |
| Baseline 4 minggu (5 aktivitas terakhir) | ~180            |
| Training load                            | ~50             |
| **Total input**                          | **~950 tokens** |
| **Output**                               | **~500 tokens** |

PRD estimate 3.000 input token terlalu konservatif. Dengan plain text, aktualnya sekitar 950.

### Format serialisasi per section

```
=== AKTIVITAS HARI INI ===
Tipe: Easy run
Tanggal: Selasa, 20 Mei 2026, 06:15
Jarak: 10.2 km | Durasi: 58:23 | Moving time: 55:41
Pace avg: 5:43/km | Pace max: 4:55/km
HR avg: 142 bpm | HR max: 163 bpm
Cadence avg: 174 spm | Elevation gain: 87m
RPE (subjektif): 5/10
Catatan: "Kaki sedikit berat di awal"

Splits:
km 1: 5:58/km, HR 135 | km 2: 5:52/km, HR 139 | km 3: 5:45/km, HR 141
km 4: 5:40/km, HR 143 | km 5: 5:41/km, HR 142 | km 6: 5:44/km, HR 143
km 7: 5:42/km, HR 144 | km 8: 5:39/km, HR 145 | km 9: 5:38/km, HR 147
km 10: 5:38/km, HR 148

HR Zone Distribution:
Z1 Recovery (<60% max): 5% | Z2 Aerobic (60-70%): 45%
Z3 Tempo (70-80%): 35% | Z4 Threshold (80-90%): 13% | Z5 VO2max (>90%): 2%

=== BASELINE (Easy run, 4 minggu terakhir) ===
5 sesi tercatat:
15 Mei: 8km | pace 5:49/km | HR avg 140
11 Mei: 12km | pace 5:55/km | HR avg 145
7 Mei: 8km | pace 5:52/km | HR avg 143
3 Mei: 10km | pace 5:58/km | HR avg 147
29 Apr: 6km | pace 6:02/km | HR avg 144

Rata-rata baseline: pace 5:55/km | HR avg 143.8 bpm

=== TRAINING LOAD ===
ACWR sekarang: 1.15 (Optimal)
Acute load 7d: 287 | Chronic load 28d: 249
```

Raw streams **tidak diinclude** ke prompt — splits sudah cukup untuk AI reasoning. Streams terlalu banyak token untuk nilai tambah yang minimal.

---

## 3. Token Budget Management

**Hard limit: 6.000 input tokens** (safety buffer di atas estimasi aktual ~950).

### Priority order kalau mendekati limit

1. System prompt — tidak pernah dipotong
2. Profil atlet — tidak pernah dipotong
3. Detail aktivitas hari ini — tidak pernah dipotong
4. Health log hari ini — dipotong kalau > 200 token
5. Baseline activities — kurangi jumlah: 5 → 3 → 1
6. Training load — ringkas kalau perlu

```javascript
function truncateBaseline(activities, tokenBudget) {
  for (let count = 5; count >= 1; count--) {
    const serialized = serializeBaseline(activities.slice(0, count))
    if (estimateTokens(serialized) <= tokenBudget) return serialized
  }
  return 'Data baseline tidak tersedia'
}
```

---

## 4. Prompt Engineering

### 4.1 Post-activity & On-demand

```
Kamu adalah personal running coach untuk {display_name}.

Analisis aktivitas lari berikut dan tulis insight dalam Bahasa Indonesia.

ATURAN:
- Selalu sebutkan angka spesifik dari data (pace, HR, jarak) — jangan pernah generic
- Kalau ada baseline, bandingkan secara konkret dengan angka
- Format output WAJIB:
  ## Ringkasan
  [1-2 paragraf, maks 100 kata]

  ## Highlight
  - [positif konkret 1]
  - [positif konkret 2, opsional]

  ## Yang Perlu Diperhatikan
  [Tulis bagian ini HANYA kalau ada sesuatu yang perlu diperhatikan. Kalau tidak ada, SKIP seluruh bagian ini]

  ## Rekomendasi Sesi Berikutnya
  [1 rekomendasi konkret dan actionable]

- Jangan fabricate data yang tidak ada di context
- Bukan medical advice — kalau ada keluhan fisik serius, sarankan ke dokter/physio
- Tone: santai, seperti coach yang kenal atletnya. Bukan laporan formal.

=== PROFIL ATLET ===
Nama: {display_name}
Umur: {age} tahun
Max HR: {max_hr} bpm | Resting HR: {resting_hr} bpm
HR zones: {hr_zones_method}
Goal aktif: {goals_summary || "Belum ada goal aktif"}

=== KONDISI HARI INI ===
{health_log_text || "Tidak ada data subjektif untuk hari ini"}

{activity_section}

{baseline_section}

{training_load_section}
```

### 4.2 Weekly Review

```
Kamu adalah personal running coach untuk {display_name}.

Buat weekly review training minggu ini dalam Bahasa Indonesia. Padat, konkret, actionable.

ATURAN:
- Mulai dengan volume summary (km total, waktu, jumlah sesi)
- Evaluasi balance easy/hard (idealnya 80/20)
- Bandingkan volume dengan 4 minggu sebelumnya (kalau ada data)
- Satu rekomendasi fokus paling penting untuk minggu depan
- Format output WAJIB:
  ## Ringkasan Minggu Ini
  [volume + highlight utama, maks 80 kata]

  ## Balance Training
  [evaluasi easy/hard ratio]

  ## Vs Minggu Lalu
  [perbandingan konkret, atau "Tidak ada data pembanding" kalau ini minggu pertama]

  ## Fokus Minggu Depan
  [1 rekomendasi konkret]

- Maks 300 kata total
- Tone: ringkas dan to the point

=== PROFIL ATLET ===
{profile_section}

=== MINGGU INI ({week_start} - {week_end}) ===
{weekly_activities_section}

=== TRAINING LOAD MINGGU INI ===
{training_load_section}

=== HEALTH LOG MINGGU INI ===
{health_log_summary || "Tidak ada data subjektif minggu ini"}

=== 4 MINGGU SEBELUMNYA (perbandingan) ===
{previous_weeks_summary}
```

### 4.3 Anomaly Alert

Anomaly terdeteksi secara **programmatic** (rules-based). Claude hanya dipanggil untuk menulis deskripsi yang personal.

```
Kamu adalah personal running coach untuk {display_name}.

Tulis satu pesan alert singkat dalam Bahasa Indonesia untuk kondisi berikut:

Kondisi: {anomaly_type}
Data: {anomaly_data}
Konteks atlet: {brief_profile}

ATURAN:
- Maks 3 kalimat
- Sebutkan angka spesifik
- Tone: perhatian tapi tidak menakut-nakuti
- Tidak boleh medical advice
- Sertakan 1 saran konkret apa yang bisa dilakukan
```

Contoh output:

> "HR rata-rata easy run kamu hari ini 162 bpm — 12% lebih tinggi dari baseline 145 bpm di pace yang sama. Ini bisa pertanda fatigue akumulasi atau cuaca panas. Coba tambah 1 hari rest sebelum sesi berikutnya."

---

## 5. Error Handling & Fallbacks

| Skenario                          | Handling                                                              |
| --------------------------------- | --------------------------------------------------------------------- |
| Claude timeout (>30s)             | Mark insight `status='failed'`, Inngest retry 1x setelah 5 menit      |
| Claude rate limit (429/529)       | Inngest retry dengan backoff: 1 menit → 5 menit → 15 menit → drop     |
| Claude output < 50 chars          | Retry sekali. Kalau tetap pendek → save dengan `is_valid=false`       |
| Claude API down                   | Skip insight generation, jangan block sync flow. Log error ke Sentry  |
| Context building gagal (DB error) | Abort Inngest job, retry. Jangan call Claude kalau data tidak lengkap |
| Inngest max retry terlampaui      | Save row ke `ai_insights` dengan `status='failed'`, `content=null`    |

### Schema tambahan yang diperlukan

```sql
ALTER TABLE ai_insights
  ADD COLUMN status TEXT DEFAULT 'completed'
    CHECK (status IN ('pending', 'completed', 'failed')),
  ADD COLUMN is_valid BOOLEAN DEFAULT TRUE,
  ADD COLUMN error_message TEXT,
  ADD COLUMN retry_count INT DEFAULT 0;
```

**Di UI:**

- `status='pending'` → tampilkan skeleton loader
- `status='failed'` → jangan tampilkan kartu insight
- `is_valid=false` → jangan tampilkan kartu insight

---

## 6. Redis Caching Strategy

| Data                      | Cache key                      | TTL      | Alasan                                           |
| ------------------------- | ------------------------------ | -------- | ------------------------------------------------ |
| User profile + biometric  | `ai:profile:{user_id}`         | 1 jam    | Jarang berubah, dipanggil di setiap insight      |
| Baseline activities (30d) | `ai:baseline:{user_id}:{type}` | 15 menit | Relatif stabil, bisa berubah kalau ada sync baru |
| Training metrics (ACWR)   | `ai:load:{user_id}`            | 5 menit  | Dihitung ulang setiap hari                       |
| Active goals              | `ai:goals:{user_id}`           | 1 jam    | Jarang berubah                                   |

### Cache invalidation

| Event                    | Cache yang di-delete      |
| ------------------------ | ------------------------- |
| User update profile      | `ai:profile:{user_id}`    |
| Strava sync selesai      | `ai:baseline:{user_id}:*` |
| Daily metrics recomputed | `ai:load:{user_id}`       |
| User update goal         | `ai:goals:{user_id}`      |

---

## 7. Inngest Step Breakdown

### `ai/generate-post-activity-insight`

```
Trigger: strava/fetch-streams selesai

Step 1: check-duplicate
  → Cek apakah sudah ada insight untuk activity_id ini
  → Kalau sudah ada: abort (idempotent)

Step 2: build-context (parallel fetch)
  → getActivity(activityId)
  → getSplits(activityId)
  → getRecentActivities(userId, { days: 28, type: activity.type, limit: 5 })
  → getTrainingLoad(userId)
  → getHealthLog(userId, activity.started_at)
  → getGoals(userId)        [dari cache]
  → getProfile(userId)      [dari cache]

Step 3: serialize-context
  → Susun plain text dari semua data
  → Estimate token count, truncate kalau perlu

Step 4: call-claude
  → POST ke Claude API
  → Timeout 30 detik

Step 5: validate-output
  → Cek panjang output (min 100 chars)
  → Cek ada section headers (## Ringkasan, dll)

Step 6: save-insight
  → Insert ke ai_insights { type: 'post_activity', status: 'completed', activity_id }

Step 7: send-push-notification
  → Kirim kalau notify_post_activity = true
  → Isi: judul insight + 1 kalimat pertama dari Ringkasan

Step 8: trigger-anomaly-check
  → Emit event 'ai/check-anomaly' dengan activity_id
```

### `ai/check-anomaly`

```
Step 1: load-data
  → Activity terbaru + baseline 30 hari
  → Training metrics (ACWR)

Step 2: evaluate-conditions (programmatic, no Claude)
  Condition A: acwr > 1.5
    → severity: 'warning'
    → contoh: "Training load minggu ini 1.8x lebih tinggi dari rata-rata 4 minggu terakhir"

  Condition B: avg_hr > baseline_hr * 1.10 (same pace ±10%)
    → severity: 'attention'
    → contoh: "HR rata-rata 12% lebih tinggi dari biasanya di pace yang sama"

  Condition C: avg_pace > baseline_pace * 1.08 (same activity type)
    → severity: 'attention'
    → contoh: "Pace tempo run 8% lebih lambat dari rata-rata 4 minggu terakhir"

  Condition D: days_since_last_activity > 10 AND avg_freq >= 3/week
    → severity: 'info'
    → contoh: "Belum ada sesi dalam 10 hari"

Step 3: kalau ada anomali
  → Call Claude untuk generate pesan personal (prompt Section 4.3)
  → Insert ke ai_insights (type: 'anomaly')
  → Kalau severity >= 'attention' → kirim push notification (notify_anomaly)

Step 4: kalau tidak ada anomali → done, tidak insert apapun
```

### `ai/weekly-review`

```
Trigger: Vercel Cron setiap Minggu 19:00

Step 1: determine-week-range
  → week_start = Senin kemarin
  → week_end = Minggu hari ini

Step 2: check-duplicate
  → Sudah ada weekly review untuk week_start ini? → abort

Step 3: build-context
  → getActivitiesInRange(userId, week_start, week_end)
  → getWeeklyMetrics(userId, week_start)
  → getPreviousWeeks(userId, count: 4)   [ringkasan saja, bukan detail]
  → getHealthLogsInRange(userId, week_start, week_end)
  → getProfile(userId)   [dari cache]
  → getGoals(userId)     [dari cache]

Step 4: call-claude

Step 5: save-insight

Step 6: send-push-notification
  → Kirim kalau notify_weekly_review = true
```

### `ai/friday-prep-notification`

```
Trigger: Vercel Cron setiap Jumat 15:00

Step 1: get-data (parallel)
  → getTrainingLoad(userId)         — ACWR, total km minggu ini
  → checkHealthLogToday(userId)     — sudah log atau belum
  → getWeekActivityCount(userId)

Step 2: determine-recommendation (rules-based, no Claude)
  ACWR > 1.5    → "Sabtu/Minggu: prioritas recovery run pendek atau rest"
  ACWR 1.3-1.5  → "Sabtu/Minggu: easy run oke, hindari sesi berat"
  ACWR 0.8-1.3  → "Sabtu/Minggu: kondisi bagus untuk long run atau quality session"
  ACWR < 0.8    → "Sabtu/Minggu: volume bisa dinaikkan sedikit"
  Tidak ada aktivitas minggu ini → "Belum ada sesi minggu ini — Sabtu/Minggu bagus untuk mulai"

Step 3: compose-notification
  Judul: "Weekend check-in"
  Body:
    - "Load minggu ini: {total_km}km, ACWR {acwr} ({status})"
    - "Belum log hari ini" atau "Log minggu ini lengkap ✓"
    - "{weekend_recommendation}"

Step 4: send-push-notification
  → Kirim kalau notify_friday_prep = true
  → Friday prep tidak call Claude — semua content rules-based
```

### `ai/generate-daily-insight`

```
Trigger: Vercel Cron daily 06:00

Step 1: check-duplicate
  → Sudah ada daily insight untuk hari ini? → abort
  → User punya < 3 aktivitas? → abort (belum cukup data)

Step 2: determine-focus
  → Ada race dalam 14 hari?       → fokus taper/readiness
  → ACWR > 1.3?                   → fokus recovery
  → Gap > 5 hari tanpa lari?      → motivational + consistency
  → Default                       → general tip dari recent pattern

Step 3: build-context → call-claude → save-insight
  → Daily insight tidak kirim push notification
  → Hanya muncul di dashboard
```

---

## 8. New User Edge Cases

**Definisi new user:** < 3 aktivitas tersimpan

### Perubahan di prompt

```
[Tambahkan ke system prompt kalau aktivitas_count < 3]

CATATAN PENTING: Ini adalah aktivitas ke-{n} {display_name} yang tercatat di platform ini.
Belum ada data historis yang cukup untuk perbandingan baseline.
Analisis berdasarkan data aktivitas ini dan profil biometric saja.
Jangan sebut "dibanding biasanya" atau "rata-rata kamu" — belum ada baseline.
```

### Pembatasan per insight type saat new user mode

| Insight type  | Behaviour                                                                      |
| ------------- | ------------------------------------------------------------------------------ |
| Post-activity | Generate, tapi tambah note "tidak ada baseline" di prompt                      |
| Weekly review | Generate, skip section "Vs Minggu Lalu"                                        |
| Anomaly       | Skip check ACWR dan HR drift (belum ada baseline). Hanya check gap konsistensi |
| Daily insight | **Skip** — belum cukup data untuk insight bermakna                             |

---

## 9. Insight Output Validation

```javascript
function validateInsightOutput(output, insightType) {
  const minLength = {
    post_activity: 150,
    weekly_review: 200,
    anomaly: 50,
    on_demand: 150,
  }

  const requiredSections = {
    post_activity: ['## Ringkasan', '## Highlight', '## Rekomendasi'],
    weekly_review: ['## Ringkasan', '## Balance', '## Fokus'],
    anomaly: [], // free form, hanya cek panjang
    on_demand: ['## Ringkasan', '## Highlight', '## Rekomendasi'],
  }

  if (output.length < minLength[insightType]) {
    return { valid: false, reason: 'too_short' }
  }

  const missing = requiredSections[insightType].filter((s) => !output.includes(s))
  if (missing.length > 0) {
    return { valid: false, reason: 'missing_sections', missing }
  }

  return { valid: true }
}
```

Kalau `valid: false` → retry sekali. Kalau tetap invalid → save dengan `is_valid=false`, tidak tampilkan di UI.

---

## 10. Notification Design (Final)

### Trigger summary

| Setting                | Default | Trigger                                          | Claude dipanggil?                                   |
| ---------------------- | ------- | ------------------------------------------------ | --------------------------------------------------- |
| `notify_post_activity` | `true`  | Setiap aktivitas sync selesai                    | Ya (dari insight generation)                        |
| `notify_weekly_review` | `true`  | Minggu 19:00                                     | Ya (dari weekly review)                             |
| `notify_friday_prep`   | `true`  | Jumat 15:00                                      | **Tidak** — rules-based                             |
| `notify_anomaly`       | `true`  | Setelah aktivitas sync, kalau anomali terdeteksi | Ya — tapi di-trigger bersamaan dengan post-activity |

### Settings schema update

```sql
ALTER TABLE user_settings
  ADD COLUMN notify_post_activity BOOLEAN DEFAULT TRUE,
  ADD COLUMN notify_friday_prep BOOLEAN DEFAULT TRUE;
  -- notify_weekly_review sudah ada di PRD
  -- notify_anomaly sudah ada di PRD
  -- notify_daily_log_reminder DIHAPUS — digantikan oleh friday_prep
```

---

## 11. Environment Variables

```
ANTHROPIC_API_KEY=      ← Claude API key
REDIS_URL=              ← Upstash Redis connection string
INNGEST_EVENT_KEY=      ← Inngest signing key
INNGEST_SIGNING_KEY=    ← Inngest webhook signing key
```

---

## 12. Cost Estimate (Revised)

| Job                   | Frekuensi/bulan         | Input token   | Output token | Biaya/bulan      |
| --------------------- | ----------------------- | ------------- | ------------ | ---------------- |
| Post-activity insight | ~20x                    | ~950          | ~500         | ~$0.18           |
| Weekly review         | 4x                      | ~2.000        | ~500         | ~$0.07           |
| Anomaly detector      | ~8x (kalau ada anomali) | ~600          | ~200         | ~$0.03           |
| On-demand             | ~10x                    | ~950          | ~500         | ~$0.09           |
| Daily insight         | ~22x                    | ~700          | ~400         | ~$0.09           |
| Friday prep           | 4x                      | 0 (no Claude) | 0            | $0               |
| **Total**             |                         |               |              | **~$0.46/bulan** |

Jauh lebih hemat dari estimasi PRD (~$1.82/bulan) karena plain text format yang lebih efisien.

---

_End of document. Version 1.0 — siap untuk implementation planning dan coding._
