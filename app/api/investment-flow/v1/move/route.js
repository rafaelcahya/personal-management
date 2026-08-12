import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { moveNode } from '@/lib/services/investmentFlow/moveNode'
import { moveNodeSchema } from '@/schemas/investmentFlow'
import {
  USER_FACING_ERRORS,
  UNEXPECTED_ERROR_MESSAGE,
} from '@/lib/services/investmentFlow/errorMessages'

// ── PUT /api/investment-flow/v1/move ──────────────────────────
// Moves a node to a new parent (drag & drop).
export async function PUT(request) {
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
    const parsed = moveNodeSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.errors },
        { status: 400 }
      )
    }

    const { id, new_parent_id, sort_order } = parsed.data

    let node
    try {
      node = await moveNode(user.id, id, new_parent_id, sort_order)
    } catch (err) {
      if (err.code === 'CYCLE') {
        return NextResponse.json(
          { success: false, error: USER_FACING_ERRORS.CYCLE },
          { status: 409 }
        )
      }
      if (err.code === 'PARENT_NOT_FOUND') {
        return NextResponse.json(
          { success: false, error: USER_FACING_ERRORS.PARENT_NOT_FOUND },
          { status: 400 }
        )
      }
      console.error('[investment-flow/move/PUT]', err)
      return NextResponse.json({ success: false, error: UNEXPECTED_ERROR_MESSAGE }, { status: 500 })
    }

    if (!node) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(
      { success: true, data: node, message: 'Node moved successfully' },
      { status: 200 }
    )
  } catch (err) {
    console.error('[investment-flow/move/PUT]', err)
    return NextResponse.json({ success: false, error: UNEXPECTED_ERROR_MESSAGE }, { status: 500 })
  }
}
