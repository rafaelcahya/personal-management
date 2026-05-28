export async function getRaceLog(supabase, userId, id) {
  const { data, error } = await supabase
    .from('rt_race_log')
    .select(
      'id, title, race_date, distance_m, finish_time_sec, avg_pace_sec_per_km, avg_hr, elevation_gain_m, position_place, position_male, did_not_finish, activity_id, notes, created_at'
    )
    .eq('user_id', userId)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(error.message)
  }
  return data
}
