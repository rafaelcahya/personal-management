import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCalorieTrend } from '@/lib/services/running/analytics/getCalorieTrend'

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

    const { data, weight_kg } = await getCalorieTrend(supabase, user.id)

    return NextResponse.json({ data, weight_kg, message: 'ok' }, { status: 200 })
  } catch (err) {
    console.error('[running/analytics/calorie-trend GET]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
