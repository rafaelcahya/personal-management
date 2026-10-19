import { computeSimulation } from './computeSimulation'
import { serializeSimulation } from './serialize'

/**
 * Same shape as a saved simulation, without a stored row: id, name and
 * created_at are null.
 */
export async function previewSimulation(supabase, userId, input) {
  const { has_threshold_pace, ...result } = await computeSimulation(supabase, userId, input)

  return serializeSimulation(
    {
      ...result,
      id: null,
      name: null,
      source: input.source,
      target_mode: input.target_mode,
      target_pace_sec_per_km: input.target_pace_sec_per_km ?? null,
      target_time_sec: input.target_time_sec ?? null,
      created_at: null,
    },
    { has_threshold_pace }
  )
}
