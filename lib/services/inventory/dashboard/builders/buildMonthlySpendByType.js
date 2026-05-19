const MONTHS_LOOKBACK = 6

export function buildMonthlySpendByType(quantityRecords, productMap) {
  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - MONTHS_LOOKBACK)

  const byKey = {}
  for (const q of quantityRecords) {
    if (!q.purchase_date || new Date(q.purchase_date) < cutoff) continue
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
