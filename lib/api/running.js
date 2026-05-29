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

export async function fetchRaceLog() {
  const res = await fetch('/api/running/v1/race-log')
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

export async function requestInsightGeneration(activityId, focus = 'general') {
  const res = await fetch('/api/running/v1/ai/insights/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ activity_id: activityId, focus }),
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
