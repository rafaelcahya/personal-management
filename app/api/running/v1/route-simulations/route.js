import { NextResponse } from 'next/server'
import { createSimulationSchema, simulationListQuerySchema } from '@/schemas/routeSimulation'
import { listSimulations } from '@/lib/services/running/routeSimulations/listSimulations'
import { createSimulation } from '@/lib/services/running/routeSimulations/createSimulation'
import {
  authenticate,
  errorResponse,
  readJsonBody,
  rejectOversizedBody,
} from '@/lib/utils/running/routeHandlers'

// Matches the 4 MB GPX cap plus room for the rest of the payload.
const MAX_BODY_BYTES = 5_000_000

export async function GET(request) {
  try {
    const { supabase, user } = await authenticate()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const query = simulationListQuerySchema.safeParse(
      Object.fromEntries(new URL(request.url).searchParams)
    )
    if (!query.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: query.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = await listSimulations(supabase, user.id, { limit: query.data.limit })
    return NextResponse.json({ data, message: 'OK' }, { status: 200 })
  } catch (err) {
    return errorResponse(err, 'route-simulations GET')
  }
}

export async function POST(request) {
  try {
    const { supabase, user } = await authenticate()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const tooLarge = rejectOversizedBody(request, MAX_BODY_BYTES)
    if (tooLarge) return tooLarge

    const { body, response } = await readJsonBody(request)
    if (response) return response

    const parsed = createSimulationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    const data = await createSimulation(supabase, user.id, parsed.data)
    return NextResponse.json({ data, message: 'Simulation saved' }, { status: 201 })
  } catch (err) {
    return errorResponse(err, 'route-simulations POST')
  }
}
