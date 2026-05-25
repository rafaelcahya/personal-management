import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getGear } from '@/lib/services/running/gear/getGear'
import { updateGear } from '@/lib/services/running/gear/updateGear'
import { updateGearSchema } from '@/schemas/runningGear'

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const gear = await getGear(supabase, user.id)
    return NextResponse.json({ data: gear, message: 'OK' }, { status: 200 })
  } catch (err) {
    console.error('[running/gear GET]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function PATCH(request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, ...rest } = body

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Validation failed', message: 'id is required' },
        { status: 400 }
      )
    }

    const parsed = updateGearSchema.safeParse(rest)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const gear = await updateGear(supabase, user.id, id, parsed.data)
    return NextResponse.json({ data: gear, message: 'Gear updated successfully' }, { status: 200 })
  } catch (err) {
    console.error('[running/gear PATCH]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
