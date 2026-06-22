import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getFeeList } from '@/lib/services/fee/getFeeList'
import { feeListQuerySchema } from '@/schemas/fee'

export async function GET(req) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user || !user.id) {
      return NextResponse.json({ success: false, error: 'User not authenticated' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const parsed = feeListQuerySchema.safeParse({
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
    })

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid query parameters', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { page, limit } = parsed.data
    const result = await getFeeList(user.id, { page, limit })

    return NextResponse.json({ success: true, ...result }, { status: 200 })
  } catch (err) {
    console.error('GET /api/trade/v1/fee/list error:', err)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
