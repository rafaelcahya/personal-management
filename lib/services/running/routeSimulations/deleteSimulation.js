import { SimulationError } from './errors'

export async function deleteSimulation(supabase, userId, id) {
  const { data, error } = await supabase
    .from('rt_route_simulations')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
    .select('id')

  if (error) throw new Error(error.message)
  if (!data?.length) throw new SimulationError('Simulation not found', 404)
}
