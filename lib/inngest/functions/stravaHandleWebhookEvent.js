import { inngest } from '@/lib/inngest/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { refreshStravaToken } from '@/lib/services/running/strava/refreshStravaToken'

const STRAVA_ACTIVITY_URL = 'https://www.strava.com/api/v3/activities'

export const stravaHandleWebhookEvent = inngest.createFunction(
  {
    id: 'strava-handle-webhook-event',
    retries: 3,
    triggers: [{ event: 'strava/handle-webhook-event' }],
  },
  async ({ event, step }) => {
    const { aspect_type, object_type, object_id, owner_id } = event.data

    if (object_type !== 'activity') return

    if (aspect_type === 'delete') {
      await step.run('delete-activity', async () => {
        const supabase = createAdminClient()
        const { data: creds } = await supabase
          .from('rt_strava_credentials')
          .select('user_id')
          .eq('athlete_id', owner_id)
          .single()

        if (!creds) return

        await supabase
          .from('rt_activities')
          .delete()
          .eq('user_id', creds.user_id)
          .eq('source', 'strava')
          .eq('external_id', String(object_id))
      })
      return
    }

    const { userId, credentials } = await step.run('get-credentials', async () => {
      const supabase = createAdminClient()
      const { data, error } = await supabase
        .from('rt_strava_credentials')
        .select('user_id, access_token, refresh_token, expires_at, needs_reconnect')
        .eq('athlete_id', owner_id)
        .single()

      if (error || !data) throw new Error(`No credentials for athlete ${owner_id}`)

      return { userId: data.user_id, credentials: data }
    })

    if (credentials.needs_reconnect) {
      console.warn(`[stravaHandleWebhookEvent] user ${userId} needs reconnect — skipping`)
      return
    }

    const tokenResult = await step.run('refresh-token-if-needed', async () => {
      return refreshStravaToken(userId, credentials)
    })

    if (tokenResult.skipped || tokenResult.needsReconnect) {
      console.warn(`[stravaHandleWebhookEvent] token refresh skipped for user ${userId}`)
      return
    }

    const accessToken = tokenResult.accessToken

    const activity = await step.run('fetch-activity', async () => {
      const res = await fetch(`${STRAVA_ACTIVITY_URL}/${object_id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!res.ok) throw new Error(`Strava fetch failed: ${res.status}`)
      return res.json()
    })

    const row = await step.run('upsert-activity', async () => {
      const supabase = createAdminClient()

      const { data: existing } = await supabase
        .from('rt_activities')
        .select('id')
        .eq('user_id', userId)
        .eq('source', 'strava')
        .eq('external_id', String(object_id))
        .maybeSingle()

      const payload = {
        user_id: userId,
        source: 'strava',
        external_id: String(activity.id),
        started_at: activity.start_date,
        duration_sec: activity.elapsed_time,
        moving_time_sec: activity.moving_time,
        distance_m: activity.distance,
        raw_data: activity,
      }

      if (existing) {
        const { data, error } = await supabase
          .from('rt_activities')
          .update(payload)
          .eq('id', existing.id)
          .select('id')
          .single()
        if (error) throw new Error(`Update failed: ${error.message}`)
        return data
      }

      const { data, error } = await supabase
        .from('rt_activities')
        .insert(payload)
        .select('id')
        .single()
      if (error) throw new Error(`Insert failed: ${error.message}`)
      return data
    })

    if (row && (aspect_type === 'create' || aspect_type === 'update')) {
      await step.sendEvent('fetch-streams', {
        name: 'strava/fetch-streams',
        data: { activityId: row.id, userId, stravaActivityId: String(object_id) },
      })
    }
  }
)
