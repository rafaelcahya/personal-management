import { unstable_cache, revalidateTag } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { getDashboardData } from '@/lib/services/running/dashboard/getDashboardData'
import { getSessionProfile } from '@/lib/services/running/analytics/getSessionProfile'
import { getZoneAnalytics } from '@/lib/services/running/analytics/getZoneAnalytics'
import { getPmcSeries } from '@/lib/services/running/analytics/getPmcSeries'
import { getTemperatureEfficiency } from '@/lib/services/running/analytics/getTemperatureEfficiency'

// TTL is a freshness backstop; the primary freshness signal is tag invalidation
// on write (sync / manual activity edit). 5 min is short enough that even if a
// background job can't reach revalidateTag, data is never stale for long.
const TTL_SECONDS = 300

// One tag per user covers every cached running analytics/dashboard response, so a
// single revalidate on write refreshes all of them at once.
export const runningAnalyticsTag = (userId) => `running-analytics:${userId}`

// unstable_cache cannot read cookies, so the cached functions use the admin client.
// This is safe only because every wrapped service filters explicitly by user_id —
// the userId is also part of the cache key so entries never cross users.

export function getCachedDashboardData(userId, activityType = null, tzOffsetMs = 0) {
  return unstable_cache(
    () => getDashboardData(userId, activityType, tzOffsetMs, createAdminClient()),
    ['running-dashboard', userId, activityType ?? 'all', String(tzOffsetMs)],
    { tags: [runningAnalyticsTag(userId)], revalidate: TTL_SECONDS }
  )()
}

export function getCachedSessionProfile(userId) {
  return unstable_cache(
    () => getSessionProfile(createAdminClient(), userId),
    ['running-session-profile', userId],
    { tags: [runningAnalyticsTag(userId)], revalidate: TTL_SECONDS }
  )()
}

export function getCachedPmcSeries(userId, days = 90) {
  return unstable_cache(
    () => getPmcSeries(createAdminClient(), userId, days),
    ['running-pmc', userId, String(days)],
    { tags: [runningAnalyticsTag(userId)], revalidate: TTL_SECONDS }
  )()
}

export function getCachedTemperatureEfficiency(userId) {
  return unstable_cache(
    () => getTemperatureEfficiency(createAdminClient(), userId),
    ['running-temperature-efficiency', userId],
    { tags: [runningAnalyticsTag(userId)], revalidate: TTL_SECONDS }
  )()
}

export function getCachedZoneAnalytics(
  userId,
  range,
  activityType,
  startDate,
  endDate,
  tzOffsetMs = 0
) {
  return unstable_cache(
    () =>
      getZoneAnalytics(
        createAdminClient(),
        userId,
        range,
        activityType,
        startDate,
        endDate,
        tzOffsetMs
      ),
    [
      'running-zones',
      userId,
      range ?? 'na',
      activityType ?? 'all',
      startDate ?? 'na',
      endDate ?? 'na',
      String(tzOffsetMs),
    ],
    { tags: [runningAnalyticsTag(userId)], revalidate: TTL_SECONDS }
  )()
}

/**
 * Invalidates all cached running analytics/dashboard responses for a user.
 * Call after any write that changes analytics inputs (sync, activity edit/delete).
 * Guarded because revalidateTag needs a request/render context — from background
 * jobs it may be unavailable, in which case the TTL is the backstop.
 */
export function invalidateRunningAnalytics(userId) {
  try {
    revalidateTag(runningAnalyticsTag(userId))
    return { revalidated: true }
  } catch (err) {
    console.warn('[invalidateRunningAnalytics] tag revalidation skipped:', err?.message)
    return { revalidated: false }
  }
}
