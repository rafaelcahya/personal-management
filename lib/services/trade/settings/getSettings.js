import { createClient } from '@/lib/supabase/server'

export async function getSettings(userId) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('settings')
    .select('initial_margin,bi_risk_free_rate,personal_risk_free_rate,margin_of_error')
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return {
        initial_margin: 0,
        bi_risk_free_rate: 0,
        personal_risk_free_rate: 0,
        margin_of_error: 10,
      }
    }
    console.error('Failed to fetch settings:', error)
    throw new Error('Failed to load settings')
  }

  return data
}
