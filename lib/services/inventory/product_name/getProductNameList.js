import { createClient } from '@/lib/supabase/server'

export async function getProductNameList(userId) {
  const supabase = await createClient()

  const [{ data: names, error: namesError }, { data: products, error: productsError }] =
    await Promise.all([
      supabase
        .from('product_name')
        .select('id, product_name, product_name_status, note, created_at, updated_at, deleted_at')
        .eq('user_id', userId)
        .order('product_name', { ascending: true }),
      supabase
        .from('product_list')
        .select('product_id')
        .eq('user_id', userId)
        .is('deleted_at', null),
    ])

  if (namesError) {
    console.error('[product-name/list] names fetch error:', namesError)
    throw new Error(namesError.message)
  }

  if (productsError) {
    console.error('[product-name/list] products fetch error:', productsError)
    throw new Error(productsError.message)
  }

  const countByProductId = (products || []).reduce((acc, p) => {
    if (p.product_id != null) {
      acc[p.product_id] = (acc[p.product_id] || 0) + 1
    }
    return acc
  }, {})

  return (names || []).map((n) => ({
    ...n,
    product_count: countByProductId[n.id] || 0,
  }))
}
