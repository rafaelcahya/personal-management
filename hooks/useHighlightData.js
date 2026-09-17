import { useCallback, useEffect, useState } from 'react'

/**
 * Shared fetch-state hook for the home dashboard highlight cards. Owns the
 * loading/error/data lifecycle and guards against stale responses on retry via
 * an ignore flag, so a slow in-flight request can't clobber a newer one.
 * `fetchFn` must be a stable reference (e.g. a module-level API function).
 */
export function useHighlightData(fetchFn) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  const reload = useCallback(() => setReloadKey((k) => k + 1), [])

  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError(false)
    fetchFn()
      .then((d) => {
        if (!ignore) setData(d)
      })
      .catch(() => {
        if (!ignore) setError(true)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [fetchFn, reloadKey])

  return { data, loading, error, reload }
}
