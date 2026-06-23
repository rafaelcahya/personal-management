import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getTradeSummary } from '@/lib/services/trade/getTradeSummary'

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

    const summary = await getTradeSummary(supabase, user.id)

    return NextResponse.json({ data: summary, message: 'OK' })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
