import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getLastPurchasePrice } from '@/lib/services/inventory/product_quantity/getLastPurchasePrice'

export async function GET(req, { params }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const idNum = Number(id)

    if (!id || isNaN(idNum) || !Number.isInteger(idNum) || idNum <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid product ID' }, { status: 400 })
    }

    const data = await getLastPurchasePrice(user.id, idNum)

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (err) {
    console.error('GET /api/inventory/v1/product/[id]/last-price error:', err)

    if (err.message.includes('not found')) {
      return NextResponse.json({ success: false, error: err.message }, { status: 404 })
    }

    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
