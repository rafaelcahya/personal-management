import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getFeeSummary } from '@/lib/services/fee/getFeeSummary'

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

    const summary = await getFeeSummary(user.id)

    return NextResponse.json({ success: true, data: summary }, { status: 200 })
  } catch (err) {
    console.error('GET /api/trade/v1/fee/summary error:', err)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
