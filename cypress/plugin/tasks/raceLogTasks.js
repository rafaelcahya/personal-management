import {
  getRaceLogListFromDb,
  getSingleRaceLogFromDb,
  getRaceLogCountFromDb,
  getSingleRaceLogIncludeDeletedFromDb,
} from '../../support/db/running/race-log/raceLogDb.js'

export const raceLogTasks = (supabaseAdmin) => ({
  async getRaceLogListFromDb({ userId }) {
    return getRaceLogListFromDb(supabaseAdmin, userId)
  },
  async getSingleRaceLogFromDb({ raceLogId, userId }) {
    return getSingleRaceLogFromDb(supabaseAdmin, raceLogId, userId)
  },
  async getRaceLogCountFromDb({ userId }) {
    return getRaceLogCountFromDb(supabaseAdmin, userId)
  },
  async getSingleRaceLogIncludeDeletedFromDb({ raceLogId, userId }) {
    return getSingleRaceLogIncludeDeletedFromDb(supabaseAdmin, raceLogId, userId)
  },
})
