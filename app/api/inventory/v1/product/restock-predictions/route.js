import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getRestockPredictions } from '@/lib/services/inventory/product/getRestockPredictions'

export async function GET() {
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

    const predictions = await getRestockPredictions(user.id)

    return NextResponse.json({ data: predictions, message: 'OK' }, { status: 200 })
  } catch (err) {
    console.error('[inventory/restock-predictions]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
