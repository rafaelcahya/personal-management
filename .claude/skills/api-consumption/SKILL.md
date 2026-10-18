---
name: api-consumption
description: Call this repo's API routes from the frontend — writing fetch functions in lib/api/, reading each module's response shape, error messages, 401 handling, query params, and wiring the result into page state. Use whenever UI code needs data from or sends data to app/api/.
---

# API Consumption

Components never call `fetch` directly. Every request goes through a function in `lib/api/{resource}.js` (one file per resource: `running.js`, `trade.js`, `event.js`, `productBrand.js`, ...).

## Function pattern

```js
// lib/api/running.js
export async function getGoals() {
  const res = await fetch('/api/running/v1/goals')
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const body = await res.json()
  if (!res.ok) throw new Error(body.message || body.error || 'Failed to load goals')
  return body.data
}

export async function updateGoal(id, payload) {
  const res = await fetch(`/api/running/v1/goals/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const body = await res.json()
  if (!res.ok) throw new Error(body.message || body.error || 'Failed to update goal')
  return body.data
}

export async function getActivities({ page = 1, limit = 20, sort, type } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (sort) params.set('sort', sort)
  if (type) params.set('type', type)
  const res = await fetch(`/api/running/v1/activities?${params}`)
  const body = await res.json()
  if (!res.ok) throw new Error(body.message || body.error || 'Failed to load activities')
  return body
}
```

## Read the right fields per module

Check the API Contract comment on the issue, or the route itself.

| Module                   | Success body                                                                                      | Error text to show                                          |
| ------------------------ | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Running, Notifications   | `{ data, message }` → return `body.data` (some list routes return the result object at top level) | `body.message` (user-facing), `body.error` is a short label |
| Trade, Inventory, others | `{ success: true, <entity> }` or `{ success: true, data }`                                        | `body.error` (string or array of strings)                   |

Older functions throw `data.error` only — for Running routes prefer `body.message || body.error` so the user sees the real reason.

## Rules

1. Function names: `get…`, `fetch…`, `create…`, `update…`, `delete…`, `save…` — one function per endpoint and method.
2. Build URLs from the route path and `URLSearchParams`; never string-concatenate user input into the query.
3. Throw `Error` with a readable message; components show it via `toast.error` or inline error state (see `ui-builder`).
4. 401 → throw `'UNAUTHORIZED'` where the page needs to react (redirect or reconnect prompt).
5. Return only what the caller needs (`body.data`), so components don't depend on the envelope.
6. Don't import anything server-only (`lib/supabase/admin`, `lib/services/*`) into `lib/api/` or components.
7. Timezone-sensitive endpoints pass `tz_offset: String(new Date().getTimezoneOffset())` like `getDashboard` does.
8. Long-running actions (sync, AI generation) return quickly with a queued status — show a pending state and refetch or poll; don't block the UI.
