import { createClient } from '@/lib/supabase/server'

// Dipanggil saat onboarding selesai atau user update profil
export async function upsertRunnerProfile(userId, email, profileData) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('rt_users')
    .upsert({ id: userId, email, ...profileData }, { onConflict: 'id' })
    .select()
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
    .select()
    .single()

  if (error) throw error
  return data
}
