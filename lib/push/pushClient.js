import { getPushStatus, savePushDevice, removePushDevice } from '@/lib/api/notifications'

// Remembers which account and which endpoint THIS browser subscribed, so opening the app on
// another device or another account never touches a subscription that isn't this browser's.
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
 * Subscribes this browser and registers it as a device. An existing browser subscription is
 * reused only when it was made with the current VAPID key; otherwise (or when `fresh`) it is
 * dropped first, because a dead or mismatched subscription would just be saved again.
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

  let saved
  try {
    saved = await savePushDevice(subscription.toJSON())
  } catch (err) {
    // 409: this endpoint is registered to another account with other keys. Get a brand-new
    // endpoint (one nobody else knows) and register that instead.
    if (err.status === 409 && !fresh) return subscribeThisDevice({ fresh: true })
    throw err
  }
  writeOptIn(saved.user_id, subscription.endpoint)
  return subscription
}

/** Removes only this browser's device; other devices keep receiving pushes. */
export async function unsubscribeThisDevice() {
  const existing = await getCurrentSubscription()
  const endpoint = existing?.endpoint ?? readOptIn()?.endpoint
  if (endpoint) {
    const status = await getPushStatus()
    const row = status.devices.find((d) => d.endpoint === endpoint)
    if (row) await removePushDevice(row.id)
  }
  if (existing) await existing.unsubscribe()
  clearOptIn()
}

/**
 * Keeps this browser's device row in step with the browser on app load. Acts only when:
 * - this browser opted in, for the account that is signed in now, and permission is still granted;
 * - its device row exists → refresh it, or replace it if the browser rotated the endpoint;
 * - its row is gone because THIS browser's endpoint expired → subscribe afresh.
 * A row removed on purpose (from another device) just clears the opt-in.
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

  const ownRow = status.devices.find((d) => d.endpoint === optIn.endpoint)
  const current = await getCurrentSubscription()

  if (ownRow) {
    if (!current) {
      await subscribeThisDevice({ fresh: true })
      await removePushDevice(ownRow.id)
    } else if (current.endpoint !== optIn.endpoint) {
      const saved = await savePushDevice(current.toJSON())
      await removePushDevice(ownRow.id)
      writeOptIn(saved.user_id, current.endpoint)
    } else {
      await savePushDevice(current.toJSON())
    }
    return
  }

  const expiredForThisDevice = status.expired_endpoint_hashes.includes(
    await sha256Hex(optIn.endpoint)
  )

  if (expiredForThisDevice) await subscribeThisDevice({ fresh: true })
  else clearOptIn()
}
