'use client'

import { useCallback, useEffect, useState } from 'react'
import { addWatchlistTicker, getWatchlist, removeWatchlistTicker } from '@/lib/api/valuation'

const MAX_TICKERS = 3

/**
 * Owns the watchlist (all IDX tickers the user tracks) and the currently
 * active selection (primary + up to 2 compare slots). All picker dropdowns
 * on the page read from the same watchlist so they stay in sync.
 */
export function useValuationWatchlist() {
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selected, setSelected] = useState([])

  const loadWatchlist = useCallback(async () => {
    try {
      setLoading(true)
      setError(false)
      const data = await getWatchlist()
      setWatchlist(data || [])
      setSelected((prev) => prev.filter((t) => (data || []).some((w) => w.ticker === t)))
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadWatchlist()
  }, [loadWatchlist])

  useEffect(() => {
    if (selected.length === 0 && watchlist.length > 0) {
      setSelected([watchlist[0].ticker])
    }
  }, [watchlist, selected.length])

  const addTicker = useCallback(async (ticker) => {
    const created = await addWatchlistTicker({ ticker })
    setWatchlist((prev) =>
      prev.some((w) => w.ticker === created.ticker) ? prev : [...prev, created]
    )
    return created
  }, [])

  const removeTicker = useCallback(async (ticker) => {
    await removeWatchlistTicker(ticker)
    setWatchlist((prev) => prev.filter((w) => w.ticker !== ticker))
    setSelected((prev) => prev.filter((t) => t !== ticker))
  }, [])

  const setPrimary = useCallback((ticker) => {
    setSelected((prev) => [ticker, ...prev.slice(1)])
  }, [])

  const setCompareSlot = useCallback((index, ticker) => {
    setSelected((prev) => {
      const next = [...prev]
      next[index] = ticker
      return next
    })
  }, [])

  const addCompareSlot = useCallback(() => {
    setSelected((prev) => {
      if (prev.length >= MAX_TICKERS) return prev
      const available = watchlist.map((w) => w.ticker).filter((t) => !prev.includes(t))
      if (available.length === 0) return prev
      return [...prev, available[0]]
    })
  }, [watchlist])

  const removeCompareSlot = useCallback((index) => {
    setSelected((prev) => prev.filter((_, i) => i !== index))
  }, [])

  return {
    watchlist,
    loading,
    error,
    reload: loadWatchlist,
    addTicker,
    removeTicker,
    selected,
    setPrimary,
    setCompareSlot,
    addCompareSlot,
    removeCompareSlot,
    maxTickers: MAX_TICKERS,
  }
}
