import { createClient } from '@/lib/supabase/server'

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

function buildCostPerUseList(products, spentByProduct, historyUnitsByProduct) {
  return products.map((p) => {
    const totalSpent = spentByProduct[p.id] || 0
    const totalUnits = Number(p.quantity || 0) + (historyUnitsByProduct[p.id] || 0)
    const costPerUse = totalSpent > 0 && totalUnits > 0 ? totalSpent / totalUnits : null
    return {
      id: p.id,
      product: p.product,
      brand: p.brand,
      type: p.type,
      quantity: p.quantity,
      product_status: p.product_status,
      is_favorite: p.is_favorite,
      total_spent: totalSpent,
      total_units: totalUnits,
      cost_per_use: costPerUse,
    }
  })
}

function sortByCostPerUse(list) {
  return [...list].sort((a, b) => {
    if (a.cost_per_use === null && b.cost_per_use === null) return 0
    if (a.cost_per_use === null) return 1
    if (b.cost_per_use === null) return -1
    return b.cost_per_use - a.cost_per_use
  })
}

function buildLowStockAlerts(products) {
  return products
    .filter((p) => p.quantity <= 2)
    .sort((a, b) => a.quantity - b.quantity)
    .map((p) => ({
      id: p.id,
      product: p.product,
      brand: p.brand,
      type: p.type,
      quantity: p.quantity,
      product_status: p.product_status,
    }))
}

function buildMonthlySpendByType(quantityRecords, productMap) {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const byKey = {}
  for (const q of quantityRecords) {
    if (!q.purchase_date || new Date(q.purchase_date) < sixMonthsAgo) continue
    const product = productMap[q.product_list_id]
    if (!product) continue
    const month = q.purchase_date.slice(0, 7)
    const key = `${month}__${q.product_list_id}`
    if (!byKey[key])
      byKey[key] = {
        month,
        product: product.product,
        brand: product.brand,
        type: product.type,
        total_spent: 0,
      }
    byKey[key].total_spent += Number(q.price || 0)
  }

  return Object.values(byKey).sort(
    (a, b) => b.month.localeCompare(a.month) || b.total_spent - a.total_spent
  )
}

function buildAvgUsageDuration(historyRecords, productMap) {
  const byProduct = {}
  for (const h of historyRecords) {
    if (!byProduct[h.product_list_id]) byProduct[h.product_list_id] = []
    byProduct[h.product_list_id].push(h.start_usage_date)
  }

  const now = new Date()
  return Object.entries(byProduct)
    .map(([productId, dates]) => {
      const product = productMap[productId]
      if (!product) return null
      dates.sort()
      let avgDays
      if (dates.length >= 2) {
        const gaps = []
        for (let i = 1; i < dates.length; i++) {
          gaps.push((new Date(dates[i]) - new Date(dates[i - 1])) / 86400000)
        }
        avgDays = Math.round(gaps.reduce((s, g) => s + g, 0) / gaps.length)
      } else {
        avgDays = Math.round((now - new Date(dates[0])) / 86400000)
      }
      return {
        product_list_id: Number(productId),
        product: product.product,
        brand: product.brand,
        type: product.type,
        avg_days: avgDays,
      }
    })
    .filter(Boolean)
    .sort((a, b) => b.avg_days - a.avg_days)
}

function buildMostRestocked(quantityRecords, productMap) {
  const countByProduct = {}
  const lastDateByProduct = {}

  for (const q of quantityRecords) {
    const id = q.product_list_id
    countByProduct[id] = (countByProduct[id] || 0) + 1
    if (!lastDateByProduct[id] || q.purchase_date > lastDateByProduct[id]) {
      lastDateByProduct[id] = q.purchase_date
    }
  }

  return Object.entries(countByProduct)
    .map(([productId, count]) => {
      const product = productMap[productId]
      if (!product) return null
      return {
        id: Number(productId),
        product: product.product,
        brand: product.brand,
        type: product.type,
        restock_count: count,
        last_restock_date: lastDateByProduct[productId] || null,
      }
    })
    .filter(Boolean)
    .sort((a, b) => b.restock_count - a.restock_count)
}

function buildSpendComparison(quantityRecords) {
  const now = new Date()

  const months = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(d.toISOString().slice(0, 7))
  }

  const totalByMonth = {}
  for (const q of quantityRecords) {
    if (!q.purchase_date) continue
    const month = q.purchase_date.slice(0, 7)
    if (months.includes(month)) {
      totalByMonth[month] = (totalByMonth[month] || 0) + Number(q.price || 0)
    }
  }

  const trend6 = months.map((m) => ({ month: m, total: totalByMonth[m] || 0 }))
  const recent3 = trend6.slice(-3)

  const thisMonth = trend6[5]
  const lastMonth = trend6[4]
  const delta = thisMonth.total - lastMonth.total
  const deltaPercent = lastMonth.total > 0 ? Math.round((delta / lastMonth.total) * 100) : null

  return {
    thisMonth,
    lastMonth,
    delta,
    deltaPercent,
    recent3,
    trend6,
  }
}

function buildLifecycleScore(costPerUseList, avgUsageDurationList) {
  const avgDaysMap = avgUsageDurationList.reduce((acc, item) => {
    acc[item.product_list_id] = item.avg_days
    return acc
  }, {})

  const eligible = costPerUseList
    .filter((p) => p.cost_per_use != null && avgDaysMap[p.id] != null)
    .map((p) => ({
      id: p.id,
      product: p.product,
      brand: p.brand,
      type: p.type,
      cost_per_use: p.cost_per_use,
      avg_days: avgDaysMap[p.id],
    }))

  if (eligible.length === 0) return []

  const maxCost = Math.max(...eligible.map((p) => p.cost_per_use))
  const minCost = Math.min(...eligible.map((p) => p.cost_per_use))
  const maxDays = Math.max(...eligible.map((p) => p.avg_days))
  const minDays = Math.min(...eligible.map((p) => p.avg_days))

  return eligible
    .map((p) => {
      const costScore =
        maxCost > minCost ? (1 - (p.cost_per_use - minCost) / (maxCost - minCost)) * 100 : 100
      const durationScore =
        maxDays > minDays ? ((p.avg_days - minDays) / (maxDays - minDays)) * 100 : 100
      const score = Math.round(costScore * 0.5 + durationScore * 0.5)
      return {
        id: p.id,
        product: p.product,
        brand: p.brand,
        type: p.type,
        cost_per_use: Math.round(p.cost_per_use),
        avg_days: p.avg_days,
        score,
      }
    })
    .sort((a, b) => b.score - a.score)
}

function buildSpendingHeatmap(quantityRecords) {
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

  const byDay = {}
  for (const q of quantityRecords) {
    if (!q.purchase_date || new Date(q.purchase_date) < oneYearAgo) continue
    const day = q.purchase_date.slice(0, 10)
    byDay[day] = (byDay[day] || 0) + Number(q.price || 0)
  }

  return Object.entries(byDay).map(([date, total]) => ({ date, total }))
}

function buildRestockPrediction(products, avgUsageDurationList) {
  const avgDaysMap = avgUsageDurationList.reduce((acc, item) => {
    acc[item.product_list_id] = item.avg_days
    return acc
  }, {})

  const now = new Date()

  return products
    .filter((p) => p.product_status === 'active')
    .map((p) => {
      const avgDays = avgDaysMap[p.id] ?? null
      if (avgDays === null && p.quantity > 0) return null

      const daysUntilEmpty = p.quantity === 0 ? 0 : Math.round(avgDays * p.quantity)
      const predictedDate =
        p.quantity === 0
          ? null
          : new Date(now.getTime() + daysUntilEmpty * 86400000).toISOString().slice(0, 10)

      return {
        id: p.id,
        product: p.product,
        brand: p.brand,
        type: p.type,
        quantity: p.quantity,
        avg_days: avgDays,
        days_until_empty: daysUntilEmpty,
        predicted_date: predictedDate,
      }
    })
    .filter(Boolean)
    .sort((a, b) => b.days_until_empty - a.days_until_empty)
}

function buildCostPerUseHistory(quantityRecords, products, historyUnitsByProduct) {
  const purchasesByProduct = {}

  for (const q of quantityRecords) {
    const id = q.product_list_id
    if (!purchasesByProduct[id]) purchasesByProduct[id] = []
    purchasesByProduct[id].push({ date: q.purchase_date, price: Number(q.price || 0) })
  }

  const productMap = products.reduce((acc, p) => {
    acc[p.id] = p
    return acc
  }, {})

  return Object.entries(purchasesByProduct)
    .map(([productId, purchases]) => {
      const product = productMap[productId]
      if (!product) return null

      purchases.sort((a, b) => (a.date > b.date ? 1 : -1))

      const totalUnits = Number(product.quantity || 0) + (historyUnitsByProduct[productId] || 0)
      if (totalUnits === 0) return null

      let cumulativeSpent = 0
      let prevCostPerUse = null
      const history = purchases.map((p) => {
        cumulativeSpent += p.price
        const costPerUse = cumulativeSpent / totalUnits
        const delta = prevCostPerUse !== null ? costPerUse - prevCostPerUse : null
        const deltaPercent =
          prevCostPerUse !== null && prevCostPerUse > 0
            ? Math.round((delta / prevCostPerUse) * 100)
            : null
        prevCostPerUse = costPerUse
        return {
          date: p.date,
          price: p.price,
          cumulative_spent: cumulativeSpent,
          cost_per_use: Math.round(costPerUse),
          delta: delta !== null ? Math.round(delta) : null,
          delta_percent: deltaPercent,
        }
      })

      return {
        product_list_id: Number(productId),
        product: product.product,
        brand: product.brand,
        type: product.type,
        total_units: totalUnits,
        history,
      }
    })
    .filter(Boolean)
    .sort((a, b) => b.history.length - a.history.length)
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
  const lowStockAlerts = buildLowStockAlerts(products)
  const monthlySpendByType = buildMonthlySpendByType(quantityRecords, productMap)
  const avgUsageDuration = buildAvgUsageDuration(historyFull, productMap)
  const mostRestocked = buildMostRestocked(quantityRecords, productMap)
  const spendComparison = buildSpendComparison(quantityRecords)
  const costPerUseHistory = buildCostPerUseHistory(quantityRecords, products, historyUnitsByProduct)
  const restockPrediction = buildRestockPrediction(products, avgUsageDuration)
  const spendingHeatmap = buildSpendingHeatmap(quantityRecords)
  const lifecycleScore = buildLifecycleScore(sorted, avgUsageDuration)

  return {
    top5: sorted.slice(0, 5),
    all: sorted,
    lowStockAlerts,
    monthlySpendByType,
    avgUsageDuration,
    mostRestocked,
    spendComparison,
    costPerUseHistory,
    restockPrediction,
    spendingHeatmap,
    lifecycleScore,
  }
}
