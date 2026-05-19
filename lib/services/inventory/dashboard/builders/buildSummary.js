import { PRODUCT_STATUS } from '@/lib/constants/inventory'

export function buildSummary(products) {
  const activeProducts = products.filter((p) => p.product_status === PRODUCT_STATUS.ACTIVE).length
  const inactiveProducts = products.filter(
    (p) => p.product_status === PRODUCT_STATUS.INACTIVE
  ).length
  const totalQuantity = products.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0)
  const favoriteProducts = products.filter((p) => p.is_favorite).length

  return {
    totalProducts: products.length,
    activeProducts,
    inactiveProducts,
    totalQuantity,
    favoriteProducts,
  }
}
