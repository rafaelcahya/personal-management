/**
 * Computes avg_pace_sec_per_km from finish_time_sec and distance_m.
 * Returns null if either value is missing or did_not_finish is true.
 * @param {number|null|undefined} finishTimeSec
 * @param {number} distanceM
 * @param {boolean} didNotFinish
 * @returns {number|null}
 */
function computeAvgPace(finishTimeSec, distanceM, didNotFinish) {
  if (didNotFinish || !finishTimeSec || !distanceM) return null
  const distanceKm = distanceM / 1000
  return Math.round(finishTimeSec / distanceKm)
}

/**
 * Creates a new race log entry for a user.
 * avg_pace_sec_per_km is computed server-side.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @param {object} payload
 * @returns {Promise<object>}
 */
export async function createRaceLog(supabase, userId, payload) {
  const {
    title,
    race_date,
    distance_m,
    finish_time_sec = null,
    avg_hr = null,
    elevation_gain_m = null,
    position_place = null,
    position_male = null,
    did_not_finish = false,
    activity_id = null,
    notes = null,
  } = payload

  const avg_pace_sec_per_km = computeAvgPace(finish_time_sec, distance_m, did_not_finish)

  const { data, error } = await supabase
    .from('rt_race_log')
    .insert({
      user_id: userId,
      title,
      race_date,
      distance_m,
      finish_time_sec: did_not_finish ? null : finish_time_sec,
      avg_pace_sec_per_km,
      avg_hr,
      elevation_gain_m,
      position_place,
      position_male,
      did_not_finish,
      activity_id,
      notes,
    })
    .select(
      'id, title, race_date, distance_m, finish_time_sec, avg_pace_sec_per_km, avg_hr, elevation_gain_m, position_place, position_male, did_not_finish, activity_id, notes, created_at'
    )
    .single()

  if (error) throw new Error(error.message)
  return data
}
