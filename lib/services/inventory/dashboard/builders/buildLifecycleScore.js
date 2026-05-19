const COST_WEIGHT = 0.5
const DURATION_WEIGHT = 0.5

export function buildLifecycleScore(costPerUseList, avgUsageDurationList) {
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
      const score = Math.round(costScore * COST_WEIGHT + durationScore * DURATION_WEIGHT)
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
