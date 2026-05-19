import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getTradeSummary } from '@/lib/services/trade/getTradeSummary'

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

    const summary = await getTradeSummary(user.id)

    return NextResponse.json({ success: true, data: summary })
  } catch {
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
