import {
  getActivityListFromDb,
  getSingleActivityFromDb,
  getActivityCountFromDb,
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
})
