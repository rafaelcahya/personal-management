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

export async function getDashboard(activityType = null) {
  const url = activityType
    ? `/api/running/v1/dashboard?type=${encodeURIComponent(activityType)}`
    : '/api/running/v1/dashboard'
  const res = await fetch(url)
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

export async function fetchActivities({ page = 1, limit = 20, type = null } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (type) params.set('type', type)
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
