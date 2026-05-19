import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getFeeList } from '@/lib/services/fee/getFeeList'

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user || !user.id) {
      return NextResponse.json({ success: false, error: 'User not authenticated' }, { status: 401 })
    }

    const fees = await getFeeList(user.id)

    return NextResponse.json({ success: true, fees }, { status: 200 })
  } catch (err) {
    console.error('GET /api/trade/v1/fee/list error:', err)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
