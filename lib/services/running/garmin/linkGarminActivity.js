import { isWithinMatchWindow, pickBestMatch } from './matchGarminActivity'
import { listGarminRunsAround } from './listGarminRuns'
import { mergeGarminOnlyRow } from './mergeGarminOnlyRow'
import { saveGarminMetrics } from './saveGarminMetrics'

const DETAIL_PATH = '/activity-service/activity'

export function fetchGarminDetail(session, garminActivityId) {
  return session.get(`${DETAIL_PATH}/${garminActivityId}`)
}

async function findLinkedRows(admin, userId, ids) {
  if (ids.length === 0) return new Map()
  const { data, error } = await admin
    .from('rt_activities')
    .select('id, source, garmin_activity_id, started_at, distance_m')
    .eq('user_id', userId)
    .in('garmin_activity_id', ids)
  if (error) throw new Error(`Failed to check linked Garmin activities: ${error.message}`)
  return new Map((data ?? []).map((r) => [Number(r.garmin_activity_id), r]))
}

/**
 * A Garmin id that is already taken can still be used when the row holding it is a Garmin-only
 * duplicate of this very run. Any other holder (for example another Strava run) blocks it.
 */
function isMergeable(holder, target) {
  return (
    holder.source === 'garmin' &&
    isWithinMatchWindow(target, {
      startMs: new Date(holder.started_at).getTime(),
      distanceM: Number(holder.distance_m) || 0,
    })
  )
}

/**
 * Finds the Garmin run for one of the user's activities (start within 60s, distance within 2%)
 * and stores its metrics. When the row already has a garmin_activity_id the metrics are re-fetched.
 * When the match is held by a Garmin-only duplicate of this run, that row is merged into this one.
 *
 * activity: { id, started_at, distance_m, garmin_activity_id }
 * Returns { garmin, rpeFilled } or null when nothing matches.
 */
export async function linkGarminActivity(session, admin, userId, activity) {
  let garminId = activity.garmin_activity_id ? Number(activity.garmin_activity_id) : null

  if (!garminId) {
    const target = {
      startMs: new Date(activity.started_at).getTime(),
      distanceM: Number(activity.distance_m) || 0,
    }
    const candidates = await listGarminRunsAround(session, target.startMs)
    const holders = await findLinkedRows(
      admin,
      userId,
      candidates.map((c) => c.activityId)
    )
    const usable = candidates.filter((c) => {
      const holder = holders.get(Number(c.activityId))
      return !holder || holder.id === activity.id || isMergeable(holder, target)
    })
    const best = pickBestMatch(target, usable)
    if (!best) return null
    garminId = best.activityId

    const holder = holders.get(Number(garminId))
    if (holder && holder.id !== activity.id) {
      await mergeGarminOnlyRow(admin, userId, holder, activity.id)
    }
  }

  const detail = await fetchGarminDetail(session, garminId)
  return saveGarminMetrics(admin, userId, activity.id, garminId, detail)
}
