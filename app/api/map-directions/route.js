import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { mapDirectionsSchema } from '@/schemas/savedRoute'
import { getDirections } from '@/lib/services/running/routes/osrm'
import { errorResponse, readJsonBody } from '@/lib/utils/running/routeHandlers'

export async function POST(request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { body, response } = await readJsonBody(request)
    if (response) return response

    const parsed = mapDirectionsSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const result = await getDirections(parsed.data.waypoints)
    if (!result.ok) {
      return NextResponse.json({ error: 'Directions failed' }, { status: result.status })
    }
    return NextResponse.json(result.data)
  } catch (err) {
    return errorResponse(err, 'map-directions POST', { message: 'Directions failed' })
  }
}
