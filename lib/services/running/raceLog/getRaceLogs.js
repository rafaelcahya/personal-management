/**
 * Returns all race log entries for a user ordered by race_date DESC.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @returns {Promise<Array>}
 */
const TOP_DISTANCES = ['1 mile', '5K', '10K', '15K', 'Half-Marathon']

export async function getRaceLogs(supabase, userId) {
  const { data, error } = await supabase
    .from('rt_race_log')
    .select(
      'id, title, race_date, distance_m, finish_time_sec, avg_pace_sec_per_km, avg_hr, elevation_gain_m, position_place, position_male, did_not_finish, activity_id, notes, created_at'
    )
    .eq('user_id', userId)
    .order('race_date', { ascending: false })

  if (error) throw new Error(error.message)

  const logs = data ?? []
  const activityIds = logs.map((l) => l.activity_id).filter(Boolean)
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

  return logs.map((l) => ({
    ...l,
    top_best_efforts:
      l.activity_id && bestEffortsMap.has(l.activity_id)
        ? [...bestEffortsMap.get(l.activity_id).values()]
        : [],
  }))
}
