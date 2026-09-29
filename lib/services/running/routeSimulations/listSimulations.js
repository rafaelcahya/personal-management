export async function listSimulations(supabase, userId) {
  const { data, error } = await supabase
    .from('rt_route_simulations')
    .select(
      'id, name, source, total_distance_m, total_elevation_gain_m, predicted_time_sec, is_realistic, created_at'
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}
