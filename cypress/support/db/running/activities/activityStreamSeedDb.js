// Seeds one tagged activity that is long enough and has heart rate, so the lazy derived-metric
// compute and the streams endpoint can be tested with real rows. The test account has no streams.
//
// Raw PostgREST fetch with the service-role key, same reason as activitySeedDb.js (the shared
// supabaseAdmin client is signed in as the test user after getSupabaseSession). Cleanup only
// touches the activity whose user_id AND external_id match, and its streams by activity_id.

const BASE = () => `${process.env.SUPABASE_URL}/rest/v1`
const headers = (extra = {}) => {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  return { apikey: key, Authorization: `Bearer ${key}`, ...extra }
}

const START_MS = Date.UTC(2021, 6, 4, 6, 0, 0)
const BATCH = 500
const SPEED_M_S = 2.8

const assertOk = async (res, label) => {
  if (!res.ok) throw new Error(`DB query failed: ${label} (${res.status}): ${await res.text()}`)
}

const externalId = (tag) => `${tag}-hr-streams`

export async function seedActivityWithStreamsInDb(userId, tag, rowCount) {
  const distance = Math.round((rowCount - 1) * SPEED_M_S)
  const activityRes = await fetch(`${BASE()}/rt_activities?select=id`, {
    method: 'POST',
    headers: headers({ 'Content-Type': 'application/json', Prefer: 'return=representation' }),
    body: JSON.stringify([
      {
        user_id: userId,
        source: 'manual',
        external_id: externalId(tag),
        name: `${tag} run with streams`,
        activity_type: 'Run',
        started_at: new Date(START_MS).toISOString(),
        duration_sec: rowCount,
        moving_time_sec: rowCount,
        distance_m: distance,
        avg_pace_sec_per_km: 357,
        avg_hr: 150,
        max_hr: 165,
        elevation_gain_m: 20,
      },
    ]),
  })
  await assertOk(activityRes, 'seed activity with streams')
  const [{ id: activityId }] = await activityRes.json()

  for (let from = 0; from < rowCount; from += BATCH) {
    const rows = []
    for (let i = from; i < Math.min(from + BATCH, rowCount); i++) {
      rows.push({
        activity_id: activityId,
        timestamp: new Date(START_MS + i * 1000).toISOString(),
        distance_m: Math.round(i * SPEED_M_S * 10) / 10,
        // Heart rate drifts up over the run, as in a real steady effort
        heart_rate: Math.round(140 + (i / rowCount) * 20),
        cadence: 172 + (i % 7),
        altitude_m: Math.round((100 + Math.sin(i / 120) * 8) * 10) / 10,
        pace_sec_per_km: 357,
        velocity_m_s: SPEED_M_S,
        latitude: -6.2 + i * 0.00002,
        longitude: 106.8 + i * 0.00001,
      })
    }
    const res = await fetch(`${BASE()}/rt_activity_streams`, {
      method: 'POST',
      headers: headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(rows),
    })
    await assertOk(res, `seed streams from ${from}`)
  }
  return { activityId, rowCount, distance_m: distance }
}

export async function deleteActivityWithStreamsFromDb(userId, tag) {
  const find = await fetch(
    `${BASE()}/rt_activities?select=id&user_id=eq.${userId}` +
      `&external_id=eq.${encodeURIComponent(externalId(tag))}`,
    { headers: headers() }
  )
  await assertOk(find, 'find activity with streams')
  const ids = (await find.json()).map((r) => r.id)
  for (const id of ids) {
    const streams = await fetch(`${BASE()}/rt_activity_streams?activity_id=eq.${id}`, {
      method: 'DELETE',
      headers: headers(),
    })
    await assertOk(streams, 'delete streams')
    const act = await fetch(`${BASE()}/rt_activities?id=eq.${id}&user_id=eq.${userId}`, {
      method: 'DELETE',
      headers: headers(),
    })
    await assertOk(act, 'delete activity with streams')
  }
  return { deleted: ids.length }
}
