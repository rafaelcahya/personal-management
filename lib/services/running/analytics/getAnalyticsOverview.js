import { getCalorieTrend } from './getCalorieTrend'
import { getEnduranceScoreWeekly } from './getEnduranceScoreWeekly'
import { getFitnessAgeWeekly } from './getFitnessAgeWeekly'
import { getPersonalBests } from './getPersonalBests'
import {
  getCachedSessionProfile,
  getCachedTemperatureEfficiency,
} from '@/lib/services/running/analyticsCache'

/**
 * Runs the six independent analytics sections in parallel. A failing section is
 * reported in `errors` and set to null so the other sections still render.
 *
 * calorie_trend, endurance_score and fitness_age use the user-session client and filter by
 * user_id. session_profile and temperature_efficiency go through analyticsCache.js with the
 * admin client (they filter by user_id). personal_bests relies on RLS (policy joins
 * rt_activities.user_id = auth.uid()).
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase user-session client
 * @param {string} userId
 * @returns {Promise<{ data: Record<string, unknown>, errors: Record<string, string> }>}
 */
export async function getAnalyticsOverview(supabase, userId) {
  const sections = {
    calorie_trend: () => getCalorieTrend(supabase, userId),
    endurance_score: () => getEnduranceScoreWeekly(supabase, userId),
    fitness_age: () => getFitnessAgeWeekly(supabase, userId),
    // No user_id column on best efforts; RLS policy scopes it via rt_activities.user_id.
    personal_bests: () => getPersonalBests(supabase),
    session_profile: () => getCachedSessionProfile(userId),
    temperature_efficiency: () => getCachedTemperatureEfficiency(userId),
  }

  const keys = Object.keys(sections)
  const settled = await Promise.allSettled(keys.map((key) => sections[key]()))

  const data = {}
  const errors = {}
  settled.forEach((result, i) => {
    const key = keys[i]
    if (result.status === 'fulfilled') {
      data[key] = result.value
    } else {
      console.error(`[running/analytics/overview] ${key} failed`, result.reason)
      data[key] = null
      errors[key] = 'Failed to load'
    }
  })

  return { data, errors }
}
