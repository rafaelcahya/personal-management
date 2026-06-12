const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000

/**
 * Returns monthly calorie burn totals for the past 6 months.
 * Formula: kcal = (1.036 × weight_kg × distance_km) + (elevation_gain_m / 100 × 2)
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @returns {Promise<{ data: Array<{ month: string, total_kcal: number }>, weight_kg: number | null }>}
 */
export async function getCalorieTrend(supabase, userId) {
  const { data: profile, error: profileError } = await supabase
    .from('rt_users')
    .select('weight_kg')
    .eq('id', userId)
    .maybeSingle()

  if (profileError) throw new Error(profileError.message)

  const weight_kg = profile?.weight_kg ?? null

  if (weight_kg === null) {
    return { data: [], weight_kg: null }
  }

  const sixMonthsAgo = new Date(Date.now() - SIX_MONTHS_MS).toISOString()

  const { data: activities, error: activitiesError } = await supabase
    .from('rt_activities')
    .select('distance_m, elevation_gain_m, started_at')
    .eq('user_id', userId)
    .gte('started_at', sixMonthsAgo)

  if (activitiesError) throw new Error(activitiesError.message)

  if (!activities || activities.length === 0) {
    return { data: [], weight_kg }
  }

  const monthlyTotals = {}

  for (const activity of activities) {
    const distanceKm = (activity.distance_m ?? 0) / 1000
    const elevationGain = activity.elevation_gain_m ?? 0
    const kcal = 1.036 * weight_kg * distanceKm + (elevationGain / 100) * 2

    const date = new Date(activity.started_at)
    const month = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`

    if (!monthlyTotals[month]) {
      monthlyTotals[month] = 0
    }
    monthlyTotals[month] += kcal
  }

  const data = Object.entries(monthlyTotals)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total_kcal]) => ({ month, total_kcal: Math.round(total_kcal) }))

  return { data, weight_kg }
}
