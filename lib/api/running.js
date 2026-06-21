export async function saveOnboardingBiometric(payload) {
  const res = await fetch('/api/running/v1/onboarding/biometric', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to save biometric data')
  return data
}

export async function completeOnboarding(payload = {}) {
  const res = await fetch('/api/running/v1/onboarding/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to complete onboarding')
  return data
}

export function redirectToStravaConnect() {
  window.location.href = '/api/running/v1/auth/strava/connect'
}

export async function syncStrava() {
  const res = await fetch('/api/running/v1/auth/strava/sync', { method: 'POST' })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Sync failed')
  return data
}

export async function reEnrichStrava() {
  const res = await fetch('/api/running/v1/auth/strava/re-enrich', { method: 'POST' })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Re-enrich failed')
  return data
}

export async function getDashboard(activityType = null) {
  const params = new URLSearchParams({ tz_offset: String(new Date().getTimezoneOffset()) })
  if (activityType) params.set('type', activityType)
  const res = await fetch(`/api/running/v1/dashboard?${params}`)
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to load dashboard')
  return data.data
}

export async function fetchPerformanceTrends(limit = 25, type = null) {
  const params = new URLSearchParams({ limit: String(limit) })
  if (type) params.set('type', type)
  const res = await fetch(`/api/running/v1/performance-trends?${params}`)
  if (!res.ok) throw new Error('Failed to fetch performance trends')
  return res.json()
}

export async function fetchCalendarActivities(month, type = null) {
  const params = new URLSearchParams({ month })
  if (type) params.set('type', type)
  const res = await fetch(`/api/running/v1/calendar?${params}`)
  if (!res.ok) throw new Error('Failed to fetch calendar activities')
  return res.json()
}

export async function fetchActivities({
  page = 1,
  limit = 20,
  type = null,
  from = null,
  to = null,
  sort = null,
  search = null,
} = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (type) params.set('type', type)
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  if (sort) params.set('sort', sort)
  if (search) params.set('search', search)
  const res = await fetch(`/api/running/v1/activities?${params}`)
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch activities')
  return data
}

export async function fetchActivity(id) {
  const res = await fetch(`/api/running/v1/activities/${id}`)
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch activity')
  return data
}

export async function fetchGear() {
  const res = await fetch('/api/running/v1/gear')
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch gear')
  return data
}

export async function updateGear(id, payload) {
  const res = await fetch('/api/running/v1/gear', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...payload }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to update gear')
  return data
}

export async function fetchRaceLog({ page = 1, limit = 15, search, distance_bucket } = {}) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))
  if (search) params.set('search', search)
  if (distance_bucket) params.set('distance_bucket', distance_bucket)

  const res = await fetch(`/api/running/v1/race-log?${params}`)
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch race log')
  return data
}

export async function fetchRaceLogEntry(id) {
  const res = await fetch(`/api/running/v1/race-log/${id}`)
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch race log entry')
  return data
}

export async function createRaceLog(payload) {
  const res = await fetch('/api/running/v1/race-log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to create race log entry')
  return data
}

export async function updateRaceLog(id, payload) {
  const res = await fetch(`/api/running/v1/race-log/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to update race log entry')
  return data
}

export async function deleteRaceLog(id) {
  const res = await fetch(`/api/running/v1/race-log/${id}`, { method: 'DELETE' })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to delete race log entry')
  return data
}

export async function updateActivity(id, payload) {
  const res = await fetch(`/api/running/v1/activities/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to update activity')
  return data
}

export async function updateGoal(id, payload) {
  const res = await fetch(`/api/running/v1/goals/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to update goal')
  return data
}

export async function fetchActivityInsight(activityId) {
  const res = await fetch(
    `/api/running/v1/ai/insights?activity_id=${encodeURIComponent(activityId)}&type=post_activity&limit=1`
  )
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch insight')
  return data.data?.[0] ?? null
}

export async function requestInsightGeneration(activityId, focus = 'general', options = {}) {
  const { perceived_effort, user_note, compare_activity_id } = options
  const res = await fetch('/api/running/v1/ai/insights/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      activity_id: activityId,
      focus,
      ...(perceived_effort != null && { perceived_effort }),
      ...(user_note && { user_note }),
      ...(compare_activity_id && { compare_activity_id }),
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to queue insight generation')
  return data
}

export async function fetchInsights(limit = 3) {
  const params = new URLSearchParams({ limit: String(limit) })
  const res = await fetch(`/api/running/v1/ai/insights?${params}`)
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch insights')
  return data.data ?? []
}

export async function fetchActivityStreams(activityId, resolution = '10s') {
  const res = await fetch(
    `/api/running/v1/activities/${encodeURIComponent(activityId)}/streams?resolution=${resolution}`
  )
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch streams')
  return data
}

export async function fetchSubjectiveHealthByDate(date) {
  const res = await fetch(`/api/running/v1/health/subjective?from=${date}&to=${date}&limit=1`)
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch health log')
  return data?.data?.[0] ?? null
}

export async function fetchSyncStatus() {
  const res = await fetch('/api/running/v1/sync/status')
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Failed to fetch sync status')
  return json
}

export async function fetchUpcomingRaces() {
  const res = await fetch('/api/running/v1/upcoming-races')
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to fetch upcoming races')
  return data
}

export async function createUpcomingRace(payload) {
  const res = await fetch('/api/running/v1/upcoming-races', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to create upcoming race')
  return data
}

export async function updateUpcomingRace(id, payload) {
  const res = await fetch(`/api/running/v1/upcoming-races/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to update upcoming race')
  return data
}

export async function deleteUpcomingRace(id) {
  const res = await fetch(`/api/running/v1/upcoming-races/${id}`, { method: 'DELETE' })
  const data = await res.json()
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to delete upcoming race')
  return data
}

export async function fetchAnalyticsInsight(section) {
  const params = new URLSearchParams({ type: 'analytics_summary', limit: '10' })
  if (section) params.set('section', section)
  const res = await fetch(`/api/running/v1/ai/insights?${params}`)
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch analytics insight')
  return data.data ?? []
}

export async function generateAnalyticsInsight(section) {
  const res = await fetch('/api/running/v1/ai/insights/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'analytics_summary', section }),
  })
  const data = await res.json()
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  if (!res.ok) throw new Error(data.error || 'Failed to queue analytics insight generation')
  return data
}

export async function fetchAnalyticsStaleness() {
  const res = await fetch('/api/running/v1/ai/insights/staleness')
  if (res.status === 404) return { is_stale: false }
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch analytics staleness')
  return data.data ?? data
}

export async function getProfile() {
  const res = await fetch('/api/running/v1/user/profile')
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch profile')
  return data.data
}

export async function updateProfile(payload) {
  const res = await fetch('/api/running/v1/user/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to update profile')
  return data.data
}

export async function getStravaStatus() {
  const res = await fetch('/api/running/v1/user/strava-status')
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch Strava status')
  return data.data
}

export async function fetchAnomalyInsights() {
  const params = new URLSearchParams({ type: 'anomaly', acknowledged: 'false' })
  const res = await fetch(`/api/running/v1/ai/insights?${params}`)
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch anomaly insights')
  return data.data ?? []
}

export async function fetchAcknowledgedAnomalyInsights() {
  const params = new URLSearchParams({ type: 'anomaly', acknowledged: 'true', limit: '10' })
  const res = await fetch(`/api/running/v1/ai/insights?${params}`)
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch acknowledged anomaly insights')
  return data.data ?? []
}

export async function fetchDailyInsight() {
  const params = new URLSearchParams({ type: 'daily', limit: '1' })
  const res = await fetch(`/api/running/v1/ai/insights?${params}`)
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch daily insight')
  return data.data?.[0] ?? null
}

export async function generateDailyInsight(force = false) {
  const res = await fetch('/api/running/v1/ai/insights/daily', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ force }),
  })
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to queue daily insight generation')
  return data
}

export async function acknowledgeInsight(id) {
  const res = await fetch(`/api/running/v1/ai/insights/${id}/ack`, {
    method: 'PATCH',
  })
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to acknowledge insight')
  return data
}

export async function fetchWeeklyReviewInsight() {
  const params = new URLSearchParams({ type: 'weekly_review', limit: '1' })
  const res = await fetch(`/api/running/v1/ai/insights?${params}`)
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch weekly review insight')
  return data.data?.[0] ?? null
}

export async function fetchFridayPrepInsight() {
  const params = new URLSearchParams({ type: 'friday_prep', limit: '1' })
  const res = await fetch(`/api/running/v1/ai/insights?${params}`)
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch friday prep insight')
  return data.data?.[0] ?? null
}

export async function generateFollowUp(insightId, question) {
  const res = await fetch('/api/running/v1/ai/insights/followup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ insightId, question }),
  })
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to generate follow-up')
  return data
}

export async function getTargetEffort() {
  const res = await fetch('/api/running/v1/analytics/target-effort')
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch target effort data')
  return data.data
}

export async function disconnectStrava() {
  const res = await fetch('/api/running/v1/auth/strava/disconnect', { method: 'POST' })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to disconnect')
  return data
}

export async function getUserProfile() {
  const res = await fetch('/api/running/v1/user/profile')
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to load profile')
  return data.data
}

export async function updateUserProfile(payload) {
  const res = await fetch('/api/running/v1/user/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to update profile')
  return data.data
}

export async function detectMaxHr() {
  const res = await fetch('/api/running/v1/user/max-hr-detect')
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to detect max HR')
  return data?.data?.max_hr ?? null
}

export async function getUserSettings() {
  const res = await fetch('/api/running/v1/user/settings')
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to load settings')
  return data.data
}

export async function updateUserSettings(payload) {
  const res = await fetch('/api/running/v1/user/settings', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to update settings')
  return data.data
}

export async function detectThresholdPace() {
  const res = await fetch('/api/running/v1/user/threshold-pace-detect')
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to detect threshold pace')
  return data.data
}

export async function getHrZones() {
  const res = await fetch('/api/running/v1/user/hr-zones')
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to load HR zones')
  return data.data
}

export async function updateHrZones(payload) {
  const res = await fetch('/api/running/v1/user/hr-zones', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to update HR zones')
  return data
}

export async function savePushSubscription(subscription) {
  const res = await fetch('/api/running/v1/user/push-subscription', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscription }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to save push subscription')
  return data.data
}

export async function deleteAllActivities() {
  const res = await fetch('/api/running/v1/user/activities', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ confirmation: 'DELETE' }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to delete activities')
  return data.data
}

export async function askInjuryCoach(payload) {
  const res = await fetch('/api/running/v1/ai/injury-coach', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to get injury coach response')
  return data.data
}

export async function checkInjuryNudge() {
  const res = await fetch('/api/running/v1/ai/injury-coach/nudge')
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to check injury nudge')
  return data.data
}

export async function getSymptomLogs() {
  const res = await fetch('/api/running/v1/symptoms')
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to fetch symptom logs')
  return data.data ?? []
}

export async function createSymptomLog(payload) {
  const res = await fetch('/api/running/v1/symptoms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to create symptom log')
  return data.data
}

export async function archiveSymptomLog(id) {
  const res = await fetch(`/api/running/v1/symptoms/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ archived: true }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to archive symptom log')
  return data.data
}

export async function getInjuryCoachInsight(payload) {
  const res = await fetch('/api/running/v1/ai/injury-coach', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to get injury coach insight')
  return data
}

export async function fetchInjuryCoachHistory() {
  const res = await fetch('/api/running/v1/ai/injury-coach/history')
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch consultation history')
  return data.data
}

export async function fetchPersonalBests() {
  const res = await fetch('/api/running/v1/analytics/personal-bests')
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch personal bests')
  return data.data
}

export async function fetchCalorieTrend() {
  const res = await fetch('/api/running/v1/analytics/calorie-trend')
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch calorie trend')
  return { data: data.data, weight_kg: data.weight_kg }
}

// getTimezoneOffset() returns minutes WEST of UTC (positive for UTC-, negative for UTC+).
// Pass tzOffset once per fetch session so parallel calls use a consistent boundary.
function buildAnalyticsParams(range, activityType, startDate, endDate, tzOffset) {
  const params = new URLSearchParams({
    range,
    activity_type: activityType,
    tz_offset: String(tzOffset),
  })
  if (startDate) params.set('start_date', startDate)
  if (endDate) params.set('end_date', endDate)
  return params
}

export async function fetchZoneReference() {
  const res = await fetch('/api/running/v1/analytics/zones/reference')
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Failed to fetch zone reference')
  return json.data
}

export async function fetchZoneAnalytics(
  range = '3m',
  activityType = 'All',
  startDate,
  endDate,
  tzOffset = new Date().getTimezoneOffset()
) {
  const params = buildAnalyticsParams(range, activityType, startDate, endDate, tzOffset)
  const res = await fetch(`/api/running/v1/analytics/zones?${params}`)
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Failed to fetch zone analytics')
  return json.data
}

export async function fetchFitnessAgeTrend() {
  const res = await fetch('/api/running/v1/analytics/fitness-age')
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch fitness age data')
  return data.data
}

export async function fetchEnduranceScoreTrend() {
  const res = await fetch('/api/running/v1/analytics/endurance-score')
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch endurance score data')
  return data.data
}

export async function fetchPmcSeries(days = 90) {
  const res = await fetch(`/api/running/v1/analytics/pmc?days=${days}`)
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch PMC data')
  return data.data
}

export async function fetchGearAnalytics(
  range = '3m',
  activityType = 'All',
  startDate,
  endDate,
  tzOffset = new Date().getTimezoneOffset()
) {
  const params = buildAnalyticsParams(range, activityType, startDate, endDate, tzOffset)
  const res = await fetch(`/api/running/v1/analytics/gear?${params}`)
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Failed to fetch gear analytics')
  return json.data
}

export async function fetchActivityTypes() {
  const res = await fetch('/api/running/v1/activities/types')
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Failed to fetch activity types')
  return json.data
}

export async function fetchSessionProfile() {
  const res = await fetch('/api/running/v1/analytics/session-profile')
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Failed to fetch session profile')
  return json
}

export async function fetchTemperatureEfficiency() {
  const res = await fetch('/api/running/v1/analytics/temperature-efficiency')
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Failed to fetch temperature efficiency')
  return json
}
