import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateQuantityEntry } from '@/lib/services/inventory/product_quantity/updateQuantityEntry'
import { deleteQuantityEntry } from '@/lib/services/inventory/product_quantity/deleteQuantityEntry'

async function getAuthUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  return { user, error }
}

function parseEntryId(id) {
  const num = Number(id)
  if (!id || isNaN(num) || !Number.isInteger(num) || num <= 0) return null
  return num
}

export async function PUT(req, context) {
  try {
    const { user, error: authError } = await getAuthUser()
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    const entryId = parseEntryId(params.id)
    if (!entryId) {
      return NextResponse.json(
        { success: false, error: 'Entry ID must be a positive integer' },
        { status: 400 }
      )
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

    const validationErrors = []

    if (body.quantity_added !== undefined) {
      const qty = Number(body.quantity_added)
      if (isNaN(qty) || !Number.isInteger(qty) || qty <= 0) {
        validationErrors.push('Quantity added must be a positive whole number')
      }
    }

    if (body.price !== undefined) {
      const price = Number(body.price)
      if (isNaN(price) || price < 0) {
        validationErrors.push('Price must be a non-negative number')
      }
    }

    if (body.purchase_date !== undefined && isNaN(Date.parse(body.purchase_date))) {
      validationErrors.push('Purchase date must be a valid date')
    }

    if (validationErrors.length > 0) {
      return NextResponse.json({ success: false, error: validationErrors }, { status: 422 })
    }

    const updated = await updateQuantityEntry(user.id, entryId, body)
    return NextResponse.json({ success: true, data: updated }, { status: 200 })
  } catch (err) {
    console.error('PUT /api/inventory/v1/product/stock/[id] error:', err)
    if (err.message.includes('not found')) {
      return NextResponse.json({ success: false, error: err.message }, { status: 404 })
    }
    if (err.message.includes('negative') || err.message.includes('Cannot')) {
      return NextResponse.json({ success: false, error: err.message }, { status: 422 })
    }
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}

export async function DELETE(req, context) {
  try {
    const { user, error: authError } = await getAuthUser()
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    const entryId = parseEntryId(params.id)
    if (!entryId) {
      return NextResponse.json(
        { success: false, error: 'Entry ID must be a positive integer' },
        { status: 400 }
      )
    }

    const result = await deleteQuantityEntry(user.id, entryId)
    return NextResponse.json({ success: true, data: result }, { status: 200 })
  } catch (err) {
    console.error('DELETE /api/inventory/v1/product/stock/[id] error:', err)
    if (err.message.includes('not found')) {
      return NextResponse.json({ success: false, error: err.message }, { status: 404 })
    }
    if (err.message.includes('negative') || err.message.includes('Cannot')) {
      return NextResponse.json({ success: false, error: err.message }, { status: 422 })
    }
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
