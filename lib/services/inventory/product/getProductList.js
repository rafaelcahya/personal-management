import { createClient } from '@/lib/supabase/server'

const SORT_MAP = {
  favorites_first: [
    { column: 'is_favorite', ascending: false },
    { column: 'created_at', ascending: false },
  ],
  product_asc: [{ column: 'product', ascending: true }],
  product_desc: [{ column: 'product', ascending: false }],
  quantity_asc: [{ column: 'quantity', ascending: true }],
  quantity_desc: [{ column: 'quantity', ascending: false }],
  in_use_asc: [{ column: 'usage_quantity', ascending: true }],
  in_use_desc: [{ column: 'usage_quantity', ascending: false }],
  usage_date_asc: [{ column: 'usage_date', ascending: true, nullsFirst: false }],
  usage_date_desc: [{ column: 'usage_date', ascending: false, nullsFirst: false }],
}

export async function getProductList(
  userId,
  { page = 1, limit = 15, search, filter, sort = 'favorites_first' } = {}
) {
  const supabase = await createClient()
  const sortOrders = SORT_MAP[sort] ?? SORT_MAP.favorites_first

  let query = supabase
    .from('product_list')
    .select(
      'id,uuid,user_id,product,brand,type,product_id,brand_id,product_status,quantity,usage_quantity,usage_date,product_image,note,is_favorite,created_at,updated_at,deleted_at',
      { count: 'exact' }
    )
    .eq('user_id', userId)
    .is('deleted_at', null)

  for (const { column, ascending, nullsFirst } of sortOrders) {
    query = query.order(column, { ascending, nullsFirst })
  }

  if (search) {
    query = query.or(`brand.ilike.%${search}%,product.ilike.%${search}%,type.ilike.%${search}%`)
  }

  if (filter) {
    switch (filter) {
      case 'active':
        query = query.eq('product_status', 'active')
        break
      case 'inactive':
        query = query.eq('product_status', 'inactive')
        break
      case 'favorite':
        query = query.eq('is_favorite', true)
        break
      case 'low-stock':
        query = query.gt('quantity', 0).lt('quantity', 5)
        break
      case 'out-stock':
        query = query.eq('quantity', 0)
        break
      case 'never-used':
        query = query.is('usage_date', null)
        break
    }
  }

  query = query.range((page - 1) * limit, page * limit - 1)

  const { data, count, error } = await query

  if (error) {
    const msg = error.message ?? ''
    // PostgREST range-not-satisfiable (offset > total rows) — return empty page
    if (error.code === 'PGRST103' || msg.toLowerCase().includes('range not satisfiable')) {
      return { data: [], total: 0, page, limit }
    }
    console.error('Supabase error:', error)
    throw new Error(msg)
  }

  return { data: data ?? [], total: count ?? 0, page, limit }
}
