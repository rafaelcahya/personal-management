import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { removeWatchlistTicker } from '@/lib/services/watchlist/removeWatchlistTicker'

export async function DELETE(req, { params }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { ticker } = await params

    if (!ticker) {
      return NextResponse.json({ success: false, error: 'Ticker is required' }, { status: 400 })
    }

    await removeWatchlistTicker(user.id, ticker)

    return NextResponse.json(
      { success: true, message: 'Ticker removed from watchlist' },
      { status: 200 }
    )
  } catch (err) {
    console.error('DELETE /api/watchlist/v1/delete error:', err)

    if (err.status === 404) {
      return NextResponse.json({ success: false, error: err.message }, { status: 404 })
    }

    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
