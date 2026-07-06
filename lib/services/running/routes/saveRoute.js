export async function saveRoute(supabase, userId, payload) {
  const { name, waypoints, encoded_polyline, distance_m } = payload

  const { data, error } = await supabase
    .from('rt_saved_routes')
    .insert({ user_id: userId, name, waypoints, encoded_polyline, distance_m })
    .select('id, name, distance_m, encoded_polyline, created_at')
    .single()

  if (error) throw new Error(error.message)
  return data
}
