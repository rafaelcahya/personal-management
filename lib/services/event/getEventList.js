import { createClient } from '@/lib/supabase/server'

export async function getEventList(
  userId,
  { search = '', page = 1, limit = 10, filter = null, today = null } = {}
) {
  const supabase = await createClient()

  let query = supabase
    .from('event_list')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('event_date', { ascending: false })

  if (search) {
    // Strip PostgREST syntax chars to prevent filter injection
    const safeSearch = search.replace(/[,()]/g, ' ').trim()
    if (safeSearch) {
      query = query.or(`title.ilike.%${safeSearch}%,event_description.ilike.%${safeSearch}%`)
    }
  }

  if (filter === 'bullish') query = query.eq('impact_direction', 'UP')
  else if (filter === 'bearish') query = query.eq('impact_direction', 'DOWN')
  else if (filter === 'favorite') query = query.eq('is_favorite', true)
  else if (filter === 'upcoming' && today) query = query.gte('event_date', today)
  else if (filter === 'past' && today) query = query.lt('event_date', today)

  const offset = (page - 1) * limit
  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    console.error('Failed to fetch events:', error)
    throw new Error('Database operation failed')
  }

  return {
    events: data || [],
    total: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  }
}
