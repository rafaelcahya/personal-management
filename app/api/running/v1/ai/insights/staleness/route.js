import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const VALID_SECTIONS = [
  'weekly_distance',
  'pace_trend',
  'training_load',
  'vo2max_trend',
  'ef_trend',
  'race_predictor',
]

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
    const section = searchParams.get('section')

    if (section && !VALID_SECTIONS.includes(section)) {
      return NextResponse.json({ error: 'Invalid section value' }, { status: 422 })
    }

    const [latestActivityRes, latestInsightRes] = await Promise.all([
      supabase
        .from('rt_activities')
        .select('started_at')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle(),

      buildInsightQuery(supabase, user.id, section),
    ])

    if (latestActivityRes.error) throw latestActivityRes.error
    if (latestInsightRes.error) throw latestInsightRes.error

    const latestActivityAt = latestActivityRes.data?.started_at ?? null
    const latestInsightAt = latestInsightRes.data?.created_at ?? null

    const isStale =
      latestActivityAt !== null &&
      (latestInsightAt === null || new Date(latestActivityAt) > new Date(latestInsightAt))

    return NextResponse.json({
      data: {
        is_stale: isStale,
        latest_activity_at: latestActivityAt,
        latest_insight_at: latestInsightAt,
      },
      message: 'OK',
    })
  } catch (err) {
    console.error('[ai/insights/staleness GET]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

function buildInsightQuery(supabase, userId, section) {
  let query = supabase
    .from('rt_ai_insights')
    .select('created_at')
    .eq('user_id', userId)
    .eq('insight_type', 'analytics_summary')
    .order('created_at', { ascending: false })
    .limit(1)

  if (section) {
    query = query.contains('data_refs', { section })
  }

  return query.maybeSingle()
}
