export async function getRaceLogListFromDb(supabase, userId) {
  const { data, error } = await supabase
    .from('rt_race_log')
    .select(
      'id, title, race_date, distance_m, finish_time_sec, avg_pace_sec_per_km, avg_hr, elevation_gain_m, position_place, position_male, did_not_finish, activity_id, notes, created_at'
    )
    .eq('user_id', userId)
    .order('race_date', { ascending: false })
  if (error) throw new Error(`DB query failed: ${error.message}`)
  return data || []
}

export async function getSingleRaceLogFromDb(supabase, raceLogId, userId) {
  const { data, error } = await supabase
    .from('rt_race_log')
    .select('*')
    .eq('id', raceLogId)
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw new Error(`DB query failed: ${error.message}`)
  return data
}

export async function getRaceLogCountFromDb(supabase, userId) {
  const { count, error } = await supabase
    .from('rt_race_log')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
  if (error) throw new Error(`DB query failed: ${error.message}`)
  return count
}

// rt_race_log has no deleted_at column — deleteRaceLog() performs a hard delete.
// This is the same query as getSingleRaceLogFromDb; kept as a distinct, explicitly
// named helper so delete-verification tests document the hard-delete assumption
// rather than relying on the same lookup used for ordinary reads.
export async function getSingleRaceLogIncludeDeletedFromDb(supabase, raceLogId, userId) {
  const { data, error } = await supabase
    .from('rt_race_log')
    .select('*')
    .eq('id', raceLogId)
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw new Error(`DB query failed: ${error.message}`)
  return data
}
