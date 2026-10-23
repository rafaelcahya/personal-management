/**
 * Returns null if the route doesn't exist or isn't owned by the user.
 */
export async function updateRoute(supabase, userId, routeId, { name }) {
  const { data, error } = await supabase
    .from('rt_saved_routes')
    .update({ name })
    .eq('id', routeId)
    .eq('user_id', userId)
    .select('id, name, distance_m, encoded_polyline, created_at')
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data ?? null
}
