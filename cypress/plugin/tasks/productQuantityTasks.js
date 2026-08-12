import {
  getLatestProductQuantityFromDb,
  getProductQuantityByIdFromDb,
  getProductQuantityCountFromDb,
  getProductQuantityListFromDb,
  getProductQuantityHistoryFromDb,
  getLastPurchasePriceFromDb,
  getActiveProductsWithHistoryFromDb,
} from '../../support/db/inventory/product/productQuantityDb'

export const productQuantityTasks = (supabaseAdmin) => ({
  async getLatestProductQuantityFromDb({ productListId, userId }) {
    return getLatestProductQuantityFromDb(supabaseAdmin, productListId, userId)
  },

  async getProductQuantityByIdFromDb({ entryId, userId }) {
    return getProductQuantityByIdFromDb(supabaseAdmin, entryId, userId)
  },

  async getProductQuantityCountFromDb({ productListId, userId }) {
    return getProductQuantityCountFromDb(supabaseAdmin, productListId, userId)
  },

  async getProductQuantityListFromDb({ productListId, userId }) {
    return getProductQuantityListFromDb(supabaseAdmin, productListId, userId)
  },

  async getProductQuantityHistoryFromDb({ productListId, userId }) {
    return getProductQuantityHistoryFromDb(supabaseAdmin, productListId, userId)
  },

  async getLastPurchasePriceFromDb({ productListId, userId }) {
    return getLastPurchasePriceFromDb(supabaseAdmin, productListId, userId)
  },

  async getActiveProductsWithHistoryFromDb({ userId }) {
    return getActiveProductsWithHistoryFromDb(supabaseAdmin, userId)
  },
})
