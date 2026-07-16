import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getWatchlist } from '@/lib/services/watchlist/getWatchlist'

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const data = await getWatchlist(user.id)

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (err) {
    console.error('GET /api/watchlist/v1/list error:', err)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
