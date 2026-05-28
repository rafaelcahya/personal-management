/**
 * Returns all race log entries for a user ordered by race_date DESC.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function getRaceLogs(supabase, userId) {
  const { data, error } = await supabase
    .from('rt_race_log')
    .select(
      'id, title, race_date, distance_m, finish_time_sec, avg_pace_sec_per_km, avg_hr, elevation_gain_m, position_place, position_male, did_not_finish, activity_id, notes, created_at'
    )
    .eq('user_id', userId)
    .order('race_date', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}
