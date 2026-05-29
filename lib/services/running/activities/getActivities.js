import { createClient } from '@/lib/supabase/server'

const SORT_MAP = {
  newest: { column: 'started_at', ascending: false },
  oldest: { column: 'started_at', ascending: true },
  longest: { column: 'distance_m', ascending: false },
  fastest: { column: 'avg_pace_sec_per_km', ascending: true },
}

export async function getActivities(
  userId,
  { from, to, type, sort = 'newest', page = 1, limit = 20, search } = {}
) {
  const supabase = await createClient()
  const { column, ascending } = SORT_MAP[sort] ?? SORT_MAP.newest

  let query = supabase
    .from('rt_activities')
    .select(
      'id, started_at, distance_m, duration_sec, moving_time_sec, avg_pace_sec_per_km, avg_hr, activity_type, source, name, elevation_gain_m, pr_count, workout_type, avg_cadence, avg_temp_c, calories, avg_watts, weighted_avg_watts, device_watts, summary_polyline, gear_id, estimated_vo2max, efficiency_factor',
      { count: 'exact' }
    )
    .eq('user_id', userId)
    .order(column, { ascending, nullsFirst: false })
    .range((page - 1) * limit, page * limit - 1)

  if (from) query = query.gte('started_at', from)
  if (to) query = query.lte('started_at', to)
  if (type) query = query.eq('activity_type', type)
  if (search) query = query.ilike('name', `%${search}%`)

  const { data, count, error } = await query
  if (error) throw error

  const activities = data ?? []

  const gearIds = [...new Set(activities.map((a) => a.gear_id).filter(Boolean))]

  let gearMap = new Map()
  if (gearIds.length > 0) {
    const { data: gearRows } = await supabase
      .from('rt_gear')
      .select('id, name, distance_m')
      .in('id', gearIds)

    gearMap = new Map((gearRows || []).map((g) => [g.id, g]))
  }

  const enriched = activities.map((a) => {
    const gear = a.gear_id ? gearMap.get(a.gear_id) : null
    return {
      ...a,
      gear_name: gear?.name ?? null,
      gear_distance_m: gear?.distance_m ?? null,
    }
  })

  return { data: enriched, total: count ?? 0, page, limit }
}
