import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getRoutes } from '@/lib/services/running/routes/getRoutes'
import { saveRoute } from '@/lib/services/running/routes/saveRoute'
import { saveRouteSchema } from '@/schemas/savedRoute'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const routes = await getRoutes(supabase, user.id)
    return NextResponse.json({ data: routes, message: 'OK' }, { status: 200 })
  } catch (err) {
    console.error('[routes GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = saveRouteSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    const route = await saveRoute(supabase, user.id, parsed.data)
    return NextResponse.json({ data: route, message: 'Route saved' }, { status: 201 })
  } catch (err) {
    console.error('[routes POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
