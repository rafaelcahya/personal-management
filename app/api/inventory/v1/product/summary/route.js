import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getProductSummary } from '@/lib/services/inventory/product/getProductSummary'

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

    const summary = await getProductSummary(user.id)

    return NextResponse.json({ success: true, data: summary }, { status: 200 })
  } catch (err) {
    console.error('GET /api/inventory/v1/product/summary error:', err)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
