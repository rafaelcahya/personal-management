import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUpcomingRaces } from '@/lib/services/running/upcomingRaces/getUpcomingRaces'
import { createUpcomingRace } from '@/lib/services/running/upcomingRaces/createUpcomingRace'
import { createUpcomingRaceSchema } from '@/schemas/upcomingRace'

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

    const races = await getUpcomingRaces(supabase, user.id)
    return NextResponse.json({ data: races, message: 'OK' }, { status: 200 })
  } catch (err) {
    console.error('[running/upcoming-races GET]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
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
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const parsed = createUpcomingRaceSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const race = await createUpcomingRace(supabase, user.id, parsed.data)
    return NextResponse.json({ data: race, message: 'Upcoming race created' }, { status: 201 })
  } catch (err) {
    console.error('[running/upcoming-races POST]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
