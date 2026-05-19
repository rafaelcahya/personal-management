const MS_PER_DAY = 86400000

export function buildAvgUsageDuration(historyRecords, productMap) {
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
          gaps.push((new Date(dates[i]) - new Date(dates[i - 1])) / MS_PER_DAY)
        }
        avgDays = Math.round(gaps.reduce((s, g) => s + g, 0) / gaps.length)
      } else {
        avgDays = Math.round((now - new Date(dates[0])) / MS_PER_DAY)
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
