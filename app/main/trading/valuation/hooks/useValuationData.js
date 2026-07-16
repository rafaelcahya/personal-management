'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getValuation } from '@/lib/api/valuation'

/**
 * Per-ticker fetch/retry state so compare mode can show independent
 * loading/error states per ticker without blocking the others.
 * @param {string[]} tickers
 */
export function useValuationData(tickers) {
  const [dataByTicker, setDataByTicker] = useState({})
  const [statusByTicker, setStatusByTicker] = useState({})
  const cacheRef = useRef({})

  const fetchTicker = useCallback(async (ticker) => {
    setStatusByTicker((prev) => ({ ...prev, [ticker]: 'loading' }))
    try {
      const result = await getValuation(ticker)
      cacheRef.current[ticker] = result
      setDataByTicker((prev) => ({ ...prev, [ticker]: result }))
      setStatusByTicker((prev) => ({ ...prev, [ticker]: 'success' }))
    } catch {
      setStatusByTicker((prev) => ({ ...prev, [ticker]: 'error' }))
    }
  }, [])

  useEffect(() => {
    tickers.forEach((ticker) => {
      if (!ticker) return
      if (cacheRef.current[ticker]) {
        setDataByTicker((prev) => ({ ...prev, [ticker]: cacheRef.current[ticker] }))
        setStatusByTicker((prev) => ({ ...prev, [ticker]: 'success' }))
        return
      }
      fetchTicker(ticker)
    })
  }, [tickers, fetchTicker])

  const retry = useCallback(
    (ticker) => {
      delete cacheRef.current[ticker]
      fetchTicker(ticker)
    },
    [fetchTicker]
  )

  return { dataByTicker, statusByTicker, retry }
}
