import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getPmcSeries } from '@/lib/services/running/analytics/getPmcSeries'

const ALLOWED_DAYS = [30, 60, 90]

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
    const requestedDays = parseInt(searchParams.get('days'), 10)
    const days = ALLOWED_DAYS.includes(requestedDays) ? requestedDays : 90

    const result = await getPmcSeries(supabase, user.id, days)

    return NextResponse.json({ data: result }, { status: 200 })
  } catch (err) {
    console.error('[running/analytics/pmc GET]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
