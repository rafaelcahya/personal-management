import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
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
    const activityType = searchParams.get('type') || null
    const tzOffset = parseInt(searchParams.get('tz_offset') ?? '0', 10)
    const tzOffsetMs = isNaN(tzOffset) ? 0 : tzOffset * 60 * 1000
    const rawWeeksAgo = parseInt(searchParams.get('weeks_ago') ?? '0', 10)
    const weeksAgo = isNaN(rawWeeksAgo) ? 0 : Math.min(4, Math.max(0, rawWeeksAgo))

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
