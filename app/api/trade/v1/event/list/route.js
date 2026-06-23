import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getEventList } from '@/lib/services/event/getEventList'
import { eventListQuerySchema } from '@/schemas/event'

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
    const raw = {
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      filter: searchParams.get('filter') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      today: searchParams.get('today') ?? undefined,
    }

    const parsed = eventListQuerySchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid query parameters', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { page, limit, filter, search, today } = parsed.data

    const result = await getEventList(user.id, { search, page, limit, filter, today })

    return NextResponse.json({ success: true, ...result }, { status: 200 })
  } catch (err) {
    console.error('GET /api/trade/v1/event/list error:', err)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
