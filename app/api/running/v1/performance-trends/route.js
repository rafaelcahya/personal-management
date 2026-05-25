import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '25', 10), 100)
    const activityType = searchParams.get('type') || null

    let q = supabase
      .from('rt_activities')
      .select(
        'id, started_at, activity_type, distance_m, avg_pace_sec_per_km, avg_hr, max_hr, relative_effort, avg_watts, weighted_avg_watts, device_watts'
      )
      .eq('user_id', user.id)
      .not('avg_pace_sec_per_km', 'is', null)
      .order('started_at', { ascending: false })
      .limit(limit)

    if (activityType) q = q.eq('activity_type', activityType)

    const { data, error } = await q
    if (error) throw error

    // Return oldest→newest for chart left→right progression
    const activities = (data ?? []).reverse()

    return NextResponse.json({ data: activities }, { status: 200 })
  } catch (err) {
    console.error('[performance-trends GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
