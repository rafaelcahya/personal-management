'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart2, TrendingUp, TrendingDown, Minus, AlertCircle, Plus } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import AddTransactionSheet from './[id]/components/AddTransactionSheet'
import {
  getCurrencyInvestments,
  getForexRates,
  getCurrencyHoldings,
} from '@/lib/api/currencyInvestments'
import PageHeader from '@/app/main/components/PageHeader'

function formatIDR(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function PctChange({ pct }) {
  if (pct === null || pct === undefined || isNaN(pct)) {
    return (
      <span className="flex items-center gap-1 text-slate-500">
        <Minus className="size-3" aria-hidden="true" />
        <span>—</span>
      </span>
    )
  }
  const isPos = pct > 0
  const isNeg = pct < 0
  return (
    <span
      className={`flex items-center gap-1 font-medium ${isPos ? 'text-emerald-600' : isNeg ? 'text-red-500' : 'text-slate-500'}`}
    >
      {isPos && <TrendingUp className="size-3" aria-hidden="true" />}
      {isNeg && <TrendingDown className="size-3" aria-hidden="true" />}
      {!isPos && !isNeg && <Minus className="size-3" aria-hidden="true" />}
      <span>
        {isPos ? '+' : ''}
        {pct.toFixed(2)}%
      </span>
    </span>
  )
}

function TableSkeleton() {
  return (
    <div className="animate-pulse" aria-label="Loading holdings">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-4 px-5 py-3.5 border-b border-slate-100">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-24 hidden sm:block" />
          <Skeleton className="h-4 w-20 hidden sm:block" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24 hidden sm:block" />
        </div>
      ))}
    </div>
  )
}

function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <BarChart2 className="size-10 text-slate-300" aria-hidden="true" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-700">No currency holdings yet</p>
        <p className="text-xs text-slate-500">Add your first investment to get started</p>
      </div>
      <Button size="sm" onClick={onAdd} className="bg-violet-600 hover:bg-violet-700 min-w-11">
        <Plus className="size-4 mr-1.5" aria-hidden="true" />
        Add Investment
      </Button>
    </div>
  )
}

function ErrorState({ onRetry }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 gap-4 text-center"
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle className="size-10 text-slate-400" aria-hidden="true" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-700">Failed to load holdings</p>
        <p className="text-xs text-slate-500">Check your connection and try again</p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry} className="min-w-11">
        Try again
      </Button>
    </div>
  )
}

export default function HoldingsPage() {
  const router = useRouter()
  const [investments, setInvestments] = useState([])
  const [rates, setRates] = useState({})
  const [holdingIds, setHoldingIds] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(false)
      const data = await getCurrencyInvestments()
      const rows = data || []
      setInvestments(rows)

      const currencies = [...new Set(rows.filter((r) => r.type === 'buy').map((r) => r.currency))]
      if (currencies.length > 0) {
        const ratesData = await getForexRates(currencies.join(','))
        setRates(ratesData || {})
      }

      const holdingsList = await getCurrencyHoldings()
      const holdingIdMap = Object.fromEntries(holdingsList.map((h) => [h.currency, h.id]))
      setHoldingIds(holdingIdMap)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const holdings = useMemo(() => {
    const map = {}
    investments
      .filter((i) => i.type === 'buy')
      .forEach((inv) => {
        if (!map[inv.currency]) {
          map[inv.currency] = {
            currency: inv.currency,
            totalInvested: 0,
            totalForeign: 0,
          }
        }
        map[inv.currency].totalInvested += inv.idr_amount || 0
        map[inv.currency].totalForeign += inv.foreign_amount || 0
      })
    investments
      .filter((i) => i.type === 'sell')
      .forEach((inv) => {
        if (map[inv.currency]) {
          map[inv.currency].totalForeign -= inv.foreign_amount || 0
        }
      })

    return Object.values(map)
      .map((h) => {
        const currentRate = rates[h.currency] || 0
        const avgBuyRate = h.totalForeign > 0 ? h.totalInvested / h.totalForeign : 0
        const currentValue = h.totalForeign * currentRate
        const pctChange = avgBuyRate > 0 ? ((currentRate - avgBuyRate) / avgBuyRate) * 100 : null
        return {
          currency: h.currency,
          totalInvested: h.totalInvested,
          avgBuyRate,
          currentRate,
          pctChange,
          currentValue,
        }
      })
      .sort((a, b) => b.currentValue - a.currentValue)
  }, [investments, rates])

  return (
    <main className="space-y-6">
      <PageHeader
        title="Holdings"
        description="All currencies you have ever bought or sold, sorted by value"
        breadcrumbs={[
          { label: 'Trading' },
          { label: 'Currency', href: '/main/trading/currency' },
          { label: 'Holdings' },
        ]}
      />
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-start gap-3 px-5 py-4 border-b border-slate-100">
          <div className="flex items-center justify-center size-9 rounded-lg bg-violet-50 shrink-0">
            <BarChart2 className="size-4 text-violet-600" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">Holdings</p>
            <p className="text-xs text-slate-500 mt-0.5">All currency positions</p>
          </div>
          <Button
            id="addInvestmentBtn_holdingsPage"
            size="sm"
            onClick={() => setSheetOpen(true)}
            className="bg-violet-600 hover:bg-violet-700 shrink-0 min-w-11"
          >
            <Plus className="size-4 mr-1.5" aria-hidden="true" />
            <span className="hidden sm:inline">Add Investment</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>

        {/* Body */}
        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <ErrorState onRetry={loadData} />
        ) : holdings.length === 0 ? (
          <EmptyState onAdd={() => setSheetOpen(true)} />
        ) : (
          <div className="overflow-x-auto">
            <table
              id="holdingsTable_holdingsPage"
              className="min-w-full text-sm"
              aria-label="Currency holdings"
            >
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                    Currency
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap hidden sm:table-cell">
                    Total Invested
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap hidden sm:table-cell">
                    Avg Buy Rate
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                    Current Rate
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                    % Change
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap hidden sm:table-cell">
                    Current Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((row) => (
                  <tr
                    key={row.currency}
                    id={`holdingsTableRow_${row.currency}_holdingsPage`}
                    onClick={() =>
                      router.push(
                        `/main/trading/currency/holdings/${holdingIds[row.currency] ?? row.currency}`
                      )
                    }
                    className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors"
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${row.currency} details`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        router.push(
                          `/main/trading/currency/holdings/${holdingIds[row.currency] ?? row.currency}`
                        )
                      }
                    }}
                  >
                    <td className="px-5 py-3.5 font-semibold text-slate-900">{row.currency}</td>
                    <td className="px-5 py-3.5 text-right font-mono text-slate-700 hidden sm:table-cell">
                      {formatIDR(row.totalInvested)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-slate-700 hidden sm:table-cell">
                      {row.avgBuyRate > 0
                        ? new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(
                            row.avgBuyRate
                          )
                        : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-slate-700">
                      {row.currentRate > 0
                        ? new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(
                            row.currentRate
                          )
                        : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <PctChange pct={row.pctChange} />
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-slate-700 hidden sm:table-cell">
                      {formatIDR(row.currentValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <AddTransactionSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSuccess={() => {
          setSheetOpen(false)
          loadData()
        }}
      />
    </main>
  )
}
