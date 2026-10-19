import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { weeklyStatsQuerySchema } from '@/schemas/runningDashboardQuery'
import { getWeeklyStatsOnly } from '@/lib/services/running/dashboard/getDashboardData'

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
    const parsed = weeklyStatsQuerySchema.safeParse({
      type: searchParams.get('type') || undefined,
      tz_offset: searchParams.get('tz_offset') || undefined,
      weeks_ago: searchParams.get('weeks_ago') || undefined,
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

    const activityType = parsed.data.type ?? null
    const tzOffsetMs = parsed.data.tz_offset * 60 * 1000
    const weeksAgo = parsed.data.weeks_ago

    const data = await getWeeklyStatsOnly(user.id, { activityType, tzOffsetMs, weeksAgo })
    return NextResponse.json({ data }, { status: 200 })
  } catch (err) {
    console.error('[running/dashboard/weekly-stats GET]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
