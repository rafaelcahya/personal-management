import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  generateSingleAnalysisSchema,
  generateMultiAnalysisSchema,
  getAnalysisQuerySchema,
} from '@/schemas/eventAiAnalysis'
import { streamEventAnalysis } from '@/lib/services/event/generateEventAnalysis'

const DAILY_CAP = 50
const TABLE = 'event_ai_analysis'
const EVENT_TABLE = 'event_list'

async function checkDailyCap(adminClient, userId) {
  const startOfDay = new Date()
  startOfDay.setUTCHours(0, 0, 0, 0)

  const { count, error } = await adminClient
    .from(TABLE)
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('generated_at', startOfDay.toISOString())

  if (error) throw new Error(error.message)
  return (count ?? 0) >= DAILY_CAP
}

async function fetchEventsByIds(adminClient, userId, eventIds) {
  const { data, error } = await adminClient
    .from(EVENT_TABLE)
    .select('id, title, event_description, impact_direction, actual_outcome, tags, event_date')
    .in('id', eventIds)
    .eq('user_id', userId)
    .is('deleted_at', null)

  if (error) throw new Error(error.message)
  return data ?? []
}

async function softDeletePreviousAnalysis(adminClient, userId, eventId) {
  await adminClient
    .from(TABLE)
    .update({ deleted_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('event_id', eventId)
    .is('deleted_at', null)
}

async function softDeletePreviousMultiAnalysis(adminClient, userId, eventIds) {
  // Soft-delete any prior multi-analysis that contains the same set of event IDs
  const sortedIds = [...eventIds].sort()
  const { data } = await adminClient
    .from(TABLE)
    .select('id, event_ids')
    .eq('user_id', userId)
    .eq('analysis_type', 'multi')
    .is('deleted_at', null)

  if (!data?.length) return

  const matchingIds = data
    .filter((row) => {
      const rowIds = (row.event_ids ?? []).slice().sort()
      return JSON.stringify(rowIds) === JSON.stringify(sortedIds)
    })
    .map((row) => row.id)

  if (matchingIds.length === 0) return

  await adminClient
    .from(TABLE)
    .update({ deleted_at: new Date().toISOString() })
    .in('id', matchingIds)
}

async function persistAnalysis(adminClient, userId, payload) {
  const { error } = await adminClient.from(TABLE).insert(payload)
  if (error) throw new Error(error.message)
}

// GET /api/trade/v1/ai/event-analysis?event_id=:id
// Returns latest non-deleted analysis for the event (single or multi)
export async function GET(request) {
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

    const { searchParams } = new URL(request.url)
    const parsed = getAnalysisQuerySchema.safeParse(Object.fromEntries(searchParams))

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { event_id } = parsed.data
    const adminClient = createAdminClient()

    // Return both single analysis for this event AND any multi-analyses that include it
    const { data: singleAnalysis, error: singleError } = await adminClient
      .from(TABLE)
      .select(
        'id, analysis_type, model, output_md, input_tokens, output_tokens, cost_usd, generated_at, event_ids'
      )
      .eq('user_id', user.id)
      .eq('event_id', event_id)
      .eq('analysis_type', 'single')
      .is('deleted_at', null)
      .order('generated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (singleError) throw new Error(singleError.message)

    // Also fetch multi-analyses that include this event_id in their event_ids array
    const { data: multiAnalyses, error: multiError } = await adminClient
      .from(TABLE)
      .select(
        'id, analysis_type, model, output_md, input_tokens, output_tokens, cost_usd, generated_at, event_ids'
      )
      .eq('user_id', user.id)
      .eq('analysis_type', 'multi')
      .is('deleted_at', null)
      .contains('event_ids', [event_id])
      .order('generated_at', { ascending: false })
      .limit(5)

    if (multiError) throw new Error(multiError.message)

    return NextResponse.json(
      {
        data: {
          single: singleAnalysis,
          multi: multiAnalyses ?? [],
        },
        message: 'OK',
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('[trade/ai/event-analysis GET]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

// POST /api/trade/v1/ai/event-analysis
// Streaming endpoint — generates and persists analysis
export async function POST(request) {
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

    const body = await request.json()

    // Try multi schema first, fall back to single — avoids routing on raw unvalidated body
    const multiAttempt = generateMultiAnalysisSchema.safeParse(body)
    const isMulti = multiAttempt.success
    const parsed = isMulti ? multiAttempt : generateSingleAnalysisSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { additional_context = '' } = parsed.data
    const adminClient = createAdminClient()

    // Daily cap check
    const capExceeded = await checkDailyCap(adminClient, user.id)
    if (capExceeded) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: "You've reached the daily analysis limit (50). Resets at midnight.",
        },
        { status: 429 }
      )
    }

    let events
    let analysisType

    if (isMulti) {
      const { event_ids } = parsed.data
      events = await fetchEventsByIds(adminClient, user.id, event_ids)

      // Ownership check — all requested IDs must belong to user
      if (events.length !== event_ids.length) {
        return NextResponse.json(
          { error: 'Forbidden', message: 'One or more events not found or not owned by you' },
          { status: 403 }
        )
      }

      analysisType = 'multi'
    } else {
      const { event_id } = parsed.data
      const fetched = await fetchEventsByIds(adminClient, user.id, [event_id])

      if (!fetched.length) {
        return NextResponse.json(
          { error: 'Not found', message: 'Event not found or not owned by you' },
          { status: 404 }
        )
      }

      events = fetched[0]
      analysisType = 'single'
    }

    // Validate content gate: must have description or additional_context
    const hasDescription = isMulti
      ? events.some((e) => e.event_description && e.event_description.length > 0)
      : events.event_description && events.event_description.length > 0

    if (!hasDescription && !additional_context) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          message: 'Add notes or additional context before analyzing',
        },
        { status: 400 }
      )
    }

    // Stream the response
    const encoder = new TextEncoder()

    const readableStream = new ReadableStream({
      async start(controller) {
        let outputMd = ''
        let finalMeta = null

        try {
          for await (const chunk of streamEventAnalysis(analysisType, events, additional_context)) {
            if (chunk.type === 'text') {
              outputMd += chunk.text
              controller.enqueue(encoder.encode(chunk.text))
            } else if (chunk.type === 'done') {
              finalMeta = chunk
            }
          }

          // Persist after stream completes
          if (finalMeta && outputMd.trim().length > 0) {
            try {
              if (isMulti) {
                await softDeletePreviousMultiAnalysis(adminClient, user.id, parsed.data.event_ids)
                await persistAnalysis(adminClient, user.id, {
                  user_id: user.id,
                  analysis_type: 'multi',
                  event_ids: parsed.data.event_ids,
                  model: finalMeta.model,
                  output_md: outputMd,
                  input_tokens: finalMeta.input_tokens,
                  output_tokens: finalMeta.output_tokens,
                  cost_usd: finalMeta.cost_usd,
                  generated_at: new Date().toISOString(),
                })
              } else {
                await softDeletePreviousAnalysis(adminClient, user.id, parsed.data.event_id)
                await persistAnalysis(adminClient, user.id, {
                  user_id: user.id,
                  analysis_type: 'single',
                  event_id: parsed.data.event_id,
                  model: finalMeta.model,
                  output_md: outputMd,
                  input_tokens: finalMeta.input_tokens,
                  output_tokens: finalMeta.output_tokens,
                  cost_usd: finalMeta.cost_usd,
                  generated_at: new Date().toISOString(),
                })
              }
            } catch (persistErr) {
              console.error('[event-analysis] persist error (stream already complete):', persistErr)
            }
          }
        } catch (streamErr) {
          console.error('[trade/ai/event-analysis POST stream]', streamErr)
          controller.enqueue(encoder.encode('\n\n[Analysis failed — please retry]'))
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (err) {
    console.error('[trade/ai/event-analysis POST]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
