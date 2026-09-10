import { createClient } from '@/lib/supabase/server'
import { buildLowStockAlerts } from '@/lib/services/inventory/dashboard/builders/buildLowStockAlerts'
import { PRODUCT_STATUS } from '@/lib/constants/inventory'

const LOW_STOCK_PREVIEW = 3

/**
 * Lightweight inventory highlights for the unified home dashboard:
 * low-stock count (+ a short preview), plus active/favorite/total counts.
 * One query on product_list — deliberately cheaper than getInventoryDashboard.
 * @param {string} userId
 */
export async function getInventoryHighlights(userId) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('product_list')
    .select('id, product, brand, type, quantity, product_status, is_favorite')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .range(0, 9999)

  if (error) throw new Error(error.message)

  const products = data ?? []
  const lowStock = buildLowStockAlerts(products)

  return {
    totalProducts: products.length,
    activeProducts: products.filter((p) => p.product_status === PRODUCT_STATUS.ACTIVE).length,
    favoriteProducts: products.filter((p) => p.is_favorite).length,
    lowStockCount: lowStock.length,
    lowStockItems: lowStock.slice(0, LOW_STOCK_PREVIEW),
  }
}
