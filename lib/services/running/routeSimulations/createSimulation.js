import { computeSimulation } from './computeSimulation'

export async function createSimulation(supabase, userId, input) {
  const result = await computeSimulation(supabase, userId, input)

  const { data, error } = await supabase
    .from('rt_route_simulations')
    .insert({
      user_id: userId,
      name: input.name,
      source: input.source,
      source_activity_id: result.source_activity_id,
      target_mode: input.target_mode,
      target_pace_sec_per_km: input.target_pace_sec_per_km ?? null,
      target_time_sec: input.target_time_sec ?? null,
      total_distance_m: result.total_distance_m,
      total_elevation_gain_m: result.total_elevation_gain_m,
      total_elevation_loss_m: result.total_elevation_loss_m,
      effort_flat_pace_sec_per_km: result.effort_flat_pace_sec_per_km,
      predicted_time_sec: result.predicted_time_sec,
      is_realistic: result.is_realistic,
      suggested_time_sec: result.suggested_time_sec,
      elevation_profile: result.elevation_profile,
      km_splits: result.km_splits,
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return { ...data, hr_band: result.hr_band }
}
