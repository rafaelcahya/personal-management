import {
  getActivityListFromDb,
  getSingleActivityFromDb,
  getActivityCountFromDb,
  getActivityIdWithSplitsFromDb,
} from '../../support/db/running/activities/activitiesDb.js'

export const activitiesTasks = (supabaseAdmin) => ({
  async getActivityListFromDb({ userId }) {
    return getActivityListFromDb(supabaseAdmin, userId)
  },
  async getSingleActivityFromDb({ activityId, userId }) {
    return getSingleActivityFromDb(supabaseAdmin, activityId, userId)
  },
  async getActivityCountFromDb({ userId }) {
    return getActivityCountFromDb(supabaseAdmin, userId)
  },
  async getActivityIdWithSplitsFromDb({ userId }) {
    return getActivityIdWithSplitsFromDb(supabaseAdmin, userId)
  },
})
