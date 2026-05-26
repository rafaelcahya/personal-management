import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { decrypt, encrypt } from '@/lib/utils/running/encrypt'
import { inngest } from '@/lib/inngest/client'

const STRAVA_ACTIVITIES_URL = 'https://www.strava.com/api/v3/athlete/activities'
const STRAVA_ATHLETE_URL = 'https://www.strava.com/api/v3/athlete'
const STRAVA_GEAR_URL = 'https://www.strava.com/api/v3/gear'
const STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token'
const PER_PAGE = 100
const TOKEN_EXPIRY_BUFFER_SEC = 300
const GEAR_REFRESH_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000

async function getValidAccessToken(credentials, admin, userId) {
  const expiresAt = new Date(credentials.expires_at).getTime() / 1000
  const fiveMinFromNow = Date.now() / 1000 + TOKEN_EXPIRY_BUFFER_SEC

  if (expiresAt > fiveMinFromNow) {
    return decrypt(credentials.access_token)
  }

  const res = await fetch(STRAVA_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: decrypt(credentials.refresh_token),
    }),
  })

  if (!res.ok) throw new Error(`Token refresh failed: ${res.status}`)

  const { access_token, refresh_token, expires_at } = await res.json()

  await admin
    .from('rt_strava_credentials')
    .update({
      access_token: encrypt(access_token),
      refresh_token: encrypt(refresh_token),
      expires_at: new Date(expires_at * 1000).toISOString(),
    })
    .eq('user_id', userId)

  return access_token
}

async function syncAthleteShoes(accessToken, admin, userId) {
  try {
    const res = await fetch(STRAVA_ATHLETE_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!res.ok) {
      console.error(`[strava/sync] athlete fetch failed: ${res.status}`)
      return
    }

    const athlete = await res.json()
    const shoes = athlete.shoes ?? []

    if (shoes.length === 0) return

    const { data: existingGear } = await admin
      .from('rt_gear')
      .select('id, last_fetched_at')
      .eq('user_id', userId)
      .in(
        'id',
        shoes.map((s) => s.id)
      )

    const existingGearMap = new Map((existingGear || []).map((g) => [g.id, g.last_fetched_at]))

    const cutoff = new Date(Date.now() - GEAR_REFRESH_INTERVAL_MS)

    for (const shoe of shoes) {
      const lastFetched = existingGearMap.get(shoe.id)
      const needsFetch = !lastFetched || new Date(lastFetched) < cutoff

      if (!needsFetch) continue

      try {
        const gearRes = await fetch(`${STRAVA_GEAR_URL}/${shoe.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })

        if (!gearRes.ok) {
          console.error(`[strava/sync] shoe detail fetch failed for ${shoe.id}: ${gearRes.status}`)
          continue
        }

        const g = await gearRes.json()

        await admin.from('rt_gear').upsert(
          {
            id: g.id,
            user_id: userId,
            name: g.name ?? null,
            brand_name: g.brand_name ?? null,
            model_name: g.model_name ?? null,
            distance_m:
              g.converted_distance != null ? Math.round(g.converted_distance * 1000) : null,
            retired: g.retired ?? false,
            notification_distance_m:
              g.notification_distance != null ? Math.round(g.notification_distance * 1000) : null,
            last_fetched_at: new Date().toISOString(),
            // category and retirement_km are user-managed — never overwritten from Strava
          },
          { onConflict: 'id,user_id' }
        )
      } catch (shoeErr) {
        console.error(`[strava/sync] shoe upsert error for ${shoe.id}:`, shoeErr.message)
      }
    }
  } catch (err) {
    console.error('[strava/sync] syncAthleteShoes failed:', err.message)
  }
}

export async function POST(_request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = createAdminClient()

    const { data: credentials, error: credError } = await admin
      .from('rt_strava_credentials')
      .select('access_token, refresh_token, expires_at, last_sync_at')
      .eq('user_id', user.id)
      .single()

    if (credError || !credentials) {
      return NextResponse.json({ error: 'Strava not connected' }, { status: 400 })
    }

    const accessToken = await getValidAccessToken(credentials, admin, user.id)

    // Proactively sync all athlete shoes — before activity loop
    await syncAthleteShoes(accessToken, admin, user.id)

    // Use last_sync_at for incremental sync — only fetch new activities
    const afterParam = credentials.last_sync_at
      ? `&after=${Math.floor(new Date(credentials.last_sync_at).getTime() / 1000)}`
      : ''

    let page = 1
    let totalInserted = 0

    while (true) {
      const res = await fetch(
        `${STRAVA_ACTIVITIES_URL}?per_page=${PER_PAGE}&page=${page}${afterParam}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )

      if (!res.ok) {
        return NextResponse.json({ error: `Strava API error: ${res.status}` }, { status: 502 })
      }

      const activities = await res.json()
      if (!Array.isArray(activities) || activities.length === 0) break

      const stravaIds = activities.map((a) => String(a.id))

      const { data: existing } = await admin
        .from('rt_activities')
        .select('external_id')
        .eq('user_id', user.id)
        .eq('source', 'strava')
        .in('external_id', stravaIds)

      const existingIds = new Set((existing || []).map((r) => r.external_id))
      const toInsert = activities.filter((a) => !existingIds.has(String(a.id)))

      if (toInsert.length > 0) {
        const rows = toInsert.map((a) => ({
          user_id: user.id,
          source: 'strava',
          external_id: String(a.id),
          activity_type: a.sport_type ?? a.type ?? null,
          name: a.name ?? null,
          description: a.description ?? null,
          notes: a.name ?? null,
          started_at: a.start_date,
          duration_sec: a.elapsed_time,
          moving_time_sec: a.moving_time,
          distance_m: Math.round(a.distance),
          avg_pace_sec_per_km: a.average_speed > 0 ? Math.round(1000 / a.average_speed) : null,
          max_pace_sec_per_km: a.max_speed > 0 ? Math.round(1000 / a.max_speed) : null,
          avg_hr: a.average_heartrate != null ? Math.round(a.average_heartrate) : null,
          max_hr: a.max_heartrate != null ? Math.round(a.max_heartrate) : null,
          avg_cadence: a.average_cadence != null ? Math.round(a.average_cadence) : null,
          elevation_gain_m: a.total_elevation_gain ?? null,
          calories: a.calories != null ? Math.round(a.calories) : null,
          relative_effort: a.suffer_score != null ? a.suffer_score : null,
          workout_type: a.workout_type != null ? a.workout_type : null,
          gear_id: a.gear_id ?? null,
          pr_count: a.pr_count != null ? a.pr_count : null,
          avg_temp_c: a.average_temp != null ? Math.round(a.average_temp) : null,
          avg_watts: a.average_watts != null ? Math.round(a.average_watts) : null,
          weighted_avg_watts:
            a.weighted_average_watts != null ? Math.round(a.weighted_average_watts) : null,
          device_watts: a.device_watts ?? false,
          kilojoules: a.kilojoules ?? null,
          achievement_count: a.achievement_count ?? 0,
          kudos_count: a.kudos_count ?? 0,
          summary_polyline: a.map?.summary_polyline ?? null,
          raw_data: a,
        }))

        const { data: insertedRows, error: insertError } = await admin
          .from('rt_activities')
          .insert(rows)
          .select('id, external_id')

        if (insertError) {
          console.error('[strava/sync] insert failed:', insertError.message)
          return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
        }

        if (insertedRows?.length > 0) {
          await inngest.send(
            insertedRows.map((r) => ({
              name: 'strava/fetch-streams',
              data: { activityId: r.id, userId: user.id, stravaActivityId: r.external_id },
            }))
          )
        }

        const uniqueGearIds = [...new Set(toInsert.map((a) => a.gear_id).filter(Boolean))]

        if (uniqueGearIds.length > 0) {
          const { data: existingGear } = await admin
            .from('rt_gear')
            .select('id, last_fetched_at')
            .eq('user_id', user.id)
            .in('id', uniqueGearIds)

          const existingGearMap = new Map(
            (existingGear || []).map((g) => [g.id, g.last_fetched_at])
          )

          const gearCutoff = new Date(Date.now() - GEAR_REFRESH_INTERVAL_MS)

          for (const gearId of uniqueGearIds) {
            const lastFetched = existingGearMap.get(gearId)
            const needsFetch = !lastFetched || new Date(lastFetched) < gearCutoff

            if (!needsFetch) continue

            try {
              const gearRes = await fetch(`${STRAVA_GEAR_URL}/${gearId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
              })

              if (!gearRes.ok) {
                console.error(`[strava/sync] gear fetch failed for ${gearId}: ${gearRes.status}`)
                continue
              }

              const g = await gearRes.json()

              await admin.from('rt_gear').upsert(
                {
                  id: g.id,
                  user_id: user.id,
                  name: g.name ?? null,
                  brand_name: g.brand_name ?? null,
                  model_name: g.model_name ?? null,
                  distance_m:
                    g.converted_distance != null ? Math.round(g.converted_distance * 1000) : null,
                  retired: g.retired ?? false,
                  notification_distance_m:
                    g.notification_distance != null
                      ? Math.round(g.notification_distance * 1000)
                      : null,
                  last_fetched_at: new Date().toISOString(),
                  // category and retirement_km are user-managed — never overwritten from Strava
                },
                { onConflict: 'id,user_id' }
              )
            } catch (gearErr) {
              console.error(`[strava/sync] gear upsert error for ${gearId}:`, gearErr.message)
            }
          }
        }

        totalInserted += rows.length
      }

      // If we got fewer than PER_PAGE, we're done
      if (activities.length < PER_PAGE) break
      page++
    }

    await admin
      .from('rt_strava_credentials')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('user_id', user.id)

    return NextResponse.json({ synced: totalInserted })
  } catch (err) {
    console.error('[strava/sync]', err.message)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}
