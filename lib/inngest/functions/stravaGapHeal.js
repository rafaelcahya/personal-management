import { inngest } from '@/lib/inngest/client'
import { createAdminClient } from '@/lib/supabase/admin'

const GAP_CAP_PER_USER = 50

export const stravaGapHeal = inngest.createFunction(
  {
    id: 'strava-gap-heal',
    retries: 3,
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
        .limit(500)
      if (error) throw new Error(`Failed to fetch connected users: ${error.message}`)
      return (data ?? []).map((r) => r.user_id)
    })

    if (users.length === 0) return { healed: 0, users: 0 }

    // Step 2: For each user, find activities with enriched_at IS NULL older than 1 hour.
    // cutoff is computed inside the step so it is memoised on Inngest replay.
    const events = await step.run('collect-gap-activities', async () => {
      const supabase = createAdminClient()
      const cutoff = new Date(Date.now() - 60 * 60 * 1000).toISOString()
      const allEvents = []

      for (const userId of users) {
        const { data } = await supabase
          .from('rt_activities')
          .select('id, external_id')
          .eq('user_id', userId)
          .eq('source', 'strava')
          .is('enriched_at', null)
          .lt('created_at', cutoff)
          .order('created_at', { ascending: true })
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
