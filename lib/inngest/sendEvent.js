import { NextResponse } from 'next/server'
import { inngest } from '@/lib/inngest/client'

export class JobsUnavailableError extends Error {
  constructor() {
    super('Background jobs are unavailable')
    this.name = 'JobsUnavailableError'
  }
}

/**
 * inngest.send for routes. When the event cannot be delivered (Inngest down, or the local Dev
 * Server not running) it throws JobsUnavailableError, so the route can answer 503 instead of 500.
 */
export async function sendEvent(payload) {
  try {
    return await inngest.send(payload)
  } catch (err) {
    console.error('[inngest] send failed:', err?.message)
    throw new JobsUnavailableError()
  }
}

/** The 503 response for a JobsUnavailableError, or null for any other error. */
export function jobsUnavailableResponse(err) {
  if (!(err instanceof JobsUnavailableError)) return null
  return NextResponse.json(
    { error: 'Service unavailable', message: 'Background jobs are unavailable. Try again later.' },
    { status: 503 }
  )
}
