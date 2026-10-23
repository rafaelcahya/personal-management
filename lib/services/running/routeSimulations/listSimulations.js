import { SIMULATION_SUMMARY_COLUMNS, serializeSimulationSummary } from './serialize'

export const DEFAULT_LIST_LIMIT = 50

export async function listSimulations(supabase, userId, { limit = DEFAULT_LIST_LIMIT } = {}) {
  const { data, error } = await supabase
    .from('rt_route_simulations')
    .select(SIMULATION_SUMMARY_COLUMNS)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)
  return (data ?? []).map(serializeSimulationSummary)
}
