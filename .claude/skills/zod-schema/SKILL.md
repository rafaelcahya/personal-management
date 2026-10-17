---
name: zod-schema
description: Write or change Zod 4 validation schemas in schemas/ for this repo — file naming, create/update/query schema patterns, error messages, cross-field refine, and sharing schemas between the API route and react-hook-form. Use when an endpoint or form needs input validation.
---

# Zod Schemas

The project uses **Zod 4** (`zod@4.x`). Schemas in `schemas/` are the single source of truth for input shapes — the route validates with them and the form (react-hook-form) uses the same schema. Never re-define validation inline.

## Files

- One file per resource: `schemas/{resource}.js` (`raceLog.js`, `trade.js`, `runningGear.js`).
- Export named schemas: `create{Resource}Schema`, `update{Resource}Schema`, `{resource}QuerySchema`.
- When the server needs stricter rules than the form (computed fields, server-only checks), export a separate `...ServerSchema` (see `createTradeServerSchema` in `schemas/trade.js`).

## Patterns

```js
import { z } from 'zod'

const today = () => new Date().toISOString().slice(0, 10)

const raceLogFields = z.object({
  title: z.string().trim().min(1, 'Race name is required').max(200, 'Race name is too long'),
  race_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Race date must be in YYYY-MM-DD format')
    .refine((d) => d <= today(), { message: 'Race date cannot be in the future' }),
  distance_m: z.number({ error: 'Distance must be a number' }).positive().max(1_000_000),
  finish_time_sec: z.number().int().positive().optional().nullable(),
  activity_id: z.uuid('Invalid activity ID').optional().nullable(),
  notes: z.string().max(5000).optional().nullable(),
  did_not_finish: z.boolean().optional().default(false),
})

export const createRaceLogSchema = raceLogFields.refine(
  (d) => d.did_not_finish || !!d.finish_time_sec,
  { message: 'Finish time is required unless you did not finish', path: ['finish_time_sec'] }
)

// PATCH: build from the plain object — .partial() throws on a refined schema
export const updateRaceLogSchema = raceLogFields
  .partial()
  .refine((d) => Object.keys(d).length > 0, { message: 'Nothing to update' })

// Query params arrive as strings — coerce them
export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().max(100).optional(),
})
```

Keep a plain `z.object({...})` base and add `.refine()` on top. `.partial()`, `.pick()`, and `.omit()` throw on a schema that already has a refinement.

## Zod 4 rules

- Read errors from `result.error.issues` (`.errors` is gone).
- Custom messages: pass a string, or `{ error: '...' }`.
- **Gotcha:** `invalid_type_error` and `required_error` are Zod 3 options. Zod 4 **silently ignores** them, so the user sees `Invalid input: expected number, received string` instead of your message. ~25 old schemas still use them. Never copy them; when you touch one of those schemas, switch it to `{ error: '...' }`.
- Top-level formats: `z.uuid()`, `z.email()`, `z.url()` (the `z.string().uuid()` form is deprecated).
- Use `.trim()` on user text, `.max()` on every string, and `.nullable().optional()` for clearable fields.
- Messages are user-facing — short, plain English, say what to fix.
