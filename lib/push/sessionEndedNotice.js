// "Session ended" is a notification this browser shows by itself: the server can't know when a
// session ends, and by then the user is signed out, so the API (and their push switch) can't
// be read. The switch is cached here while they're still signed in.
const PREF_KEY = 'session_ended_push'

export function cacheSessionEndedPreference(enabled) {
  try {
    localStorage.setItem(PREF_KEY, enabled ? '1' : '0')
  } catch {
    // Storage blocked — the default (on) applies.
  }
}

function isEnabled() {
  try {
    return localStorage.getItem(PREF_KEY) !== '0'
  } catch {
    return true
  }
}

/**
 * Shows "You were signed out" through the service worker, only when notifications are allowed,
 * the switch is on, and the page is hidden (a visible page already redirects to the login screen).
 */
export async function showSessionEndedNotice() {
  if (typeof window === 'undefined') return
  if (!('Notification' in window) || !('serviceWorker' in navigator)) return
  if (Notification.permission !== 'granted') return
  if (document.visibilityState !== 'hidden') return
  if (!isEnabled()) return

  const registration = await navigator.serviceWorker.ready
  await registration.showNotification('You were signed out', {
    body: 'Your session ended. Tap to sign in again.',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'session-ended',
    data: { url: '/login?reason=session_expired' },
  })
}
