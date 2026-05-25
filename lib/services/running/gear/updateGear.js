/**
 * Updates user-managed gear fields (category, retirement_km).
 * Only these two fields are user-editable — Strava-owned fields are never updated here.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @param {string} gearId
 * @param {{ category?: string|null, retirement_km?: number|null }} payload
 * @returns {Promise<Object>}
 */
export async function updateGear(supabase, userId, gearId, payload) {
  const { data, error } = await supabase
    .from('rt_gear')
    .update(payload)
    .eq('id', gearId)
    .eq('user_id', userId)
    .select(
      'id, name, brand_name, model_name, distance_m, retired, category, retirement_km, last_fetched_at'
    )
    .single()

  if (error) throw new Error(error.message)
  if (!data) throw new Error('Gear not found')
  return data
}
