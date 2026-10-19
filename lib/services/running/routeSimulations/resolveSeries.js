import { parseGpx, hasElevation, MAX_GPX_POINTS } from '@/lib/running/gpx'
import { pointsToDistEle } from '@/lib/running/routeSimulation'
import { SimulationError } from './errors'

// Matches the PostgREST max-rows cap; a full page means there may be more.
// (activity_id, timestamp) is the table primary key, so the order is already total.
const STREAM_PAGE_SIZE = 1000
const MAX_STREAM_PAGES = 60 // 60,000 rows, about 16 h at 1 Hz

function fetchStreamPage(supabase, activityId, page) {
  const from = page * STREAM_PAGE_SIZE
  return supabase
    .from('rt_activity_streams')
    .select('distance_m, altitude_m')
    .eq('activity_id', activityId)
    .order('timestamp', { ascending: true })
    .range(from, from + STREAM_PAGE_SIZE - 1)
}

async function fetchAllStreamRows(supabase, activityId, firstPage) {
  const rows = []
  let result = await firstPage
  for (let page = 0; page < MAX_STREAM_PAGES; page++) {
    if (result.error) throw result.error
    const batch = result.data ?? []
    rows.push(...batch)
    if (batch.length < STREAM_PAGE_SIZE) return rows
    if (page === MAX_STREAM_PAGES - 1) break // a full last page: do not fetch past the cap
    result = await fetchStreamPage(supabase, activityId, page + 1)
  }
  throw new SimulationError('This activity is too long to simulate', 422)
}

async function resolveActivitySeries(supabase, userId, activityId) {
  // The streams table has no user_id, so ownership is checked on rt_activities.
  // It runs next to the first page; rows are only used once ownership passes.
  const [ownership, firstPage] = await Promise.all([
    supabase
      .from('rt_activities')
      .select('id')
      .eq('id', activityId)
      .eq('user_id', userId)
      .maybeSingle(),
    fetchStreamPage(supabase, activityId, 0),
  ])

  if (ownership.error) throw ownership.error
  if (!ownership.data) throw new SimulationError('Activity not found', 404)

  const rows = await fetchAllStreamRows(supabase, activityId, firstPage)
  return rows
    .filter((r) => r.distance_m != null && r.altitude_m != null)
    .map((r) => ({ distM: Number(r.distance_m), ele: Number(r.altitude_m) }))
    .filter((p) => Number.isFinite(p.distM) && Number.isFinite(p.ele))
}

/**
 * Turn the request input into a { distM, ele } elevation series the simulator
 * can run on, plus the source activity id when the route came from an activity.
 */
export async function resolveSeries(supabase, userId, input) {
  if (input.source === 'gpx_upload') {
    const points = parseGpx(input.gpx)
    if (points.length > MAX_GPX_POINTS) {
      throw new SimulationError(`This GPX has too many points (max ${MAX_GPX_POINTS})`, 422)
    }
    if (points.length < 2) {
      throw new SimulationError('Could not read this GPX file', 422)
    }
    if (!hasElevation(points)) {
      throw new SimulationError("This GPX has no elevation data, so it can't be simulated", 422)
    }
    return { series: pointsToDistEle(points), sourceActivityId: null }
  }

  const series = await resolveActivitySeries(supabase, userId, input.activity_id)
  if (series.length < 2) {
    throw new SimulationError('This activity has no elevation data', 422)
  }
  return { series, sourceActivityId: input.activity_id }
}
