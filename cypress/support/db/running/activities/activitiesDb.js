export async function getActivityListFromDb(supabase, userId) {
  const { data, error } = await supabase
    .from('rt_activities')
    .select(
      'id, activity_type, started_at, distance_m, duration_sec, moving_time_sec, avg_pace_sec_per_km, avg_hr, name, source, elevation_gain_m, calories, pr_count, workout_type'
    )
    .eq('user_id', userId)
    .order('started_at', { ascending: false })
  if (error) throw new Error(`DB query failed: ${error.message}`)
  return data || []
}

export async function getSingleActivityFromDb(supabase, activityId, userId) {
  const { data, error } = await supabase
    .from('rt_activities')
    .select('*')
    .eq('id', activityId)
    .eq('user_id', userId)
    .single()
  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`DB query failed: ${error.message}`)
  }
  return data
}

export async function getActivityCountFromDb(supabase, userId) {
  const { count, error } = await supabase
    .from('rt_activities')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
  if (error) throw new Error(`DB query failed: ${error.message}`)
  return count
}
