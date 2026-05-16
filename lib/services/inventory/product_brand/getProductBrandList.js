import { createClient } from '@/lib/supabase/server'

export async function getProductBrandList(userId) {
  const supabase = await createClient()

  const [{ data: brands, error }, { data: usedBy, error: usageError }] = await Promise.all([
    supabase
      .from('product_brand')
      .select('*')
      .eq('user_id', userId)
      .order('brand', { ascending: true }),
    supabase.from('product_list').select('brand_id').eq('user_id', userId).is('deleted_at', null),
  ])

  if (error) {
    console.error('Get product brands error:', error)
    throw new Error(error.message)
  }

  if (usageError) {
    console.error('Get product usage error:', usageError)
    throw new Error(usageError.message)
  }

  const countMap = {}
  ;(usedBy || []).forEach((p) => {
    countMap[p.brand_id] = (countMap[p.brand_id] || 0) + 1
  })

  return brands.map((b) => ({ ...b, product_count: countMap[b.id] || 0 }))
}
