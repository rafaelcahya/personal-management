import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAnalyticsOverview } from '@/lib/services/running/analytics/getAnalyticsOverview'

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

    const { data, errors } = await getAnalyticsOverview(supabase, user.id)

    return NextResponse.json({ data, errors, message: 'OK' }, { status: 200 })
  } catch (err) {
    console.error('[running/analytics/overview GET]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
