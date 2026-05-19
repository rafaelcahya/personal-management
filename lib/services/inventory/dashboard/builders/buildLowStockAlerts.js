import { LOW_STOCK_THRESHOLD } from '@/lib/constants/inventory'

export function buildLowStockAlerts(products) {
  return products
    .filter((p) => p.quantity < LOW_STOCK_THRESHOLD)
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
