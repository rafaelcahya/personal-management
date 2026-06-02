import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUpcomingRace } from '@/lib/services/running/upcomingRaces/getUpcomingRace'
import { updateUpcomingRace } from '@/lib/services/running/upcomingRaces/updateUpcomingRace'
import { deleteUpcomingRace } from '@/lib/services/running/upcomingRaces/deleteUpcomingRace'
import { updateUpcomingRaceSchema } from '@/schemas/upcomingRace'

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
    const race = await getUpcomingRace(supabase, user.id, id)

    if (!race) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ data: race }, { status: 200 })
  } catch (err) {
    console.error('[running/upcoming-races/:id GET]', err)
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
    const parsed = updateUpcomingRaceSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const result = await updateUpcomingRace(supabase, user.id, id, parsed.data)

    if (result === null) {
      return NextResponse.json(
        { error: 'Not found', message: 'Upcoming race not found' },
        { status: 404 }
      )
    }

    if (result?.error === 'activity_not_found') {
      return NextResponse.json(
        { error: 'activity_not_found', message: 'Linked activity not found' },
        { status: 422 }
      )
    }

    return NextResponse.json({ data: result, message: 'Upcoming race updated' }, { status: 200 })
  } catch (err) {
    console.error('[running/upcoming-races/:id PATCH]', err)
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
    const deleted = await deleteUpcomingRace(supabase, user.id, id)

    if (!deleted) {
      return NextResponse.json(
        { error: 'Not found', message: 'Upcoming race not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Deleted' }, { status: 200 })
  } catch (err) {
    console.error('[running/upcoming-races/:id DELETE]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
