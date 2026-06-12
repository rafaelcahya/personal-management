import { inngest } from '@/lib/inngest/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { refreshStravaToken } from '@/lib/services/running/strava/refreshStravaToken'

const STRAVA_ACTIVITIES_URL = 'https://www.strava.com/api/v3/athlete/activities'
const PER_PAGE = 200
const PAGE_DELAY_MS = 200
const GAP_HEAL_CAP = 50

export const stravaBackfill = inngest.createFunction(
  { id: 'strava-backfill', retries: 3, triggers: [{ event: 'strava/backfill' }] },
  async ({ event, step }) => {
    const { userId } = event.data

    const credentials = await step.run('get-credentials', async () => {
      const supabase = createAdminClient()
      const { data, error } = await supabase
        .from('rt_strava_credentials')
        .select('access_token, refresh_token, expires_at, needs_reconnect')
        .eq('user_id', userId)
        .single()

      if (error || !data) throw new Error('Strava credentials not found')

      return data
    })

    if (credentials.needs_reconnect) {
      console.warn(`[stravaBackfill] user ${userId} needs reconnect — skipping`)
      return
    }

    const tokenResult = await step.run('refresh-token-if-needed', async () => {
      return refreshStravaToken(userId, credentials)
    })

    if (tokenResult.skipped || tokenResult.needsReconnect) {
      console.warn(`[stravaBackfill] token refresh skipped for user ${userId}`)
      return
    }

    const accessToken = tokenResult.accessToken

    const insertedRows = await step.run('paginate-and-insert', async () => {
      const supabase = createAdminClient()
      const rows = []
      let page = 1

      while (true) {
        const res = await fetch(`${STRAVA_ACTIVITIES_URL}?per_page=${PER_PAGE}&page=${page}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })

        if (!res.ok) throw new Error(`Strava API error: ${res.status}`)

        const activities = await res.json()
        if (!Array.isArray(activities) || activities.length === 0) break

        const stravaIds = activities.map((a) => String(a.id))

        const { data: existing } = await supabase
          .from('rt_activities')
          .select('external_id')
          .eq('user_id', userId)
          .eq('source', 'strava')
          .in('external_id', stravaIds)

        const existingIds = new Set((existing || []).map((r) => r.external_id))
        const toInsert = activities.filter((a) => !existingIds.has(String(a.id)))

        if (toInsert.length > 0) {
          const insertRows = toInsert.map((a) => ({
            user_id: userId,
            source: 'strava',
            external_id: String(a.id),
            started_at: a.start_date,
            duration_sec: a.elapsed_time,
            moving_time_sec: a.moving_time,
            distance_m: a.distance,
            raw_data: a,
          }))

          const { data: inserted, error: insertError } = await supabase
            .from('rt_activities')
            .insert(insertRows)
            .select('id, external_id')

          if (insertError) throw new Error(`Insert failed: ${insertError.message}`)

          rows.push(...(inserted || []))
        }

        page++
        await new Promise((resolve) => setTimeout(resolve, PAGE_DELAY_MS))
      }

      return rows
    })

    // Also re-fire enrichment for existing activities that never completed successfully
    const gapRows = await step.run('find-gap-activities', async () => {
      const supabase = createAdminClient()
      const cutoff = new Date(Date.now() - 60 * 60 * 1000).toISOString()
      const { data } = await supabase
        .from('rt_activities')
        .select('id, external_id')
        .eq('user_id', userId)
        .eq('source', 'strava')
        .is('enriched_at', null)
        .lt('created_at', cutoff)
        .limit(GAP_HEAL_CAP)
      return data ?? []
    })

    const newIds = new Set(insertedRows.map((r) => r.id))
    const gapOnly = gapRows.filter((r) => !newIds.has(r.id))
    const allToEnrich = [...insertedRows, ...gapOnly]

    if (allToEnrich.length > 0) {
      const events = allToEnrich.map((row) => ({
        name: 'strava/fetch-streams',
        data: { activityId: row.id, userId, stravaActivityId: row.external_id },
      }))
      await step.sendEvent('fan-out-streams', events)
    }

    await step.run('update-sync-time', async () => {
      const supabase = createAdminClient()
      const { error } = await supabase
        .from('rt_strava_credentials')
        .update({ last_sync_at: new Date().toISOString() })
        .eq('user_id', userId)

      if (error) throw new Error('Failed to update last_sync_at')
    })

    await step.run('subscribe-webhook', async () => {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL
      if (!appUrl) throw new Error('NEXT_PUBLIC_APP_URL not set — cannot register Strava webhook')

      // Strava webhook subscription is app-wide, check if already exists
      const checkRes = await fetch(
        `https://www.strava.com/api/v3/push_subscriptions?client_id=${process.env.STRAVA_CLIENT_ID}&client_secret=${process.env.STRAVA_CLIENT_SECRET}`
      )
      if (checkRes.ok) {
        const existing = await checkRes.json()
        if (Array.isArray(existing) && existing.length > 0) return
      }

      const res = await fetch('https://www.strava.com/api/v3/push_subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: process.env.STRAVA_CLIENT_ID,
          client_secret: process.env.STRAVA_CLIENT_SECRET,
          callback_url: `${appUrl}/api/running/v1/sync/webhook`,
          verify_token: process.env.STRAVA_WEBHOOK_VERIFY_SECRET,
        }),
      })

      if (!res.ok) {
        const body = await res.text()
        throw new Error(`Webhook subscribe failed: ${res.status} ${body}`)
      }
    })
  }
)
