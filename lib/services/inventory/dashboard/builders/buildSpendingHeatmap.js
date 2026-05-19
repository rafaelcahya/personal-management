const HEATMAP_LOOKBACK_YEARS = 1

export function buildSpendingHeatmap(quantityRecords) {
  const cutoff = new Date()
  cutoff.setFullYear(cutoff.getFullYear() - HEATMAP_LOOKBACK_YEARS)

  const byDay = {}
  for (const q of quantityRecords) {
    if (!q.purchase_date || new Date(q.purchase_date) < cutoff) continue
    const day = q.purchase_date.slice(0, 10)
    byDay[day] = (byDay[day] || 0) + Number(q.price || 0)
  }

  return Object.entries(byDay).map(([date, total]) => ({ date, total }))
}
