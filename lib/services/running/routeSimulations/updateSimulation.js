import { SimulationError } from './errors'

export async function updateSimulation(supabase, userId, id, { name }) {
  const { data, error } = await supabase
    .from('rt_route_simulations')
    .update({ name })
    .eq('id', id)
    .eq('user_id', userId)
    .select(
      'id, name, source, total_distance_m, total_elevation_gain_m, predicted_time_sec, is_realistic, created_at'
    )
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) throw new SimulationError('Simulation not found', 404)
  return data
}
