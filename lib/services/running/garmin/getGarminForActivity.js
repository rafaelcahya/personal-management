import { GARMIN_METRICS_COLUMNS } from './mapGarminMetrics'

/** The merged `garmin` object for one activity, or null when no Garmin run is linked. */
export async function getGarminForActivity(supabase, userId, activityId) {
  const { data, error } = await supabase
    .from('rt_activity_garmin_metrics')
    .select(GARMIN_METRICS_COLUMNS)
    .eq('activity_id', activityId)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data ?? null
}

/** Map of activity id to training_effect_label for the list. Missing ids have no Garmin data. */
export async function getGarminListFlags(supabase, userId, activityIds) {
  if (activityIds.length === 0) return new Map()
  const { data, error } = await supabase
    .from('rt_activity_garmin_metrics')
    .select('activity_id, training_effect_label')
    .eq('user_id', userId)
    .in('activity_id', activityIds)

  if (error) throw new Error(error.message)
  return new Map((data ?? []).map((r) => [r.activity_id, r.training_effect_label ?? null]))
}
