import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getPersonalBests } from '@/lib/services/running/analytics/getPersonalBests'

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

    const data = await getPersonalBests(supabase)

    return NextResponse.json({ data, message: 'OK' }, { status: 200 })
  } catch (err) {
    console.error('[running/analytics/personal-bests GET]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
