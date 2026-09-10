import { createClient } from '@/lib/supabase/server'
import { fetchStreak, weekStartMondayUTC } from '@/lib/services/running/analytics/getStreak'

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * Lightweight running highlights for the unified home dashboard: current weekly
 * streak, this week's run count/distance, and the next upcoming race.
 * @param {string} userId
 * @param {number} tzOffsetMs - shifts UTC timestamps into the user's local time
 */
export async function getRunningHighlights(userId, tzOffsetMs = 0) {
  const supabase = await createClient()
  const now = new Date()
  const localNow = new Date(now.getTime() - tzOffsetMs)

  // Same UTC-safe Monday boundary fetchStreak uses, so this week's count can't
  // disagree with streak.active_this_week near the week edge. localNow is local
  // wall time as a UTC-based Date; convert the local week-start back to a real
  // UTC instant for the DB query by re-applying the offset.
  const weekStart = new Date(weekStartMondayUTC(localNow.getTime()) + tzOffsetMs)
  const today = localNow.toISOString().slice(0, 10)

  const [streak, weekRes, raceRes] = await Promise.all([
    fetchStreak(supabase, userId, localNow, tzOffsetMs),
    supabase
      .from('rt_activities')
      .select('distance_m')
      .eq('user_id', userId)
      .gte('started_at', weekStart.toISOString())
      .lte('started_at', now.toISOString()),
    supabase
      .from('rt_goals')
      .select('id, target_distance_m, target_date, title')
      .eq('user_id', userId)
      .eq('goal_type', 'race')
      .eq('status', 'active')
      .gte('target_date', today)
      .order('target_date', { ascending: true })
      .limit(1)
      .maybeSingle(),
  ])

  if (weekRes.error) throw weekRes.error
  if (raceRes.error) throw raceRes.error

  const weekRows = weekRes.data ?? []
  const thisWeek = {
    count: weekRows.length,
    distance_m: weekRows.reduce((sum, a) => sum + (Number(a.distance_m) || 0), 0),
  }

  let nextRace = null
  if (raceRes.data) {
    // Date-only diff so a race today is 0 (not a negative/near-zero value from
    // comparing midnight-UTC target against a time-of-day localNow).
    const targetMs = Date.parse(`${raceRes.data.target_date}T00:00:00Z`)
    const todayMs = Date.parse(`${today}T00:00:00Z`)
    const days_until = Math.max(0, Math.round((targetMs - todayMs) / DAY_MS))
    nextRace = {
      id: raceRes.data.id,
      distance_m: Number(raceRes.data.target_distance_m),
      target_date: raceRes.data.target_date,
      title: raceRes.data.title ?? null,
      days_until,
    }
  }

  return { streak, thisWeek, nextRace }
}
