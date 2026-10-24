import { sendEvent } from '@/lib/inngest/sendEvent'
import { acquireGarminSyncLock, releaseGarminSyncLock } from './garminSyncLock'

/**
 * Takes the one-sync-at-a-time lock and queues the background sync.
 * Returns { queued: true }, or { queued: false } when a sync is already running.
 * Throws JobsUnavailableError (lock released) when the event cannot be sent.
 */
export async function queueGarminSync(userId, { from, to }, source = 'manual') {
  const gotLock = await acquireGarminSyncLock(userId)
  if (!gotLock) return { queued: false }

  try {
    await sendEvent({
      name: 'garmin/sync.requested',
      data: { userId, from, to, source, lockHeld: true },
    })
  } catch (err) {
    await releaseGarminSyncLock(userId)
    throw err
  }
  return { queued: true }
}
