import { createClient } from '@/lib/supabase/server'

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

function buildGpx(route) {
  const trkpts = (route.waypoints ?? [])
    .map(([lng, lat]) => `<trkpt lat="${lat}" lon="${lng}"><ele>0</ele></trkpt>`)
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

export async function GET(_, { params }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { id } = await params

    const { data: route, error } = await supabase
      .from('rt_saved_routes')
      .select('id, name, waypoints')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error || !route) {
      return new Response(JSON.stringify({ error: 'Route not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const gpx = buildGpx(route)
    const filename = `${sanitizeFilename(route.name)}.gpx`

    return new Response(gpx, {
      status: 200,
      headers: {
        'Content-Type': 'application/gpx+xml',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (err) {
    console.error('[routes export gpx GET]', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
