import { GARMIN_METRICS_COLUMNS, mapGarminMetrics } from './mapGarminMetrics'

const UNIQUE_VIOLATION = '23505'

/**
 * Links a Garmin activity to one of the user's rows, stores its metrics and fills
 * perceived_exertion from the Garmin RPE only when it is still empty.
 * `detail` is the response of GET /activity-service/activity/{id}.
 *
 * Returns { garmin, rpeFilled }, or null when the Garmin id is already linked to another run.
 */
export async function saveGarminMetrics(admin, userId, activityId, garminActivityId, detail) {
  const metrics = mapGarminMetrics(detail?.summaryDTO)

  const { error: linkError } = await admin
    .from('rt_activities')
    .update({ garmin_activity_id: garminActivityId })
    .eq('id', activityId)
    .eq('user_id', userId)
  if (linkError) {
    if (linkError.code === UNIQUE_VIOLATION) return null
    throw new Error(`Failed to link Garmin activity: ${linkError.message}`)
  }

  // matched_at is left out on purpose so a refresh keeps the original match time
  const { error: metricsError } = await admin.from('rt_activity_garmin_metrics').upsert(
    {
      ...metrics,
      activity_id: activityId,
      user_id: userId,
      garmin_activity_id: garminActivityId,
      fetched_at: new Date().toISOString(),
    },
    { onConflict: 'activity_id' }
  )
  if (metricsError) throw new Error(`Failed to save Garmin metrics: ${metricsError.message}`)

  let rpeFilled = false
  if (metrics.rpe != null) {
    const { data, error } = await admin
      .from('rt_activities')
      .update({ perceived_exertion: metrics.rpe })
      .eq('id', activityId)
      .eq('user_id', userId)
      .is('perceived_exertion', null)
      .select('id')
    if (error) throw new Error(`Failed to fill perceived exertion: ${error.message}`)
    rpeFilled = (data?.length ?? 0) > 0
  }

  const { data: garmin, error: readError } = await admin
    .from('rt_activity_garmin_metrics')
    .select(GARMIN_METRICS_COLUMNS)
    .eq('activity_id', activityId)
    .eq('user_id', userId)
    .single()
  if (readError) throw new Error(`Failed to read Garmin metrics: ${readError.message}`)

  return { garmin, rpeFilled }
}
