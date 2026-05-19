const TREND_MONTHS = 6

export function buildSpendComparison(quantityRecords) {
  const now = new Date()

  const months = []
  for (let i = TREND_MONTHS - 1; i >= 0; i--) {
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

  const thisMonth = trend6[TREND_MONTHS - 1]
  const lastMonth = trend6[TREND_MONTHS - 2]
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
