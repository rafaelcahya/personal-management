'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import Card, { CardContent } from '@/components/base/Card/Card'
import {
  EmptyState,
  EmptyStateTitle,
  EmptyStateDescription,
} from '@/components/base/EmptyState/EmptyState'
import {
  getCurrencyInvestments,
  getForexHistory,
  getForexRates,
} from '@/lib/api/currencyInvestments'
import PageHeader from '@/app/main/components/PageHeader'
import AllocationCard from './components/AllocationCard'
import CurrentValueCard from './components/CurrentValueCard'
import DashboardSkeleton from './components/DashboardSkeleton'
import PnLCard from './components/PnLCard'

function dateStr(daysAgo) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().slice(0, 10)
}

const PAGE_HEADER = (
  <PageHeader
    title="Currency"
    description="Track your foreign currency investments and performance"
    breadcrumbs={[{ label: 'Trading' }, { label: 'Currency' }, { label: 'Dashboard' }]}
  />
)

export default function CurrencyDashboardPage() {
  const [investments, setInvestments] = useState([])
  const [rates, setRates] = useState({})
  const [historyData, setHistoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeFilter, setActiveFilter] = useState(30)
  const [customStart, setCustomStart] = useState(null)
  const [customEnd, setCustomEnd] = useState(null)

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
    if (customStart) return customStart.toISOString().slice(0, 10)
    return dateStr(activeFilter)
  }, [customStart, activeFilter])

  const toDate = useMemo(() => {
    if (customEnd) return customEnd.toISOString().slice(0, 10)
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
        {PAGE_HEADER}
        <DashboardSkeleton />
      </div>
    )

  if (error)
    return (
      <div className="space-y-6">
        {PAGE_HEADER}
        <Card>
          <CardContent
            className="flex flex-col items-center justify-center py-16 gap-4 text-center"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle className="size-10 text-slate-400" aria-hidden="true" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-700">Failed to load currency data</p>
              <p className="text-xs text-slate-500">Check your connection and try again</p>
            </div>
            <Button variant="outline" size="base" onClick={loadData} className="min-w-11">
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    )

  if (investments.length === 0)
    return (
      <div className="space-y-6">
        {PAGE_HEADER}
        <EmptyState>
          <EmptyStateTitle>No currency investments yet</EmptyStateTitle>
          <EmptyStateDescription>
            Add your first transaction from the Holdings page
          </EmptyStateDescription>
        </EmptyState>
      </div>
    )

  return (
    <main className="space-y-6">
      {PAGE_HEADER}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AllocationCard data={allocationData} />
        <CurrentValueCard
          totalCurrentValue={totalCurrentValue}
          currencyBreakdown={currencyBreakdown}
        />
      </div>
      <PnLCard
        historyData={historyData}
        activeFilter={activeFilter}
        customStart={customStart}
        customEnd={customEnd}
        onFilterChange={setActiveFilter}
        onCustomStartChange={setCustomStart}
        onCustomEndChange={setCustomEnd}
      />
    </main>
  )
}
