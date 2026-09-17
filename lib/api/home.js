async function getJson(url) {
  const res = await fetch(url)
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Failed to load highlights')
  return json.data
}

export async function fetchInventoryHighlights() {
  return getJson('/api/home/v1/inventory')
}

export async function fetchTradingHighlights() {
  return getJson('/api/home/v1/trading')
}

export async function fetchRunningHighlights() {
  const params = new URLSearchParams({ tz_offset: String(new Date().getTimezoneOffset()) })
  return getJson(`/api/home/v1/running?${params}`)
}
