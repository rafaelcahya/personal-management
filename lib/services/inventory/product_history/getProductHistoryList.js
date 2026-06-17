import { createClient } from '@/lib/supabase/server'

const SORT_MAP = {
  date_desc: { column: 'start_usage_date', ascending: false },
  date_asc: { column: 'start_usage_date', ascending: true },
  name_asc: { column: 'product', ascending: true },
  name_desc: { column: 'product', ascending: false },
}

export async function getProductHistoryList(
  userId,
  { page = 1, limit = 15, search, status, sort = 'date_desc' } = {}
) {
  const supabase = await createClient()
  const { column, ascending } = SORT_MAP[sort] ?? SORT_MAP.date_desc

  let query = supabase
    .from('product_history')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order(column, { ascending, nullsFirst: false })
    .range((page - 1) * limit, page * limit - 1)

  if (search) query = query.ilike('product', `%${search}%`)
  if (status) query = query.eq('status', status)

  const { data, count, error } = await query
  if (error) throw error

  return { data: data ?? [], total: count ?? 0, page, limit }
}
