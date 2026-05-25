import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { startOfMonth, endOfMonth, format, parseISO, isValid } from 'date-fns'

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
    const monthParam = searchParams.get('month')
    const activityType = searchParams.get('type') || null

    let refDate = new Date()
    if (monthParam) {
      const parsed = parseISO(`${monthParam}-01`)
      if (isValid(parsed)) refDate = parsed
    }

    const monthStart = startOfMonth(refDate)
    const monthEnd = endOfMonth(refDate)

    let q = supabase
      .from('rt_activities')
      .select('id, started_at, activity_type, name, distance_m, relative_effort')
      .eq('user_id', user.id)
      .gte('started_at', monthStart.toISOString())
      .lte('started_at', monthEnd.toISOString())
      .order('started_at', { ascending: true })

    if (activityType) q = q.eq('activity_type', activityType)

    const { data, error } = await q
    if (error) throw error

    const activities = (data ?? []).map((a) => ({
      id: a.id,
      date: format(new Date(a.started_at), 'yyyy-MM-dd'),
      activity_type: a.activity_type,
      name: a.name ?? null,
      distance_m: a.distance_m ?? null,
      relative_effort: a.relative_effort ?? null,
    }))

    return NextResponse.json({ data: activities }, { status: 200 })
  } catch (err) {
    console.error('[running/calendar GET]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
