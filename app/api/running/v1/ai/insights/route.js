import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const activityId = searchParams.get('activity_id')
    const type = searchParams.get('type')
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '10', 10) || 10)

    let query = supabase
      .from('rt_ai_insights')
      .select(
        'id, insight_type, status, is_valid, title, content, data_refs, acknowledged, created_at'
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (type) query = query.eq('insight_type', type)
    if (activityId) query = query.contains('data_refs', { activity_id: activityId })

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ data: data ?? [] })
  } catch (err) {
    console.error('[ai/insights GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
