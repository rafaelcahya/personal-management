const ERROR_TEXT = {
  subscription_expired: 'the subscription expired',
  push_rejected: 'the push service rejected the message',
  vapid_not_configured: 'push keys are not configured on the server',
  endpoint_not_allowed: 'the subscription points to an unsupported push service',
  invalid_subscription: 'the stored subscription is invalid',
  push_send_failed: 'sending failed',
}

export const errorText = (code) => ERROR_TEXT[code] ?? 'sending failed'

export function formatWhen(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

// A readable device name from the browser's user agent, e.g. "Chrome on Android".
export function describeDevice(userAgent) {
  if (!userAgent) return 'Unknown device'
  const browser = /Edg\//.test(userAgent)
    ? 'Edge'
    : /Firefox\//.test(userAgent)
      ? 'Firefox'
      : /Chrome\//.test(userAgent)
        ? 'Chrome'
        : /Safari\//.test(userAgent)
          ? 'Safari'
          : 'Browser'
  const os = /Windows/.test(userAgent)
    ? 'Windows'
    : /Android/.test(userAgent)
      ? 'Android'
      : /iPhone|iPad/.test(userAgent)
        ? 'iOS'
        : /Mac OS X/.test(userAgent)
          ? 'macOS'
          : /Linux/.test(userAgent)
            ? 'Linux'
            : 'unknown system'
  return `${browser} on ${os}`
}
