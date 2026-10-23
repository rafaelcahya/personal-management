/**
 * Returns false if the route doesn't exist or isn't owned by the user.
 */
export async function deleteRoute(supabase, userId, routeId) {
  const { data, error } = await supabase
    .from('rt_saved_routes')
    .delete()
    .eq('id', routeId)
    .eq('user_id', userId)
    .select('id')

  if (error) throw new Error(error.message)
  return data?.length > 0
}
