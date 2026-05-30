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
  }

  const requiredSections = {
    post_activity: ['## Highlights'],
    weekly_review: ['## Training Balance'],
    anomaly: [],
    daily: [],
    on_demand: ['## Highlights'],
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
    system: systemPrompt,
    messages: [{ role: 'user', content: userContent }],
  })

  const output = response.content[0]?.text ?? ''
  const validation = validateOutput(output, insightType)

  return { output, isValid: validation.valid, validationReason: validation.reason }
}
