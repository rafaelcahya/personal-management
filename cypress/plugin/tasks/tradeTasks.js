import {
  getSingleTradeFromDb,
  getTradesFromDb,
  getTotalTradesFromDb,
  getTotalWinsFromDb,
  getTotalLossesFromDb,
  getStockTypeSummaryFromDb,
  getEntrySessionSummaryFromDb,
  getEntryOccasionSummaryFromDb,
} from '../../support/db/trading/trade/tradeDb.js'

export const tradeTasks = (supabaseAdmin) => ({
  async getSingleTradeFromDb({ tradeId, userId }) {
    return getSingleTradeFromDb(supabaseAdmin, tradeId, userId)
  },

  async getTradesFromDb({ userId }) {
    return getTradesFromDb(supabaseAdmin, userId)
  },

  async getTotalTradesFromDb({ userId }) {
    return getTotalTradesFromDb(supabaseAdmin, userId)
  },

  async getTotalWinsFromDb({ userId }) {
    return getTotalWinsFromDb(supabaseAdmin, userId)
  },

  async getTotalLossesFromDb({ userId }) {
    return getTotalLossesFromDb(supabaseAdmin, userId)
  },

  async getStockTypeSummaryFromDb({ userId }) {
    return getStockTypeSummaryFromDb(supabaseAdmin, userId)
  },

  async getEntrySessionSummaryFromDb({ userId }) {
    return getEntrySessionSummaryFromDb(supabaseAdmin, userId)
  },

  async getEntryOccasionSummaryFromDb({ userId }) {
    return getEntryOccasionSummaryFromDb(supabaseAdmin, userId)
  },
})
