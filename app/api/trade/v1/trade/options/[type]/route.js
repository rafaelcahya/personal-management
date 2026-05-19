import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAllTradeOptions } from '@/lib/services/trade/options/getTradeOptions'

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

    const options = await getAllTradeOptions(user.id)

    return NextResponse.json({ success: true, options }, { status: 200 })
  } catch (err) {
    console.error('GET /api/trade/v1/trade/options/all error:', err)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
