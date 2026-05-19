import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createQuantityUpdate } from '@/lib/services/inventory/product_quantity/createQuantityUpdate'

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

    const validationErrors = []

    const requiredFields = ['product_list_id', 'quantity_added', 'price', 'purchase_date']

    requiredFields.forEach((field) => {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        validationErrors.push(
          `${field.charAt(0).toUpperCase() + field.slice(1).replaceAll('_', ' ')} is required`
        )
      }
    })

    if (body.product_list_id !== undefined && body.product_list_id !== null) {
      const pid = Number(body.product_list_id)
      if (isNaN(pid) || !Number.isInteger(pid) || pid <= 0) {
        validationErrors.push('Product list id must be a positive integer')
      }
    }

    if (body.quantity_added !== undefined && body.quantity_added !== null) {
      const qty = Number(body.quantity_added)
      if (isNaN(qty)) {
        validationErrors.push('Quantity added must be a valid number')
      } else if (!Number.isInteger(qty)) {
        validationErrors.push('Quantity added must be a whole number')
      } else if (qty <= 0) {
        validationErrors.push('Quantity added must be greater than 0')
      }
    }

    if (body.price !== undefined && body.price !== null && body.price !== '') {
      const price = Number(body.price)
      if (isNaN(price)) {
        validationErrors.push('Price must be a valid number')
      } else if (price < 0) {
        validationErrors.push('Price cannot be negative')
      }
    }

    if (body.purchase_date && isNaN(Date.parse(body.purchase_date))) {
      validationErrors.push('Purchase date must be a valid date')
    }

    if (validationErrors.length > 0) {
      return NextResponse.json({ success: false, error: validationErrors }, { status: 400 })
    }

    const result = await createQuantityUpdate(user.id, body)

    return NextResponse.json({ success: true, data: result }, { status: 201 })
  } catch (err) {
    console.error('POST /api/inventory/v1/product/stock/create error:', err)

    if (err.message.includes('not found')) {
      return NextResponse.json({ success: false, error: err.message }, { status: 404 })
    }

    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
