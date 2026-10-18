import { buildAvgUsageDuration } from '@/lib/services/inventory/dashboard/builders/buildAvgUsageDuration'
import { buildRestockPrediction } from '@/lib/services/inventory/dashboard/builders/buildRestockPrediction'
import { PRODUCT_STATUS } from '@/lib/constants/inventory'

// Tune these two numbers to change how early and how sure the reminder is.
export const RESTOCK_WARNING_DAYS = 14
// avg_days needs at least two gaps between usage starts to mean anything.
export const RESTOCK_MIN_SESSIONS = 3
export const RESTOCK_MAX_PER_RUN = 5

/**
 * Products that will run out within RESTOCK_WARNING_DAYS, by the same rule the Inventory
 * dashboard uses (days_until_empty = avg_days × quantity), and that haven't been reminded
 * about since the last purchase. Needs the admin client; every query filters by user_id.
 * @param {import('@supabase/supabase-js').SupabaseClient} admin
 * @param {string} userId
 */
export async function getRestockCandidates(admin, userId) {
  const productsRes = await admin
    .from('product_list')
    .select('id, product, brand, type, quantity, product_status')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .eq('product_status', PRODUCT_STATUS.ACTIVE)
    .gt('quantity', 0)
  if (productsRes.error) throw new Error(productsRes.error.message)

  const products = productsRes.data ?? []
  if (products.length === 0) return []

  const [historyRes, purchasesRes, remindersRes] = await Promise.all([
    // Same rows the dashboard uses for avg_days, so the reminder never disagrees with it.
    admin.from('product_history').select('product_list_id, start_usage_date').eq('user_id', userId),
    admin.from('product_quantity').select('product_list_id, created_at').eq('user_id', userId),
    admin
      .from('notifications')
      .select('created_at, data')
      .eq('user_id', userId)
      .eq('type', 'restock_reminder')
      // Only reminders for products still in play, so the lookup doesn't grow with old history.
      .in(
        'data->>productId',
        products.map((p) => String(p.id))
      ),
  ])
  for (const res of [historyRes, purchasesRes, remindersRes]) {
    if (res.error) throw new Error(res.error.message)
  }

  const productMap = Object.fromEntries(products.map((p) => [p.id, p]))
  const history = (historyRes.data ?? []).filter(
    (h) => h.start_usage_date && productMap[h.product_list_id]
  )

  const sessions = {}
  for (const h of history) sessions[h.product_list_id] = (sessions[h.product_list_id] ?? 0) + 1

  // product_quantity.created_at has no timezone but is stored in UTC.
  const lastPurchase = {}
  for (const row of purchasesRes.data ?? []) {
    const at = Date.parse(`${row.created_at}Z`)
    lastPurchase[row.product_list_id] = Math.max(at, lastPurchase[row.product_list_id] ?? -Infinity)
  }

  const lastReminder = {}
  for (const row of remindersRes.data ?? []) {
    const id = row.data?.productId
    if (id == null) continue
    lastReminder[id] = Math.max(Date.parse(row.created_at), lastReminder[id] ?? -Infinity)
  }

  // Already reminded in this stock cycle = a reminder exists and no purchase came after it.
  const remindedThisCycle = (id) =>
    lastReminder[id] != null && !((lastPurchase[id] ?? -Infinity) > lastReminder[id])

  const avgUsage = buildAvgUsageDuration(history, productMap)
  return (
    buildRestockPrediction(products, avgUsage)
      .filter((p) => (sessions[p.id] ?? 0) >= RESTOCK_MIN_SESSIONS)
      .filter((p) => p.days_until_empty > 0 && p.days_until_empty <= RESTOCK_WARNING_DAYS)
      // One reminder per stock cycle: a newer purchase starts a new cycle.
      .filter((p) => !remindedThisCycle(p.id))
      .sort((a, b) => a.days_until_empty - b.days_until_empty)
      .slice(0, RESTOCK_MAX_PER_RUN)
  )
}
