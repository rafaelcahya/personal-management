import { createClient } from '@/lib/supabase/server'
import { PRODUCT_STATUS } from '@/lib/constants/inventory'

export async function getRestockPredictions(userId) {
  const supabase = await createClient()

  const { data: products, error: productsError } = await supabase
    .from('product_list')
    .select('id, quantity')
    .eq('user_id', userId)
    .eq('product_status', PRODUCT_STATUS.ACTIVE)
    .is('deleted_at', null)

  if (productsError) throw new Error(productsError.message)
  if (!products || products.length === 0) return []

  const productIds = products.map((p) => p.id)

  const { data: history, error: historyError } = await supabase
    .from('product_history')
    .select('product_list_id, start_usage_date')
    .eq('user_id', userId)
    .in('product_list_id', productIds)
    .order('product_list_id')
    .order('start_usage_date')

  if (historyError) throw new Error(historyError.message)

  const historyByProduct = {}
  for (const h of history || []) {
    if (!historyByProduct[h.product_list_id]) {
      historyByProduct[h.product_list_id] = []
    }
    historyByProduct[h.product_list_id].push(h.start_usage_date)
  }

  const now = new Date()
  const avgDaysMap = {}
  for (const [productId, dates] of Object.entries(historyByProduct)) {
    if (dates.length >= 2) {
      const gaps = []
      for (let i = 1; i < dates.length; i++) {
        gaps.push((new Date(dates[i]) - new Date(dates[i - 1])) / 86400000)
      }
      avgDaysMap[productId] = Math.round(gaps.reduce((s, g) => s + g, 0) / gaps.length)
    } else {
      avgDaysMap[productId] = Math.round((now - new Date(dates[0])) / 86400000)
    }
  }

  const result = []
  for (const p of products) {
    const avgDays = avgDaysMap[p.id] ?? null
    if (avgDays === null && p.quantity > 0) continue

    const daysUntilEmpty = p.quantity === 0 ? 0 : Math.round(avgDays * p.quantity)
    const predictedDate =
      p.quantity === 0
        ? null
        : new Date(now.getTime() + daysUntilEmpty * 86400000).toISOString().slice(0, 10)

    result.push({
      product_list_id: p.id,
      days_until_empty: daysUntilEmpty,
      predicted_date: predictedDate,
    })
  }

  return result
}
