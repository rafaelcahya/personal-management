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
import {
  seedActivityWithStreamsInDb,
  deleteActivityWithStreamsFromDb,
} from '../../support/db/running/activities/activityStreamSeedDb.js'
import {
  seedStreamActivityInDb,
  deleteStreamActivityFromDb,
  countTaggedRouteRowsFromDb,
  getOtherUserRouteIdsFromDb,
} from '../../support/db/running/route-simulator/streamSeedDb.js'

export const activitiesTasks = (supabaseAdmin) => ({
  async seedActivityWithStreamsInDb({ userId, tag, rowCount }) {
    return seedActivityWithStreamsInDb(userId, tag, rowCount)
  },
  async deleteActivityWithStreamsFromDb({ userId, tag }) {
    return deleteActivityWithStreamsFromDb(userId, tag)
  },
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
  async seedStreamActivityInDb({ userId, tag, rowCount }) {
    return seedStreamActivityInDb(userId, tag, rowCount)
  },
  async deleteStreamActivityFromDb({ userId, tag }) {
    return deleteStreamActivityFromDb(userId, tag)
  },
  async countTaggedRouteRowsFromDb({ userId, tag }) {
    return countTaggedRouteRowsFromDb(userId, tag)
  },
  async getOtherUserRouteIdsFromDb({ userId }) {
    return getOtherUserRouteIdsFromDb(userId)
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
