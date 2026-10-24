import { DAY_MS, GARMIN_RUN_TYPE_KEYS } from '@/lib/constants/garmin'
import { garminListItemToCandidate } from './matchGarminActivity'

const LIST_PATH = '/activitylist-service/activities/search/activities'
const PAGE_SIZE = 50
const MAX_PAGES = 10

/**
 * Lists the Garmin run activities between two YYYY-MM-DD dates (inclusive).
 * Walks pages one at a time. Returns plain objects so job steps can store them.
 */
export async function listGarminRuns(session, { from, to }) {
  const runs = []
  for (let page = 0; page < MAX_PAGES; page++) {
    const items = await session.get(LIST_PATH, {
      start: page * PAGE_SIZE,
      limit: PAGE_SIZE,
      startDate: from,
      endDate: to,
    })
    if (!Array.isArray(items) || items.length === 0) break

    for (const item of items) {
      const candidate = garminListItemToCandidate(item)
      if (GARMIN_RUN_TYPE_KEYS.includes(candidate.typeKey)) runs.push(candidate)
    }
    if (items.length < PAGE_SIZE) break
  }
  return runs
}

/** Garmin runs that started within a day of the given time, which covers local vs UTC dates. */
export function listGarminRunsAround(session, startMs) {
  const day = (ms) => new Date(ms).toISOString().slice(0, 10)
  return listGarminRuns(session, { from: day(startMs - DAY_MS), to: day(startMs + DAY_MS) })
}
