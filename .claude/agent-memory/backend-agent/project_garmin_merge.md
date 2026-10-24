---
name: garmin-strava-merge-gotchas
description: Garmin/Strava merge (#922) design gotchas: RPE clobber fix in fetch-streams, credentials column grants, and the single event flow into garmin-sync
metadata:
  type: project
---

`stravaFetchStreams.mapActivityToRow` only writes `perceived_exertion` when Strava sends a value. It used to write null on every re-enrich, which wiped the user's RPE and any Garmin-filled RPE.

`rt_garmin_credentials` uses column-level grants. The session client can read only the safe columns (`key_last4`, expiry, status, `last_error`, `last_synced_at`). The encrypted key and token are read and written only through the admin client.

Strava webhook, backfill and gap-heal all go through `strava/fetch-streams`. Its last step sends `garmin/link-activity` (recent runs only, only when Garmin is connected). One `garmin-sync` function handles that event and `garmin/sync.requested`, with concurrency limit 1 per user. The daily cron only fans out `garmin/sync.requested` events.

**Why:** these are not obvious from the code, and they affect any future change to Strava enrichment or Garmin sync.

**How to apply:** before touching `mapActivityToRow`, the credentials table or the sync functions, check these rules first.
