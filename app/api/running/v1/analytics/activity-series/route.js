import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getActivitySeries } from '@/lib/services/running/analytics/getActivitySeries'

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

    const data = await getActivitySeries(supabase, user.id)

    return NextResponse.json({ data, total: data.length, message: 'OK' }, { status: 200 })
  } catch (err) {
    console.error('[running/analytics/activity-series GET]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
