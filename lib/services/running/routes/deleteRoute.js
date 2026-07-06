export async function deleteRoute(supabase, userId, routeId) {
  const { error } = await supabase
    .from('rt_saved_routes')
    .delete()
    .eq('id', routeId)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
}
