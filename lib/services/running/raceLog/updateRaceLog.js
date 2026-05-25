/**
 * Recomputes avg_pace_sec_per_km if finish_time_sec or distance_m is being updated.
 * Returns null if did_not_finish is true or required values are absent.
 * @param {number|null|undefined} finishTimeSec
 * @param {number|null|undefined} distanceM
 * @param {boolean} didNotFinish
 * @returns {number|null|undefined} undefined = leave existing value intact
 */
function maybeRecomputePace(finishTimeSec, distanceM, didNotFinish) {
  if (didNotFinish) return null
  if (finishTimeSec == null || distanceM == null) return undefined
  const distanceKm = distanceM / 1000
  return Math.round(finishTimeSec / distanceKm)
}

/**
 * Updates a race log entry. Ownership is enforced via user_id filter.
 * Returns null if the entry is not found or does not belong to the user.
 * avg_pace_sec_per_km is recomputed when finish_time_sec or distance_m changes.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @param {string} raceLogId
 * @param {object} payload
 * @returns {Promise<object|null>}
 */
export async function updateRaceLog(supabase, userId, raceLogId, payload) {
  // Fetch current values to compute pace when only one of the two fields is updated
  const { data: existing, error: fetchError } = await supabase
    .from('rt_race_log')
    .select('finish_time_sec, distance_m, did_not_finish')
    .eq('id', raceLogId)
    .eq('user_id', userId)
    .single()

  if (fetchError || !existing) return null

  const mergedFinishTime =
    payload.finish_time_sec !== undefined ? payload.finish_time_sec : existing.finish_time_sec
  const mergedDistance = payload.distance_m !== undefined ? payload.distance_m : existing.distance_m
  const mergedDnf =
    payload.did_not_finish !== undefined ? payload.did_not_finish : existing.did_not_finish

  const recomputedPace = maybeRecomputePace(mergedFinishTime, mergedDistance, mergedDnf)

  const updatePayload = { ...payload, updated_at: new Date().toISOString() }

  if (recomputedPace !== undefined) {
    updatePayload.avg_pace_sec_per_km = recomputedPace
  }

  if (mergedDnf) {
    updatePayload.finish_time_sec = null
    updatePayload.avg_pace_sec_per_km = null
  }

  const { data, error } = await supabase
    .from('rt_race_log')
    .update(updatePayload)
    .eq('id', raceLogId)
    .eq('user_id', userId)
    .select(
      'id, title, race_date, distance_m, finish_time_sec, avg_pace_sec_per_km, avg_hr, elevation_gain_m, position_overall, position_category, did_not_finish, activity_id, notes, created_at, updated_at'
    )
    .single()

  if (error) throw new Error(error.message)
  if (!data) return null
  return data
}
