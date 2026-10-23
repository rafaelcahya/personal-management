import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { SimulationError } from '@/lib/services/running/routeSimulations/errors'

/**
 * Maps a caught error to a response. Only SimulationError carries a status that
 * is safe to show; anything else (DB, Anthropic SDK, bugs) is logged and
 * answered with a generic message, so a provider 401 never looks like an
 * expired session.
 */
export function errorResponse(err, tag, { status = 500, message = 'Internal server error' } = {}) {
  if (err instanceof SimulationError) {
    return NextResponse.json({ error: err.message }, { status: err.status })
  }
  console.error(`[${tag}]`, err)
  return NextResponse.json({ error: message }, { status })
}

/**
 * Parses the JSON body. Returns { body } or { response } with a 400 so the
 * route can return it directly.
 */
export async function readJsonBody(request) {
  try {
    return { body: await request.json() }
  } catch {
    return {
      response: NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 }),
    }
  }
}

export function invalidIdResponse(label) {
  return NextResponse.json({ error: `Invalid ${label} ID` }, { status: 400 })
}

/**
 * Session check shared by the route handlers. `user` is null when there is no
 * valid session; the caller answers 401.
 */
export async function authenticate() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  return { supabase, user: authError ? null : user }
}

/**
 * Like readJsonBody, but an empty body is fine and yields {}.
 */
export async function readOptionalBody(request) {
  const text = await request.text()
  if (!text.trim()) return { body: {} }
  try {
    return { body: JSON.parse(text) }
  } catch {
    return {
      response: NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 }),
    }
  }
}

/**
 * Returns a 413 response when the declared Content-Length is over `maxBytes`,
 * otherwise null. Checked before the body is read; it is a cheap guard, not a
 * hard limit (the schema's max length still applies).
 */
export function rejectOversizedBody(request, maxBytes) {
  const declared = Number(request.headers.get('content-length'))
  if (Number.isFinite(declared) && declared > maxBytes) {
    return NextResponse.json({ error: 'Request body too large' }, { status: 413 })
  }
  return null
}
