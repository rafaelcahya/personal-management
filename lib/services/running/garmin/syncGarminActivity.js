import { GARMIN_MATCH_WINDOW_SEC } from '@/lib/constants/garmin'
import { pickBestMatch } from './matchGarminActivity'
import { fetchGarminDetail } from './linkGarminActivity'
import { mapGarminActivityRow } from './mapGarminActivityRow'
import { saveGarminMetrics } from './saveGarminMetrics'

const UNIQUE_VIOLATION = '23505'
const ROW_COLUMNS = 'id, started_at, distance_m, garmin_activity_id'

async function findRowByGarminId(admin, userId, garminId) {
  const { data, error } = await admin
    .from('rt_activities')
    .select(ROW_COLUMNS)
    .eq('user_id', userId)
    .eq('garmin_activity_id', garminId)
    .maybeSingle()
  if (error) throw new Error(`Failed to look up Garmin activity: ${error.message}`)
  return data
}

async function hasMetrics(admin, userId, activityId) {
  const { data, error } = await admin
    .from('rt_activity_garmin_metrics')
    .select('activity_id')
    .eq('activity_id', activityId)
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw new Error(`Failed to check Garmin metrics: ${error.message}`)
  return data != null
}

async function findUnlinkedMatch(admin, userId, garmin) {
  const windowMs = (GARMIN_MATCH_WINDOW_SEC + 1) * 1000
  const { data, error } = await admin
    .from('rt_activities')
    .select(ROW_COLUMNS)
    .eq('user_id', userId)
    .is('garmin_activity_id', null)
    .gte('started_at', new Date(garmin.startMs - windowMs).toISOString())
    .lte('started_at', new Date(garmin.startMs + windowMs).toISOString())
  if (error) throw new Error(`Failed to look for a matching activity: ${error.message}`)

  const rows = (data ?? []).map((r) => ({
    ...r,
    startMs: new Date(r.started_at).getTime(),
    distanceM: Number(r.distance_m) || 0,
  }))
  return pickBestMatch(garmin, rows)
}

/**
 * Handles one Garmin run: skip it if it is already stored, link it to a matching
 * unlinked run, or import it as a Garmin-only run.
 *
 * garmin: { activityId, startMs, distanceM }
 * Returns 'skipped' | 'linked' | 'imported'.
 */
export async function syncGarminActivity(session, admin, userId, garmin) {
  const existing = await findRowByGarminId(admin, userId, garmin.activityId)
  if (existing && (await hasMetrics(admin, userId, existing.id))) return 'skipped'

  const match = existing ?? (await findUnlinkedMatch(admin, userId, garmin))
  const detail = await fetchGarminDetail(session, garmin.activityId)

  if (match) {
    const saved = await saveGarminMetrics(admin, userId, match.id, garmin.activityId, detail)
    return saved ? 'linked' : 'skipped'
  }

  const row = mapGarminActivityRow(userId, detail)
  if (!row) return 'skipped'

  const { data: inserted, error } = await admin
    .from('rt_activities')
    .insert(row)
    .select('id')
    .single()
  if (error) {
    if (error.code === UNIQUE_VIOLATION) return 'skipped'
    throw new Error(`Failed to import Garmin activity: ${error.message}`)
  }

  await saveGarminMetrics(admin, userId, inserted.id, garmin.activityId, detail)
  return 'imported'
}
