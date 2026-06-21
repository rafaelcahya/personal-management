import { getTradeSettingsFromDb } from '../../support/db/trading/settings/settingsDb.js'

export const settingsTasks = (supabaseAdmin) => ({
  async getTradeSettingsFromDb({ userId }) {
    return getTradeSettingsFromDb(supabaseAdmin, userId)
  },
})
