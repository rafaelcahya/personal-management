import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { closePosition } from '@/lib/services/investmentFlow/closePosition'
import { closePositionSchema } from '@/schemas/investmentFlow'
import {
  USER_FACING_ERRORS,
  UNEXPECTED_ERROR_MESSAGE,
} from '@/lib/services/investmentFlow/errorMessages'

// ── POST /api/investment-flow/v1/close ────────────────────────
// Closes (sells) a ticker position: returns the full proceeds to a cash
// category and deletes the node.
export async function POST(request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = closePositionSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.errors },
        { status: 400 }
      )
    }

    const { id, proceeds, cash_category_id } = parsed.data

    let result
    try {
      result = await closePosition(user.id, id, { proceeds, cash_category_id })
    } catch (err) {
      if (err.code === 'NODE_NOT_CLOSABLE') {
        return NextResponse.json(
          { success: false, error: USER_FACING_ERRORS.NODE_NOT_CLOSABLE },
          { status: 422 }
        )
      }
      if (err.code === 'CASH_CATEGORY_NOT_FOUND') {
        return NextResponse.json(
          { success: false, error: USER_FACING_ERRORS.CASH_CATEGORY_NOT_FOUND },
          { status: 422 }
        )
      }
      console.error('[investment-flow/close/POST]', err)
      return NextResponse.json({ success: false, error: UNEXPECTED_ERROR_MESSAGE }, { status: 500 })
    }

    if (!result) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(
      { success: true, data: result, message: 'Position closed successfully' },
      { status: 200 }
    )
  } catch (err) {
    console.error('[investment-flow/close/POST]', err)
    return NextResponse.json({ success: false, error: UNEXPECTED_ERROR_MESSAGE }, { status: 500 })
  }
}
