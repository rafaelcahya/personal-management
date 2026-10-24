import { inngest } from '@/lib/inngest/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { DAY_MS, GARMIN_DEFAULT_SYNC_DAYS } from '@/lib/constants/garmin'
import { deriveGarminStatus } from '@/lib/services/running/garmin/connectionStatus'

const MAX_USERS = 500

export const garminDailySync = inngest.createFunction(
  {
    id: 'garmin-daily-sync',
    retries: 2,
    triggers: [{ cron: '0 3 * * *' }],
  },
  async ({ step }) => {
    const events = await step.run('collect-connected-users', async () => {
      const admin = createAdminClient()
      const { data, error } = await admin
        .from('rt_garmin_credentials')
        .select('user_id, status, key_expires_at')
        .eq('status', 'connected')
        .limit(MAX_USERS)
      if (error) throw new Error(`Failed to load Garmin users: ${error.message}`)

      const to = new Date().toISOString().slice(0, 10)
      const from = new Date(Date.now() - GARMIN_DEFAULT_SYNC_DAYS * DAY_MS)
        .toISOString()
        .slice(0, 10)

      return (data ?? [])
        .filter((row) => deriveGarminStatus(row) === 'connected')
        .map((row) => ({
          name: 'garmin/sync.requested',
          data: { userId: row.user_id, from, to, source: 'cron', lockHeld: false },
        }))
    })

    if (events.length > 0) await step.sendEvent('fan-out-garmin-sync', events)

    return { users: events.length }
  }
)
