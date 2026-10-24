import { upgradeGarminRowsForStrava } from '@/lib/services/running/garmin/upgradeGarminRows'

/**
 * The one place that creates source = 'strava' rows. A Strava run that matches a Garmin-only
 * run (start within 60s, distance within 2%) takes over that row, so it is never duplicated.
 * Every code path that saves new Strava activities must go through here.
 *
 * activities: raw Strava activities that are not stored yet.
 * toRow: maps one raw Strava activity to its rt_activities insert payload.
 * Returns [{ id, external_id }] for upgraded and inserted rows, so the caller can send
 * strava/fetch-streams for each of them.
 */
export async function insertStravaActivities(admin, userId, activities, toRow) {
  if (activities.length === 0) return []

  const upgraded = await upgradeGarminRowsForStrava(admin, userId, activities, toRow)
  const upgradedIds = new Set(upgraded.map((r) => r.external_id))
  const fresh = activities.filter((a) => !upgradedIds.has(String(a.id)))
  if (fresh.length === 0) return upgraded

  const { data, error } = await admin
    .from('rt_activities')
    .insert(fresh.map(toRow))
    .select('id, external_id')
  if (error) throw new Error(`Insert failed: ${error.message}`)

  return [...upgraded, ...(data ?? [])]
}
