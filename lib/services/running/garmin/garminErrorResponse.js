import { NextResponse } from 'next/server'
import { GarminError } from './garminClient'

const BODIES = {
  not_connected: [409, { error: 'Conflict', message: 'Garmin is not connected' }],
  expired: [409, { error: 'Conflict', message: 'Garmin key is expired or invalid' }],
  invalid: [409, { error: 'Conflict', message: 'Garmin key is expired or invalid' }],
  unavailable: [502, { error: 'Bad Gateway', message: 'Garmin API is unavailable' }],
  rate_limited: [
    429,
    { error: 'Too many requests', message: 'Garmin is rate limiting requests. Try again later' },
  ],
}

const KEY_REJECTED = [400, { error: 'Bad Request', message: 'Garmin rejected the API key' }]

/**
 * Turns a GarminError into the module's { error, message } response.
 * Returns null for anything else so the caller can fall through to its 500.
 * A "rejected" error only means a bad key while saving; elsewhere it is a Garmin-side failure.
 */
export function garminErrorResponse(err, { savingKey = false } = {}) {
  if (!(err instanceof GarminError)) return null
  const [status, body] =
    err.kind === 'rejected' ? (savingKey ? KEY_REJECTED : BODIES.unavailable) : BODIES[err.kind]
  return NextResponse.json(body, { status })
}
