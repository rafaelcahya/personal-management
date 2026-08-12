import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// S-2: validate message shape and cap count/length to prevent oversized API calls
const chatMessagesSchema = z
  .array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string().min(1).max(10000),
    })
  )
  .min(1)
  .max(50)

export async function POST(req) {
  try {
    const authClient = await createClient()
    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    let body
    try {
      body = await req.json()
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const parsed = chatMessagesSchema.safeParse(body?.messages)
    if (!parsed.success) {
      const errors = parsed.error.issues.map((i) => i.message)
      return new Response(JSON.stringify({ error: errors }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const messages = parsed.data

    // S-1: admin client bypasses RLS — safe only because every query below
    // explicitly filters by user.id. Do not remove the .eq('user_id', user.id) filters.
    const supabase = createAdminClient()

    const [{ data: tradeList }, { data: feeList }, { data: eventList }, { data: settings }] =
      await Promise.all([
        supabase
          .from('trade_list')
          .select(
            'buy_date,sell_date,ticker,margin,proceeds,return_percent,realized_gain,entry_session_option,buy_reason_option,sell_reason_option,entry_occasion_option,stock_type_option,notes'
          )
          .eq('user_id', user.id)
          .is('deleted_at', null)
          .order('sell_date', { ascending: false, nullsFirst: false })
          .limit(200),
        supabase
          .from('fee_list')
          .select('fee_name,fee,fee_date')
          .eq('user_id', user.id)
          .is('deleted_at', null)
          .order('fee_date', { ascending: false })
          .limit(100),
        supabase
          .from('event_list')
          .select('event_description,impact_direction,event_date,is_favorite')
          .eq('user_id', user.id)
          .is('deleted_at', null)
          .order('event_date', { ascending: false })
          .limit(50),
        supabase
          .from('settings')
          .select('initial_margin,bi_risk_free_rate,personal_risk_free_rate,margin_of_error')
          .eq('user_id', user.id)
          .limit(1)
          .single(),
      ])

    const systemPrompt = `You are an AI assistant for the Trading Management feature in a personal management app.
You help users analyze their stock trades, review performance, manage fees, and track market events.

Here is the user's current trading data:

## Trade List — ${tradeList?.length ?? 0} trades (most recent 200):
${JSON.stringify(tradeList)}

## Fee List — ${feeList?.length ?? 0} fees (most recent 100):
${JSON.stringify(feeList)}

## Event List — ${eventList?.length ?? 0} events (most recent 50):
${JSON.stringify(eventList)}

## User Settings:
${JSON.stringify(settings)}

Guidelines:
- Answer in clear, friendly English
- Provide actionable insights based on the user's real data only
- When discussing trades, mention specific tickers, dates, and P&L numbers from the data
- Calculate win rate, total realized gain/loss, and average trade metrics when relevant
- If the user has a losing streak or is underwater, offer constructive analysis
- Use tables when comparing multiple trades or metrics
- Never fabricate data — only use what is provided above
- Format currency values clearly (e.g., +Rp 1,500,000 or -Rp 250,000)`

    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    })

    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            controller.enqueue(new TextEncoder().encode(chunk.delta.text))
          }
        }
        controller.close()
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (err) {
    console.error('POST /api/trade-chat error:', err)
    return new Response(JSON.stringify({ error: 'Something went wrong' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
