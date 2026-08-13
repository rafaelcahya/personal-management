import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { listNodes } from '@/lib/services/investmentFlow/listNodes'
import { createNode } from '@/lib/services/investmentFlow/createNode'
import { updateNode } from '@/lib/services/investmentFlow/updateNode'
import { deleteNode } from '@/lib/services/investmentFlow/deleteNode'
import { getUninvestedCash } from '@/lib/services/investmentFlow/getUninvestedCash'
import { listCashCategories } from '@/lib/services/investmentFlow/listCashCategories'
import { getHighlights } from '@/lib/services/investmentFlow/getHighlights'
import { createNodeSchema, updateNodeSchema, deleteNodeQuerySchema } from '@/schemas/investmentFlow'
import {
  USER_FACING_ERRORS,
  UNEXPECTED_ERROR_MESSAGE,
} from '@/lib/services/investmentFlow/errorMessages'

// ── GET /api/investment-flow/v1 ────────────────────────────────
// Returns all investment flow nodes for the authenticated user
// as a flat adjacency list (frontend rebuilds the tree), plus the
// user's uninvested cash amount.
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

    const [nodes, uninvestedCash, cashCategories, highlights] = await Promise.all([
      listNodes(user.id),
      getUninvestedCash(user.id),
      listCashCategories(user.id),
      getHighlights(user.id),
    ])

    return NextResponse.json(
      { success: true, data: { nodes, uninvestedCash, cashCategories, highlights } },
      { status: 200 }
    )
  } catch (err) {
    console.error('[investment-flow/GET]', err)
    return NextResponse.json({ success: false, error: UNEXPECTED_ERROR_MESSAGE }, { status: 500 })
  }
}

// ── POST /api/investment-flow/v1 ───────────────────────────────
// Creates a new category or ticker node.
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
    const parsed = createNodeSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.errors },
        { status: 400 }
      )
    }

    let node
    try {
      node = await createNode(user.id, parsed.data)
    } catch (err) {
      if (err.code === 'PARENT_NOT_FOUND') {
        return NextResponse.json(
          { success: false, error: USER_FACING_ERRORS.PARENT_NOT_FOUND },
          { status: 400 }
        )
      }
      if (err.code === 'NODE_LIMIT_EXCEEDED') {
        return NextResponse.json(
          { success: false, error: USER_FACING_ERRORS.NODE_LIMIT_EXCEEDED },
          { status: 422 }
        )
      }
      if (err.code === 'INSUFFICIENT_CASH') {
        return NextResponse.json(
          {
            success: false,
            error: USER_FACING_ERRORS.INSUFFICIENT_CASH,
            code: 'INSUFFICIENT_CASH',
          },
          { status: 422 }
        )
      }
      console.error('[investment-flow/POST]', err)
      return NextResponse.json({ success: false, error: UNEXPECTED_ERROR_MESSAGE }, { status: 500 })
    }

    return NextResponse.json(
      { success: true, data: node, message: 'Node created successfully' },
      { status: 201 }
    )
  } catch (err) {
    console.error('[investment-flow/POST]', err)
    return NextResponse.json({ success: false, error: UNEXPECTED_ERROR_MESSAGE }, { status: 500 })
  }
}

// ── PUT /api/investment-flow/v1 ────────────────────────────────
// Updates an existing node (name for category; name/nominal/notes for ticker).
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
    const parsed = updateNodeSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.errors },
        { status: 400 }
      )
    }

    const { id, ...fields } = parsed.data

    let node
    try {
      node = await updateNode(user.id, id, fields)
    } catch (err) {
      if (err.code === 'INVALID_FIELD') {
        return NextResponse.json(
          { success: false, error: USER_FACING_ERRORS.INVALID_FIELD },
          { status: 400 }
        )
      }
      if (err.code === 'INSUFFICIENT_CASH') {
        return NextResponse.json(
          {
            success: false,
            error: USER_FACING_ERRORS.INSUFFICIENT_CASH,
            code: 'INSUFFICIENT_CASH',
          },
          { status: 422 }
        )
      }
      console.error('[investment-flow/PUT]', err)
      return NextResponse.json({ success: false, error: UNEXPECTED_ERROR_MESSAGE }, { status: 500 })
    }

    if (!node) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(
      { success: true, data: node, message: 'Node updated successfully' },
      { status: 200 }
    )
  } catch (err) {
    console.error('[investment-flow/PUT]', err)
    return NextResponse.json({ success: false, error: UNEXPECTED_ERROR_MESSAGE }, { status: 500 })
  }
}

// ── DELETE /api/investment-flow/v1?id=:uuid ───────────────────
// Deletes a node and its entire subtree.
export async function DELETE(request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const parsed = deleteNodeQuerySchema.safeParse(Object.fromEntries(searchParams))

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.errors },
        { status: 400 }
      )
    }

    const deleted = await deleteNode(user.id, parsed.data.id)

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('[investment-flow/DELETE]', err)
    return NextResponse.json({ success: false, error: UNEXPECTED_ERROR_MESSAGE }, { status: 500 })
  }
}
