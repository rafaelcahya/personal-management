export async function deleteSimulation(supabase, userId, id) {
  const { error } = await supabase
    .from('rt_route_simulations')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
}
