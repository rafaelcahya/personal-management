import { createAdminClient } from '@/lib/supabase/admin'
import { invalidateRunningAnalytics } from '@/lib/services/running/analyticsCache'
import { createGarminSession } from './garminClient'
import { linkGarminActivity } from './linkGarminActivity'

/**
 * Re-fetches the Garmin metrics for one activity. Matches first when it is not linked yet.
 *
 * Returns null when the activity does not exist or is not the user's,
 * { garmin: null } when no Garmin run matches, otherwise { garmin }.
 * Throws GarminError (not_connected | expired | invalid | unavailable | rate_limited).
 */
export async function refreshGarminMetrics(supabase, userId, activityId) {
  const { data: activity, error } = await supabase
    .from('rt_activities')
    .select('id, started_at, distance_m, garmin_activity_id')
    .eq('id', activityId)
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw new Error(error.message)
  if (!activity) return null

  const admin = createAdminClient()
  const session = await createGarminSession(admin, userId)
  const saved = await linkGarminActivity(session, admin, userId, activity)
  if (!saved) return { garmin: null }

  if (saved.rpeFilled) invalidateRunningAnalytics(userId)
  return { garmin: saved.garmin }
}
