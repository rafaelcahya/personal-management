import { parseGpx, hasElevation } from '@/lib/running/gpx'
import { pointsToDistEle } from '@/lib/running/routeSimulation'
import { SimulationError } from './errors'

/**
 * Turn the request input into a { distM, ele } elevation series the simulator
 * can run on, plus the source activity id when the route came from an activity.
 */
export async function resolveSeries(supabase, userId, input) {
  if (input.source === 'gpx_upload') {
    const points = parseGpx(input.gpx)
    if (points.length < 2) {
      throw new SimulationError('Could not read this GPX file', 422)
    }
    if (!hasElevation(points)) {
      throw new SimulationError("This GPX has no elevation data, so it can't be simulated", 422)
    }
    return { series: pointsToDistEle(points), sourceActivityId: null }
  }

  // source === 'activity'
  const { data: activity, error: activityError } = await supabase
    .from('rt_activities')
    .select('id')
    .eq('id', input.activity_id)
    .eq('user_id', userId)
    .maybeSingle()

  if (activityError) throw activityError
  if (!activity) throw new SimulationError('Activity not found', 404)

  const { data: rows, error: streamsError } = await supabase
    .from('rt_activity_streams')
    .select('distance_m, altitude_m')
    .eq('activity_id', input.activity_id)
    .order('timestamp', { ascending: true })

  if (streamsError) throw streamsError

  const series = (rows ?? [])
    .filter((r) => Number.isFinite(r.distance_m) && Number.isFinite(r.altitude_m))
    .map((r) => ({ distM: Number(r.distance_m), ele: Number(r.altitude_m) }))

  if (series.length < 2) {
    throw new SimulationError('This activity has no elevation data', 422)
  }

  return { series, sourceActivityId: input.activity_id }
}
