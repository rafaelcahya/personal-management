import { createClient } from '@/lib/supabase/server'

// Dipanggil saat onboarding selesai atau user update profil
export async function upsertRunnerProfile(userId, email, profileData) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('rt_users')
    .upsert({ id: userId, email, ...profileData }, { onConflict: 'id' })
    .select(
      'id, email, display_name, birth_date, height_cm, weight_kg, max_hr, resting_hr_baseline'
    )
    .single()

  if (error) throw error
  return data
}

// Upsert settings default saat user pertama kali masuk
export async function upsertRunnerSettings(userId, overrides = {}) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('rt_user_settings')
    .upsert({ user_id: userId, ...overrides }, { onConflict: 'user_id' })
    .select(
      'user_id, hr_zones_method, notify_post_activity, notify_weekly_review, notify_friday_prep, notify_anomaly, notify_race_reminder, push_notifications_enabled'
    )
    .single()

  if (error) throw error
  return data
}
