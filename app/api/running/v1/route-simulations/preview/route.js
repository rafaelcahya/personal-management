import { NextResponse } from 'next/server'
import { previewSimulationSchema } from '@/schemas/routeSimulation'
import { previewSimulation } from '@/lib/services/running/routeSimulations/previewSimulation'
import {
  authenticate,
  errorResponse,
  readJsonBody,
  rejectOversizedBody,
} from '@/lib/utils/running/routeHandlers'

// Matches the 4 MB GPX cap plus room for the rest of the payload.
const MAX_BODY_BYTES = 5_000_000

export async function POST(request) {
  try {
    const { supabase, user } = await authenticate()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const tooLarge = rejectOversizedBody(request, MAX_BODY_BYTES)
    if (tooLarge) return tooLarge

    const { body, response } = await readJsonBody(request)
    if (response) return response

    const parsed = previewSimulationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    const data = await previewSimulation(supabase, user.id, parsed.data)
    return NextResponse.json({ data, message: 'OK' }, { status: 200 })
  } catch (err) {
    return errorResponse(err, 'route-simulations/preview POST')
  }
}
