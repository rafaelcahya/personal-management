import { inngest } from '@/lib/inngest/client'
import { createAdminClient } from '@/lib/supabase/admin'

const GAP_CAP_PER_USER = 50

export const stravaGapHeal = inngest.createFunction(
  {
    id: 'strava-gap-heal',
    triggers: [{ cron: '0 2 * * *' }],
  },
  async ({ step }) => {
    // Step 1: Get all users with an active Strava connection
    const users = await step.run('get-connected-users', async () => {
      const supabase = createAdminClient()
      const { data, error } = await supabase
        .from('rt_strava_credentials')
        .select('user_id')
        .eq('needs_reconnect', false)
      if (error) throw new Error(`Failed to fetch connected users: ${error.message}`)
      return (data ?? []).map((r) => r.user_id)
    })

    if (users.length === 0) return

    // Step 2: For each user, find activities with enriched_at IS NULL older than 1 hour
    const cutoff = new Date(Date.now() - 60 * 60 * 1000).toISOString()

    const events = await step.run('collect-gap-activities', async () => {
      const supabase = createAdminClient()
      const allEvents = []

      for (const userId of users) {
        const { data } = await supabase
          .from('rt_activities')
          .select('id, external_id')
          .eq('user_id', userId)
          .eq('source', 'strava')
          .is('enriched_at', null)
          .lt('created_at', cutoff)
          .limit(GAP_CAP_PER_USER)

        for (const row of data ?? []) {
          allEvents.push({
            name: 'strava/fetch-streams',
            data: { activityId: row.id, userId, stravaActivityId: row.external_id },
          })
        }
      }

      return allEvents
    })

    if (events.length > 0) {
      await step.sendEvent('heal-gap-streams', events)
    }

    return { healed: events.length, users: users.length }
  }
)
