'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getNotificationPreferences } from '@/lib/api/notifications'
import { cacheSessionEndedPreference, showSessionEndedNotice } from '@/lib/push/sessionEndedNotice'

const PREF_SYNCED_KEY = 'session_ended_pref_synced'

export function AuthListener() {
  const router = useRouter()
  const supabase = createClient()
  // Supabase fires an initial SIGNED_OUT event on mount when there is no
  // session yet (e.g. on the login page itself). That is not a real
  // session expiry, so we must not redirect on the very first event.
  const hasSeenInitialEvent = useRef(false)
  const hasCachedPreference = useRef(false)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const isInitialEvent = !hasSeenInitialEvent.current
      hasSeenInitialEvent.current = true

      // While signed in, remember the "Session ended" switch — after sign-out it can't be fetched.
      // Once per browser session; the Settings page refreshes it on every toggle.
      if (session && !hasCachedPreference.current) {
        hasCachedPreference.current = true
        if (!sessionStorage.getItem(PREF_SYNCED_KEY)) {
          sessionStorage.setItem(PREF_SYNCED_KEY, '1')
          getNotificationPreferences()
            .then((prefs) => {
              const pref = prefs.find((p) => p.type === 'session_ended')
              if (pref) cacheSessionEndedPreference(pref.push_enabled)
            })
            .catch(() => sessionStorage.removeItem(PREF_SYNCED_KEY))
        }
      }

      if (event === 'SIGNED_OUT' && !isInitialEvent && !session) {
        const intentional = sessionStorage.getItem('intentional_logout')
        sessionStorage.removeItem('intentional_logout')
        if (!intentional) {
          showSessionEndedNotice().catch(() => {})
          router.push('/login?reason=session_expired')
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return null
}
