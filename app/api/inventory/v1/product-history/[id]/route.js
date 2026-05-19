import { getProductHistoryByProductListId } from '@/lib/services/inventory/product_history/getProductHistoryByProductListId'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(req, context) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    const productListId = params.id

    if (!productListId) {
      return NextResponse.json(
        { success: false, error: 'Product list ID is required' },
        { status: 400 }
      )
    }

    const listProductHistory = await getProductHistoryByProductListId(productListId, user.id)

    return NextResponse.json({ success: true, products: listProductHistory }, { status: 200 })
  } catch (err) {
    console.error('API Route Error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
