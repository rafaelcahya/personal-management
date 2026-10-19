import {
  getActivityListFromDb,
  getSingleActivityFromDb,
  getActivityCountFromDb,
  getActivityIdWithSplitsFromDb,
} from '../../support/db/running/activities/activitiesDb.js'
import {
  seedAnalyticsActivitiesInDb,
  deleteSeededAnalyticsActivitiesFromDb,
  getSeededAnalyticsActivitiesFromDb,
  seedTaggedActivitiesInDb,
} from '../../support/db/running/activities/activitySeedDb.js'

export const activitiesTasks = (supabaseAdmin) => ({
  async seedAnalyticsActivitiesInDb({ userId, tag, count }) {
    return seedAnalyticsActivitiesInDb(userId, tag, count)
  },
  async deleteSeededAnalyticsActivitiesFromDb({ userId, tag }) {
    return deleteSeededAnalyticsActivitiesFromDb(userId, tag)
  },
  async getSeededAnalyticsActivitiesFromDb({ userId, tag }) {
    return getSeededAnalyticsActivitiesFromDb(userId, tag)
  },
  async seedTaggedActivitiesInDb({ userId, tag, rows }) {
    return seedTaggedActivitiesInDb(userId, tag, rows)
  },
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
