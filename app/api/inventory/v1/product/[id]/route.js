import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getProductById } from '@/lib/services/inventory/product/getProductById'
import { updateProductDetails } from '@/lib/services/inventory/product/updateProductDetails'

export async function GET(req, { params }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 })
    }

    const idNum = Number(id)
    if (isNaN(idNum)) {
      return NextResponse.json(
        { success: false, error: 'Product ID must be a valid number' },
        { status: 400 }
      )
    }

    if (!Number.isInteger(idNum)) {
      return NextResponse.json(
        { success: false, error: 'Product ID must be an integer' },
        { status: 400 }
      )
    }

    if (idNum <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product ID must be a positive integer',
        },
        { status: 400 }
      )
    }

    const product = await getProductById(user.id, idNum.toString())

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: product }, { status: 200 })
  } catch (err) {
    console.error('GET /api/inventory/v1/product/[id] error:', err)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}

export async function PATCH(req, { params }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const idNum = Number(id)

    if (!id || isNaN(idNum) || !Number.isInteger(idNum) || idNum <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid product ID' }, { status: 400 })
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

    const { brand_id, product_id, type, product_status } = body
    const errors = []

    if (!brand_id || isNaN(Number(brand_id)) || Number(brand_id) <= 0)
      errors.push('brand_id must be a positive integer')
    if (!product_id || isNaN(Number(product_id)) || Number(product_id) <= 0)
      errors.push('product_id must be a positive integer')
    if (!type || typeof type !== 'string' || type.trim() === '') errors.push('type is required')
    if (!['active', 'inactive'].includes(product_status))
      errors.push("product_status must be 'active' or 'inactive'")

    if (errors.length > 0) {
      return NextResponse.json({ success: false, error: errors }, { status: 400 })
    }

    const updated = await updateProductDetails(user.id, idNum, {
      brand_id: Number(brand_id),
      product_id: Number(product_id),
      type: type.trim(),
      product_status,
    })

    return NextResponse.json(
      { success: true, data: updated, message: 'Product updated successfully' },
      { status: 200 }
    )
  } catch (err) {
    console.error('PATCH /api/inventory/v1/product/[id] error:', err)

    if (err.code === 'NOT_FOUND' || err.message.includes('not found')) {
      return NextResponse.json({ success: false, error: err.message }, { status: 404 })
    }

    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
