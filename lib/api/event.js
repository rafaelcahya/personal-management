export async function fetchEventList({ search = '', page = 1, filter = null } = {}) {
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  if (page > 1) params.set('page', String(page))
  if (filter) {
    params.set('filter', filter)
    if (filter === 'upcoming' || filter === 'past') {
      const d = new Date()
      const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      params.set('today', today)
    }
  }
  const qs = params.toString()

  const res = await fetch(`/api/trade/v1/event/list${qs ? `?${qs}` : ''}`, {
    cache: 'no-store',
  })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch events')
  }

  return {
    events: data.events || [],
    total: data.total ?? 0,
    page: data.page ?? 1,
    totalPages: data.totalPages ?? 1,
  }
}

export async function createEvent(payload) {
  const res = await fetch('/api/trade/v1/event/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Failed to create event')
  }

  return data.data
}

export async function updateEvent(id, payload) {
  const res = await fetch(`/api/trade/v1/event/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Failed to update event')
  }

  return data.data
}

export async function deleteEvent(id) {
  const res = await fetch(`/api/trade/v1/event/delete/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete event')
  }

  return data
}

export async function favoriteEvent(id, isFavorite) {
  const res = await fetch(`/api/trade/v1/event/favorite/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_favorite: isFavorite }),
  })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to favorite event')
  }

  return data
}

export async function fetchEventSummary() {
  const response = await fetch('/api/trade/v1/event/summary')
  if (!response.ok) throw new Error('Failed to fetch event summary')
  const json = await response.json()
  return json.event
}

export async function fetchEventDetail(id) {
  const res = await fetch(`/api/trade/v1/event/${id}`, { cache: 'no-store' })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch event detail')
  return data
}

export async function fetchEventTags() {
  const res = await fetch('/api/trade/v1/event/tags', { cache: 'no-store' })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch event tags')
  return data.tags || []
}

export async function fetchEventAnalysis(eventId) {
  const res = await fetch(`/api/trade/v1/ai/event-analysis?event_id=${eventId}`, {
    cache: 'no-store',
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch analysis')
  return data.data
}

export async function analyzeEvent(payload) {
  return fetch('/api/trade/v1/ai/event-analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function fetchAnalysisHistory() {
  const res = await fetch('/api/trade/v1/ai/event-analysis/history', { cache: 'no-store' })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch analysis history')
  return data.data
}
