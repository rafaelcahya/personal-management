import { PRODUCT_STATUS } from '@/lib/constants/inventory'

const MS_PER_DAY = 86400000

export function buildRestockPrediction(products, avgUsageDurationList) {
  const avgDaysMap = avgUsageDurationList.reduce((acc, item) => {
    acc[item.product_list_id] = item.avg_days
    return acc
  }, {})

  const now = new Date()

  return products
    .filter((p) => p.product_status === PRODUCT_STATUS.ACTIVE)
    .map((p) => {
      const avgDays = avgDaysMap[p.id] ?? null
      if (avgDays === null && p.quantity > 0) return null

      const daysUntilEmpty = p.quantity === 0 ? 0 : Math.round(avgDays * p.quantity)
      const predictedDate =
        p.quantity === 0
          ? null
          : new Date(now.getTime() + daysUntilEmpty * MS_PER_DAY).toISOString().slice(0, 10)

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
