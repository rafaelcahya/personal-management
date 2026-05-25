import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getRaceLogs } from '@/lib/services/running/raceLog/getRaceLogs'
import { createRaceLog } from '@/lib/services/running/raceLog/createRaceLog'
import { createRaceLogSchema } from '@/schemas/raceLog'

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

    const logs = await getRaceLogs(supabase, user.id)
    return NextResponse.json({ data: logs, message: 'OK' }, { status: 200 })
  } catch (err) {
    console.error('[running/race-log GET]', err)
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
    const parsed = createRaceLogSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const entry = await createRaceLog(supabase, user.id, parsed.data)
    return NextResponse.json({ data: entry, message: 'Race log created' }, { status: 201 })
  } catch (err) {
    console.error('[running/race-log POST]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
