import { linkGarminActivity } from './linkGarminActivity'

/**
 * Links one of the user's activities to Garmin by its row id. Does nothing when the row
 * is already linked and has its metrics, so repeated Strava saves do not call Garmin again.
 * Returns { skipped: reason } or { linked, rpeFilled }.
 */
export async function linkGarminActivityById(session, admin, userId, activityId) {
  const { data: activity, error } = await admin
    .from('rt_activities')
    .select('id, started_at, distance_m, garmin_activity_id')
    .eq('id', activityId)
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw new Error(`Failed to load activity: ${error.message}`)
  if (!activity) return { skipped: 'activity_not_found' }

  if (activity.garmin_activity_id) {
    const { data: metrics, error: metricsError } = await admin
      .from('rt_activity_garmin_metrics')
      .select('activity_id')
      .eq('activity_id', activity.id)
      .eq('user_id', userId)
      .maybeSingle()
    if (metricsError) throw new Error(`Failed to check Garmin metrics: ${metricsError.message}`)
    if (metrics) return { skipped: 'already_linked' }
  }

  const saved = await linkGarminActivity(session, admin, userId, activity)
  return { linked: saved != null, rpeFilled: saved?.rpeFilled ?? false }
}
