const R = 6371000 // Earth radius in metres

function toRad(deg) {
  return (deg * Math.PI) / 180
}

/**
 * Haversine distance between two [lat, lng] points in metres.
 */
export function haversineDistance([lat1, lng1], [lat2, lng2]) {
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

/**
 * Total distance in metres along an ordered list of [lat, lng] waypoints.
 * Consecutive duplicates are ignored.
 */
export function totalDistance(waypoints) {
  if (!waypoints || waypoints.length < 2) return 0
  let dist = 0
  for (let i = 1; i < waypoints.length; i++) {
    const [lat1, lng1] = waypoints[i - 1]
    const [lat2, lng2] = waypoints[i]
    if (lat1 === lat2 && lng1 === lng2) continue
    dist += haversineDistance(waypoints[i - 1], waypoints[i])
  }
  return dist
}
