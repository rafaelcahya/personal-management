export function buildMostRestocked(quantityRecords, productMap) {
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
