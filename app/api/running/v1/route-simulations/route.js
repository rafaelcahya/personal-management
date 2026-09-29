import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createSimulationSchema } from '@/schemas/routeSimulation'
import { listSimulations } from '@/lib/services/running/routeSimulations/listSimulations'
import { createSimulation } from '@/lib/services/running/routeSimulations/createSimulation'

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await listSimulations(supabase, user.id)
    return NextResponse.json({ data, message: 'OK' }, { status: 200 })
  } catch (err) {
    console.error('[route-simulations GET]', err.message)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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
    if (err.status) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error('[route-simulations POST]', err.message)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
