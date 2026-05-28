import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getRaceLog } from '@/lib/services/running/raceLog/getRaceLog'
import { updateRaceLog } from '@/lib/services/running/raceLog/updateRaceLog'
import { deleteRaceLog } from '@/lib/services/running/raceLog/deleteRaceLog'
import { updateRaceLogSchema } from '@/schemas/raceLog'

export async function GET(_request, { params }) {
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
    const entry = await getRaceLog(supabase, user.id, id)

    if (!entry) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ data: entry }, { status: 200 })
  } catch (err) {
    console.error('[running/race-log GET]', err)
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
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const parsed = updateRaceLogSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const entry = await updateRaceLog(supabase, user.id, id, parsed.data)

    if (!entry) {
      return NextResponse.json(
        { error: 'Not found', message: 'Race log entry not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: entry, message: 'Race log updated' }, { status: 200 })
  } catch (err) {
    console.error('[running/race-log PATCH]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function DELETE(_request, { params }) {
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

    const { id } = await params
    const deleted = await deleteRaceLog(supabase, user.id, id)

    if (!deleted) {
      return NextResponse.json(
        { error: 'Not found', message: 'Race log entry not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Deleted' }, { status: 200 })
  } catch (err) {
    console.error('[running/race-log DELETE]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
