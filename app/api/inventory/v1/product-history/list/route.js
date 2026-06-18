import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getProductHistoryList } from '@/lib/services/inventory/product_history/getProductHistoryList'

const MAX_LIMIT = 100
const DEFAULT_LIMIT = 15

const VALID_SORTS = ['date_desc', 'date_asc', 'name_asc', 'name_desc']

export async function GET(request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') ?? '1', 10) || 1
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, parseInt(searchParams.get('limit') ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT)
    )
    const search = searchParams.get('search') ?? undefined
    const status = searchParams.get('status') ?? undefined
    const rawSort = searchParams.get('sort') ?? 'date_desc'
    const sort = VALID_SORTS.includes(rawSort) ? rawSort : 'date_desc'

    const result = await getProductHistoryList(user.id, { page, limit, search, status, sort })

    return NextResponse.json({ success: true, ...result }, { status: 200 })
  } catch (err) {
    console.error('GET /api/inventory/v1/product-history/list error:', err)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
