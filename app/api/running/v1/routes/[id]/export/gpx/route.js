import { createClient } from '@/lib/supabase/server'
import { getRouteGpx } from '@/lib/services/running/routes/getRouteGpx'
import { routeIdSchema } from '@/schemas/savedRoute'

function jsonError(error, status) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function GET(_, { params }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) return jsonError('Unauthorized', 401)

    const id = routeIdSchema.safeParse((await params).id)
    if (!id.success) return jsonError('Invalid route ID', 400)

    const result = await getRouteGpx(supabase, user.id, id.data)
    if (!result) return jsonError('Route not found', 404)

    return new Response(result.gpx, {
      status: 200,
      headers: {
        'Content-Type': 'application/gpx+xml',
        'Content-Disposition': `attachment; filename="${result.filename}"`,
      },
    })
  } catch (err) {
    console.error('[routes export gpx GET]', err)
    return jsonError('Internal server error', 500)
  }
}
