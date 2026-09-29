import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { previewSimulationSchema } from '@/schemas/routeSimulation'
import { computeSimulation } from '@/lib/services/running/routeSimulations/computeSimulation'

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

    const body = await request.json()
    const parsed = previewSimulationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    const data = await computeSimulation(supabase, user.id, parsed.data)
    return NextResponse.json({ data, message: 'OK' }, { status: 200 })
  } catch (err) {
    if (err.status) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error('[route-simulations/preview POST]', err.message)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
