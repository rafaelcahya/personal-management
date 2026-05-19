export function buildCostPerUseList(products, spentByProduct, historyUnitsByProduct) {
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

export function sortByCostPerUse(list) {
  return [...list].sort((a, b) => {
    if (a.cost_per_use === null && b.cost_per_use === null) return 0
    if (a.cost_per_use === null) return 1
    if (b.cost_per_use === null) return -1
    return b.cost_per_use - a.cost_per_use
  })
}
