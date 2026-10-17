import { getPushStatus, savePushSubscription } from '@/lib/api/running'

// Remembers which account and which endpoint THIS browser subscribed, so opening the app on
// another device or another account never silently takes over the single stored subscription.
export const PUSH_OPT_IN_KEY = 'push_opt_in'

export function isPushSupported() {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  )
}

export function getPermission() {
  return isPushSupported() ? Notification.permission : 'unsupported'
}

function readOptIn() {
  try {
    const value = JSON.parse(localStorage.getItem(PUSH_OPT_IN_KEY))
    return value?.userId && value?.endpoint ? value : null
  } catch {
    return null
  }
}

function writeOptIn(userId, endpoint) {
  localStorage.setItem(PUSH_OPT_IN_KEY, JSON.stringify({ userId, endpoint }))
}

function clearOptIn() {
  localStorage.removeItem(PUSH_OPT_IN_KEY)
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

async function sha256Hex(text) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function getRegistration() {
  await navigator.serviceWorker.register('/sw.js')
  return navigator.serviceWorker.ready
}

export async function getCurrentSubscription() {
  if (!isPushSupported()) return null
  const registration = await getRegistration()
  return registration.pushManager.getSubscription()
}

function sameKey(subscription, keyBytes) {
  const current = subscription.options?.applicationServerKey
  if (!current) return false
  const a = new Uint8Array(current)
  return a.length === keyBytes.length && a.every((v, i) => v === keyBytes[i])
}

/**
 * Subscribes this browser and saves it. An existing browser subscription is reused only when it
 * was made with the current VAPID key; otherwise (or when `fresh`) it is dropped first, because
 * a dead or mismatched subscription would just be saved again and keep failing.
 */
export async function subscribeThisDevice({ fresh = false } = {}) {
  const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  if (!vapidKey) throw new Error('Push notifications are not configured.')
  const keyBytes = urlBase64ToUint8Array(vapidKey)

  const registration = await getRegistration()
  let subscription = await registration.pushManager.getSubscription()
  if (subscription && (fresh || !sameKey(subscription, keyBytes))) {
    await subscription.unsubscribe()
    subscription = null
  }
  subscription ??= await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: keyBytes,
  })

  const saved = await savePushSubscription(subscription.toJSON())
  writeOptIn(saved.user_id, subscription.endpoint)
  return subscription
}

export async function unsubscribeThisDevice() {
  const existing = await getCurrentSubscription()
  if (existing) await existing.unsubscribe()
  await savePushSubscription(null)
  clearOptIn()
}

/**
 * Keeps the server's subscription in step with this browser on app load. Acts only when:
 * - this browser opted in, for the account that is signed in now, and permission is still granted;
 * - the server still holds THIS browser's endpoint and the browser rotated it → save the new one;
 * - push was switched off because THIS browser's endpoint expired → subscribe afresh.
 * Anything else (another device took over, user turned push off) just forgets the opt-in.
 */
export async function syncPushSubscription() {
  if (!isPushSupported() || Notification.permission !== 'granted') return
  const optIn = readOptIn()
  if (!optIn) return

  let status
  try {
    status = await getPushStatus()
  } catch {
    return
  }

  if (status.user_id !== optIn.userId) {
    clearOptIn()
    return
  }

  const current = await getCurrentSubscription()

  if (status.enabled) {
    if (status.endpoint !== optIn.endpoint) {
      clearOptIn()
      return
    }
    if (!current) {
      await subscribeThisDevice({ fresh: true })
    } else if (current.endpoint !== optIn.endpoint) {
      await savePushSubscription(current.toJSON())
      writeOptIn(status.user_id, current.endpoint)
    }
    return
  }

  const failure = status.last_failure
  const lastSuccess = status.last_success ? Date.parse(status.last_success.created_at) : 0
  const expiredForThisDevice =
    failure?.status === 'expired' &&
    Date.parse(failure.created_at) > lastSuccess &&
    failure.endpoint_hash === (await sha256Hex(optIn.endpoint))

  if (expiredForThisDevice) await subscribeThisDevice({ fresh: true })
  else clearOptIn()
}
