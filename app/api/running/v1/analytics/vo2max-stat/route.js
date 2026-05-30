import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCurrentVo2maxStat } from '@/lib/services/running/analytics/getCurrentVo2maxStat'

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

    const data = await getCurrentVo2maxStat(supabase, user.id)

    return NextResponse.json({ data }, { status: 200 })
  } catch (err) {
    console.error('[running/analytics/vo2max-stat GET]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
