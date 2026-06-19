import { createClient } from '@/lib/supabase/server'

const SORT_MAP = {
  name_asc: { column: 'brand', ascending: true },
  name_desc: { column: 'brand', ascending: false },
}

export async function getProductBrandList(
  userId,
  { page = 1, limit = 15, search, status, sort = 'name_asc' } = {}
) {
  const supabase = await createClient()

  const isCountSort = sort === 'most_products' || sort === 'least_products'

  let query = supabase.from('product_brand').select('*', { count: 'exact' }).eq('user_id', userId)

  if (search) query = query.ilike('brand', `%${search}%`)
  if (status) query = query.eq('brand_status', status)

  if (!isCountSort) {
    const { column, ascending } = SORT_MAP[sort] ?? SORT_MAP.name_asc
    query = query.order(column, { ascending }).range((page - 1) * limit, page * limit - 1)
  } else {
    query = query.order('brand', { ascending: true })
  }

  const { data: brands, count, error } = await query
  if (error) throw error

  const brandIds = (brands ?? []).map((b) => b.id)

  let usedBy = []
  if (brandIds.length > 0) {
    const { data: productData, error: usageError } = await supabase
      .from('product_list')
      .select('brand_id')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .in('brand_id', brandIds)

    if (usageError) throw usageError
    usedBy = productData ?? []
  }

  const countMap = {}
  usedBy.forEach((p) => {
    countMap[p.brand_id] = (countMap[p.brand_id] || 0) + 1
  })

  let merged = (brands ?? []).map((b) => ({ ...b, product_count: countMap[b.id] || 0 }))

  if (isCountSort) {
    merged.sort((a, b) =>
      sort === 'most_products'
        ? (b.product_count ?? 0) - (a.product_count ?? 0)
        : (a.product_count ?? 0) - (b.product_count ?? 0)
    )
    merged = merged.slice((page - 1) * limit, page * limit)
  }

  return { data: merged, total: count ?? 0, page, limit }
}
