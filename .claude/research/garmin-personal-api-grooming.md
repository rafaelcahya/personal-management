# Grooming: Garmin Connect Personal API

> Status: grooming (belum ada issue) · Tanggal: 2026-10-24
> Kategori yang sudah dibahas: **Aktivitas** · Berikutnya: Sleep / HRV / Recovery

## Ringkasan API

- Docs: https://developer.garmin.com/gc-developer-program/personal/swagger-docs/
- Base URL: `https://personal.connectapi.garmin.com`
- Auth: API key (dibuat di Garmin Connect Web, berlaku 30/90/180/365 hari) → tukar jadi access token:
  `POST /personalapitoken-service/personal-api/personal-api-key/token` dengan header `Authorization: ApiKey <key>`.
  Response berupa **JWT mentah (bukan JSON)**, berlaku 24 jam, tanpa refresh token.
- Panggil endpoint dengan `Authorization: Bearer <token>`.
- Read-only (semua GET), **tidak ada webhook**, rate limit tidak didokumentasikan.
- Key disimpan di `.env.local` sebagai `GARMIN_TOKEN`.

## Hasil tes dengan data asli (run 15K, 18 Okt 2026, Forerunner 165)

Data inti **identik** dengan Strava (jarak, durasi, HR, kalori, power, laps).
Strava hanya meneruskan data dari jam → Garmin **tidak lebih akurat, tapi jauh lebih detail**.

| Metrik tambahan dari Garmin                   | Contoh nilai            | Terisi?                 |
| --------------------------------------------- | ----------------------- | ----------------------- |
| Training Effect + label                       | 5.0 · LACTATE_THRESHOLD | ✅                      |
| Ground contact time                           | 255 ms                  | ✅                      |
| Vertical oscillation / ratio                  | 8,1 cm / 8,15%          | ✅                      |
| Stride length                                 | 99,6 cm                 | ✅                      |
| Grade-adjusted speed                          | 2,88 m/s                | ✅                      |
| RPE + Feel dari jam                           | 8/10 · feel 100         | ✅ (di Strava kosong)   |
| Body Battery selama run                       | −21                     | ✅                      |
| Estimasi keringat                             | 1.451 ml                | ✅                      |
| Training load, recovery HR, lactate threshold | —                       | ❌ tidak didukung FR165 |

- `splitSummaries` = ringkasan run/walk, **bukan split per km**.
- Download FIT (`/download-service/files/activity/{id}`) berhasil → zip berisi `.fit` (data per detik, laps, running dynamics).

## Keputusan sementara

1. **Strava tidak diganti, tapi diperkaya oleh Garmin.** Mengganti total berarti parse FIT sendiri
   (streams, splits, best efforts, peta) dan kehilangan webhook + gear.
2. **Gabung jadi 1 endpoint lewat DB, bukan call live:**
   - Strava webhook → Inngest ambil detail Garmin yang cocok (start time ±60 dtk + jarak ±2%).
   - Simpan `garmin_activity_id` di `rt_activities` + metrik di tabel pendamping (mis. `rt_activity_garmin_metrics`).
   - `GET /api/running/activities/:id` mengembalikan data gabungan.
   - Aturan merge: Garmin untuk fisiologi & running dynamics; Strava untuk peta, streams, best efforts, gear, sosial.

## Kandidat fitur — Aktivitas

| #   | Fitur                          | Isi                                                                            | Catatan                                                |
| --- | ------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------ |
| 1   | Running Form card              | GCT, vertical oscillation/ratio, stride length, cadence + grafik tren mingguan | Di detail aktivitas + halaman analytics                |
| 2   | Training Effect badge          | Label Tempo / Threshold / Base / dll. di list & detail aktivitas               | Bisa jadi filter juga                                  |
| 3   | RPE & Feel otomatis            | Isi `perceived_exertion` dari jam                                              | Kolom ini sekarang kosong semua                        |
| 4   | Hidrasi & Body Battery cost    | Keringat (ml) dan penurunan Body Battery per run                               | Bisa jadi saran hidrasi                                |
| 5   | Garmin sebagai fallback import | Cron harian: aktivitas yang ada di Garmin tapi tidak ada di DB → import        | Lihat bug di bawah                                     |
| 6   | AI coach lebih tajam           | Post-activity insight & daily insight pakai metrik di atas                     | `lib/inngest/functions/generatePostActivityInsight.js` |
| 7   | (Nanti) Parse FIT              | Stream running dynamics per detik                                              | Fase lanjutan, effort besar                            |

## Bug yang ditemukan saat grooming

- Run **23 Okt 2026 17:49 (5K, Garmin id 24824113687)** ada di Garmin tapi **tidak ada di `rt_activities`**.
  Perlu dicek: belum masuk Strava, atau webhook/gap-heal kita melewatkannya.

## Yang masih perlu dicek

- Rate limit Garmin & syarat pemakaian (lihat saat buat key).
- Cara simpan API key: encrypted di DB per user (UI di User Settings) vs env var.
- Reminder sebelum key expired (maks 1 tahun).

## Kategori berikutnya

- [ ] Sleep / HRV / Body Battery / Stress (recovery & readiness)
- [ ] Wellness harian (steps, daily HR, SpO2, hidrasi)
- [ ] Weight & Fitness Age (overlap dengan `rt_weight_logs`)
