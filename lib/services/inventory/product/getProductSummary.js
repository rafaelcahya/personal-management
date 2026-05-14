import { createClient } from '@/lib/supabase/server'

export async function getProductSummary(userId) {
  const supabase = await createClient()

  const { count: totalProducts, error: totalError } = await supabase
    .from('product_list')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .is('deleted_at', null)

  if (totalError) {
    console.error('Supabase error:', totalError)
    throw new Error(totalError.message)
  }

  if (totalProducts === 0) {
    return {
      totalProducts: 0,
      activeProducts: 0,
      inactiveProducts: 0,
      totalQuantity: 0,
      totalUsageQuantity: 0,
      favoriteProducts: 0,
    }
  }

  const { count: activeProducts, error: activeError } = await supabase
    .from('product_list')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('product_status', 'active')
    .is('deleted_at', null)

  if (activeError) {
    console.error('Supabase error:', activeError)
    throw new Error(activeError.message)
  }

  const { count: inactiveProducts, error: inactiveError } = await supabase
    .from('product_list')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('product_status', 'inactive')
    .is('deleted_at', null)

  if (inactiveError) {
    console.error('Supabase error:', inactiveError)
    throw new Error(inactiveError.message)
  }

  const { count: favoriteProducts, error: favoriteError } = await supabase
    .from('product_list')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_favorite', true)
    .is('deleted_at', null)

  if (favoriteError) {
    console.error('Supabase error:', favoriteError)
    throw new Error(favoriteError.message)
  }

  const { data: products, error: dataError } = await supabase
    .from('product_list')
    .select('quantity, usage_quantity')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .range(0, 9999)

  if (dataError) {
    console.error('Supabase error:', dataError)
    throw new Error(dataError.message)
  }

  const totalQuantity = (products || []).reduce((sum, p) => sum + (Number(p.quantity) || 0), 0)
  const totalUsageQuantity = (products || []).reduce(
    (sum, p) => sum + (Number(p.usage_quantity) || 0),
    0
  )

  return {
    totalProducts,
    activeProducts,
    inactiveProducts,
    totalQuantity,
    totalUsageQuantity,
    favoriteProducts,
  }
}
