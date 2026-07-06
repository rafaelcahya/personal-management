import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { deleteRoute } from '@/lib/services/running/routes/deleteRoute'
import { updateRoute } from '@/lib/services/running/routes/updateRoute'
import { updateRouteSchema } from '@/schemas/savedRoute'

export async function PATCH(request, { params }) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: 'Missing route id' }, { status: 400 })
    }

    const body = await request.json()
    const result = updateRouteSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = await updateRoute(supabase, user.id, id, { name: result.data.name })
    return NextResponse.json({ data }, { status: 200 })
  } catch (err) {
    console.error('[routes PATCH]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_, { params }) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: 'Missing route id' }, { status: 400 })
    }

    await deleteRoute(supabase, user.id, id)
    return NextResponse.json({ message: 'Deleted' }, { status: 200 })
  } catch (err) {
    console.error('[routes DELETE]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
