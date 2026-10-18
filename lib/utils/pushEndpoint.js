// Web push endpoints are URLs the server will POST to, so only the browser vendors' own push
// services are accepted. Anything else would let a user aim server-side requests at any host.
const EXACT_HOSTS = new Set([
  'fcm.googleapis.com',
  'updates.push.services.mozilla.com',
  'web.push.apple.com',
])
const HOST_SUFFIXES = ['.notify.windows.com', '.push.apple.com']

export function isAllowedPushEndpoint(endpoint) {
  let url
  try {
    url = new URL(endpoint)
  } catch {
    return false
  }
  if (url.protocol !== 'https:' || url.port) return false
  const host = url.hostname.toLowerCase()
  return EXACT_HOSTS.has(host) || HOST_SUFFIXES.some((s) => host.endsWith(s))
}
