const BEST_EFFORT_DISTANCES = ['1 mile', '5K', '10K', '15K', 'Half-Marathon']

const DISTANCE_METERS = {
  '1 mile': 1609,
  '5K': 5000,
  '10K': 10000,
  '15K': 15000,
  'Half-Marathon': 21097,
}

const TOP_N = 5

/**
 * Returns top 5 fastest efforts per distance for a user.
 * RLS on rt_activity_best_efforts already scopes results to the authenticated user.
 * Fetches all target-distance efforts, then groups and ranks in JS.
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @returns {Promise<Record<string, Array<{ rank: number, elapsed_time_sec: number, pace_sec_per_km: number | null, date: string, activity_id: string, pr_rank: number | null }>>>}
 */
export async function getPersonalBests(supabase) {
  const { data, error } = await supabase
    .from('rt_activity_best_efforts')
    .select('elapsed_time_sec, pr_rank, started_at, name, distance_m, activity_id')
    .in('name', BEST_EFFORT_DISTANCES)
    .order('name', { ascending: true })
    .order('elapsed_time_sec', { ascending: true })

  if (error) throw new Error(error.message)

  const result = {}
  for (const distance of BEST_EFFORT_DISTANCES) {
    result[distance] = []
  }

  if (!data) return result

  const grouped = {}
  for (const row of data) {
    if (!grouped[row.name]) grouped[row.name] = []
    grouped[row.name].push(row)
  }

  for (const distance of BEST_EFFORT_DISTANCES) {
    const rows = grouped[distance] ?? []
    const top = rows.slice(0, TOP_N)

    result[distance] = top.map((row, index) => {
      const distanceM = DISTANCE_METERS[row.name] ?? Number(row.distance_m)
      const paceSec = distanceM > 0 ? Math.round(row.elapsed_time_sec / (distanceM / 1000)) : null

      return {
        rank: index + 1,
        elapsed_time_sec: row.elapsed_time_sec,
        pace_sec_per_km: paceSec,
        date: row.started_at,
        activity_id: row.activity_id,
        pr_rank: row.pr_rank,
      }
    })
  }

  return result
}
