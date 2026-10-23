const OSRM_BASE = 'https://router.project-osrm.org'
const OSRM_TIMEOUT_MS = 10_000
const MATCH_RADIUS_M = 25
const ROUTING_CODES = new Set(['NoRoute', 'NoMatch', 'NoSegment'])

/**
 * Calls the public OSRM server. Returns { ok: true, data } or
 * { ok: false, status } — upstream messages are never passed on.
 * 422 = OSRM answered with a routing code (NoRoute, NoMatch, ...), which it sends
 * with HTTP 400; 502 = network error, unparsable body or a 5xx.
 */
export async function queryOsrm(path) {
  try {
    const res = await fetch(`${OSRM_BASE}${path}`, { signal: AbortSignal.timeout(OSRM_TIMEOUT_MS) })
    if (res.status >= 500) return { ok: false, status: 502 }
    const data = await res.json()
    if (data?.code === 'Ok' && res.ok) return { ok: true, data }
    return { ok: false, status: ROUTING_CODES.has(data?.code) ? 422 : 502 }
  } catch (err) {
    console.error('[osrm]', err.name)
    return { ok: false, status: 502 }
  }
}

function toCoordString(points) {
  return points.map(([lng, lat]) => `${lng},${lat}`).join(';')
}

export function getDirections(waypoints) {
  return queryOsrm(`/route/v1/walking/${toCoordString(waypoints)}?geometries=geojson&overview=full`)
}

export function matchCoordinates(coordinates) {
  const radiuses = coordinates.map(() => MATCH_RADIUS_M).join(';')
  return queryOsrm(
    `/match/v1/walking/${toCoordString(coordinates)}?geometries=geojson&radiuses=${radiuses}&overview=full`
  )
}
