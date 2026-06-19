import { getProductList } from '@/lib/services/inventory/product/getProductList'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const MAX_LIMIT = 100
const DEFAULT_LIMIT = 15

const VALID_SORTS = [
  'favorites_first',
  'product_asc',
  'product_desc',
  'quantity_asc',
  'quantity_desc',
  'in_use_asc',
  'in_use_desc',
  'usage_date_asc',
  'usage_date_desc',
]

const VALID_FILTERS = ['active', 'inactive', 'favorite', 'low-stock', 'out-stock', 'never-used']

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
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1)
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, parseInt(searchParams.get('limit') ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT)
    )
    const search = searchParams.get('search') || undefined
    const rawFilter = searchParams.get('filter') || undefined
    const filter = rawFilter && VALID_FILTERS.includes(rawFilter) ? rawFilter : undefined
    const rawSort = searchParams.get('sort') ?? 'favorites_first'
    const sort = VALID_SORTS.includes(rawSort) ? rawSort : 'favorites_first'

    // guard: offsets beyond 100k rows are unreachable in practice and may trigger PostgREST 416
    if ((page - 1) * limit > 100000) {
      return NextResponse.json({ success: true, data: [], total: 0, page, limit }, { status: 200 })
    }

    const result = await getProductList(user.id, { page, limit, search, filter, sort })

    return NextResponse.json({ success: true, ...result }, { status: 200 })
  } catch (err) {
    console.error('GET /api/inventory/v1/product/list error:', err)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
