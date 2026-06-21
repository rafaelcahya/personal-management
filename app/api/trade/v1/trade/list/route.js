import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getTradeList } from '@/lib/services/trade/getTradeList'
import { tradeListQuerySchema } from '@/schemas/trade'

export async function GET(request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const parsed = tradeListQuerySchema.safeParse(Object.fromEntries(searchParams))

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', message: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const result = await getTradeList(supabase, user.id, parsed.data)

    return NextResponse.json(
      {
        data: {
          trades: result.trades,
          total: result.total,
          page: result.page,
          limit: result.limit,
        },
        message: 'OK',
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('[trade/list]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
