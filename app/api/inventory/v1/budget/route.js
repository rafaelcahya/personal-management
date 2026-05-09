import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user)
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('inventory_budget')
      .select('type, monthly_budget')
      .eq('user_id', user.id)

    if (error) throw new Error(error.message)

    return NextResponse.json({ success: true, data: data || [] }, { status: 200 })
  } catch (err) {
    console.error('GET /api/inventory/v1/budget error:', err)
    return NextResponse.json(
      { success: false, error: err?.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user)
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { type, monthly_budget } = body

    if (!type || monthly_budget == null)
      return NextResponse.json(
        { success: false, error: 'type and monthly_budget are required' },
        { status: 400 }
      )

    const { error } = await supabase
      .from('inventory_budget')
      .upsert(
        {
          user_id: user.id,
          type,
          monthly_budget: Number(monthly_budget),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,type' }
      )

    if (error) throw new Error(error.message)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('POST /api/inventory/v1/budget error:', err)
    return NextResponse.json(
      { success: false, error: err?.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
