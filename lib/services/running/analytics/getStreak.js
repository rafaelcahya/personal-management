const DAY_MS = 24 * 60 * 60 * 1000
const WEEK_MS = 7 * DAY_MS
const LOOKBACK_MS = 2 * 365 * DAY_MS

function weekStartMondayUTC(ms) {
  const d = new Date(ms)
  const dow = d.getUTCDay() // 0 (Sun) .. 6 (Sat)
  const daysSinceMonday = dow === 0 ? 6 : dow - 1
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - daysSinceMonday * DAY_MS
}

/**
 * Computes the weekly streak from the set of local week-start timestamps that
 * contain activity.
 *
 * @param {Set<number>} weekStarts - Monday-start week-start times (ms) that have >=1 activity
 * @param {number} currentWeekStart - Monday-start time (ms) of the current week
 * @param {number} dayOfWeekIndex - 0 (Mon) .. 6 (Sun) for the user's local "now"
 * @returns {{ current_weeks: number, best_weeks: number, at_risk: boolean, active_this_week: boolean, unit: 'week' }}
 */
export function computeWeeklyStreak(weekStarts, currentWeekStart, dayOfWeekIndex) {
  const activeThisWeek = weekStarts.has(currentWeekStart)
  const prevWeekStart = currentWeekStart - WEEK_MS

  let anchor = null
  if (activeThisWeek) anchor = currentWeekStart
  else if (weekStarts.has(prevWeekStart)) anchor = prevWeekStart

  let current = 0
  if (anchor !== null) {
    for (let w = anchor; weekStarts.has(w); w -= WEEK_MS) current += 1
  }

  const sorted = [...weekStarts].sort((a, b) => a - b)
  let best = 0
  let run = 0
  let prev = null
  for (const w of sorted) {
    run = prev !== null && w - prev === WEEK_MS ? run + 1 : 1
    if (run > best) best = run
    prev = w
  }

  const atRisk = !activeThisWeek && current > 0 && dayOfWeekIndex >= 5

  return {
    current_weeks: current,
    best_weeks: best,
    at_risk: atRisk,
    active_this_week: activeThisWeek,
    unit: 'week',
  }
}

/**
 * Fetches activity dates and derives the user's weekly streak. Counts any
 * activity type (habit metric), independent of the dashboard's type filter.
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @param {Date} localNow - "now" already shifted into the user's local time
 * @param {number} tzOffsetMs - offset applied to shift UTC timestamps to local
 */
export async function fetchStreak(supabase, userId, localNow, tzOffsetMs) {
  const nowMs = localNow.getTime() + tzOffsetMs
  const cutoff = new Date(nowMs - LOOKBACK_MS).toISOString()

  const { data, error } = await supabase
    .from('rt_activities')
    .select('started_at')
    .eq('user_id', userId)
    .gte('started_at', cutoff)

  if (error) throw error

  const rows = data ?? []
  if (rows.length === 0) {
    return {
      current_weeks: 0,
      best_weeks: 0,
      at_risk: false,
      active_this_week: false,
      unit: 'week',
    }
  }

  const weekStarts = new Set()
  for (const r of rows) {
    weekStarts.add(weekStartMondayUTC(new Date(r.started_at).getTime() - tzOffsetMs))
  }

  const currentWeekStart = weekStartMondayUTC(localNow.getTime())
  const dayOfWeekIndex = Math.floor((localNow.getTime() - currentWeekStart) / DAY_MS)

  return computeWeeklyStreak(weekStarts, currentWeekStart, dayOfWeekIndex)
}
