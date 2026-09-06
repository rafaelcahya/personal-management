// Shoes wear out around 500-800 km. We alert once when a pair reaches the runner's
// own retirement target (rt_gear.retirement_km); when they haven't set one, fall
// back to a sensible default. mileage_notified_at makes the alert fire exactly once.

export const DEFAULT_RETIREMENT_KM = 500

/**
 * Resolves the wear threshold (in metres) for a gear row.
 * @param {{ retirement_km?: number|null }} gear
 * @returns {number}
 */
export function gearThresholdMeters(gear) {
  const km =
    gear?.retirement_km != null && gear.retirement_km > 0
      ? gear.retirement_km
      : DEFAULT_RETIREMENT_KM
  return km * 1000
}

/**
 * Whether a gear row should trigger a (first) mileage alert now.
 * @param {{ distance_m?: number, retired?: boolean, retirement_km?: number|null, mileage_notified_at?: string|null }} gear
 * @returns {boolean}
 */
export function needsMileageAlert(gear) {
  if (!gear || gear.retired) return false
  if (gear.mileage_notified_at) return false
  return (gear.distance_m ?? 0) >= gearThresholdMeters(gear)
}

/**
 * Returns the active gear that has crossed its wear threshold and not yet been
 * notified, for a single user.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - admin client
 * @param {string} userId
 * @returns {Promise<Array<{ id: string, name: string, distance_m: number, thresholdM: number }>>}
 */
export async function getGearMileageAlerts(supabase, userId) {
  const { data, error } = await supabase
    .from('rt_gear')
    .select(
      'id, name, brand_name, model_name, distance_m, retired, retirement_km, mileage_notified_at'
    )
    .eq('user_id', userId)
    .eq('retired', false)
    .is('mileage_notified_at', null)

  if (error) throw new Error(error.message)

  return (data ?? []).filter(needsMileageAlert).map((g) => ({
    id: g.id,
    name: g.name || [g.brand_name, g.model_name].filter(Boolean).join(' ') || 'Your shoes',
    distance_m: Math.round(g.distance_m ?? 0),
    thresholdM: gearThresholdMeters(g),
  }))
}
