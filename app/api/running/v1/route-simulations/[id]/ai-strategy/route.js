import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateStrategy } from '@/lib/services/running/routeSimulations/generateStrategy'

export async function POST(_, { params }) {
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
    const strategy = await generateStrategy(supabase, user.id, id)
    return NextResponse.json({ data: { ai_strategy: strategy }, message: 'OK' }, { status: 200 })
  } catch (err) {
    if (err.status) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error('[route-simulations/:id/ai-strategy POST]', err.message)
    return NextResponse.json({ error: 'Failed to generate strategy' }, { status: 500 })
  }
}
