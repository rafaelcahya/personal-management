import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { bulkUpdateProductNameStatus } from '@/lib/services/inventory/product_name/bulkUpdateProductNameStatus'

const VALID_STATUSES = ['active', 'inactive']

export async function POST(request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { ids, status } = body ?? {}

    if (
      !Array.isArray(ids) ||
      ids.length === 0 ||
      !ids.every((id) => Number.isInteger(id) && id > 0)
    ) {
      return NextResponse.json(
        { success: false, error: 'ids must be a non-empty array of positive integers' },
        { status: 400 }
      )
    }

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, error: `status must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      )
    }

    await bulkUpdateProductNameStatus(supabase, user.id, ids, status)

    return NextResponse.json({ success: true, updated: ids.length }, { status: 200 })
  } catch (err) {
    console.error('POST /api/inventory/v1/product-name/bulk-update-status error:', err)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
