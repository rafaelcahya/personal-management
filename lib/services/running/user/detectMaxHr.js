import { createClient } from '@/lib/supabase/server'

export async function detectMaxHr(userId) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('rt_activities')
    .select('max_hr')
    .eq('user_id', userId)
    .not('max_hr', 'is', null)
    .order('max_hr', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data?.max_hr ?? null
}
