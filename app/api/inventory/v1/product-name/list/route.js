import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getProductNameList } from '@/lib/services/inventory/product_name/getProductNameList'

const MAX_LIMIT = 100
const DEFAULT_LIMIT = 15
const VALID_SORTS = ['name_asc', 'name_desc', 'most_products', 'least_products']
const VALID_STATUSES = ['active', 'inactive', 'deleted']

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
    const rawStatus = searchParams.get('status') || undefined
    const status = rawStatus && VALID_STATUSES.includes(rawStatus) ? rawStatus : undefined
    const rawSort = searchParams.get('sort') || undefined
    const sort = rawSort && VALID_SORTS.includes(rawSort) ? rawSort : 'name_asc'

    const result = await getProductNameList(user.id, { page, limit, search, status, sort })

    return NextResponse.json({ success: true, ...result }, { status: 200 })
  } catch (err) {
    console.error('GET /api/inventory/v1/product-name/list error:', err)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
