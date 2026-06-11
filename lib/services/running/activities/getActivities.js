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

  const TOP_DISTANCES = ['1 mile', '5K', '10K', '15K', 'Half-Marathon']
  const activityIds = activities.map((a) => a.id)
  let bestEffortsMap = new Map()

  if (activityIds.length > 0) {
    const { data: beRows } = await supabase
      .from('rt_activity_best_efforts')
      .select('activity_id, name, pr_rank')
      .in('activity_id', activityIds)
      .in('name', TOP_DISTANCES)
      .not('pr_rank', 'is', null)
      .lte('pr_rank', 5)

    if ((beRows ?? []).length > 0) {
      const names = [...new Set(beRows.map((r) => r.name))]
      const ranks = [...new Set(beRows.map((r) => r.pr_rank))]

      const { data: globalRows } = await supabase
        .from('rt_activity_best_efforts')
        .select('activity_id, name, pr_rank, rt_activities!inner(started_at)')
        .in('name', names)
        .in('pr_rank', ranks)
        .not('pr_rank', 'is', null)
        .lte('pr_rank', 5)
        .eq('rt_activities.user_id', userId)

      const globalLatestMap = new Map()
      for (const row of globalRows ?? []) {
        const key = `${row.name}__${row.pr_rank}`
        const rowDate = row.rt_activities?.started_at ?? ''
        if (!globalLatestMap.has(key) || rowDate > globalLatestMap.get(key).date) {
          globalLatestMap.set(key, { activity_id: row.activity_id, date: rowDate })
        }
      }

      for (const row of beRows) {
        const key = `${row.name}__${row.pr_rank}`
        if (globalLatestMap.get(key)?.activity_id === row.activity_id) {
          if (!bestEffortsMap.has(row.activity_id)) bestEffortsMap.set(row.activity_id, new Map())
          bestEffortsMap
            .get(row.activity_id)
            .set(row.name, { name: row.name, pr_rank: row.pr_rank })
        }
      }
    }
  }

  const enriched = activities.map((a) => {
    const gear = a.gear_id ? gearMap.get(a.gear_id) : null
    return {
      ...a,
      gear_name: gear?.name ?? null,
      gear_distance_m: gear?.distance_m ?? null,
      top_best_efforts: bestEffortsMap.has(a.id) ? [...bestEffortsMap.get(a.id).values()] : [],
    }
  })

  return { data: enriched, total: count ?? 0, page, limit }
}
