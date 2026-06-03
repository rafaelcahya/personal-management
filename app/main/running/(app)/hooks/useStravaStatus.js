'use client'

import { useState, useEffect } from 'react'
import { getStravaStatus } from '@/lib/api/running'

export function useStravaStatus() {
  const [needsReconnect, setNeedsReconnect] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await getStravaStatus()
        if (!cancelled) {
          setNeedsReconnect(data?.needs_reconnect ?? false)
        }
      } catch (err) {
        // Fail silently — banner omission is better than blocking the page
        if (!cancelled) {
          setError(err.message)
          setNeedsReconnect(false)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { needsReconnect, isLoading, error }
}
