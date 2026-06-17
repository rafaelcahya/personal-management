import {
  getAiInsightFromDb,
  getLatestAiInsightByTypeFromDb,
  getUnacknowledgedInsightIdFromDb,
} from '../../../support/db/running/ai-insights/aiInsightsDb.js'

export const aiInsightsTasks = (supabaseAdmin) => ({
  async getAiInsightFromDb({ insightId, userId }) {
    return getAiInsightFromDb(supabaseAdmin, insightId, userId)
  },
  async getLatestAiInsightByTypeFromDb({ insightType, userId }) {
    return getLatestAiInsightByTypeFromDb(supabaseAdmin, insightType, userId)
  },
  async getUnacknowledgedInsightIdFromDb({ userId }) {
    return getUnacknowledgedInsightIdFromDb(supabaseAdmin, userId)
  },
})
