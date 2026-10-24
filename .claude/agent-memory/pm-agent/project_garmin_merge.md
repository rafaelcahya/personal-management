---
name: project-garmin-merge
description: Running section 26 Garmin Integration (#922) decisions: Strava stays primary, Garmin enriches, merge in DB
metadata:
  type: project
---

2026-10-24: Running section 26 (Garmin Integration, #922), PRD v3.8. Keep Strava and enrich with Garmin. Merge happens in our DB, never live. API contract lives in Postman folder "Running > Garmin merge (#922, planned)", not Swagger.

**Why:** Garmin gives more detail, not more accuracy, and replacing Strava would mean parsing FIT ourselves.

**How to apply:** Sleep/HRV/wellness, FIT parsing, Running Form trend chart, Training Effect filter, AI coach using Garmin metrics, and key-expiry push notifications are all out of scope. Do not re-open them under #922. Garmin-sourced runs count as normal runs and get upgraded to Strava by the webhook (no duplicates).
