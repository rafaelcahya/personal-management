## 3. Integration with Personal Management

### 3.1 Auth sharing

Running Tracker and Personal Management use the **same** Supabase project. This means:

```
User login via Google OAuth
        ↓
Supabase (shared project) issue session
        ↓
Session cookie valid in both Personal Management AND Running Tracker
```

**Required in Running Tracker:**

- `NEXT_PUBLIC_SUPABASE_URL` — same as Personal Management
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — same as Personal Management
- Supabase `@supabase/ssr` package for session management

**What does NOT need to be done:**

- No modifications to the Personal Management codebase
- No new endpoints in Personal Management
- No user data sync between the two systems

### 3.2 User ID

The user ID in Supabase is a UUID. All tables in the Running Tracker DB use `user_id UUID` as a foreign key referencing `auth.users.id` in Supabase.

---

## 7. Features & Scope per Phase

### 6.1 Phase 1 — MVP (target 6–7 weeks)

**Required modules:**

| Module          | Description                                                     |
| --------------- | --------------------------------------------------------------- |
| Auth & setup    | Supabase shared auth + Strava connect flow                      |
| Strava sync     | OAuth, webhook, backfill, polling fallback, rate limit handling |
| File upload     | GPX/FIT parser, dedup logic, batch upload                       |
| Manual entry    | Workout form + daily health log (mood, sleep, energy, weight)   |
| Dashboard       | Weekly summary + training load indicator + recent activities    |
| Activity detail | Chart pace, HR, elevation, splits table, map, HR zones          |
| Activity list   | Filter by date/type, search                                     |
| Analytics       | Trend charts, training load (ACWR), race predictor, PR tracking |
| AI Coach        | Chat + 5 modes + 8 tools + insight generation                   |

**Not in Phase 1:**

- Garmin integration
- HRV/sleep auto-sync
- Correlation view (requires more than 1 month of data)
- Composite readiness score

### 6.2 Phase 2 — Health integration (4–6 weeks after MVP)

| Module             | Description                                                         |
| ------------------ | ------------------------------------------------------------------- |
| Garmin integration | Official API (if approved) or unofficial library                    |
| Health metrics     | Sleep stages, HRV, RHR, steps, body battery, stress, SpO2           |
| Health dashboard   | Daily health card + mini trends                                     |
| Correlation view   | 2-metric interactive overlay (3-month rolling)                      |
| Readiness score    | Daily composite score (sleep + HRV + training load)                 |
| AI Coach advanced  | Cross-metric reasoning, anomaly detection, readiness-based planning |

### 6.3 Phase 3 — Future (TBD)

- Hydration tracking + reminder
- Nutrition logging
- Race calendar integration
- PDF weekly report export
- Voice AI Coach
- Weather-adjusted analysis

---

## 19. Development Phases & Timeline

### Phase 1 — MVP

| #   | Phase                       | Scope                                                                                                                 | Estimate     |
| --- | --------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------ |
| 1   | **Setup**                   | Scaffold Next.js, Supabase auth (shared), Drizzle + DB schema, Vercel deploy, Inngest setup, env vars                 | 1 week       |
| 2   | **Onboarding**              | Onboarding wizard (biometric + Strava connect + goal), `/api/user/profile`, `/api/user/settings`, middleware redirect | 0.5 weeks    |
| 3   | **Strava ingestion**        | OAuth flow, webhook (GET verify + POST handler), backfill via Inngest, polling fallback, rate limit, token encryption | 1.5 weeks    |
| 4   | **Upload & manual entry**   | GPX/FIT parser, dedup logic, manual workout form, daily health log                                                    | 1 week       |
| 5   | **Dashboard & activity UI** | Dashboard, activity list, activity detail + map + charts, streams downsampling                                        | 1.5 weeks    |
| 6   | **Analytics**               | Trend charts, training load (ACWR), race predictor, PR tracking, VO2max estimation                                    | 1 week       |
| 7   | **AI Insight Engine**       | Post-activity insight, weekly review, anomaly detector, on-demand analysis                                            | 1 week       |
| 8   | **PWA + push notification** | Service worker, VAPID setup, push subscription flow, notification triggers                                            | 0.5 weeks    |
|     | **— MVP shipped —**         |                                                                                                                       | **~7 weeks** |

### Phase 2 — Health integration

| #   | Phase                  | Scope                                                                   | Estimate              |
| --- | ---------------------- | ----------------------------------------------------------------------- | --------------------- |
| 9   | **Garmin integration** | Strategy TBD (official API / unofficial), credentials, sync job         | 2 weeks               |
| 10  | **Health UI**          | Health tabs, daily health card, mini trends per metric                  | 1.5 weeks             |
| 11  | **Advanced analytics** | Correlation view (2-metric overlay), readiness score composite          | 1.5 weeks             |
| 12  | **AI Coach advanced**  | Cross-metric reasoning, HRV/RHR-based anomaly detection, readiness mode | 1.5 weeks             |
| 13  | **Chat Coach**         | Live chat interface, conversation history, tool use, streaming SSE      | 1.5 weeks             |
|     | **— Full platform —**  |                                                                         | **~15.5 weeks total** |

### Sequencing notes

- Phase 1 #2 (Onboarding) **must complete before** #3 (Strava ingestion) — backfill requires the user to have a row in the DB first
- Phase 1 #3 (Strava ingestion) **must complete before** #5 (Dashboard) — no data means no UI to test
- Phase 1 #8 (PWA) can run in parallel with #7 (AI Coach) to move faster
- Phase 2 can start after MVP has been stable for at least 4 weeks of real usage

---

## 20. Risks

| Risk                                       | Likelihood | Impact | Mitigation                                                                      |
| ------------------------------------------ | ---------- | ------ | ------------------------------------------------------------------------------- |
| Strava rate limit hit during backfill      | Medium     | Low    | Throttle to 80 req/15 min, queue via Inngest                                    |
| Webhook missed events                      | Medium     | Low    | Polling fallback every 1 hour                                                   |
| Inngest free tier limit exceeded           | Low        | Low    | 50k events/month is sufficient for a personal app. Monitor in Inngest dashboard |
| Garmin Phase 2 more complex than estimated | Medium     | Medium | Schema already prepared, can fall back to unofficial library                    |
| AI cost overrun                            | Medium     | Medium | Monitor token usage, cache context                                              |
| Data loss                                  | Low        | High   | Daily encrypted backup                                                          |
| Strava policy change                       | Low        | Medium | Raw data stored in `activities.raw_data`, can be re-processed                   |

---
