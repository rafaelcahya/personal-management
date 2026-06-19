const TOP_DISTANCES = ['1 mile', '5K', '10K', '15K', 'Half-Marathon']

const DISTANCE_BUCKET_MAP = {
  '5k': { gte: 4500, lte: 5499 },
  '10k': { gte: 9500, lte: 10499 },
  '21k': { gte: 20500, lte: 21499 },
  '42k': { gte: 41500, lte: 42499 },
}

export async function getRaceLogs(
  supabase,
  userId,
  { page = 1, limit = 15, search, distance_bucket } = {}
) {
  let query = supabase
    .from('rt_race_log')
    .select(
      'id, title, race_date, distance_m, finish_time_sec, avg_pace_sec_per_km, avg_hr, elevation_gain_m, position_place, position_male, did_not_finish, activity_id, notes, created_at',
      { count: 'exact' }
    )
    .eq('user_id', userId)
    .order('race_date', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (search) query = query.ilike('title', `%${search}%`)

  if (distance_bucket) {
    const range = DISTANCE_BUCKET_MAP[distance_bucket]
    if (range) {
      query = query.gte('distance_m', range.gte).lte('distance_m', range.lte)
    } else if (distance_bucket === 'other') {
      query = query.or(
        'distance_m.is.null,' +
          'distance_m.lt.4500,' +
          'and(distance_m.gte.5500,distance_m.lte.9499),' +
          'and(distance_m.gte.10500,distance_m.lte.20499),' +
          'and(distance_m.gte.21500,distance_m.lte.41499),' +
          'distance_m.gt.42499'
      )
    }
  }

  const { data, count, error } = await query
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

  return {
    data: logs.map((l) => ({
      ...l,
      top_best_efforts:
        l.activity_id && bestEffortsMap.has(l.activity_id)
          ? [...bestEffortsMap.get(l.activity_id).values()]
          : [],
    })),
    total: count ?? 0,
    page,
    limit,
  }
}
