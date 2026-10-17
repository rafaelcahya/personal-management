# Product Requirements Document (PRD)

<!-- files:start -->

**This module is split into one file per feature.** Read only the file your task needs.

| File                                                       | Covers                                                 | Size  |
| ---------------------------------------------------------- | ------------------------------------------------------ | ----- |
| [activity-detail.md](./activity-detail.md)                 | 11.3 Activity detail page                              | 7 KB  |
| [ai-insights.md](./ai-insights.md)                         | 10. AI Insight Engine                                  | 14 KB |
| [ai-recommendation-cards.md](./ai-recommendation-cards.md) | 11.5 AI Recommendation Cards                           | 1 KB  |
| [analytics.md](./analytics.md)                             | 11.2 Analytics page                                    | 8 KB  |
| [api-endpoints.md](./api-endpoints.md)                     | 9. API Endpoints                                       | 13 KB |
| [architecture-decisions.md](./architecture-decisions.md)   | 21. Architectural Decisions (final)                    | 8 KB  |
| [background-workers.md](./background-workers.md)           | 15. Background Workers                                 | 5 KB  |
| [dashboard.md](./dashboard.md)                             | 11. Dashboard & Statistics                             | 2 KB  |
| [database-schema.md](./database-schema.md)                 | 8. Database Schema                                     | 9 KB  |
| [derived-metrics.md](./derived-metrics.md)                 | 11.4 Derived Metrics                                   | 4 KB  |
| [encryption.md](./encryption.md)                           | 17. Encryption Strategy                                | 3 KB  |
| [gear.md](./gear.md)                                       | 12. Gear Management (Shoe Rotation)                    | 10 KB |
| [injury-coach.md](./injury-coach.md)                       | 10.11 Injury & Sports Medicine AI Coach                | 14 KB |
| [metrics-formulas.md](./metrics-formulas.md)               | 14. Computed Metrics Formulas                          | 1 KB  |
| [nfr.md](./nfr.md)                                         | 18. Non-functional Requirements                        | 1 KB  |
| [onboarding.md](./onboarding.md)                           | 4. Onboarding Flow                                     | 1 KB  |
| [overview-scope.md](./overview-scope.md)                   | 3. Integration with Personal Management                | 8 KB  |
| [pace-calculator.md](./pace-calculator.md)                 | 11.6 Pace Calculator page                              | 4 KB  |
| [push-notifications.md](./push-notifications.md)           | 16. Push Notification (PWA)                            | 4 KB  |
| [race-log.md](./race-log.md)                               | 13. Race Log                                           | 27 KB |
| [racing-weight.md](./racing-weight.md)                     | 22. Racing Weight                                      | 8 KB  |
| [route-builder.md](./route-builder.md)                     | 23. Route Builder                                      | 17 KB |
| [route-simulator.md](./route-simulator.md)                 | 24. Route Pacing Simulator                             | 18 KB |
| [settings.md](./settings.md)                               | 11.7 Running Settings page                             | 8 KB  |
| [strava.md](./strava.md)                                   | 5. Strava OAuth Flow                                   | 15 KB |
| [tech-stack.md](./tech-stack.md)                           | 6. Tech Stack                                          | 3 KB  |
| [version-history.md](./version-history.md)                 | Version history (read only when you need past changes) | 1 KB  |
| [zone-analytics.md](./zone-analytics.md)                   | 11.2a Zone Analytics — DONE                            | 5 KB  |

<!-- files:end -->

## Personal Running & Health Performance Platform

**Version:** 3.5
**Last Updated:** 2026-10-17
**Owner:** Rafael Cahya
**Stack:** Next.js 15 App Router · JavaScript/JSX · Supabase (shared auth) · PostgreSQL · Tailwind CSS · Base Components · Claude AI (Sonnet 4.6) · Strava API

---

## Product Release Plan

> PRD version = document revision (tracks requirement changes).
> Product release version = what ships to production (GitHub milestone).

| Release  | Status  | GitHub Milestone                                                       | PRD Coverage                                                                                                  | Issues      |
| -------- | ------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------- |
| **v1.0** | Shipped | —                                                                      | RT PRD v1.0–v2.6 (all features to date: Dashboard, Activities, Race Log, Training Load, Sidebar)              | —           |
| **v1.1** | Planned | [v1.1](https://github.com/rafaelcahya/personal-management/milestone/2) | §10 Analytics (10.2 page, 10.4 VO2max), §10.4 Efficiency Factor, §11 AI Coach                                 | #4 #5 #6 #7 |
| **v1.2** | Planned | [v1.2](https://github.com/rafaelcahya/personal-management/milestone/3) | TBD                                                                                                           | —           |
| **v1.7** | Planned | [v1.7](https://github.com/rafaelcahya/personal-management/milestone/8) | §10.11 Injury & Sports Medicine AI Coach: Physio + Sports Medicine personas, InjuryCoachCard, rt_symptom_logs | #160        |

---

## 1. Overview

Running Tracker is a personal web app for monitoring running performance. It is not a social app and not a Strava replacement — it is a **personal analytics layer** on top of existing Strava data, paired with an AI Coach powered by Claude that has access to your full workout history.

**Two things you cannot get from Strava or Garmin Connect:**

- An AI Coach that genuinely understands your training history and can reason from your specific data
- Custom cross-metric analytics tailored to your needs (not generic summaries)

**Relationship with Personal Management:**

- Separate application (own repo), but uses the **same Supabase project** for auth
- User logs in once via Google OAuth in Supabase → session is valid in both apps
- No changes required in the Personal Management codebase

---

## 2. Users & Access

| Role               | Access                      |
| ------------------ | --------------------------- |
| Authenticated User | Full access to all features |
| Unauthenticated    | Redirect to login           |

- Auth via Supabase (Google OAuth only) — shared with Personal Management
- Strava OAuth is separate, used only for data sync (not identity)
- Single-user app — no multi-user, no social features

---
