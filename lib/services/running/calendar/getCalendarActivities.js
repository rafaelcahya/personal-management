/**
 * Activities inside one calendar month in the user's local time.
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @param {{ month?: string|null, activityType?: string|null, tzOffsetMs?: number }} [options]
 *   month is YYYY-MM; omitted means the user's current local month. tzOffsetMs follows
 *   Date#getTimezoneOffset (UTC minus local), same as the dashboard.
 * @returns {Promise<Array<{ id: string, started_at: string, activity_type: string, name: string|null, distance_m: number|null, relative_effort: number|null }>>}
 */
export async function getCalendarActivities(
  supabase,
  userId,
  { month = null, activityType = null, tzOffsetMs = 0 } = {}
) {
  let year
  let monthIndex
  if (month) {
    const [y, m] = month.split('-').map(Number)
    year = y
    monthIndex = m - 1
  } else {
    // Shifting by the offset makes the UTC getters read the user's local date.
    const localNow = new Date(Date.now() - tzOffsetMs)
    year = localNow.getUTCFullYear()
    monthIndex = localNow.getUTCMonth()
  }

  const monthStart = new Date(Date.UTC(year, monthIndex, 1) + tzOffsetMs)
  const nextMonthStart = new Date(Date.UTC(year, monthIndex + 1, 1) + tzOffsetMs)

  let q = supabase
    .from('rt_activities')
    .select('id, started_at, activity_type, name, distance_m, relative_effort')
    .eq('user_id', userId)
    .gte('started_at', monthStart.toISOString())
    .lt('started_at', nextMonthStart.toISOString())
    .order('started_at', { ascending: true })

  if (activityType) q = q.eq('activity_type', activityType)

  const { data, error } = await q
  if (error) throw error

  return (data ?? []).map((a) => ({
    id: a.id,
    started_at: a.started_at,
    activity_type: a.activity_type,
    name: a.name ?? null,
    distance_m: a.distance_m ?? null,
    relative_effort: a.relative_effort ?? null,
  }))
}
