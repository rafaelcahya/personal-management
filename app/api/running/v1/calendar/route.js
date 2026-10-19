import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calendarQuerySchema } from '@/schemas/runningCalendar'
import { getCalendarActivities } from '@/lib/services/running/calendar/getCalendarActivities'

export async function GET(request) {
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

    const { searchParams } = new URL(request.url)
    const parsed = calendarQuerySchema.safeParse({
      month: searchParams.get('month') || undefined,
      tz_offset: searchParams.get('tz_offset') || undefined,
      type: searchParams.get('type') || undefined,
    })

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Bad request',
          message: parsed.error.issues[0]?.message ?? 'Invalid query params',
        },
        { status: 400 }
      )
    }

    const { month, tz_offset, type } = parsed.data
    const activities = await getCalendarActivities(supabase, user.id, {
      month,
      activityType: type ?? null,
      tzOffsetMs: tz_offset * 60 * 1000,
    })

    return NextResponse.json({ data: activities }, { status: 200 })
  } catch (err) {
    console.error('[running/calendar GET]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
