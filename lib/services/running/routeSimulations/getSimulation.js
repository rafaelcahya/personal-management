import { SimulationError } from './errors'

export async function getSimulation(supabase, userId, id) {
  const { data, error } = await supabase
    .from('rt_route_simulations')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) throw new SimulationError('Simulation not found', 404)
  return data
}
