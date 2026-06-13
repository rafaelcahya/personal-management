import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getEventList } from '@/lib/services/event/getEventList'

const VALID_FILTERS = ['bullish', 'bearish', 'upcoming', 'past']
const MAX_PAGE = 10000

export async function GET(req) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 401 })
    }

    if (!user || !user.id) {
      return NextResponse.json({ success: false, error: 'User not authenticated' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') ?? ''
    const page = Math.min(MAX_PAGE, Math.max(1, parseInt(searchParams.get('page') ?? '1', 10)))
    const limit = 10
    const rawFilter = searchParams.get('filter') ?? null
    const filter = VALID_FILTERS.includes(rawFilter) ? rawFilter : null
    const today = searchParams.get('today') ?? null

    const result = await getEventList(user.id, { search, page, limit, filter, today })

    return NextResponse.json({ success: true, ...result }, { status: 200 })
  } catch (err) {
    console.error('GET /api/trade/v1/event/list error:', err)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
