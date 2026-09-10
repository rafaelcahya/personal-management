import { createAdminClient } from '@/lib/supabase/admin'
import { createNotification } from '@/lib/services/notification'
import { LOW_STOCK_THRESHOLD } from '@/lib/constants/inventory'

/**
 * Emits a shared-notification-center alert when a product's stock crosses below
 * the low-stock threshold. Only fires on the downward crossing (>= threshold →
 * < threshold) so an ongoing low condition never re-notifies, and is skipped
 * while an unread low-stock alert already exists for the product (no stacking).
 *
 * Best-effort: any failure is logged and swallowed so it can never break the
 * stock mutation that triggered it.
 *
 * @param {{ userId: string, productId: number|string, oldQty: number, newQty: number }} params
 */
export async function notifyLowStockIfCrossed({ userId, productId, oldQty, newQty }) {
  try {
    const before = Number(oldQty)
    const after = Number(newQty)
    const crossedDown = before >= LOW_STOCK_THRESHOLD && after < LOW_STOCK_THRESHOLD
    if (!crossedDown) return

    const admin = createAdminClient()

    // Dedupe: don't stack a second alert while the first is still unacknowledged.
    const { data: existing } = await admin
      .from('notifications')
      .select('id')
      .eq('user_id', userId)
      .eq('type', 'low_stock')
      .eq('is_read', false)
      .eq('data->>productId', String(productId))
      .limit(1)
      .maybeSingle()
    if (existing) return

    const { data: product } = await admin
      .from('product_list')
      .select('brand, product')
      .eq('id', productId)
      .maybeSingle()

    const name = product ? `${product.brand ?? ''} ${product.product ?? ''}`.trim() : 'A product'
    const outOfStock = after <= 0

    await createNotification(admin, {
      userId,
      type: 'low_stock',
      title: outOfStock ? `Out of stock: ${name}` : `Low stock: ${name}`,
      message: outOfStock
        ? `${name} is out of stock. Time to restock.`
        : `${name} is down to ${after} left.`,
      data: {
        url: `/main/inventory/product-list/${productId}`,
        productId,
        quantity: after,
      },
    })
  } catch (err) {
    console.error('[notifyLowStockIfCrossed]', err)
  }
}
