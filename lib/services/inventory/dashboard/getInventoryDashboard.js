import { createClient } from '@/lib/supabase/server'
import { buildCostPerUseList, sortByCostPerUse } from './builders/buildCostPerUseList'
import { buildLowStockAlerts } from './builders/buildLowStockAlerts'
import { buildMonthlySpendByType } from './builders/buildMonthlySpendByType'
import { buildAvgUsageDuration } from './builders/buildAvgUsageDuration'
import { buildMostRestocked } from './builders/buildMostRestocked'
import { buildSpendComparison } from './builders/buildSpendComparison'
import { buildLifecycleScore } from './builders/buildLifecycleScore'
import { buildSpendingHeatmap } from './builders/buildSpendingHeatmap'
import { buildRestockPrediction } from './builders/buildRestockPrediction'
import { buildCostPerUseHistory } from './builders/buildCostPerUseHistory'
import { buildSummary } from './builders/buildSummary'

async function fetchProductList(supabase, userId) {
  const { data, error } = await supabase
    .from('product_list')
    .select('id, product, brand, type, quantity, product_status, is_favorite')
    .eq('user_id', userId)
    .is('deleted_at', null)
  if (error) throw new Error(error.message)
  return data || []
}

async function fetchSpentByProduct(supabase, userId) {
  const { data, error } = await supabase
    .from('product_quantity')
    .select('product_list_id, price')
    .eq('user_id', userId)
  if (error) throw new Error(error.message)
  return (data || []).reduce((acc, q) => {
    acc[q.product_list_id] = (acc[q.product_list_id] || 0) + Number(q.price || 0)
    return acc
  }, {})
}

async function fetchHistoryUnitsByProduct(supabase, userId) {
  const { data, error } = await supabase
    .from('product_history')
    .select('product_list_id, quantity')
    .eq('user_id', userId)
  if (error) throw new Error(error.message)
  return (data || []).reduce((acc, h) => {
    acc[h.product_list_id] = (acc[h.product_list_id] || 0) + Number(h.quantity || 0)
    return acc
  }, {})
}

async function fetchQuantityRecordsWithDate(supabase, userId) {
  const { data, error } = await supabase
    .from('product_quantity')
    .select('product_list_id, price, purchase_date')
    .eq('user_id', userId)
  if (error) throw new Error(error.message)
  return data || []
}

async function fetchProductHistoryFull(supabase, userId) {
  const { data, error } = await supabase
    .from('product_history')
    .select('product_list_id, depleted_quantity, start_usage_date')
    .eq('user_id', userId)
  if (error) throw new Error(error.message)
  return data || []
}

export async function getInventoryDashboard(userId) {
  const supabase = await createClient()

  const [products, spentByProduct, historyUnitsByProduct, quantityRecords, historyFull] =
    await Promise.all([
      fetchProductList(supabase, userId),
      fetchSpentByProduct(supabase, userId),
      fetchHistoryUnitsByProduct(supabase, userId),
      fetchQuantityRecordsWithDate(supabase, userId),
      fetchProductHistoryFull(supabase, userId),
    ])

  const productMap = products.reduce((acc, p) => {
    acc[p.id] = p
    return acc
  }, {})

  const sorted = sortByCostPerUse(
    buildCostPerUseList(products, spentByProduct, historyUnitsByProduct)
  )
  const avgUsageDuration = buildAvgUsageDuration(historyFull, productMap)

  return {
    summary: buildSummary(products),
    top5: sorted.slice(0, 5),
    all: sorted,
    lowStockAlerts: buildLowStockAlerts(products),
    monthlySpendByType: buildMonthlySpendByType(quantityRecords, productMap),
    avgUsageDuration,
    mostRestocked: buildMostRestocked(quantityRecords, productMap),
    spendComparison: buildSpendComparison(quantityRecords),
    costPerUseHistory: buildCostPerUseHistory(quantityRecords, products, historyUnitsByProduct),
    restockPrediction: buildRestockPrediction(products, avgUsageDuration),
    spendingHeatmap: buildSpendingHeatmap(quantityRecords),
    lifecycleScore: buildLifecycleScore(sorted, avgUsageDuration),
  }
}
