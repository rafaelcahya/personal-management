# Route Patterns (from real code)

## REST style — Running (`{ data, message }` / `{ error, message }`)

Based on `app/api/running/v1/goals/[id]/route.js`.

```js
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateGoal } from '@/lib/services/running/goals/updateGoal'
import { updateGoalSchema } from '@/schemas/raceLog'

export async function PATCH(request, { params }) {
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

    const { id } = await params

    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Validation failed', message: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const parsed = updateGoalSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const goal = await updateGoal(supabase, user.id, id, parsed.data)
    if (!goal) {
      return NextResponse.json({ error: 'Not found', message: 'Goal not found' }, { status: 404 })
    }

    return NextResponse.json({ data: goal, message: 'Goal updated' }, { status: 200 })
  } catch (err) {
    console.error('[running/goals PATCH]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
```

## List with pagination — Running

Based on `app/api/running/v1/activities/route.js`. Clamp `limit` with named constants; validate enum-like params against an allow-list.

```js
const MAX_LIMIT = 100
const DEFAULT_LIMIT = 20
const VALID_SORTS = ['newest', 'oldest', 'longest', 'fastest']

export async function GET(request) {
  try {
    // ...auth check as above...
    const { searchParams } = new URL(request.url)
    const rawSort = searchParams.get('sort') ?? 'newest'
    const sort = VALID_SORTS.includes(rawSort) ? rawSort : 'newest'
    const page = parseInt(searchParams.get('page') ?? '1', 10) || 1
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, parseInt(searchParams.get('limit') ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT)
    )

    const result = await getActivities(user.id, { sort, page, limit })
    return NextResponse.json(result, { status: 200 })
  } catch (err) {
    console.error('[running/activities GET]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
```

For new list endpoints with several filters, prefer a Zod query schema (`schema.safeParse(Object.fromEntries(searchParams))` with `z.coerce.number()`) — see `schemas/runningAnalyticsQuery.js`.

## Action-path style — Trade (`{ success, ... }`)

Based on `app/api/trade/v1/trade/create/route.js`.

```js
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createTrade } from '@/lib/services/trade/createTrade'
import { createTradeServerSchema } from '@/schemas/trade'

export async function POST(req) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    let body
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const parsed = createTradeServerSchema.safeParse(body)
    if (!parsed.success) {
      const errors = parsed.error.issues.map((i) => i.message)
      return NextResponse.json({ success: false, error: errors }, { status: 400 })
    }

    const newTrade = await createTrade(user.id, parsed.data)
    return NextResponse.json({ success: true, trade: newTrade }, { status: 201 })
  } catch (err) {
    console.error('[trade/create POST]', err)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
```

## Firing a background job instead of doing slow work inline

```js
import { inngest } from '@/lib/inngest/client'

await inngest.send({ name: 'strava/backfill', data: { userId: user.id } })
return NextResponse.json({ data: { queued: true }, message: 'Sync started' }, { status: 202 })
```

## Registering the endpoint

```json
// cypress/fixtures/app-constants.json — and the same key in app-constants.yaml
"endpoints": {
  "running_goals": {
    "goals": "/api/running/v1/goals"
  }
}
```
