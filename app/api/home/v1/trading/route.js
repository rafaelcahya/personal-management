import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getTradingHighlights } from '@/lib/services/home/getTradingHighlights'

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await getTradingHighlights()
    return NextResponse.json({ data }, { status: 200 })
  } catch (err) {
    console.error('[home/trading GET]', err)
    return NextResponse.json({ error: 'Failed to load trading highlights' }, { status: 500 })
  }
}
