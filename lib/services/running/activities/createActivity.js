import { createClient } from '@/lib/supabase/server'

const DEDUP_WINDOW_MS = 300000
const DEDUP_DISTANCE_BUFFER_M = 200

export async function createActivity(userId, data) {
  const supabase = await createClient()

  const startedAtMs = new Date(data.started_at).getTime()
  const windowStart = new Date(startedAtMs - DEDUP_WINDOW_MS).toISOString()
  const windowEnd = new Date(startedAtMs + DEDUP_WINDOW_MS).toISOString()

  // Fuzzy dedup: same user, activity started within ±5 minutes of the provided started_at
  let dupQuery = supabase
    .from('rt_activities')
    .select('id, started_at, distance_m, activity_type, source')
    .eq('user_id', userId)
    .gte('started_at', windowStart)
    .lte('started_at', windowEnd)

  if (data.distance_m != null) {
    dupQuery = dupQuery
      .gte('distance_m', data.distance_m - DEDUP_DISTANCE_BUFFER_M)
      .lte('distance_m', data.distance_m + DEDUP_DISTANCE_BUFFER_M)
  }

  const { data: existing, error: dupError } = await dupQuery.limit(1).maybeSingle()
  if (dupError) throw dupError

  if (existing) {
    return { duplicate: true, existing }
  }

  const { data: created, error } = await supabase
    .from('rt_activities')
    .insert({
      ...data,
      user_id: userId,
      source: 'manual',
      external_id: null,
    })
    .select()
    .single()

  if (error) throw error

  return { duplicate: false, data: created }
}
