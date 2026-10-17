---
name: ai-integration
description: Add or change features that call Claude through the Anthropic SDK in this repo (Running AI coach insights, trade event analysis, chat routes) — where AI code lives, prompt caching, output validation, token logging, rate-limit tier, and running generation in Inngest. Use with the claude-api skill for API details.
---

# AI Integration (Anthropic SDK)

For **API correctness** (model IDs, thinking/effort params, what each model accepts), load the `claude-api` skill — don't write API calls from memory. This skill covers how AI code is organized in this repo.

## Where it lives

| Use                                                                                      | File                                                                                         |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Running insights (post-activity, weekly, daily, anomaly, Friday prep, analytics summary) | `lib/services/running/ai/generateInsight.js` + Inngest functions in `lib/inngest/functions/` |
| Insight follow-up chat                                                                   | `app/api/running/v1/ai/insights/followup/route.js`                                           |
| Trade event analysis                                                                     | `lib/services/event/generateEventAnalysis.js`                                                |
| General chat / trade chat                                                                | `app/api/chat/route.js`, `app/api/trade-chat/route.js`                                       |

SDK: `@anthropic-ai/sdk` 0.91.x, `import Anthropic from '@anthropic-ai/sdk'`, `new Anthropic()` (reads `ANTHROPIC_API_KEY`).

## Pattern used in the project

```js
const client = new Anthropic()
const response = await client.messages.create({
  model: MODEL_ID,
  max_tokens: maxTokens,
  system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
  messages: [{ role: 'user', content: userContent }],
})

const { input_tokens, cache_creation_input_tokens, cache_read_input_tokens } = response.usage
console.log(
  `[ai/insight] type=${insightType} tokens={input:${input_tokens}, cache_write:${cache_creation_input_tokens ?? 0}, cache_read:${cache_read_input_tokens ?? 0}}`
)

const output = response.content.find((b) => b.type === 'text')?.text ?? ''
const validation = validateOutput(output, insightType)
```

## Rules

1. **Generation runs in Inngest**, not in the request — the route sends an event and the UI shows a pending state (see `background-job`). Short interactive chat replies are the exception.
2. **Cache the system prompt** — keep it stable (no timestamps or per-request IDs in it) and mark it with `cache_control`. Put per-request data in the user message.
3. **Validate output before saving** — check minimum length and required sections per insight type (`validateOutput` in `generateInsight.js`). Save invalid output with its reason, or retry; never silently store junk.
4. **Log token usage** with the `[ai/...]` prefix, never the prompt content or user data.
5. **Read text blocks by type** (`content.find(b => b.type === 'text')`) — newer models can return thinking blocks before the text.
6. **Rate limit** — AI routes must fall under the `ai` tier (30/hour) in `lib/rate-limit.js` → `getRateLimitTier()`. Check the path mapping when adding a route.
7. **New insight types** need a DB migration — `rt_ai_insights.insight_type` has the CHECK constraint `rt_ai_insights_insight_type_check` (current values: `post_activity`, `weekly_review`, `anomaly`, `daily`, `on_demand`, `analytics_summary`, `friday_prep`, `injury_coach`). Drop and recreate it with the new value, like `add_friday_prep_insight_type` did. Also add the type to `validateOutput`.
8. **Model changes are a user decision.** The code currently uses `claude-sonnet-4-6` and `claude-haiku-4-5-20251001`. Don't switch models as a side effect of another task. When the user asks for a newer model, follow `claude-api` → model migration: Sonnet 5.5 and Opus 5.5 reject non-default `temperature`, and the current code sets `temperature: 0.3`.
9. Keep system prompts in the service layer, not inline in route handlers.
