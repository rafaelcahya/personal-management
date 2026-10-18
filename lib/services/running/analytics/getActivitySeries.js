const SERIES_COLUMNS =
  'id, started_at, activity_type, distance_m, avg_pace_sec_per_km, avg_hr, elevation_gain_m, efficiency_factor, estimated_vo2max, avg_watts, weighted_avg_watts, device_watts'

// Supabase caps a single response at 1000 rows by default.
const CHUNK_SIZE = 1000
const MAX_CHUNKS = 20

/**
 * Returns every activity of the user (newest first) with only the columns the
 * analytics charts read. Pages through Supabase in CHUNK_SIZE chunks, so there is no
 * row cap below MAX_CHUNKS * CHUNK_SIZE (a safety stop against runaway loops).
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 */
export async function getActivitySeries(supabase, userId) {
  const rows = []
  let total = null

  for (let chunk = 0; chunk < MAX_CHUNKS; chunk++) {
    const from = chunk * CHUNK_SIZE
    const { data, count, error } = await supabase
      .from('rt_activities')
      .select(SERIES_COLUMNS, chunk === 0 ? { count: 'exact' } : undefined)
      .eq('user_id', userId)
      .order('started_at', { ascending: false })
      .order('id', { ascending: true })
      .range(from, from + CHUNK_SIZE - 1)

    if (error) throw new Error(error.message)

    if (chunk === 0) total = count ?? 0
    rows.push(...(data ?? []))

    if (rows.length >= total || !data || data.length === 0) break
  }

  return rows
}
