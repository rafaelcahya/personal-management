import { getDateRange } from './analyticsRangeUtils'

const ACTIVITY_LIMIT = 100

export async function getGearUsage(supabase, userId, range, activityType, startDate, endDate) {
  const { fromDate, toDate } = getDateRange(range, startDate, endDate)

  let query = supabase
    .from('rt_activities')
    .select(
      'gear_id, moving_time_sec, distance_m, rt_gear(id, name, brand_name, model_name, retired, category)'
    )
    .eq('user_id', userId)
    .not('gear_id', 'is', null)
    .order('started_at', { ascending: false })
    .limit(ACTIVITY_LIMIT)

  if (fromDate) query = query.gte('started_at', fromDate)
  if (toDate) query = query.lte('started_at', toDate)
  if (activityType && activityType !== 'All') {
    query = query.eq('activity_type', activityType)
  }

  const { data: activityRows } = await query

  const gearMap = new Map()
  for (const row of activityRows ?? []) {
    const gear = row.rt_gear
    if (!gear) continue
    if (!gearMap.has(gear.id)) {
      gearMap.set(gear.id, {
        id: gear.id,
        name: gear.name,
        brand_name: gear.brand_name,
        model_name: gear.model_name,
        retired: gear.retired ?? false,
        category: gear.category ?? null,
        total_activities: 0,
        total_moving_time_sec: 0,
        total_distance_m: 0,
      })
    }
    const entry = gearMap.get(gear.id)
    entry.total_activities += 1
    entry.total_moving_time_sec += row.moving_time_sec ?? 0
    entry.total_distance_m += row.distance_m ?? 0
  }

  const gear = Array.from(gearMap.values())
    .map((g) => ({ ...g, total_distance_m: Math.round(g.total_distance_m) }))
    .sort((a, b) => b.total_distance_m - a.total_distance_m)

  return { gear }
}
