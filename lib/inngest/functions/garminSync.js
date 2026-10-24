import { RetryAfterError } from 'inngest'
import { inngest } from '@/lib/inngest/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { GarminError, createGarminSession } from '@/lib/services/running/garmin/garminClient'
import { listGarminRuns } from '@/lib/services/running/garmin/listGarminRuns'
import { syncGarminActivity } from '@/lib/services/running/garmin/syncGarminActivity'
import { linkGarminActivityById } from '@/lib/services/running/garmin/linkGarminActivityById'
import { releaseGarminSyncLock } from '@/lib/services/running/garmin/garminSyncLock'
import { invalidateRunningAnalytics } from '@/lib/services/running/analyticsCache'

const SKIP_KINDS = ['not_connected', 'expired', 'invalid']
const DEFAULT_RETRY_AFTER_SEC = 60

/**
 * Runs one Garmin step. Users without a working key are skipped, not failed, and a 429
 * becomes an Inngest retry that waits as long as Garmin asked.
 */
async function runGarmin(userId, fn) {
  const admin = createAdminClient()
  try {
    const session = await createGarminSession(admin, userId)
    return await fn(session, admin)
  } catch (err) {
    if (err instanceof GarminError) {
      if (SKIP_KINDS.includes(err.kind)) return { skipped: err.kind }
      if (err.kind === 'rate_limited') {
        throw new RetryAfterError(
          'Garmin rate limited',
          (err.retryAfterSec ?? DEFAULT_RETRY_AFTER_SEC) * 1000
        )
      }
    }
    throw err
  }
}

async function linkOne(step, userId, activityId) {
  const result = await step.run('link-activity', () =>
    runGarmin(userId, (session, admin) =>
      linkGarminActivityById(session, admin, userId, activityId)
    )
  )
  if (result?.rpeFilled) {
    await step.run('invalidate-analytics-cache', () => invalidateRunningAnalytics(userId))
  }
  return result
}

async function syncRange(step, { userId, from, to, lockHeld }) {
  const listed = await step.run('list-garmin-runs', () =>
    runGarmin(userId, async (session) => ({ runs: await listGarminRuns(session, { from, to }) }))
  )

  const totals = { linked: 0, imported: 0, skipped: 0, failed: 0 }

  if (!listed.skipped) {
    for (const garmin of listed.runs) {
      const outcome = await step.run(`sync-${garmin.activityId}`, async () => {
        try {
          return await runGarmin(userId, (session, admin) =>
            syncGarminActivity(session, admin, userId, garmin)
          )
        } catch (err) {
          if (err instanceof GarminError || err instanceof RetryAfterError) throw err
          // One bad run should not stop the rest of the range
          console.error(`[garminSync] run ${garmin.activityId} failed`, err.message)
          return 'failed'
        }
      })
      const key = typeof outcome === 'string' ? outcome : 'skipped'
      totals[key] += 1
    }
  }

  await step.run('finish', async () => {
    const admin = createAdminClient()
    if (!listed.skipped) {
      const { error } = await admin
        .from('rt_garmin_credentials')
        .update({ last_synced_at: new Date().toISOString() })
        .eq('user_id', userId)
      if (error) throw new Error(`Failed to save Garmin last sync time: ${error.message}`)
    }
    if (totals.linked + totals.imported > 0) invalidateRunningAnalytics(userId)
    if (lockHeld) await releaseGarminSyncLock(userId)
  })

  return listed.skipped ? { skipped: listed.skipped } : totals
}

export const garminSync = inngest.createFunction(
  {
    id: 'garmin-sync',
    retries: 3,
    // One Garmin request at a time per user, across link and range work
    concurrency: { limit: 1, key: 'event.data.userId' },
    triggers: [{ event: 'garmin/link-activity' }, { event: 'garmin/sync.requested' }],
    onFailure: async ({ event }) => {
      const original = event.data.event?.data
      if (original?.lockHeld) await releaseGarminSyncLock(original.userId)
    },
  },
  async ({ event, step }) => {
    if (event.name === 'garmin/link-activity') {
      return linkOne(step, event.data.userId, event.data.activityId)
    }
    return syncRange(step, event.data)
  }
)
