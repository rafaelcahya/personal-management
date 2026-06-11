import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

    const { data, error } = await supabase
      .from('rt_ai_insights')
      .select('id, created_at, content, data_refs')
      .eq('user_id', user.id)
      .eq('insight_type', 'injury_coach')
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error

    return NextResponse.json({ data: data ?? [], message: 'OK' })
  } catch (err) {
    console.error('[running/ai/injury-coach/history GET]', err.message)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
