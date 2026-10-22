import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getProductNameSummary } from '@/lib/services/inventory/product_name/getProductNameSummary'

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const data = await getProductNameSummary(user.id)

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('GET /api/inventory/v1/product-name/summary error:', err)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
