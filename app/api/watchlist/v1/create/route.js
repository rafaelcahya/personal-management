import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { addWatchlistTicker } from '@/lib/services/watchlist/addWatchlistTicker'
import { watchlistAddTickerSchema } from '@/schemas/valuation'

export async function POST(req) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    let body
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const parsed = watchlistAddTickerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 })
    }

    const data = await addWatchlistTicker(user.id, parsed.data)

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (err) {
    console.error('POST /api/watchlist/v1/create error:', err)

    if (err.status === 409) {
      return NextResponse.json({ success: false, error: err.message }, { status: 409 })
    }

    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
