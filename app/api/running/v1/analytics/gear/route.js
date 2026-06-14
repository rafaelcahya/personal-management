import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getGearUsage } from '@/lib/services/running/analytics/getGearUsage'
import { analyticsQuerySchema } from '@/schemas/runningAnalyticsQuery'

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
    const parsed = analyticsQuerySchema.safeParse({
      range: searchParams.get('range') ?? undefined,
      activity_type: searchParams.get('activity_type') ?? undefined,
      start_date: searchParams.get('start_date') ?? undefined,
      end_date: searchParams.get('end_date') ?? undefined,
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

    const { range, activity_type, start_date, end_date } = parsed.data
    const { gear } = await getGearUsage(
      supabase,
      user.id,
      range,
      activity_type,
      start_date,
      end_date
    )

    return NextResponse.json({ data: gear, message: 'ok' }, { status: 200 })
  } catch (err) {
    console.error('[running/analytics/gear GET]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
