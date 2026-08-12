import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createTrade } from '@/lib/services/trade/createTrade'
import { createTradeServerSchema } from '@/schemas/trade'

export async function POST(req) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    let body
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const parsed = createTradeServerSchema.safeParse(body)
    if (!parsed.success) {
      const errors = parsed.error.issues.map((i) => i.message)
      return NextResponse.json({ success: false, error: errors }, { status: 400 })
    }

    const newTrade = await createTrade(user.id, parsed.data)

    return NextResponse.json({ success: true, trade: newTrade }, { status: 201 })
  } catch (err) {
    console.error('POST /api/trade/create error:', err)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
