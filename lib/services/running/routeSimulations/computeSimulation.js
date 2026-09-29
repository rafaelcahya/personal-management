import { simulateRoute } from '@/lib/running/routeSimulation'
import { resolveSeries } from './resolveSeries'

/**
 * Resolve the route source, pull the runner's pacing anchors, and run the
 * even-effort simulation. Shared by both preview (stateless) and save.
 */
export async function computeSimulation(supabase, userId, input) {
  const { series, sourceActivityId } = await resolveSeries(supabase, userId, input)

  const { data: profile } = await supabase
    .from('rt_users')
    .select('threshold_pace_sec, max_hr')
    .eq('id', userId)
    .maybeSingle()

  const result = simulateRoute({
    series,
    targetMode: input.target_mode,
    targetPaceSecPerKm: input.target_pace_sec_per_km,
    targetTimeSec: input.target_time_sec,
    thresholdPaceSec: profile?.threshold_pace_sec ?? null,
    maxHr: profile?.max_hr ?? null,
  })

  return {
    ...result,
    source_activity_id: sourceActivityId,
    has_threshold_pace: profile?.threshold_pace_sec != null,
  }
}
