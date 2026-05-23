import { createClient } from '@/lib/supabase/server'

/**
 * Marks onboarding as complete for a runner profile.
 * Creates the rt_users row if it doesn't exist yet.
 */
export async function completeOnboarding(userId, email) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('rt_users')
    .upsert({ id: userId, email, onboarding_complete: true }, { onConflict: 'id' })
    .select('id, onboarding_complete')
    .single()

  if (error) throw error
  return data
}
