'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function AuthListener() {
  const router = useRouter()
  const supabase = createClient()
  // Supabase fires an initial SIGNED_OUT event on mount when there is no
  // session yet (e.g. on the login page itself). That is not a real
  // session expiry, so we must not redirect on the very first event.
  const hasSeenInitialEvent = useRef(false)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const isInitialEvent = !hasSeenInitialEvent.current
      hasSeenInitialEvent.current = true

      if (event === 'SIGNED_OUT' && !isInitialEvent && !session) {
        const intentional = sessionStorage.getItem('intentional_logout')
        sessionStorage.removeItem('intentional_logout')
        if (!intentional) {
          router.push('/login?reason=session_expired')
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return null
}
