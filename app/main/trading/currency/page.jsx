'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { DollarSign, BarChart2, AlertCircle, TrendingUp } from 'lucide-react'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import Button from '@/components/base/Button/Button'
import { cn } from '@/lib/utils'
import AllocationChart from './components/AllocationChart'
import PnLChart from './components/PnLChart'
import {
  getCurrencyInvestments,
  getForexRates,
  getForexHistory,
} from '@/lib/api/currencyInvestments'
import PageHeader from '@/app/main/components/PageHeader'

const FILTERS = [
  { label: '7D', days: 7, id: 'pnlFilter_7d_currencyPage' },
  { label: '30D', days: 30, id: 'pnlFilter_30d_currencyPage' },
  { label: '3M', days: 90, id: 'pnlFilter_3m_currencyPage' },
  { label: '6M', days: 180, id: 'pnlFilter_6m_currencyPage' },
  { label: '1Y', days: 365, id: 'pnlFilter_1y_currencyPage' },
]

function dateStr(daysAgo) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().slice(0, 10)
}

function formatIDR(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4 animate-pulse" aria-label="Loading currency dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-48 w-full" />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-48" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-48 w-full" />
      </div>
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
        <p className="text-sm font-medium text-slate-700">Failed to load currency data</p>
        <p className="text-xs text-slate-500">Check your connection and try again</p>
      </div>
      <Button variant="outline" size="base" onClick={onRetry} className="min-w-11">
        Try again
      </Button>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <DollarSign className="size-10 text-slate-300" aria-hidden="true" />
      <p className="text-sm font-medium text-slate-700">No currency investments yet</p>
      <p className="text-xs text-slate-500">Add your first transaction from the Holdings page</p>
    </div>
  )
}

export default function CurrencyDashboardPage() {
  const [investments, setInvestments] = useState([])
  const [rates, setRates] = useState({})
  const [historyData, setHistoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeFilter, setActiveFilter] = useState(30)
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(false)
      const data = await getCurrencyInvestments()
      setInvestments(data || [])

      const buys = (data || []).filter((inv) => inv.type === 'buy')
      if (buys.length === 0) return

      const currencies = [...new Set(buys.map((inv) => inv.currency))]
      const [ratesData] = await Promise.all([getForexRates(currencies.join(','))])
      setRates(ratesData || {})
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const fromDate = useMemo(() => {
    if (customStart) return customStart
    return dateStr(activeFilter)
  }, [customStart, activeFilter])

  const toDate = useMemo(() => {
    if (customEnd) return customEnd
    return new Date().toISOString().slice(0, 10)
  }, [customEnd])

  useEffect(() => {
    if (investments.length === 0) return
    const currencies = [
      ...new Set(investments.filter((i) => i.type === 'buy').map((i) => i.currency)),
    ]
    if (currencies.length === 0) return

    Promise.all(currencies.map((c) => getForexHistory(c, fromDate, toDate).catch(() => [])))
      .then((results) => {
        const merged = {}
        currencies.forEach((c, idx) => {
          const history = results[idx] || []
          history.forEach(({ date, rate_idr }) => {
            if (!merged[date]) merged[date] = { date, rateMap: {} }
            merged[date].rateMap[c] = rate_idr
          })
        })

        const totalInvestedPerCurrency = {}
        const totalSellIDRPerCurrency = {}
        const totalForeignPerCurrency = {}
        investments
          .filter((i) => i.type === 'buy')
          .forEach((inv) => {
            totalInvestedPerCurrency[inv.currency] =
              (totalInvestedPerCurrency[inv.currency] || 0) + (inv.idr_amount || 0)
            totalForeignPerCurrency[inv.currency] =
              (totalForeignPerCurrency[inv.currency] || 0) + (inv.foreign_amount || 0)
          })
        investments
          .filter((i) => i.type === 'sell')
          .forEach((inv) => {
            totalForeignPerCurrency[inv.currency] =
              (totalForeignPerCurrency[inv.currency] || 0) - (inv.foreign_amount || 0)
            totalSellIDRPerCurrency[inv.currency] =
              (totalSellIDRPerCurrency[inv.currency] || 0) + (inv.idr_amount || 0)
          })

        const totalInvested = Object.values(totalInvestedPerCurrency).reduce((a, b) => a + b, 0)
        const totalSellIDR = Object.values(totalSellIDRPerCurrency).reduce((a, b) => a + b, 0)
        const netCostBasis = totalInvested - totalSellIDR

        const sorted = Object.values(merged).sort((a, b) => a.date.localeCompare(b.date))
        const chartPoints = sorted.map(({ date, rateMap }) => {
          const currentValue = currencies.reduce((sum, c) => {
            const held = totalForeignPerCurrency[c] || 0
            const rate = rateMap[c] || 0
            return sum + held * rate
          }, 0)
          return { date: date.slice(5), pnl: Math.round(currentValue - netCostBasis) }
        })

        setHistoryData(chartPoints)
      })
      .catch(() => {})
  }, [investments, fromDate, toDate])

  const allocationData = useMemo(() => {
    const map = {}
    investments
      .filter((i) => i.type === 'buy')
      .forEach((inv) => {
        map[inv.currency] = (map[inv.currency] || 0) + (inv.idr_amount || 0)
      })
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [investments])

  const totalCurrentValue = useMemo(() => {
    const totalForeignPerCurrency = {}
    investments
      .filter((i) => i.type === 'buy')
      .forEach((inv) => {
        totalForeignPerCurrency[inv.currency] =
          (totalForeignPerCurrency[inv.currency] || 0) + (inv.foreign_amount || 0)
      })
    investments
      .filter((i) => i.type === 'sell')
      .forEach((inv) => {
        totalForeignPerCurrency[inv.currency] =
          (totalForeignPerCurrency[inv.currency] || 0) - (inv.foreign_amount || 0)
      })
    return Object.entries(totalForeignPerCurrency).reduce((sum, [currency, held]) => {
      return sum + held * (rates[currency] || 0)
    }, 0)
  }, [investments, rates])

  const currencyBreakdown = useMemo(() => {
    return allocationData.map((item) => ({
      ...item,
      currentRate: rates[item.name] || 0,
    }))
  }, [allocationData, rates])

  if (loading)
    return (
      <div className="space-y-6">
        <PageHeader
          title="Currency"
          description="Track your foreign currency investments and performance"
          breadcrumbs={[{ label: 'Trading' }, { label: 'Currency' }, { label: 'Dashboard' }]}
        />
        <DashboardSkeleton />
      </div>
    )

  if (error)
    return (
      <div className="space-y-6">
        <PageHeader
          title="Currency"
          description="Track your foreign currency investments and performance"
          breadcrumbs={[{ label: 'Trading' }, { label: 'Currency' }, { label: 'Dashboard' }]}
        />
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <ErrorState onRetry={loadData} />
        </div>
      </div>
    )

  const isEmpty = investments.length === 0

  return (
    <main className="space-y-6">
      <PageHeader
        title="Currency"
        description="Track your foreign currency investments and performance"
        breadcrumbs={[{ label: 'Trading' }, { label: 'Currency' }, { label: 'Dashboard' }]}
      />

      {isEmpty ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <EmptyState />
        </div>
      ) : (
        <>
          {/* Section 1 — Allocation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Donut chart card */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-start gap-3 px-5 py-4 border-b border-slate-100">
                <div className="flex items-center justify-center size-9 rounded-lg bg-violet-50 shrink-0">
                  <DollarSign className="size-4 text-violet-600" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">Allocation</p>
                  <p className="text-xs text-slate-500 mt-0.5">IDR invested by currency</p>
                </div>
              </div>
              <div className="p-4">
                <AllocationChart data={allocationData} />
              </div>
            </section>

            {/* Current value card */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-start gap-3 px-5 py-4 border-b border-slate-100">
                <div className="flex items-center justify-center size-9 rounded-lg bg-violet-50 shrink-0">
                  <BarChart2 className="size-4 text-violet-600" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">Current Value</p>
                  <p className="text-xs text-slate-500 mt-0.5">Based on live forex rates</p>
                </div>
              </div>
              <div className="px-5 py-4 space-y-4">
                <p className="text-2xl font-bold font-mono text-slate-900">
                  {formatIDR(totalCurrentValue)}
                </p>
                <div className="space-y-2" aria-label="Currency breakdown">
                  {currencyBreakdown.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{item.name}</span>
                      <span className="text-slate-500 font-mono">{formatIDR(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Section 2 — P&L Chart */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-start gap-3 px-5 py-4 border-b border-slate-100">
              <div className="flex items-center justify-center size-9 rounded-lg bg-violet-50 shrink-0">
                <TrendingUp className="size-4 text-violet-600" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">Unrealized P&L</p>
                <p className="text-xs text-slate-500 mt-0.5">Portfolio performance over time</p>
              </div>
            </div>

            <div className="px-5 pt-4 pb-2">
              {/* Filter controls */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {FILTERS.map((f) => (
                  <Button
                    key={f.label}
                    id={f.id}
                    variant="ghost"
                    onClick={() => {
                      setActiveFilter(f.days)
                      setCustomStart('')
                      setCustomEnd('')
                    }}
                    aria-pressed={activeFilter === f.days && !customStart}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium min-w-11',
                      activeFilter === f.days && !customStart
                        ? 'bg-violet-600 text-white hover:bg-violet-600'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    )}
                  >
                    {f.label}
                  </Button>
                ))}
                <div className="flex items-center gap-2 ml-auto">
                  <input
                    type="date"
                    aria-label="Chart start date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="text-xs border border-slate-200 rounded-md px-2 py-1.5 text-slate-700 focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:border-violet-600 outline-none"
                  />
                  <span className="text-xs text-slate-400">–</span>
                  <input
                    type="date"
                    aria-label="Chart end date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="text-xs border border-slate-200 rounded-md px-2 py-1.5 text-slate-700 focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:border-violet-600 outline-none"
                  />
                </div>
              </div>

              <PnLChart data={historyData} />
            </div>
          </section>
        </>
      )}
    </main>
  )
}
