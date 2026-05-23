import { createClient } from '@/lib/supabase/server'

export async function upsertSubjectiveHealth(userId, data) {
  const supabase = await createClient()

  const { data: row, error } = await supabase
    .from('rt_subjective_health_logs')
    .upsert({ user_id: userId, ...data }, { onConflict: 'user_id,log_date' })
    .select()
    .single()

  if (error) throw error
  return row
}

export async function getSubjectiveHealth(userId, { from, to, page = 1, limit = 30 } = {}) {
  const supabase = await createClient()

  let query = supabase
    .from('rt_subjective_health_logs')
    .select(
      'id, log_date, sleep_hours, sleep_quality, morning_energy, mood, soreness_level, manual_rhr, notes, created_at',
      { count: 'exact' }
    )
    .eq('user_id', userId)
    .order('log_date', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (from) query = query.gte('log_date', from)
  if (to) query = query.lte('log_date', to)

  const { data, count, error } = await query
  if (error) throw error

  return { data: data ?? [], total: count ?? 0, page, limit }
}
