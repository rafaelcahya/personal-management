// Seed/cleanup for analytics tests that need more than 100 activities with EF / VO2max / watts.
//
// Uses raw PostgREST fetch with the service-role key instead of the supabase-js admin client:
// inside Cypress's bundled config context the supabase-js client does not resolve the
// `sb_secret_` key to service_role, so RLS blocks inserts (same reason as notificationTasks.js).
//
// Every seeded row carries external_id `${tag}-${i}` and name `${tag} run ${i}`; cleanup only
// deletes rows matching user_id AND both prefixes, so pre-existing rows are never touched.

const REST = () => `${process.env.SUPABASE_URL}/rest/v1/rt_activities`
const headers = (extra = {}) => {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  return { apikey: key, Authorization: `Bearer ${key}`, ...extra }
}

const BASE_DATE_MS = Date.UTC(2021, 0, 1, 6, 0, 0)
const DAY_MS = 24 * 60 * 60 * 1000

// Deterministic share of populated values: EF 80%, VO2max 75%, watts 67%.
const buildRow = (userId, tag, i) => {
  const distance = 5000 + (i % 10) * 500
  const pace = 330 + (i % 12) * 5
  return {
    user_id: userId,
    source: 'manual',
    external_id: `${tag}-${i}`,
    name: `${tag} run ${i}`,
    activity_type: 'Run',
    started_at: new Date(BASE_DATE_MS + i * DAY_MS).toISOString(),
    duration_sec: Math.round((distance / 1000) * pace),
    moving_time_sec: Math.round((distance / 1000) * pace),
    distance_m: distance,
    avg_pace_sec_per_km: pace,
    avg_hr: 140 + (i % 20),
    elevation_gain_m: 20 + (i % 15) * 3,
    efficiency_factor: i % 5 === 0 ? null : Number((1.1 + (i % 10) * 0.01).toFixed(2)),
    estimated_vo2max: i % 4 === 0 ? null : Number((45 + (i % 10) * 0.5).toFixed(1)),
    avg_watts: i % 3 === 0 ? null : 200 + (i % 10) * 5,
    weighted_avg_watts: i % 3 === 0 ? null : 205 + (i % 10) * 5,
    device_watts: i % 3 === 0 ? null : true,
  }
}

const assertOk = async (res, label) => {
  if (!res.ok) throw new Error(`DB query failed: ${label} (${res.status}): ${await res.text()}`)
}

export async function seedAnalyticsActivitiesInDb(userId, tag, count) {
  const rows = Array.from({ length: count }, (_, i) => buildRow(userId, tag, i))
  const res = await fetch(`${REST()}?select=id`, {
    method: 'POST',
    headers: headers({ 'Content-Type': 'application/json', Prefer: 'return=representation' }),
    body: JSON.stringify(rows),
  })
  await assertOk(res, 'seed activities')
  const inserted = await res.json()
  return { inserted: inserted.length }
}

export async function deleteSeededAnalyticsActivitiesFromDb(userId, tag) {
  const url =
    `${REST()}?select=id&user_id=eq.${userId}` +
    `&external_id=like.${encodeURIComponent(`${tag}-*`)}` +
    `&name=like.${encodeURIComponent(`${tag} run *`)}`
  const res = await fetch(url, {
    method: 'DELETE',
    headers: headers({ Prefer: 'return=representation' }),
  })
  await assertOk(res, 'delete seeded activities')
  const deleted = await res.json()
  return { deleted: deleted.length }
}

export async function getSeededAnalyticsActivitiesFromDb(userId, tag) {
  const url =
    `${REST()}?select=id,started_at,efficiency_factor,estimated_vo2max,avg_watts` +
    `&user_id=eq.${userId}&external_id=like.${encodeURIComponent(`${tag}-*`)}` +
    `&order=started_at.desc&limit=1000`
  const res = await fetch(url, { headers: headers() })
  await assertOk(res, 'read seeded activities')
  return res.json()
}
