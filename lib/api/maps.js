function thinCoords(coords, max) {
  if (coords.length <= max) return coords
  const step = (coords.length - 1) / (max - 1)
  return Array.from({ length: max }, (_, i) => coords[Math.round(i * step)])
}

export async function matchRoute(coords) {
  try {
    const thinned = thinCoords(coords, 50)
    const res = await fetch('/api/map-match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coordinates: thinned }),
    })
    if (!res.ok) return { data: null, error: `${res.status}` }
    const json = await res.json()
    const matched = json.matchings?.[0]?.geometry?.coordinates
    return matched?.length ? { data: matched, error: null } : { data: null, error: 'no match' }
  } catch {
    return { data: null, error: 'network error' }
  }
}

export async function getDirections(waypoints, signal) {
  try {
    const res = await fetch('/api/map-directions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ waypoints }),
      signal,
    })
    if (!res.ok) return { data: null, error: `${res.status}` }
    const json = await res.json()
    const route = json.routes?.[0]
    if (!route) return { data: null, error: 'no route' }
    return {
      data: { coordinates: route.geometry.coordinates, distance: route.distance },
      error: null,
    }
  } catch {
    return { data: null, error: 'network error' }
  }
}
