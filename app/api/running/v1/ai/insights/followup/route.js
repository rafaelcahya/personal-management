import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildFollowUpPrompt } from '@/lib/services/running/ai/prompts'

const anthropic = new Anthropic()

export async function POST(req) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  let body
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { question, insightId } = body ?? {}
  if (!question?.trim()) return Response.json({ error: 'question is required' }, { status: 400 })
  if (!insightId) return Response.json({ error: 'insightId is required' }, { status: 400 })

  const { data: insight } = await supabase
    .from('rt_ai_insights')
    .select('content')
    .eq('id', insightId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!insight) return Response.json({ error: 'Insight not found' }, { status: 404 })

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 200,
    temperature: 0.3,
    system: buildFollowUpPrompt(insight.content),
    messages: [{ role: 'user', content: question.trim() }],
  })

  const content = response.content[0]?.text ?? ''
  if (!content) return Response.json({ error: 'Empty response from AI' }, { status: 500 })

  return Response.json({ content })
}
