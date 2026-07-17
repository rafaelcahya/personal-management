'use client'

import { AlertTriangle, RefreshCw } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import { Badge } from '@/components/base/Badge/Badge'
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from '@/components/base/EmptyState/EmptyState'
import { Microscope } from 'lucide-react'

const RSI_ZONES = [
  { label: 'Overbought', range: '≥ 70', color: 'bg-red-50 text-red-600 border-transparent' },
  { label: 'Neutral', range: '30–70', color: 'bg-slate-50 text-slate-600 border-transparent' },
  { label: 'Oversold', range: '≤ 30', color: 'bg-green-50 text-green-600 border-transparent' },
]

function RsiGauge({ value }) {
  const pct = Math.min(100, Math.max(0, value))
  const barColor = value >= 70 ? 'bg-red-400' : value <= 30 ? 'bg-green-400' : 'bg-amber-400'
  const badgeColor =
    value >= 70
      ? 'bg-red-50 text-red-600 border-transparent'
      : value <= 30
        ? 'bg-green-50 text-green-700 border-transparent'
        : 'bg-amber-50 text-amber-700 border-transparent'
  const label = value >= 70 ? 'Overbought' : value <= 30 ? 'Oversold' : 'Neutral'

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-slate-800">{value}</span>
        <Badge className={badgeColor}>{label}</Badge>
      </div>
      <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${pct}%` }}
        />
        {/* 30 and 70 markers */}
        <div className="absolute top-0 left-[30%] h-full w-px bg-slate-300" />
        <div className="absolute top-0 left-[70%] h-full w-px bg-slate-300" />
      </div>
      <div className="flex justify-between text-[10px] text-slate-400">
        <span>0</span>
        <span>30</span>
        <span>70</span>
        <span>100</span>
      </div>
    </div>
  )
}

function MacdSection({ macd }) {
  if (!macd) {
    return (
      <EmptyState size="sm">
        <EmptyStateTitle>No MACD data</EmptyStateTitle>
        <EmptyStateDescription>
          MACD unavailable — may require a premium Finnhub plan.
        </EmptyStateDescription>
      </EmptyState>
    )
  }

  const trendColor =
    macd.trend === 'bullish'
      ? 'bg-green-50 text-green-700 border-transparent'
      : macd.trend === 'bearish'
        ? 'bg-red-50 text-red-600 border-transparent'
        : 'bg-slate-50 text-slate-600 border-transparent'

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-slate-800">
          {macd.histogram > 0 ? '+' : ''}
          {macd.histogram}
        </span>
        <Badge className={trendColor}>{macd.trend}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">MACD Line</p>
          <p className="text-sm font-semibold text-slate-700">{macd.macd}</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Signal Line</p>
          <p className="text-sm font-semibold text-slate-700">{macd.signal}</p>
        </div>
      </div>
    </div>
  )
}

function PatternsSection({ patterns }) {
  if (!patterns) {
    return (
      <EmptyState size="sm">
        <EmptyStateTitle>No pattern data</EmptyStateTitle>
        <EmptyStateDescription>
          Pattern recognition unavailable — may require a premium Finnhub plan.
        </EmptyStateDescription>
      </EmptyState>
    )
  }

  if (patterns.length === 0) {
    return (
      <EmptyState size="sm">
        <EmptyStateIcon icon={Microscope} />
        <EmptyStateTitle>No patterns detected</EmptyStateTitle>
        <EmptyStateDescription>
          No candlestick patterns found for this ticker.
        </EmptyStateDescription>
      </EmptyState>
    )
  }

  return (
    <div className="space-y-2">
      {patterns.map((p, i) => {
        const breakoutColor =
          p.breakout === 'bullish'
            ? 'bg-green-50 text-green-700 border-transparent'
            : p.breakout === 'bearish'
              ? 'bg-red-50 text-red-600 border-transparent'
              : 'bg-slate-50 text-slate-600 border-transparent'
        return (
          <div
            key={i}
            className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
          >
            <div>
              <p className="text-sm font-medium text-slate-700">{p.name}</p>
              <p className="text-xs text-slate-400 capitalize">
                {p.type} · {p.status}
              </p>
            </div>
            {p.breakout && <Badge className={breakoutColor}>{p.breakout}</Badge>}
          </div>
        )
      })}
    </div>
  )
}

export default function TechnicalsTab({ ticker, state, onRetry }) {
  const { loading, error, data } = state

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-2 w-full" />
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
          RSI (14)
        </p>
        {data?.rsi ? (
          <RsiGauge value={data.rsi.value} />
        ) : (
          <EmptyState size="sm">
            <EmptyStateTitle>No RSI data</EmptyStateTitle>
            <EmptyStateDescription>
              RSI unavailable — may require a premium Finnhub plan.
            </EmptyStateDescription>
          </EmptyState>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
          MACD (12, 26, 9)
        </p>
        <MacdSection macd={data?.macd} />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 md:col-span-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
          Candlestick Patterns
        </p>
        <PatternsSection patterns={data?.patterns} />
      </div>
    </div>
  )
}
