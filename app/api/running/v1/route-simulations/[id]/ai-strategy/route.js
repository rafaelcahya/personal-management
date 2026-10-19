import { NextResponse } from 'next/server'
import { simulationIdSchema, strategyRequestSchema } from '@/schemas/routeSimulation'
import { generateStrategy } from '@/lib/services/running/routeSimulations/generateStrategy'
import {
  authenticate,
  errorResponse,
  invalidIdResponse,
  readOptionalBody,
} from '@/lib/utils/running/routeHandlers'

export async function POST(request, { params }) {
  try {
    const { supabase, user } = await authenticate()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const id = simulationIdSchema.safeParse((await params).id)
    if (!id.success) return invalidIdResponse('simulation')

    const { body, response } = await readOptionalBody(request)
    if (response) return response

    const parsed = strategyRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const strategy = await generateStrategy(supabase, user.id, id.data, {
      regenerate: parsed.data.regenerate,
    })
    return NextResponse.json({ data: { ai_strategy: strategy }, message: 'OK' }, { status: 200 })
  } catch (err) {
    return errorResponse(err, 'route-simulations/:id/ai-strategy POST', {
      status: 502,
      message: 'Failed to generate strategy',
    })
  }
}
