import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateSimulationSchema } from '@/schemas/routeSimulation'
import { getSimulation } from '@/lib/services/running/routeSimulations/getSimulation'
import { updateSimulation } from '@/lib/services/running/routeSimulations/updateSimulation'
import { deleteSimulation } from '@/lib/services/running/routeSimulations/deleteSimulation'

export async function GET(_, { params }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const data = await getSimulation(supabase, user.id, id)
    return NextResponse.json({ data, message: 'OK' }, { status: 200 })
  } catch (err) {
    if (err.status) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error('[route-simulations/:id GET]', err.message)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request, { params }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const parsed = updateSimulationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      )
    }

    const data = await updateSimulation(supabase, user.id, id, { name: parsed.data.name })
    return NextResponse.json({ data, message: 'Renamed' }, { status: 200 })
  } catch (err) {
    if (err.status) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error('[route-simulations/:id PATCH]', err.message)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_, { params }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await deleteSimulation(supabase, user.id, id)
    return NextResponse.json({ message: 'Deleted' }, { status: 200 })
  } catch (err) {
    console.error('[route-simulations/:id DELETE]', err.message)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
