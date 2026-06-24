'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { fetchTradeList, fetchTradeSummary } from '@/lib/api/trade'
import PageHeader from '../../components/PageHeader'
import TradeTableHeader from './list/component/TradeTableHeader'
import TradeMetricStrip from './list/component/TradeMetricStrip'
import TradesTable from './list/TradesTable'
import TradeTableSkeleton from './list/component/TradeTableSkeleton'
import TradeErrorState from './list/component/TradeErrorState'
import TradeEmptyState from './list/component/TradeEmptyState'
import TradePagination from './list/component/TradePagination'
import AddTrade from './AddTrade'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'

const DEFAULT_SORT_KEY = 'trade_date'
const DEFAULT_SORT_DIR = 'desc'
const DEBOUNCE_MS = 300

function sortTrades(trades, key, dir) {
  return [...trades].sort((a, b) => {
    let aVal = a[key]
    let bVal = b[key]

    if (key === 'trade_date') {
      aVal = new Date(aVal).getTime()
      bVal = new Date(bVal).getTime()
    } else {
      aVal = parseFloat(aVal) || 0
      bVal = parseFloat(bVal) || 0
    }

    if (aVal < bVal) return dir === 'asc' ? -1 : 1
    if (aVal > bVal) return dir === 'asc' ? 1 : -1
    return 0
  })
}

export default function TradesPageClient({
  initialTrades,
  initialTotal,
  initialPage,
  initialLimit,
}) {
  const [trades, setTrades] = useState(initialTrades ?? [])
  const [total, setTotal] = useState(initialTotal ?? 0)
  const [page, setPage] = useState(initialPage ?? 1)
  const limit = initialLimit ?? 15

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [summary, setSummary] = useState({ totalTrades: 0, totalWins: 0, netPnL: 0 })

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sortKey, setSortKey] = useState(DEFAULT_SORT_KEY)
  const [sortDir, setSortDir] = useState(DEFAULT_SORT_DIR)

  const [addTradeOpen, setAddTradeOpen] = useState(false)

  const debounceTimer = useRef(null)
  const isMounted = useRef(false)
  const totalPages = Math.ceil(total / limit)

  const fetchSummary = useCallback(async () => {
    try {
      const data = await fetchTradeSummary()
      setSummary({
        totalTrades: data.totalTrades ?? 0,
        totalWins: data.totalWins ?? 0,
        netPnL: data.netPnL ?? 0,
      })
    } catch (err) {
      console.error('[TradesPageClient] summary fetch error:', err)
    }
  }, [])

  const fetchTrades = useCallback(
    async (targetPage = 1, tickerQuery = debouncedSearch) => {
      try {
        setIsLoading(true)
        setError(null)
        const result = await fetchTradeList({
          page: targetPage,
          limit,
          ticker: tickerQuery || undefined,
        })
        setTrades(result.trades)
        setTotal(result.total)
        setPage(result.page)
      } catch (err) {
        console.error('[TradesPageClient] fetch error:', err)
        setError(err.message || 'Failed to fetch trades')
      } finally {
        setIsLoading(false)
      }
    },
    [limit, debouncedSearch]
  )

  const refresh = useCallback(async () => {
    await Promise.all([fetchTrades(page), fetchSummary()])
  }, [fetchTrades, fetchSummary, page])

  useEffect(() => {
    fetchSummary()
    fetchTrades(1, '').then(() => {
      isMounted.current = true
    })
  }, [])

  useEffect(() => {
    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(search)
    }, DEBOUNCE_MS)
    return () => clearTimeout(debounceTimer.current)
  }, [search])

  useEffect(() => {
    if (!isMounted.current) return
    fetchTrades(1, debouncedSearch)
  }, [debouncedSearch, fetchTrades])

  const handleSort = useCallback(
    (key) => {
      if (sortKey === key) {
        setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
      } else {
        setSortKey(key)
        setSortDir('asc')
      }
    },
    [sortKey]
  )

  const handlePageChange = useCallback(
    (newPage) => {
      fetchTrades(newPage)
    },
    [fetchTrades]
  )

  const filteredAndSorted = useMemo(() => {
    return sortTrades(trades, sortKey, sortDir)
  }, [trades, sortKey, sortDir])

  const showPagination = totalPages > 1

  return (
    <main id="tradePage" className="space-y-6">
      <PageHeader
        title="Trades"
        description="Log and manage your trading positions"
        breadcrumbs={[{ label: 'Trading', href: '/main/trading/dashboard' }, { label: 'Trades' }]}
      />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <TradeTableHeader
          action={
            <AddTrade
              open={addTradeOpen}
              onOpenChange={setAddTradeOpen}
              onAdded={async () => {
                await Promise.all([fetchTrades(1), fetchSummary()])
              }}
            />
          }
        />

        {/* Sticky filter bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-3 sm:px-5 py-2 sm:py-2.5">
          <div className="relative" id="tradeSearchBar_tradePage">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none"
              aria-hidden="true"
            />
            <Input
              id="tradeSearchInput_tradePage"
              type="text"
              placeholder="Search by ticker..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-8 h-8 text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
              aria-label="Search trades by ticker"
            />
            {search && (
              <button
                id="tradeSearchClearBtn_tradePage"
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label="Clear search"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Table area */}
        <div className="px-5 pt-3">
          <TradeMetricStrip summary={summary} />
        </div>

        {isLoading ? (
          <TradeTableSkeleton />
        ) : error ? (
          <TradeErrorState message={error} onRetry={() => fetchTrades(page)} />
        ) : filteredAndSorted.length === 0 ? (
          <TradeEmptyState onAddTrade={() => setAddTradeOpen(true)} search={debouncedSearch} />
        ) : (
          <>
            <TradesTable
              trades={filteredAndSorted}
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
              onRefresh={refresh}
            />
            {showPagination && (
              <TradePagination
                page={page}
                totalPages={totalPages}
                total={total}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </main>
  )
}
