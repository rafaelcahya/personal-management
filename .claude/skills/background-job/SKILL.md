---
name: background-job
description: Create or change Inngest background jobs in this repo — the shared client, function file layout, event and cron triggers, step.run boundaries, retries, admin client use, registering in the serve route, and firing events from routes. Use for slow or scheduled work (AI generation, Strava sync, notifications).
---

# Background Jobs (Inngest)

## Where things live

| Piece       | Location                                                                                           |
| ----------- | -------------------------------------------------------------------------------------------------- |
| Client      | `lib/inngest/client.js` → `export const inngest = new Inngest({ id: 'personal-management', ... })` |
| Functions   | `lib/inngest/functions/{camelCaseName}.js` — one function per file                                 |
| Serve route | `app/api/inngest/route.js` — **every new function must be added to the `functions` array here**    |

## When to use a job

- Work that's slow (AI generation, Strava backfill or stream fetch), can fail and retry, or runs on a schedule.
- The route sends an event and returns right away (202 or a "queued" response). Don't make the user wait on Claude or Strava inside a request.

## Function pattern

```js
import { inngest } from '@/lib/inngest/client'
import { createAdminClient } from '@/lib/supabase/admin'

export const generatePostActivityInsight = inngest.createFunction(
  {
    id: 'generate-post-activity-insight',
    retries: 2,
    triggers: [{ event: 'ai/generate-post-activity-insight' }],
  },
  async ({ event, step }) => {
    const { activityId, userId } = event.data

    const isDuplicate = await step.run('check-duplicate', async () => {
      const supabase = createAdminClient()
      const { data } = await supabase
        .from('rt_ai_insights')
        .select('id')
        .eq('user_id', userId)
        .eq('activity_id', activityId)
        .maybeSingle()
      return !!data
    })
    if (isDuplicate) return { skipped: true, reason: 'duplicate' }

    // ...more step.run() blocks...
    return { done: true }
  }
)
```

Scheduled job: `triggers: [{ cron: '0 8 * * *' }]` (see `raceReminderNotification.js`).

## Rules

- **Function id**: kebab-case, unique, stable — renaming it creates a new function in Inngest.
- **Event names**: `{area}/{action}` — `strava/backfill`, `ai/generate-post-activity-insight`.
- **Wrap every side effect in `step.run('step-name', ...)`** — DB reads, API calls, writes. Steps are retried and memoized one by one; code outside a step re-runs on every retry.
- Step return values must be JSON-serializable (no Dates, class instances, or Supabase clients). Create the admin client **inside** each step.
- Jobs have no user session, so they use `createAdminClient()` — and therefore **must filter every query by `userId`** from `event.data`.
- Make jobs idempotent: check for an existing result first (as above), and use upserts.
- Return a small summary object (`{ skipped: true, reason }`, `{ done: true, count }`) — it shows in the Inngest dashboard.
- `retries: 2` is the project default.

## Firing an event from a route

```js
import { inngest } from '@/lib/inngest/client'

await inngest.send({ name: 'strava/backfill', data: { userId: user.id } })
```

Only send IDs and small values in `data` — the job loads the rest itself.
