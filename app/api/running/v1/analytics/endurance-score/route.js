import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getEnduranceScoreWeekly } from '@/lib/services/running/analytics/getEnduranceScoreWeekly'

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

    const result = await getEnduranceScoreWeekly(supabase, user.id)

    return NextResponse.json({ data: result }, { status: 200 })
  } catch (err) {
    console.error('[running/analytics/endurance-score GET]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
