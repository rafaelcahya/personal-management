import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(_request, { params }) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!UUID_REGEX.test(id)) {
      return NextResponse.json({ error: 'Invalid insight ID' }, { status: 400 })
    }

    const { data: insight, error: fetchError } = await supabase
      .from('rt_ai_insights')
      .select('id, user_id')
      .eq('id', id)
      .maybeSingle()

    if (fetchError) throw fetchError

    if (!insight) {
      return NextResponse.json({ error: 'Insight not found' }, { status: 404 })
    }

    if (insight.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error: updateError } = await supabase
      .from('rt_ai_insights')
      .update({ acknowledged: true })
      .eq('id', id)
      .eq('user_id', user.id)

    if (updateError) throw updateError

    return NextResponse.json({
      data: { id, acknowledged: true },
      message: 'Insight acknowledged',
    })
  } catch (err) {
    console.error('[ai/insights/[id]/ack PATCH]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
