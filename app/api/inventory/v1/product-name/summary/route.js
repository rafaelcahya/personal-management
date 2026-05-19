import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getProductNameList } from '@/lib/services/inventory/product_name/getProductNameList'

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

    const productNames = await getProductNameList(user.id)

    const totalProductNames = Array.isArray(productNames) ? productNames.length : 0

    const totalStatus = productNames.reduce((acc, totalProductName) => {
      const type = totalProductName.product_name_status
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      data: {
        totalProductNames,
        totalStatus,
      },
    })
  } catch (err) {
    console.error('GET /api/inventory/v1/product-brand/summary error:', err)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
