'use client'

import { AlertTriangle, Loader2, RefreshCw, TrendingDown, TrendingUp } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from '@/components/base/EmptyState/EmptyState'
import { Badge } from '@/components/base/Badge/Badge'

function RecommendationBar({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-500 w-20 shrink-0">{label}</span>
      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-slate-700 w-6 text-right shrink-0">{count}</span>
    </div>
  )
}

function RecommendationSection({ data }) {
  if (!data) {
    return (
      <EmptyState size="sm">
        <EmptyStateTitle>No analyst data</EmptyStateTitle>
        <EmptyStateDescription>No recommendations available for this ticker.</EmptyStateDescription>
      </EmptyState>
    )
  }

  const bullish = data.strongBuy + data.buy
  const bearish = data.sell + data.strongSell
  const consensus = bullish > bearish ? 'Buy' : bearish > bullish ? 'Sell' : 'Hold'
  const consensusColor =
    consensus === 'Buy'
      ? 'bg-green-50 text-green-700 border-transparent'
      : consensus === 'Sell'
        ? 'bg-red-50 text-red-600 border-transparent'
        : 'bg-amber-50 text-amber-700 border-transparent'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 mb-0.5">Consensus ({data.total} analysts)</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-slate-800">{consensus}</span>
            <Badge className={consensusColor}>{data.period}</Badge>
          </div>
        </div>
        {consensus === 'Buy' ? (
          <TrendingUp className="size-8 text-green-400" />
        ) : consensus === 'Sell' ? (
          <TrendingDown className="size-8 text-red-400" />
        ) : null}
      </div>
      <div className="space-y-2">
        <RecommendationBar
          label="Strong Buy"
          count={data.strongBuy}
          total={data.total}
          color="bg-green-500"
        />
        <RecommendationBar label="Buy" count={data.buy} total={data.total} color="bg-green-300" />
        <RecommendationBar label="Hold" count={data.hold} total={data.total} color="bg-amber-300" />
        <RecommendationBar label="Sell" count={data.sell} total={data.total} color="bg-red-300" />
        <RecommendationBar
          label="Strong Sell"
          count={data.strongSell}
          total={data.total}
          color="bg-red-500"
        />
      </div>
    </div>
  )
}

function PriceTargetSection({ data }) {
  if (!data) {
    return (
      <EmptyState size="sm">
        <EmptyStateTitle>No price target data</EmptyStateTitle>
        <EmptyStateDescription>Price targets unavailable for this ticker.</EmptyStateDescription>
      </EmptyState>
    )
  }

  const range = data.high - data.low
  const meanPct = range > 0 ? ((data.mean - data.low) / range) * 100 : 50

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-slate-400 mb-0.5">Analyst Price Target</p>
        <span className="text-2xl font-bold text-slate-800">${data.mean?.toFixed(2)}</span>
        <span className="text-sm text-slate-400 ml-1.5">avg</span>
      </div>
      <div className="space-y-2">
        <div className="relative h-3 bg-slate-100 rounded-full">
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-3.5 bg-violet-600 rounded-full border-2 border-white shadow"
            style={{ left: `${meanPct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400">
          <span>Low ${data.low?.toFixed(2)}</span>
          <span>High ${data.high?.toFixed(2)}</span>
        </div>
      </div>
      {data.lastUpdated && <p className="text-[11px] text-slate-400">Updated {data.lastUpdated}</p>}
    </div>
  )
}

export default function OverviewTab({ ticker, state, onRetry }) {
  const { loading, error, data } = state

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {[0, 1].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-24" />
            <div className="space-y-2">
              {[...Array(5)].map((_, j) => (
                <Skeleton key={j} className="h-3 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
        <AlertTriangle className="size-8 text-red-300" />
        <p className="text-sm text-slate-600">{error}</p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="size-3.5" /> Try again
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
          Analyst Recommendations
        </p>
        <RecommendationSection data={data?.recommendation} />
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
          Price Target
        </p>
        <PriceTargetSection data={data?.priceTarget} />
      </div>
    </div>
  )
}
