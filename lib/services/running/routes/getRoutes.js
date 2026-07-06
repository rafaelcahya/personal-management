export async function getRoutes(supabase, userId) {
  const { data, error } = await supabase
    .from('rt_saved_routes')
    .select('id, name, distance_m, encoded_polyline, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}
