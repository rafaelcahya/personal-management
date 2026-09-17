import { createClient } from '@/lib/supabase/server'
import { PRODUCT_STATUS } from '@/lib/constants/inventory'

export async function getProductSummary(userId) {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from('product_list')
    .select('product_status, is_favorite, quantity, usage_quantity')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .range(0, 9999)

  if (error) {
    console.error('Supabase error:', error)
    throw new Error(error.message)
  }

  const rows = products || []

  const summary = {
    totalProducts: rows.length,
    activeProducts: 0,
    inactiveProducts: 0,
    totalQuantity: 0,
    totalUsageQuantity: 0,
    favoriteProducts: 0,
  }

  for (const p of rows) {
    if (p.product_status === PRODUCT_STATUS.ACTIVE) summary.activeProducts += 1
    if (p.product_status === PRODUCT_STATUS.INACTIVE) summary.inactiveProducts += 1
    if (p.is_favorite) summary.favoriteProducts += 1
    summary.totalQuantity += Number(p.quantity) || 0
    summary.totalUsageQuantity += Number(p.usage_quantity) || 0
  }

  return summary
}
