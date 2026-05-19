import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createTrade } from '@/lib/services/trade/createTrade'

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

    const requiredFields = ['trade_date', 'ticker', 'margin', 'proceeds']
    const validationErrors = []

    requiredFields.forEach((field) => {
      if (!body[field] || body[field].toString().trim() === '') {
        validationErrors.push(`${field.replace(/_/g, ' ')} is required`)
      }
    })

    if (validationErrors.length > 0) {
      return NextResponse.json({ success: false, error: validationErrors }, { status: 400 })
    }

    const newTrade = await createTrade(user.id, body)

    return NextResponse.json({ success: true, trade: newTrade }, { status: 201 })
  } catch (err) {
    console.error('POST /api/trade/create error:', err)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
