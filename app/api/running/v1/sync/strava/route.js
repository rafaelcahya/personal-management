import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { inngest } from '@/lib/inngest/client'

export async function POST() {
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

    await inngest.send({ name: 'strava/backfill', data: { userId: user.id } })

    return NextResponse.json({ success: true, message: 'Sync started' }, { status: 200 })
  } catch (err) {
    console.error('[running/sync/strava]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
