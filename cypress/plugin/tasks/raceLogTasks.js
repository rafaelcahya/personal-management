import { createClient } from '@supabase/supabase-js'
import {
  getRaceLogListFromDb,
  getSingleRaceLogFromDb,
  getRaceLogCountFromDb,
  getSingleRaceLogIncludeDeletedFromDb,
  getForeignRaceLogIdFromDb,
  getForeignUpcomingRaceIdFromDb,
} from '../../support/db/running/race-log/raceLogDb.js'

// getSupabaseSession signs in on the shared supabaseAdmin client, so after that it runs as the test
// user under RLS and cannot see other users' rows. Foreign-row lookups need a fresh service-role client.
const freshServiceClient = () =>
  createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '', {
    auth: { autoRefreshToken: false, persistSession: false },
  })

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
  async getForeignRaceLogIdFromDb({ userId }) {
    return getForeignRaceLogIdFromDb(freshServiceClient(), userId)
  },
  async getForeignUpcomingRaceIdFromDb({ userId }) {
    return getForeignUpcomingRaceIdFromDb(freshServiceClient(), userId)
  },
})
