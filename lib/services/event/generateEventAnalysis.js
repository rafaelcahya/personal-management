import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `You are a Senior Cross-Asset Research Analyst at an emerging markets hedge fund, specializing in Indonesian capital markets (IDX/IHSG).

Your expertise spans four disciplines:
- Macro Strategy: interpreting central bank decisions (Fed, Bank Indonesia), inflation data, and geopolitical events in the context of Southeast Asian market dynamics
- Equity Research: assessing how macro catalysts translate into sector rotation and individual stock exposure on the IDX
- Risk Analysis: identifying tail risks, scenario asymmetries, and conditions that could invalidate the consensus view
- Emerging Markets: understanding EM-specific dynamics — rupiah sensitivity, foreign fund flows, commodity linkages, and the behavioral patterns unique to Indonesian retail and institutional market participants

Your output style mirrors a high-conviction event brief — the kind distributed in a morning note before the IDX open. Concise, specific, analytical. No filler, no generic disclaimers mid-analysis.

Rules:
- Focus on IDX/IHSG and global events that impact Indonesian equities
- Mention specific IDX sectors and representative stocks where relevant
- Never invent statistics, dates, or specific market data you don't have — be general but accurate, not specific but wrong
- Acknowledge uncertainty explicitly — no definitive forecasts
- All framing is retrospective and analytical, never predictive
- Output in English
- Use markdown with clear section headers
- Total output must not exceed 450 words — every sentence must earn its place`

const SINGLE_EVENT_SECTIONS = `## Context & Historical Pattern
## Exposed Sectors & Stocks (IDX)
## Expectation vs Reality
## Key Risk
---
⚠️ Based on general market knowledge — not real-time data.`

const MULTI_EVENT_SECTIONS = `## Period Overview
## Event Interactions
## Net Directional Bias for IDX
## Stocks to Watch
## Key Risk
---
⚠️ Based on general market knowledge — not real-time data.`

const SINGLE_MODEL = 'claude-haiku-4-5-20251001'
const MULTI_MODEL = 'claude-sonnet-4-6'
const MAX_TOKENS = 700

function buildSingleEventPrompt(event, additionalContext) {
  const hasActualOutcome = Boolean(event.actual_outcome)

  const lines = [
    `Event: ${event.title}`,
    `Date: ${event.event_date}`,
    `Impact direction: ${event.impact_direction === 'UP' ? 'Bullish (UP)' : 'Bearish (DOWN)'}`,
    event.tags?.length ? `Tags: ${event.tags.join(', ')}` : null,
    event.event_description
      ? `\nNotes:\n${event.event_description}`
      : '\nNotes: (no description provided)',
    hasActualOutcome
      ? `\nActual outcome: ${event.actual_outcome === 'UP' ? 'Bullish (UP)' : 'Bearish (DOWN)'}`
      : null,
    additionalContext
      ? `\nAdditional context (real-time at analysis time):\n${additionalContext}`
      : null,
  ].filter(Boolean)

  const sectionsInstruction = hasActualOutcome
    ? `Provide your analysis with these exact sections:\n${SINGLE_EVENT_SECTIONS}`
    : `Provide your analysis with these exact sections (omit "Expectation vs Reality" — actual outcome not recorded):\n## Context & Historical Pattern\n## Exposed Sectors & Stocks (IDX)\n## Key Risk\n---\n⚠️ Based on general market knowledge — not real-time data.`

  return `Analyze this market event:\n\n${lines.join('\n')}\n\n${sectionsInstruction}`
}

function buildMultiEventPrompt(events, additionalContext) {
  const eventSummaries = events
    .map((e, i) => {
      const hasDesc = e.event_description && e.event_description.length > 0
      return [
        `Event ${i + 1}: ${e.title}`,
        `  Date: ${e.event_date}`,
        `  Impact: ${e.impact_direction === 'UP' ? 'Bullish' : 'Bearish'}`,
        e.actual_outcome
          ? `  Actual outcome: ${e.actual_outcome === 'UP' ? 'Bullish' : 'Bearish'}`
          : null,
        hasDesc ? `  Notes: ${e.event_description}` : `  Notes: ⚠️ No description`,
      ]
        .filter(Boolean)
        .join('\n')
    })
    .join('\n\n')

  const contextLine = additionalContext
    ? `\nAdditional context (real-time at analysis time):\n${additionalContext}`
    : ''

  return `Analyze these ${events.length} market events together, focusing on their interactions and combined market impact:\n\n${eventSummaries}${contextLine}\n\nProvide your analysis with these exact sections:\n${MULTI_EVENT_SECTIONS}`
}

/**
 * Calls Claude API with streaming and returns the full output text + usage stats.
 * @param {'single'|'multi'} analysisType
 * @param {object|object[]} eventOrEvents - single event object or array of event objects
 * @param {string} [additionalContext]
 * @returns {AsyncGenerator<string>} async generator yielding text chunks
 */
export async function* streamEventAnalysis(analysisType, eventOrEvents, additionalContext = '') {
  const client = new Anthropic()

  const model = analysisType === 'multi' ? MULTI_MODEL : SINGLE_MODEL
  const userPrompt =
    analysisType === 'multi'
      ? buildMultiEventPrompt(eventOrEvents, additionalContext)
      : buildSingleEventPrompt(eventOrEvents, additionalContext)

  const stream = await client.messages.stream({
    model,
    max_tokens: MAX_TOKENS,
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: userPrompt }],
  })

  let fullText = ''

  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      fullText += chunk.delta.text
      yield { type: 'text', text: chunk.delta.text }
    }
  }

  const finalMessage = await stream.finalMessage()
  const inputTokens = finalMessage.usage?.input_tokens ?? 0
  const outputTokens = finalMessage.usage?.output_tokens ?? 0

  // Cost estimate (per million tokens)
  const inputCostPerM = analysisType === 'multi' ? 3.0 : 0.8
  const outputCostPerM = analysisType === 'multi' ? 15.0 : 4.0
  const costUsd = (inputTokens * inputCostPerM + outputTokens * outputCostPerM) / 1_000_000

  console.log(
    `[event-analysis] type=${analysisType} model=${model} tokens={input:${inputTokens}, output:${outputTokens}} cost=$${costUsd.toFixed(6)}`
  )

  yield {
    type: 'done',
    output_md: fullText,
    model,
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    cost_usd: costUsd,
  }
}
