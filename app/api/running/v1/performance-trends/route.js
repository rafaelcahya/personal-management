import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { performanceTrendsQuerySchema } from '@/schemas/runningPerformanceTrends'
import { getPerformanceTrends } from '@/lib/services/running/performanceTrends/getPerformanceTrends'

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
    const parsed = performanceTrendsQuerySchema.safeParse({
      limit: searchParams.get('limit') || undefined,
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

    const { limit, type } = parsed.data
    const activities = await getPerformanceTrends(supabase, user.id, {
      limit,
      activityType: type ?? null,
    })

    return NextResponse.json({ data: activities }, { status: 200 })
  } catch (err) {
    console.error('[running/performance-trends GET]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
