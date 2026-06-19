import { createClient } from '@/lib/supabase/server'

const SORT_MAP = {
  name_asc: { column: 'product_name', ascending: true },
  name_desc: { column: 'product_name', ascending: false },
}

export async function getProductNameList(
  userId,
  { page = 1, limit = 15, search, status, sort = 'name_asc' } = {}
) {
  const supabase = await createClient()
  const isCountSort = sort === 'most_products' || sort === 'least_products'

  let query = supabase
    .from('product_name')
    .select('id, product_name, product_name_status, note, created_at, updated_at, deleted_at', {
      count: 'exact',
    })
    .eq('user_id', userId)

  if (search) query = query.ilike('product_name', `%${search}%`)
  if (status) query = query.eq('product_name_status', status)

  if (!isCountSort) {
    const { column, ascending } = SORT_MAP[sort] ?? SORT_MAP.name_asc
    query = query.order(column, { ascending }).range((page - 1) * limit, page * limit - 1)
  } else {
    query = query.order('product_name', { ascending: true })
  }

  const { data: names, count, error: namesError } = await query

  if (namesError) {
    console.error('[product-name/list] names fetch error:', namesError)
    throw new Error(namesError.message)
  }

  const nameList = names ?? []
  const nameIds = nameList.map((n) => n.id)

  let countByNameId = {}
  if (nameIds.length > 0) {
    const { data: products, error: productsError } = await supabase
      .from('product_list')
      .select('product_id')
      .in('product_id', nameIds)
      .eq('user_id', userId)
      .is('deleted_at', null)

    if (productsError) {
      console.error('[product-name/list] products fetch error:', productsError)
      throw new Error(productsError.message)
    }

    countByNameId = (products ?? []).reduce((acc, p) => {
      if (p.product_id != null) {
        acc[p.product_id] = (acc[p.product_id] || 0) + 1
      }
      return acc
    }, {})
  }

  const merged = nameList.map((n) => ({ ...n, product_count: countByNameId[n.id] || 0 }))

  if (isCountSort) {
    merged.sort((a, b) =>
      sort === 'most_products'
        ? b.product_count - a.product_count
        : a.product_count - b.product_count
    )
    return {
      data: merged.slice((page - 1) * limit, page * limit),
      total: count ?? 0,
      page,
      limit,
    }
  }

  return { data: merged, total: count ?? 0, page, limit }
}
