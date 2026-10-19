function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9_\-. ]/g, '_').trim() || 'route'
}

// Saved routes only store lng/lat, so points carry no <ele>: writing 0 would
// look like real sea-level elevation to importers.
function buildGpx(route) {
  const trkpts = (route.waypoints ?? [])
    .map(([lng, lat]) => [Number(lat), Number(lng)])
    .filter(([lat, lon]) => Number.isFinite(lat) && Number.isFinite(lon))
    .map(([lat, lon]) => `<trkpt lat="${lat}" lon="${lon}"/>`)
    .join('')
  return (
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<gpx version="1.1" creator="Personal Management"` +
    ` xmlns="http://www.topografix.com/GPX/1/1"` +
    ` xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"` +
    ` xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">` +
    `<trk><name>${escapeXml(route.name)}</name><trkseg>${trkpts}</trkseg></trk>` +
    `</gpx>`
  )
}

/**
 * Returns { gpx, filename }, or null if the route doesn't exist or isn't owned
 * by the user.
 */
export async function getRouteGpx(supabase, userId, routeId) {
  const { data: route, error } = await supabase
    .from('rt_saved_routes')
    .select('id, name, waypoints')
    .eq('id', routeId)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!route) return null

  return { gpx: buildGpx(route), filename: `${sanitizeFilename(route.name)}.gpx` }
}
