import { createClient } from '@/lib/supabase/server'

export async function createWeightLog(userId, data) {
  const supabase = await createClient()

  const { data: row, error } = await supabase
    .from('rt_weight_logs')
    .insert({ user_id: userId, ...data })
    .select()
    .single()

  if (error) throw error
  return row
}

export async function getWeightLogs(userId, { from, to, page = 1, limit = 30 } = {}) {
  const supabase = await createClient()

  let query = supabase
    .from('rt_weight_logs')
    .select('id, measured_at, weight_kg, body_fat_pct, notes', { count: 'exact' })
    .eq('user_id', userId)
    .order('measured_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (from) query = query.gte('measured_at', from)
  if (to) query = query.lte('measured_at', to)

  const { data, count, error } = await query
  if (error) throw error

  return { data: data ?? [], total: count ?? 0, page, limit }
}
