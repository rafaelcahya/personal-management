import { createAdminClient } from '@/lib/supabase/admin'

export async function buildWeeklyContext(userId, weekStart, weekEnd) {
  const supabase = createAdminClient()

  const fourWeeksAgo = new Date(weekStart)
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28)

  const [profile, goals, weekActivities, prevWeeksActivities, healthLogs] = await Promise.all([
    getProfile(supabase, userId),
    getGoals(supabase, userId),
    getActivitiesInRange(supabase, userId, weekStart, weekEnd),
    getActivitiesInRange(supabase, userId, fourWeeksAgo.toISOString(), weekStart),
    getHealthLogs(supabase, userId, weekStart, weekEnd),
  ])

  return { profile, goals, weekActivities, prevWeeksActivities, healthLogs }
}

async function getProfile(supabase, userId) {
  const { data: profile } = await supabase
    .from('rt_users')
    .select('display_name, birth_date, max_hr, resting_hr_baseline')
    .eq('id', userId)
    .maybeSingle()

  if (!profile) return null

  const { count } = await supabase
    .from('rt_activities')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)

  return { ...profile, activityCount: count ?? 0 }
}

async function getGoals(supabase, userId) {
  const { data } = await supabase
    .from('rt_goals')
    .select('goal_type, target_date, target_distance_m, target_time_sec, notes')
    .eq('user_id', userId)
    .eq('status', 'active')

  return data ?? []
}

async function getActivitiesInRange(supabase, userId, from, to) {
  const { data } = await supabase
    .from('rt_activities')
    .select(
      'started_at, distance_m, avg_pace_sec_per_km, avg_hr, activity_type, duration_sec, zones'
    )
    .eq('user_id', userId)
    .gte('started_at', from)
    .lte('started_at', to)
    .order('started_at', { ascending: true })

  return data ?? []
}

async function getHealthLogs(supabase, userId, from, to) {
  const fromDate = new Date(from).toISOString().split('T')[0]
  const toDate = new Date(to).toISOString().split('T')[0]

  const { data } = await supabase
    .from('rt_subjective_health_logs')
    .select('log_date, sleep_hours, sleep_quality, morning_energy, mood, soreness_level')
    .eq('user_id', userId)
    .gte('log_date', fromDate)
    .lte('log_date', toDate)
    .order('log_date', { ascending: true })

  return data ?? []
}
