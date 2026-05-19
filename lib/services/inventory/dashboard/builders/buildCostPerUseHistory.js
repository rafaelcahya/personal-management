export function buildCostPerUseHistory(quantityRecords, products, historyUnitsByProduct) {
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
