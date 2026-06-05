import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

// Validasi output Claude sebelum disimpan ke DB
function validateOutput(output, insightType) {
  const minLength = {
    post_activity: 150,
    weekly_review: 200,
    anomaly: 50,
    daily: 100,
    on_demand: 150,
    analytics_summary: 100,
    friday_prep: 100,
  }

  const requiredSections = {
    post_activity: ['## Highlights'],
    weekly_review: ['## Training Balance'],
    anomaly: [],
    daily: [],
    on_demand: ['## Highlights'],
    analytics_summary: ['weekly_distance', 'pace_trend'],
    friday_prep: ['weekend_plan', 'saturday', 'sunday'],
  }

  if (output.length < (minLength[insightType] ?? 100)) {
    return { valid: false, reason: 'too_short' }
  }

  const missing = (requiredSections[insightType] ?? []).filter((s) => !output.includes(s))
  if (missing.length > 0) {
    return { valid: false, reason: 'missing_sections', missing }
  }

  return { valid: true }
}

// Call Claude API dan return output text
export async function generateInsight({
  systemPrompt,
  userContent,
  insightType,
  maxTokens = 1500,
}) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: maxTokens,
    temperature: 0.3,
    system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: userContent }],
  })

  const { cache_creation_input_tokens, cache_read_input_tokens, input_tokens } = response.usage
  console.log(
    `[ai/insight] type=${insightType} tokens={input:${input_tokens}, cache_write:${cache_creation_input_tokens ?? 0}, cache_read:${cache_read_input_tokens ?? 0}}`
  )

  const output = response.content[0]?.text ?? ''
  const validation = validateOutput(output, insightType)

  return { output, isValid: validation.valid, validationReason: validation.reason }
}
