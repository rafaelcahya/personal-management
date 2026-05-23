import { createClient } from '@/lib/supabase/server'

// Fetch dan serialize semua context yang dibutuhkan AI untuk generate insight
export async function buildInsightContext(activityId, userId) {
  const supabase = await createClient()

  const [activity, splits, recentActivities, trainingLoad, healthLog, goals, profile] =
    await Promise.all([
      getActivity(supabase, activityId, userId),
      getSplits(supabase, activityId),
      getRecentActivities(supabase, userId, activity?.activity_type),
      getTrainingLoad(supabase, userId),
      getHealthLog(supabase, userId, activity?.started_at),
      getGoals(supabase, userId),
      getProfile(supabase, userId),
    ])

  return serializeToPlainText({
    activity,
    splits,
    recentActivities,
    trainingLoad,
    healthLog,
    goals,
    profile,
  })
}

async function getActivity(supabase, activityId, userId) {
  const { data } = await supabase
    .from('rt_activities')
    .select('*')
    .eq('id', activityId)
    .eq('user_id', userId)
    .single()
  return data
}

async function getSplits(supabase, activityId) {
  const { data } = await supabase
    .from('rt_activity_splits')
    .select('*')
    .eq('activity_id', activityId)
    .order('split_number')
  return data ?? []
}

async function getRecentActivities(supabase, userId, activityType, limit = 5) {
  if (!activityType) return []
  const from = new Date()
  from.setDate(from.getDate() - 28)

  const { data } = await supabase
    .from('rt_activities')
    .select('started_at, distance_m, avg_pace_sec_per_km, avg_hr, activity_type')
    .eq('user_id', userId)
    .eq('activity_type', activityType)
    .gte('started_at', from.toISOString())
    .order('started_at', { ascending: false })
    .limit(limit)
  return data ?? []
}

async function getTrainingLoad(supabase, userId) {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('rt_daily_training_metrics')
    .select('acwr, acute_load_7d, chronic_load_28d, training_load')
    .eq('user_id', userId)
    .eq('date', today)
    .single()
  return data
}

async function getHealthLog(supabase, userId, startedAt) {
  if (!startedAt) return null
  const logDate = new Date(startedAt).toISOString().split('T')[0]
  const { data } = await supabase
    .from('rt_subjective_health_logs')
    .select('sleep_hours, sleep_quality, morning_energy, mood, soreness_level, notes')
    .eq('user_id', userId)
    .eq('log_date', logDate)
    .single()
  return data
}

async function getGoals(supabase, userId) {
  const { data } = await supabase
    .from('rt_goals')
    .select('goal_type, target_date, target_distance_m, target_time_sec, notes')
    .eq('user_id', userId)
    .eq('status', 'active')
  return data ?? []
}

async function getProfile(supabase, userId) {
  const { data } = await supabase
    .from('rt_users')
    .select('display_name, birth_date, max_hr, resting_hr_baseline, height_cm, weight_kg')
    .eq('id', userId)
    .single()
  return data
}

function serializeToPlainText({
  activity: _activity,
  splits: _splits,
  recentActivities: _recentActivities,
  trainingLoad: _trainingLoad,
  healthLog: _healthLog,
  goals: _goals,
  profile: _profile,
}) {
  // TODO: implementasi serialisasi ke plain text format sesuai spec
  // Format ada di running/05_AI_Coach_Implementation_Spec.md Section 2
  return ''
}
