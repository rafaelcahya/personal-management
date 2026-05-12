import {
  getSingleProductFromDb,
  getTotalProductsFromDb,
  getProductListFromDb,
  getProductSummaryFromDb,
  getSingleProductIncludeDeletedFromDb,
  getProductWithQuantityFromDb,
  getLatestProductHistoryFromDb,
  setProductQuantityInDb,
  getProductHistoryCountFromDb,
  getProductFavoriteStatusFromDb,
  insertProductHistoryFromDb,
} from '../../support/db/inventory/product/productDb'

export const productTasks = (supabaseAdmin) => ({
  async getSingleProductFromDb({ productId, userId }) {
    return getSingleProductFromDb(supabaseAdmin, productId, userId)
  },

  async getTotalProductsFromDb({ userId }) {
    return getTotalProductsFromDb(supabaseAdmin, userId)
  },

  async getProductListFromDb({ userId }) {
    return getProductListFromDb(supabaseAdmin, userId)
  },

  async getProductSummaryFromDb({ userId }) {
    return getProductSummaryFromDb(supabaseAdmin, userId)
  },

  async getSingleProductIncludeDeletedFromDb({ productId, userId }) {
    return getSingleProductIncludeDeletedFromDb(supabaseAdmin, productId, userId)
  },

  async getProductWithQuantityFromDb({ productId, userId }) {
    return getProductWithQuantityFromDb(supabaseAdmin, productId, userId)
  },

  async getLatestProductHistoryFromDb({ productId, userId }) {
    return getLatestProductHistoryFromDb(supabaseAdmin, productId, userId)
  },

  async setProductQuantityInDb({ productId, quantity }) {
    return setProductQuantityInDb(supabaseAdmin, productId, quantity)
  },

  async getProductHistoryCountFromDb({ productId, userId }) {
    return getProductHistoryCountFromDb(supabaseAdmin, productId, userId)
  },

  async getProductFavoriteStatusFromDb({ productId, userId }) {
    return getProductFavoriteStatusFromDb(supabaseAdmin, productId, userId)
  },

  async insertProductHistory({ productListId, userId, startUsageDate, depletedQuantity }) {
    return insertProductHistoryFromDb(
      supabaseAdmin,
      productListId,
      userId,
      startUsageDate,
      depletedQuantity
    )
  },
})
