import {
  seedStravaCredentialsInDb,
  deleteSeededStravaCredentialsInDb,
  getStravaCredentialsFromDb,
  getHealthLogFromDb,
  deleteSeededHealthLogsInDb,
} from '../../../support/db/running/settings/runningSettingsDb.js'

export const runningSettingsTasks = (supabaseAdmin) => ({
  async seedStravaCredentialsInDb({ userId, needsReconnect }) {
    return seedStravaCredentialsInDb(supabaseAdmin, userId, { needsReconnect })
  },
  async deleteSeededStravaCredentialsInDb({ userId }) {
    return deleteSeededStravaCredentialsInDb(supabaseAdmin, userId)
  },
  async getStravaCredentialsFromDb({ userId }) {
    return getStravaCredentialsFromDb(supabaseAdmin, userId)
  },
  async getHealthLogFromDb({ kind, id }) {
    return getHealthLogFromDb(supabaseAdmin, kind, id)
  },
  async deleteSeededHealthLogsInDb() {
    return deleteSeededHealthLogsInDb(supabaseAdmin)
  },
})
