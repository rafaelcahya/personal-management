import { NextResponse } from 'next/server'
import { simulationIdSchema, updateSimulationSchema } from '@/schemas/routeSimulation'
import { getSimulation } from '@/lib/services/running/routeSimulations/getSimulation'
import { updateSimulation } from '@/lib/services/running/routeSimulations/updateSimulation'
import { deleteSimulation } from '@/lib/services/running/routeSimulations/deleteSimulation'
import {
  authenticate,
  errorResponse,
  invalidIdResponse,
  readJsonBody,
} from '@/lib/utils/running/routeHandlers'

export async function GET(_, { params }) {
  try {
    const { supabase, user } = await authenticate()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const id = simulationIdSchema.safeParse((await params).id)
    if (!id.success) return invalidIdResponse('simulation')

    const data = await getSimulation(supabase, user.id, id.data)
    return NextResponse.json({ data, message: 'OK' }, { status: 200 })
  } catch (err) {
    return errorResponse(err, 'route-simulations/:id GET')
  }
}

export async function PATCH(request, { params }) {
  try {
    const { supabase, user } = await authenticate()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const id = simulationIdSchema.safeParse((await params).id)
    if (!id.success) return invalidIdResponse('simulation')

    const { body, response } = await readJsonBody(request)
    if (response) return response

    const parsed = updateSimulationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      )
    }

    const data = await updateSimulation(supabase, user.id, id.data, { name: parsed.data.name })
    return NextResponse.json({ data, message: 'Renamed' }, { status: 200 })
  } catch (err) {
    return errorResponse(err, 'route-simulations/:id PATCH')
  }
}

export async function DELETE(_, { params }) {
  try {
    const { supabase, user } = await authenticate()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const id = simulationIdSchema.safeParse((await params).id)
    if (!id.success) return invalidIdResponse('simulation')

    await deleteSimulation(supabase, user.id, id.data)
    return NextResponse.json({ message: 'Deleted' }, { status: 200 })
  } catch (err) {
    return errorResponse(err, 'route-simulations/:id DELETE')
  }
}
