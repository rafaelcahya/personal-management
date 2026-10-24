import { pickBestMatch } from './matchGarminActivity'

const MAX_GARMIN_ROWS = 2000

/**
 * A Strava activity that matches a Garmin-only run (start within 60s, distance within 2%) takes
 * over that row instead of creating a duplicate. The row keeps its Garmin link and metrics.
 *
 * stravaActivities: raw Strava activities (start_date, distance, ...).
 * toRow: optional mapper to the full rt_activities payload, so the upgraded row gets the same
 * columns a fresh insert would. The row keeps its own perceived_exertion either way.
 * Returns [{ id, external_id }] for every Strava activity that was merged into an existing row.
 */
export async function upgradeGarminRowsForStrava(admin, userId, stravaActivities, toRow = null) {
  const { data: garminRows, error } = await admin
    .from('rt_activities')
    .select('id, started_at, distance_m')
    .eq('user_id', userId)
    .eq('source', 'garmin')
    .limit(MAX_GARMIN_ROWS)
  if (error) throw new Error(`Failed to load Garmin-only runs: ${error.message}`)
  if (!garminRows?.length) return []

  const available = garminRows.map((r) => ({
    id: r.id,
    startMs: new Date(r.started_at).getTime(),
    distanceM: Number(r.distance_m) || 0,
  }))

  const upgraded = []
  for (const a of stravaActivities) {
    const best = pickBestMatch(
      { startMs: new Date(a.start_date).getTime(), distanceM: Number(a.distance) || 0 },
      available
    )
    if (!best) continue

    const { perceived_exertion: _keepRowValue, ...payload } = toRow
      ? toRow(a)
      : {
          source: 'strava',
          external_id: String(a.id),
          started_at: a.start_date,
          duration_sec: a.elapsed_time,
          moving_time_sec: a.moving_time,
          distance_m: a.distance,
          raw_data: a,
        }

    const { data, error: updateError } = await admin
      .from('rt_activities')
      .update(payload)
      .eq('id', best.id)
      .eq('user_id', userId)
      .eq('source', 'garmin')
      .select('id, external_id')
    if (updateError) throw new Error(`Failed to upgrade Garmin run: ${updateError.message}`)

    if (data?.length) {
      upgraded.push(data[0])
      available.splice(available.indexOf(best), 1)
    }
  }
  return upgraded
}
