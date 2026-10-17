## 4. Onboarding Flow

New users who log in for the first time need to go through a short setup before they can use the app. Without this, the AI Coach has no biometric data and cannot give accurate recommendations.

```
Login via Google OAuth (Supabase)
        ↓
Middleware checks: does the user already exist in the users table?
        ↓ no
Create new row in users + user_settings (with default values)
        ↓
Redirect to /onboarding
        ↓
Step 1 — Biometric setup (required)
  - Max heart rate (manual input or formula 220 - age)
  - Resting heart rate baseline
  - Height + current weight
  - Birth date (for age-based max HR calculation)
        ↓
Step 2 — Connect Strava (required for automatic data, can skip for manual-only)
  - "Connect Strava" button → triggers OAuth flow
  - Or "Skip for now, I'll add manually"
        ↓
Step 3 — Set first goal (optional, can skip)
  - Upcoming race? Target distance + date
  - Or "No race planned yet"
        ↓
Redirect to /dashboard
  - If Strava connected → show backfill progress
  - If Strava skipped → show empty state with manual entry CTA
```

**When onboarding is considered complete:**

- Biometric step done → flag `onboarding_complete = true` in `users` table
- Strava and goal are optional and do not block access to the dashboard

Add column to schema:

```sql
ALTER TABLE users ADD COLUMN onboarding_complete BOOLEAN DEFAULT FALSE;
```

---
