import { createAdminClient } from '@/lib/supabase/admin'

export async function buildDailyContext(userId) {
  const supabase = createAdminClient()

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  const fourWeeksAgo = new Date(today)
  fourWeeksAgo.setDate(today.getDate() - 28)

  const [profile, goals, trainingMetrics, recentActivities, healthLog] = await Promise.all([
    getProfile(supabase, userId),
    getGoals(supabase, userId),
    getTrainingMetrics(supabase, userId, todayStr),
    getRecentActivities(supabase, userId, fourWeeksAgo.toISOString()),
    getTodayHealthLog(supabase, userId, todayStr),
  ])

  return { profile, goals, trainingMetrics, recentActivities, healthLog }
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

async function getTrainingMetrics(supabase, userId, date) {
  const { data } = await supabase
    .from('rt_daily_training_metrics')
    .select('acwr, acute_load_7d, chronic_load_28d, training_load, date')
    .eq('user_id', userId)
    .eq('date', date)
    .maybeSingle()

  return data
}

async function getRecentActivities(supabase, userId, fromIso) {
  const { data } = await supabase
    .from('rt_activities')
    .select('started_at, distance_m, avg_pace_sec_per_km, avg_hr, activity_type, duration_sec')
    .eq('user_id', userId)
    .gte('started_at', fromIso)
    .order('started_at', { ascending: false })
    .limit(10)

  return data ?? []
}

async function getTodayHealthLog(supabase, userId, date) {
  const { data } = await supabase
    .from('rt_subjective_health_logs')
    .select('sleep_hours, sleep_quality, morning_energy, mood, soreness_level, notes')
    .eq('user_id', userId)
    .eq('log_date', date)
    .maybeSingle()

  return data
}
