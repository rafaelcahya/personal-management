import {
  getSingleProductBrandFromDb,
  getTotalProductBrandsFromDb,
  getActiveProductCountByBrandFromDb,
} from '../../support/db/inventory/product_brand/productBrandDb'

export const productBrandTasks = (supabaseAdmin) => ({
  async getSingleProductBrandFromDb({ productBrandId, userId }) {
    return getSingleProductBrandFromDb(supabaseAdmin, productBrandId, userId)
  },

  async getTotalProductBrandsFromDb({ userId }) {
    return getTotalProductBrandsFromDb(supabaseAdmin, userId)
  },

  async getActiveProductCountByBrandFromDb({ brandId }) {
    return getActiveProductCountByBrandFromDb(supabaseAdmin, brandId)
  },
})
