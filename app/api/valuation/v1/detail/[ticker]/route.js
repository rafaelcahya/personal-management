import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStockValuation } from '@/lib/services/valuation/getStockValuation'

const TICKER_PATTERN = /^[A-Za-z]{1,10}$/

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

    const { ticker } = await params

    if (!ticker || !TICKER_PATTERN.test(ticker)) {
      return NextResponse.json({ success: false, error: 'Invalid ticker format' }, { status: 400 })
    }

    const data = await getStockValuation(ticker)

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (err) {
    console.error('GET /api/valuation/v1/detail/[ticker] error:', err)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
