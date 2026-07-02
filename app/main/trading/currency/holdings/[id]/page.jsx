'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  TrendingUp,
  BarChart2,
  Receipt,
  AlertCircle,
  Plus,
  TrendingDown,
  Minus,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/base/Badge/Badge'
import Button from '@/components/base/Button/Button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import RateHistoryChart from './components/RateHistoryChart'
import SummaryStats from './components/SummaryStats'
import TransactionTable from './components/TransactionTable'
import AddTransactionSheet from './components/AddTransactionSheet'
import PageHeader from '@/app/main/components/PageHeader'
import {
  getCurrencyInvestments,
  getForexRates,
  getForexHistory,
  deleteCurrencyInvestment,
  getCurrencyHoldingById,
} from '@/lib/api/currencyInvestments'

const CURRENCY_NAMES = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  CHF: 'Swiss Franc',
  JPY: 'Japanese Yen',
  SGD: 'Singapore Dollar',
  AUD: 'Australian Dollar',
  CAD: 'Canadian Dollar',
  NZD: 'New Zealand Dollar',
  HKD: 'Hong Kong Dollar',
  SEK: 'Swedish Krona',
  NOK: 'Norwegian Krone',
  DKK: 'Danish Krone',
  MYR: 'Malaysian Ringgit',
  THB: 'Thai Baht',
  PHP: 'Philippine Peso',
  KRW: 'South Korean Won',
  CNY: 'Chinese Yuan',
  INR: 'Indian Rupee',
  SAR: 'Saudi Riyal',
  AED: 'UAE Dirham',
  QAR: 'Qatari Riyal',
  BHD: 'Bahraini Dinar',
  KWD: 'Kuwaiti Dinar',
  ZAR: 'South African Rand',
}

function DetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <Skeleton className="h-6 w-24" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-48 w-full" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-slate-200 p-4 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
        <Skeleton className="h-5 w-28" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
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
        <p className="text-sm font-medium text-slate-700">Failed to load currency details</p>
        <p className="text-xs text-slate-500">Check your connection and try again</p>
      </div>
      <Button variant="outline" size="base" onClick={onRetry} className="min-w-11">
        Try again
      </Button>
    </div>
  )
}

export default function CurrencyDetailPage() {
  const params = useParams()
  const holdingId = params?.id
  const [currency, setCurrency] = useState('')

  const [investments, setInvestments] = useState([])
  const [currentRate, setCurrentRate] = useState(0)
  const [rateHistory, setRateHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  const loadData = useCallback(async () => {
    if (!holdingId) return
    try {
      setLoading(true)
      setError(false)
      const holding = await getCurrencyHoldingById(holdingId)
      if (!holding) {
        setError(true)
        return
      }
      const resolvedCurrency = holding.currency.toUpperCase()
      setCurrency(resolvedCurrency)

      const [data, ratesData] = await Promise.all([
        getCurrencyInvestments(resolvedCurrency),
        getForexRates(resolvedCurrency),
      ])
      const rows = data || []
      setInvestments(rows)
      setCurrentRate(ratesData?.[resolvedCurrency] || 0)

      const buys = rows.filter((i) => i.type === 'buy')
      if (buys.length > 0) {
        const earliestDate = buys
          .map((i) => i.transacted_at)
          .sort()
          .at(0)
        const history = await getForexHistory(resolvedCurrency, earliestDate)
        setRateHistory(
          (history || []).map((h) => ({ date: h.date?.slice(5) ?? h.date, rate_idr: h.rate_idr }))
        )
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [holdingId])

  useEffect(() => {
    loadData()
  }, [loadData])

  const avgBuyRate = useMemo(() => {
    const buys = investments.filter((i) => i.type === 'buy')
    const totalForeign = buys.reduce((s, i) => s + (i.foreign_amount || 0), 0)
    const totalIDR = buys.reduce((s, i) => s + (i.idr_amount || 0), 0)
    return totalForeign > 0 ? totalIDR / totalForeign : 0
  }, [investments])

  const pctChange = useMemo(() => {
    if (!avgBuyRate || !currentRate) return null
    return ((currentRate - avgBuyRate) / avgBuyRate) * 100
  }, [avgBuyRate, currentRate])

  const handleDelete = useCallback(async (id) => {
    try {
      await deleteCurrencyInvestment(id)
      setInvestments((prev) => prev.filter((t) => t.id !== id))
      toast.success('Transaction deleted')
    } catch {
      toast.error('Failed to delete transaction')
    }
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <DetailSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <ErrorState onRetry={loadData} />
      </div>
    )
  }

  const isPositive = pctChange !== null && pctChange > 0
  const isNegative = pctChange !== null && pctChange < 0

  return (
    <main id="currencyDetailPage" className="space-y-6">
      <div className="space-y-2">
        <PageHeader
          title={currency || '—'}
          breadcrumbs={[
            { label: 'Trading' },
            { label: 'Currency', href: '/main/trading/currency' },
            { label: 'Holdings', href: '/main/trading/currency/holdings' },
            { label: currency },
          ]}
        />

        {/* Back link */}
        <Link
          href="/main/trading/currency/holdings"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Holdings
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{currency}</h1>
            {pctChange !== null && (
              <Badge
                className={cn(
                  'text-xs font-medium',
                  isPositive && 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  isNegative && 'bg-red-50 text-red-600 border-red-200',
                  !isPositive && !isNegative && 'bg-slate-100 text-slate-600 border-slate-200'
                )}
              >
                {isPositive && <TrendingUp className="size-3 mr-0.5" aria-hidden="true" />}
                {isNegative && <TrendingDown className="size-3 mr-0.5" aria-hidden="true" />}
                {!isPositive && !isNegative && (
                  <Minus className="size-3 mr-0.5" aria-hidden="true" />
                )}
                {isPositive ? '+' : ''}
                {pctChange?.toFixed(2)}%
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-500">{CURRENCY_NAMES[currency] || currency}</p>
          {currentRate > 0 && (
            <p className="font-mono text-xl font-semibold text-slate-800">
              {new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(currentRate)}
              <span className="text-sm text-slate-400 ml-1 font-normal">IDR</span>
            </p>
          )}
        </div>
      </div>

      {/* Rate History Chart card */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-start gap-3 px-5 py-4 border-b border-slate-100">
          <div className="flex items-center justify-center size-9 rounded-lg bg-violet-50 shrink-0">
            <TrendingUp className="size-4 text-violet-600" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">Rate History</p>
            <p className="text-xs text-slate-500 mt-0.5">Historical IDR rate from first purchase</p>
          </div>
        </div>
        <div className="p-4">
          <RateHistoryChart data={rateHistory} avgBuyRate={avgBuyRate} />
        </div>
      </section>

      {/* Summary Stats */}
      <section aria-label="Summary statistics">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex items-center justify-center size-9 rounded-lg bg-violet-50 shrink-0">
            <BarChart2 className="size-4 text-violet-600" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Summary</p>
            <p className="text-xs text-slate-500 mt-0.5">Computed from all transactions</p>
          </div>
        </div>
        <SummaryStats investments={investments} currentRate={currentRate} />
      </section>

      {/* Transactions card */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-start gap-3 px-5 py-4 border-b border-slate-100">
          <div className="flex items-center justify-center size-9 rounded-lg bg-violet-50 shrink-0">
            <Receipt className="size-4 text-violet-600" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">Transactions</p>
            <p className="text-xs text-slate-500 mt-0.5">{investments.length} records</p>
          </div>
          <Button
            id="addTransactionBtn_currencyDetailPage"
            size="base"
            onClick={() => setSheetOpen(true)}
            className="bg-violet-600 hover:bg-violet-700 shrink-0 min-w-11"
          >
            <Plus className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Add Transaction</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
        <TransactionTable transactions={investments} onDelete={handleDelete} currency={currency} />
      </section>

      <AddTransactionSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        defaultCurrency={currency}
        onSuccess={() => {
          setSheetOpen(false)
          loadData()
        }}
      />
    </main>
  )
}
