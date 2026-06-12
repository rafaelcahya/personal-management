import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const TABLE = 'event_ai_analysis'
const EVENT_TABLE = 'event_list'

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

    const adminClient = createAdminClient()

    const { data: analyses, error } = await adminClient
      .from(TABLE)
      .select(
        'id, analysis_type, event_id, event_ids, model, output_md, input_tokens, output_tokens, cost_usd, generated_at'
      )
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('generated_at', { ascending: false })
      .limit(50)

    if (error) throw new Error(error.message)

    // Collect all event IDs to batch-fetch titles
    const singleIds = analyses.filter((a) => a.event_id).map((a) => a.event_id)
    const multiIds = analyses.filter((a) => Array.isArray(a.event_ids)).flatMap((a) => a.event_ids)
    const allIds = [...new Set([...singleIds, ...multiIds])]

    let eventMap = {}
    if (allIds.length > 0) {
      const { data: events } = await adminClient
        .from(EVENT_TABLE)
        .select('id, title')
        .in('id', allIds)
        .eq('user_id', user.id)
        .is('deleted_at', null)
      if (events) {
        eventMap = Object.fromEntries(events.map((e) => [e.id, e.title]))
      }
    }

    const enriched = analyses.map((a) => ({
      ...a,
      event_title: a.event_id ? (eventMap[a.event_id] ?? null) : null,
      event_titles: Array.isArray(a.event_ids)
        ? a.event_ids.map((id) => eventMap[id] ?? `Event #${id}`)
        : [],
    }))

    return NextResponse.json({ data: enriched, message: 'OK' }, { status: 200 })
  } catch (err) {
    console.error('[trade/ai/event-analysis/history GET]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
