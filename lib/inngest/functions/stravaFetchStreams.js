import { inngest } from '@/lib/inngest/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { decrypt, encrypt } from '@/lib/utils/running/encrypt'
import { computeAndSaveDerivedMetrics } from '@/lib/services/running/metrics'

const STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token'
const STRAVA_ACTIVITY_URL = 'https://www.strava.com/api/v3/activities'
const TOKEN_EXPIRY_BUFFER_SEC = 300
const STREAM_BATCH_SIZE = 500

// ─── mapping helpers ──────────────────────────────────────────────────────────

function mapActivityToRow(a) {
  const movingSec = a.moving_time ?? 0
  const distM = a.distance ?? 0
  const maxSpeedMs = a.max_speed ?? 0

  return {
    activity_type: a.sport_type ?? a.type ?? null,
    name: a.name ?? null,
    description: a.description ?? null,
    started_at: a.start_date,
    duration_sec: a.elapsed_time,
    moving_time_sec: movingSec,
    distance_m: distM,
    avg_pace_sec_per_km: movingSec > 0 && distM > 0 ? Math.round(movingSec / (distM / 1000)) : null,
    max_pace_sec_per_km: maxSpeedMs > 0 ? Math.round(1000 / maxSpeedMs) : null,
    avg_hr: a.average_heartrate != null ? Math.round(a.average_heartrate) : null,
    max_hr: a.max_heartrate != null ? Math.round(a.max_heartrate) : null,
    avg_cadence: a.average_cadence != null ? Math.round(a.average_cadence) : null,
    elevation_gain_m: a.total_elevation_gain ?? null,
    calories: a.calories != null ? Math.round(a.calories) : null,
    avg_watts: a.average_watts != null ? Math.round(a.average_watts) : null,
    weighted_avg_watts:
      a.weighted_average_watts != null ? Math.round(a.weighted_average_watts) : null,
    device_watts: a.device_watts ?? false,
    avg_temp_c: a.average_temp ?? null,
    pr_count: a.pr_count ?? 0,
    workout_type: a.workout_type ?? null,
    summary_polyline: a.map?.summary_polyline ?? null,
    raw_data: a,
    device_name: a.device_name ?? null,
    kilojoules: a.kilojoules ?? null,
    elev_high_m: a.elev_high ?? null,
    elev_low_m: a.elev_low ?? null,
    achievement_count: a.achievement_count ?? 0,
    kudos_count: a.kudos_count ?? 0,
    max_watts: a.max_watts != null ? Math.round(a.max_watts) : null,
    commute: a.commute ?? null,
    trainer: a.trainer ?? null,
    has_heartrate: a.has_heartrate ?? null,
    manual: a.manual ?? null,
    perceived_exertion: a.perceived_exertion ?? null,
  }
}

function mapSplits(splitsMetric, activityId) {
  if (!Array.isArray(splitsMetric) || splitsMetric.length === 0) return []
  return splitsMetric.map((s) => {
    const movingSec = s.moving_time ?? s.elapsed_time ?? 0
    const distM = s.distance ?? 0
    return {
      activity_id: activityId,
      split_number: s.split,
      distance_m: distM,
      duration_sec: movingSec,
      pace_sec_per_km: movingSec > 0 && distM > 0 ? Math.round(movingSec / (distM / 1000)) : null,
      avg_hr: s.average_heartrate != null ? Math.round(s.average_heartrate) : null,
      elevation_gain_m: s.elevation_difference ?? null,
    }
  })
}

function mapBestEfforts(bestEfforts, activityId) {
  if (!Array.isArray(bestEfforts) || bestEfforts.length === 0) return []
  return bestEfforts.map((e) => ({
    activity_id: activityId,
    name: e.name ?? null,
    distance_m: e.distance ?? null,
    elapsed_time_sec: e.elapsed_time ?? null,
    moving_time_sec: e.moving_time ?? null,
    started_at: e.start_date ?? null,
    pr_rank: e.pr_rank ?? null,
  }))
}

function mapLaps(laps, activityId) {
  if (!Array.isArray(laps) || laps.length === 0) return []
  return laps.map((l) => ({
    activity_id: activityId,
    lap_index: l.lap_index ?? null,
    name: l.name ?? null,
    distance_m: l.distance ?? null,
    elapsed_time_sec: l.elapsed_time ?? null,
    moving_time_sec: l.moving_time ?? null,
    started_at: l.start_date ?? null,
    avg_speed_ms: l.average_speed ?? null,
    max_speed_ms: l.max_speed ?? null,
    avg_cadence: l.average_cadence ?? null,
    avg_watts: l.average_watts ?? null,
    total_elevation_gain_m: l.total_elevation_gain ?? null,
    pace_zone: l.pace_zone ?? null,
  }))
}

function mapPhotos(photos, activityId) {
  const primary = photos?.primary
  if (!primary?.unique_id) return []
  return [
    {
      activity_id: activityId,
      unique_id: primary.unique_id,
      url_600: primary.urls?.['600'] ?? null,
      url_100: primary.urls?.['100'] ?? null,
      media_type: primary.media_type ?? null,
    },
  ]
}

// ─── function ─────────────────────────────────────────────────────────────────

export const stravaFetchStreams = inngest.createFunction(
  { id: 'strava-fetch-streams', retries: 3, triggers: [{ event: 'strava/fetch-streams' }] },
  async ({ event, step }) => {
    const { activityId, userId, stravaActivityId } = event.data

    // Step 1: Get valid access token
    const { accessToken } = await step.run('get-credentials', async () => {
      const supabase = createAdminClient()
      const { data, error } = await supabase
        .from('rt_strava_credentials')
        .select('access_token, refresh_token, expires_at')
        .eq('user_id', userId)
        .single()

      if (error || !data) throw new Error(`No credentials for user ${userId}`)

      const fiveMinFromNow = Date.now() / 1000 + TOKEN_EXPIRY_BUFFER_SEC
      if (new Date(data.expires_at).getTime() / 1000 > fiveMinFromNow) {
        return { accessToken: decrypt(data.access_token) }
      }

      const res = await fetch(STRAVA_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: process.env.STRAVA_CLIENT_ID,
          client_secret: process.env.STRAVA_CLIENT_SECRET,
          grant_type: 'refresh_token',
          refresh_token: decrypt(data.refresh_token),
        }),
      })

      if (!res.ok) throw new Error(`Token refresh failed: ${res.status}`)

      const { access_token, refresh_token, expires_at } = await res.json()

      await supabase
        .from('rt_strava_credentials')
        .update({
          access_token: encrypt(access_token),
          refresh_token: encrypt(refresh_token),
          expires_at: new Date(expires_at * 1000).toISOString(),
        })
        .eq('user_id', userId)

      return { accessToken: access_token }
    })

    // Step 2: Fetch full DetailedActivity from Strava
    const stravaActivity = await step.run('fetch-activity-detail', async () => {
      const res = await fetch(
        `${STRAVA_ACTIVITY_URL}/${stravaActivityId}?include_all_efforts=true`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      if (!res.ok) throw new Error(`Strava activity fetch failed: ${res.status}`)
      return res.json()
    })

    // Step 3: Enrich rt_activities with all parsed fields
    await step.run('enrich-activity', async () => {
      const supabase = createAdminClient()
      const { error } = await supabase
        .from('rt_activities')
        .update(mapActivityToRow(stravaActivity))
        .eq('id', activityId)
      if (error) throw new Error(`Enrich activity failed: ${error.message}`)
    })

    // Step 4: Replace splits from splits_metric
    await step.run('upsert-splits', async () => {
      const supabase = createAdminClient()
      const splits = mapSplits(stravaActivity.splits_metric, activityId)
      if (splits.length === 0) return

      await supabase.from('rt_activity_splits').delete().eq('activity_id', activityId)

      const { error } = await supabase.from('rt_activity_splits').insert(splits)
      if (error) throw new Error(`Splits insert failed: ${error.message}`)
    })

    // Step 5: Upsert best efforts
    await step.run('upsert-best-efforts', async () => {
      const supabase = createAdminClient()
      const rows = mapBestEfforts(stravaActivity.best_efforts, activityId)
      if (rows.length === 0) return
      await supabase.from('rt_activity_best_efforts').delete().eq('activity_id', activityId)
      const { error } = await supabase.from('rt_activity_best_efforts').insert(rows)
      if (error) throw new Error(`Best efforts insert failed: ${error.message}`)
    })

    // Step 6: Upsert laps
    await step.run('upsert-laps', async () => {
      const supabase = createAdminClient()
      const rows = mapLaps(stravaActivity.laps, activityId)
      if (rows.length === 0) return
      await supabase.from('rt_activity_laps').delete().eq('activity_id', activityId)
      const { error } = await supabase.from('rt_activity_laps').insert(rows)
      if (error) throw new Error(`Laps insert failed: ${error.message}`)
    })

    // Step 7: Upsert photos
    await step.run('upsert-photos', async () => {
      const supabase = createAdminClient()
      const rows = mapPhotos(stravaActivity.photos, activityId)
      if (rows.length === 0) return
      await supabase.from('rt_activity_photos').delete().eq('activity_id', activityId)
      const { error } = await supabase.from('rt_activity_photos').insert(rows)
      if (error) throw new Error(`Photos insert failed: ${error.message}`)
    })

    // Step 8: Fetch streams and store in rt_activity_streams
    await step.run('fetch-and-store-streams', async () => {
      const supabase = createAdminClient()

      const res = await fetch(
        `${STRAVA_ACTIVITY_URL}/${stravaActivityId}/streams` +
          `?keys=time,distance,latlng,altitude,heartrate,cadence,velocity_smooth&key_by_type=true`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )

      // Streams may be unavailable (private activity, no GPS, etc.) — not fatal
      if (!res.ok) return

      const raw = await res.json()
      const timeData = raw.time?.data
      if (!Array.isArray(timeData) || timeData.length === 0) return

      const startMs = new Date(stravaActivity.start_date).getTime()
      const dist = raw.distance?.data
      const latlng = raw.latlng?.data
      const altitude = raw.altitude?.data
      const heartrate = raw.heartrate?.data
      const cadence = raw.cadence?.data
      const velocity = raw.velocity_smooth?.data

      const rows = timeData.map((t, i) => {
        const v = velocity?.[i] ?? null
        return {
          activity_id: activityId,
          timestamp: new Date(startMs + t * 1000).toISOString(),
          latitude: latlng?.[i]?.[0] ?? null,
          longitude: latlng?.[i]?.[1] ?? null,
          altitude_m: altitude?.[i] ?? null,
          heart_rate: heartrate?.[i] ?? null,
          cadence: cadence?.[i] != null ? cadence[i] * 2 : null,
          velocity_m_s: v,
          distance_m: dist?.[i] ?? null,
          pace_sec_per_km: v > 0 ? Math.round(1000 / v) : null,
        }
      })

      await supabase.from('rt_activity_streams').delete().eq('activity_id', activityId)

      for (let i = 0; i < rows.length; i += STREAM_BATCH_SIZE) {
        const { error } = await supabase
          .from('rt_activity_streams')
          .insert(rows.slice(i, i + STREAM_BATCH_SIZE))
        if (error) throw new Error(`Streams insert failed at batch ${i}: ${error.message}`)
      }
    })

    // Step 9: Compute derived metrics (Aerobic Decoupling + Efficiency Factor)
    await step.run('compute-derived-metrics', async () => {
      await computeAndSaveDerivedMetrics(activityId, userId)
    })

    // Step 10: Fetch HR zones from Strava
    await step.run('fetch-zones', async () => {
      const res = await fetch(`${STRAVA_ACTIVITY_URL}/${stravaActivityId}/zones`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      // Not fatal — zones unavailable for activities without HR or Strava zones config
      if (!res.ok) return

      const zones = await res.json()
      if (!zones?.heart_rate?.zones?.length) return

      const supabase = createAdminClient()
      await supabase
        .from('rt_activities')
        .update({ zones: { heart_rate: zones.heart_rate } })
        .eq('id', activityId)
    })

    await step.sendEvent('trigger-insight', {
      name: 'ai/generate-post-activity-insight',
      data: { activityId, userId },
    })
  }
)
