import { SimulationError } from './errors'
import { SIMULATION_SUMMARY_COLUMNS, serializeSimulationSummary } from './serialize'

export async function updateSimulation(supabase, userId, id, { name }) {
  const { data, error } = await supabase
    .from('rt_route_simulations')
    .update({ name })
    .eq('id', id)
    .eq('user_id', userId)
    .select(SIMULATION_SUMMARY_COLUMNS)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) throw new SimulationError('Simulation not found', 404)
  return serializeSimulationSummary(data)
}
