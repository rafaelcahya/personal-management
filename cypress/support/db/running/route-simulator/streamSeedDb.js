// Seeds one tagged activity with a long stream (more than one PostgREST page) so the route
// simulator's stream paging can be checked against real rows.
//
// Raw PostgREST fetch with the service-role key, same reason as activitySeedDb.js. Cleanup only
// touches the activity whose user_id AND external_id match, and its streams by activity_id.

const BASE = () => `${process.env.SUPABASE_URL}/rest/v1`
const headers = (extra = {}) => {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  return { apikey: key, Authorization: `Bearer ${key}`, ...extra }
}

const STEP_M = 10
const START_MS = Date.UTC(2021, 5, 1, 6, 0, 0)
const BATCH = 500

const assertOk = async (res, label) => {
  if (!res.ok) throw new Error(`DB query failed: ${label} (${res.status}): ${await res.text()}`)
}

export async function seedStreamActivityInDb(userId, tag, rowCount) {
  const distance = (rowCount - 1) * STEP_M
  const activityRes = await fetch(`${BASE()}/rt_activities?select=id`, {
    method: 'POST',
    headers: headers({ 'Content-Type': 'application/json', Prefer: 'return=representation' }),
    body: JSON.stringify([
      {
        user_id: userId,
        source: 'manual',
        external_id: `${tag}-stream`,
        name: `${tag} stream run`,
        activity_type: 'Run',
        started_at: new Date(START_MS).toISOString(),
        duration_sec: rowCount,
        moving_time_sec: rowCount,
        distance_m: distance,
        avg_pace_sec_per_km: 360,
        elevation_gain_m: 50,
      },
    ]),
  })
  await assertOk(activityRes, 'seed stream activity')
  const [{ id: activityId }] = await activityRes.json()

  for (let from = 0; from < rowCount; from += BATCH) {
    const rows = []
    for (let i = from; i < Math.min(from + BATCH, rowCount); i++) {
      rows.push({
        activity_id: activityId,
        timestamp: new Date(START_MS + i * 1000).toISOString(),
        distance_m: i * STEP_M,
        altitude_m: 100 + i * 0.05,
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

export async function deleteStreamActivityFromDb(userId, tag) {
  const find = await fetch(
    `${BASE()}/rt_activities?select=id&user_id=eq.${userId}` +
      `&external_id=eq.${encodeURIComponent(`${tag}-stream`)}`,
    { headers: headers() }
  )
  await assertOk(find, 'find stream activity')
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
    await assertOk(act, 'delete stream activity')
  }
  return { deleted: ids.length }
}

export async function countTaggedRouteRowsFromDb(userId, tag) {
  const act = await fetch(
    `${BASE()}/rt_activities?select=id&user_id=eq.${userId}&external_id=like.${encodeURIComponent(`${tag}-*`)}`,
    { headers: headers() }
  )
  await assertOk(act, 'count tagged activities')
  const sims = await fetch(
    `${BASE()}/rt_route_simulations?select=id&user_id=eq.${userId}&name=like.${encodeURIComponent(`${tag}*`)}`,
    { headers: headers() }
  )
  await assertOk(sims, 'count tagged simulations')
  const routes = await fetch(
    `${BASE()}/rt_saved_routes?select=id&user_id=eq.${userId}&name=like.${encodeURIComponent(`${tag}*`)}`,
    { headers: headers() }
  )
  await assertOk(routes, 'count tagged routes')
  return {
    activities: (await act.json()).length,
    simulations: (await sims.json()).length,
    routes: (await routes.json()).length,
  }
}

// Read-only: ids of one saved route and one simulation owned by someone other than `userId`,
// for ownership checks. Only used with GET requests, never with PATCH/DELETE on real data.
export async function getOtherUserRouteIdsFromDb(userId) {
  const first = async (table) => {
    const res = await fetch(`${BASE()}/${table}?select=id&user_id=neq.${userId}&limit=1`, {
      headers: headers(),
    })
    await assertOk(res, `read other user ${table}`)
    const rows = await res.json()
    return rows[0]?.id ?? null
  }
  return {
    routeId: await first('rt_saved_routes'),
    simulationId: await first('rt_route_simulations'),
  }
}
