import { createClient } from '@/lib/supabase/server'

export async function getActivities(userId, { from, to, type, page = 1, limit = 20 } = {}) {
  const supabase = await createClient()

  let query = supabase
    .from('rt_activities')
    .select(
      'id, started_at, distance_m, duration_sec, avg_pace_sec_per_km, avg_hr, activity_type, source',
      {
        count: 'exact',
      }
    )
    .eq('user_id', userId)
    .order('started_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (from) query = query.gte('started_at', from)
  if (to) query = query.lte('started_at', to)
  if (type) query = query.eq('activity_type', type)

  const { data, count, error } = await query
  if (error) throw error

  return { data: data ?? [], total: count ?? 0, page, limit }
}
