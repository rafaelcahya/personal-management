import { createHash } from 'crypto'
import webpush from 'web-push'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAllowedPushEndpoint } from '@/lib/utils/pushEndpoint'

// Only fixed codes are stored and shown to users; raw text from the push service or the
// library stays in the server log.
const PUSH_TIMEOUT_MS = 8000

export const PUSH_ERROR = {
  INVALID_SUBSCRIPTION: 'invalid_subscription',
  ENDPOINT_NOT_ALLOWED: 'endpoint_not_allowed',
  VAPID_NOT_CONFIGURED: 'vapid_not_configured',
  EXPIRED: 'subscription_expired',
  REJECTED: 'push_rejected',
  FAILED: 'push_send_failed',
}

const vapidReady = () =>
  !!(
    process.env.VAPID_EMAIL &&
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY &&
    process.env.VAPID_PRIVATE_KEY
  )

export const hashEndpoint = (endpoint) => createHash('sha256').update(endpoint).digest('hex')

async function logDelivery(userId, source, endpoint, result) {
  if (!userId) return
  try {
    const supabase = createAdminClient()
    const { error } = await supabase.from('push_delivery_log').insert({
      user_id: userId,
      source: source ?? 'unknown',
      status: result.sent ? 'sent' : result.expired ? 'expired' : 'failed',
      status_code: result.statusCode ?? null,
      error: result.error ?? null,
      endpoint_hash: endpoint ? hashEndpoint(endpoint) : null,
    })
    if (error) console.error('[sendPushNotification] log insert failed', error.message)
  } catch (err) {
    // A logging failure must never block or fail the notification itself.
    console.error('[sendPushNotification] log failed', err?.message)
  }
}

/**
 * Sends one web push and records the outcome in push_delivery_log when userId is given.
 * Never throws — callers get { sent, expired?, error?, statusCode? }.
 */
export async function sendPushNotification(subscription, payload, { userId, source } = {}) {
  const endpoint = subscription?.endpoint
  let result

  if (!endpoint) {
    result = { sent: false, error: PUSH_ERROR.INVALID_SUBSCRIPTION }
  } else if (!isAllowedPushEndpoint(endpoint)) {
    result = { sent: false, error: PUSH_ERROR.ENDPOINT_NOT_ALLOWED }
  } else if (!vapidReady()) {
    result = { sent: false, error: PUSH_ERROR.VAPID_NOT_CONFIGURED }
  } else {
    try {
      // setVapidDetails throws when a key is missing (e.g. env not set in a deploy),
      // so it has to sit inside the try to surface as a recorded failure.
      webpush.setVapidDetails(
        `mailto:${process.env.VAPID_EMAIL}`,
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
      )
      const body = JSON.stringify({
        title: payload?.title,
        body: payload?.body,
        url: payload?.url ?? '/',
      })
      // Send to the normalized URL so web-push parses the same host the allowlist checked.
      const res = await webpush.sendNotification(
        { ...subscription, endpoint: new URL(endpoint).href },
        body,
        { timeout: PUSH_TIMEOUT_MS }
      )
      result = { sent: true, statusCode: res?.statusCode ?? null }
    } catch (err) {
      if (err.statusCode === 410 || err.statusCode === 404) {
        result = {
          sent: false,
          expired: true,
          error: PUSH_ERROR.EXPIRED,
          statusCode: err.statusCode,
        }
      } else if (err.statusCode) {
        console.error('[sendPushNotification]', err.statusCode, err.body)
        result = { sent: false, error: PUSH_ERROR.REJECTED, statusCode: err.statusCode }
      } else if (/vapid|public key|private key|subject/i.test(err.message ?? '')) {
        console.error('[sendPushNotification] VAPID', err.message)
        result = { sent: false, error: PUSH_ERROR.VAPID_NOT_CONFIGURED }
      } else {
        console.error('[sendPushNotification]', err.message)
        result = { sent: false, error: PUSH_ERROR.FAILED }
      }
    }
  }

  await logDelivery(userId, source, endpoint, result)
  return result
}
