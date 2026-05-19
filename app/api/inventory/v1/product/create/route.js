import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createProduct } from '@/lib/services/inventory/product/createProduct'

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

    if (!body) {
      return NextResponse.json(
        { success: false, error: 'Request body is required' },
        { status: 400 }
      )
    }

    const requiredFields = ['product_id', 'brand_id', 'type']
    const validationErrors = []

    requiredFields.forEach((field) => {
      const value = body[field]
      const isEmpty = value === undefined || value === null || value.toString().trim() === ''

      if (isEmpty) {
        validationErrors.push(`${field.replaceAll('_', ' ')} is required`)
      }
    })

    ;['product_id', 'brand_id'].forEach((field) => {
      const value = body[field]
      if (value === undefined || value === null || value.toString().trim() === '') return

      if (isNaN(Number(value))) {
        validationErrors.push(`${field.replaceAll('_', ' ')} must be a valid number`)
      } else if (!Number.isInteger(Number(value))) {
        validationErrors.push(`${field.replaceAll('_', ' ')} must be an integer`)
      } else if (Number(value) <= 0) {
        validationErrors.push(`${field.replaceAll('_', ' ')} must be a positive integer`)
      }
    })

    if (body.usage_quantity !== undefined && Number(body.usage_quantity) < 0) {
      validationErrors.push('usage quantity must be non-negative')
    }

    if (validationErrors.length > 0) {
      return NextResponse.json({ success: false, error: validationErrors }, { status: 400 })
    }

    const payload = {
      product_id: parseInt(body.product_id),
      brand_id: parseInt(body.brand_id),
      type: body.type,
      usage_quantity: parseInt(body.usage_quantity) || 0,
      product_image: body.product_image || '',
      note: body.note || '',
    }

    const newProduct = await createProduct(user.id, payload)

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 })
  } catch (err) {
    console.error('POST /api/inventory/v1/product/create error:', err)

    if (err.message.includes('not found') || err.message.includes('unauthorized')) {
      return NextResponse.json({ success: false, error: err.message }, { status: 404 })
    }

    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
