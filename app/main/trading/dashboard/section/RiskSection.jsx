'use client'

import Card, {
  CardContent,
  CardDescription,
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
} from '@/components/base/Card/Card.jsx'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import {
  EmptyState,
  EmptyStateTitle,
  EmptyStateDescription,
} from '@/components/base/EmptyState/EmptyState'
import { ArrowDownRight, ArrowUpRight, Minus, TrendingDown, TrendingUp } from 'lucide-react'

function StatCell({ label, value, sub, valueClassName, chip }) {
  return (
    <div className="flex flex-col gap-0.5 bg-slate-50 rounded-lg px-4 py-3">
      <div className="flex items-start justify-between gap-1">
        <span className="text-xs text-slate-400">{label}</span>
        {chip && (
          <span
            className={`inline-flex px-1.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${chip.className}`}
          >
            {chip.label}
          </span>
        )}
      </div>
      <span className={`text-sm font-semibold tabular-nums ${valueClassName ?? 'text-slate-800'}`}>
        {value ?? '—'}
      </span>
      {sub && <span className="text-xs text-slate-400">{sub}</span>}
    </div>
  )
}

const StatCellSkeleton = () => (
  <div className="bg-slate-50 rounded-lg px-4 py-3 flex flex-col gap-1.5">
    <div className="flex items-start justify-between">
      <Skeleton className="h-3 w-10" />
      <Skeleton className="h-4 w-14 rounded-full" />
    </div>
    <Skeleton className="h-5 w-28" />
    <Skeleton className="h-3 w-20" />
  </div>
)

export default function RiskSection({ metrics, loading }) {
  if (loading) {
    return (
      <Card className="border border-slate-200/70 shadow-sm px-5 py-5 gap-4">
        {/* Take Profit */}
        <CardHeader className="p-0 border-0">
          <Skeleton className="h-7 w-7 rounded-lg shrink-0" />
          <div className="min-w-0 flex-1 flex flex-col gap-1.5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-72" />
          </div>
        </CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <StatCellSkeleton key={i} />
          ))}
        </div>
        <div className="border-t border-slate-100" />
        {/* Stop Loss */}
        <CardHeader className="p-0 border-0">
          <Skeleton className="h-7 w-7 rounded-lg shrink-0" />
          <div className="min-w-0 flex-1 flex flex-col gap-1.5">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-72" />
          </div>
        </CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <StatCellSkeleton key={i} />
          ))}
        </div>
      </Card>
    )
  }

  if (!metrics || metrics.totalTrades === 0) {
    return (
      <EmptyState>
        <EmptyStateTitle>No Risk Data Available</EmptyStateTitle>
        <EmptyStateDescription>
          Add more trades to see risk analysis and suggestions
        </EmptyStateDescription>
      </EmptyState>
    )
  }

  const { bullTP, baseTP, bearTP, bullSL, baseSL, bearSL } = metrics

  return (
    <Card>
      {/* Take Profit row */}
      <CardHeader>
        <CardIcon icon={ArrowUpRight} />
        <CardHeaderContent>
          <CardTitle>Take Profit Targets</CardTitle>
          <CardDescription>
            Tiered targets based on historical average profit and standard deviation.
          </CardDescription>
        </CardHeaderContent>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCell
          label={
            <span className="flex items-center gap-1">
              Bull <TrendingUp className="size-3 text-green-600" />
            </span>
          }
          chip={{ label: 'stretch', className: 'bg-green-100 text-green-700' }}
          value={`Rp ${Math.floor(bullTP).toLocaleString('id-ID')}`}
          valueClassName="text-green-600"
          sub="avg profit + 1σ"
        />
        <StatCell
          label={
            <span className="flex items-center gap-1">
              Base <Minus className="size-3 text-blue-500" />
            </span>
          }
          chip={{ label: 'expected', className: 'bg-blue-100 text-blue-700' }}
          value={`Rp ${Math.floor(baseTP).toLocaleString('id-ID')}`}
          valueClassName="text-blue-600"
          sub="avg profit"
        />
        <StatCell
          label={
            <span className="flex items-center gap-1">
              Bear <TrendingDown className="size-3 text-amber-500" />
            </span>
          }
          chip={{ label: 'conservative', className: 'bg-amber-100 text-amber-700' }}
          value={bearTP > 0 ? `Rp ${Math.floor(bearTP).toLocaleString('id-ID')}` : '—'}
          valueClassName={bearTP > 0 ? 'text-amber-600' : 'text-slate-400'}
          sub={bearTP > 0 ? 'avg profit − 1σ' : 'volatility exceeds avg profit'}
        />
      </CardContent>

      <div className="border-t border-slate-100" />

      {/* Stop Loss row */}
      <CardHeader>
        <CardIcon icon={ArrowDownRight} />
        <CardHeaderContent>
          <CardTitle>Stop Loss Levels</CardTitle>
          <CardDescription>
            Tiered stop levels based on historical average loss and standard deviation.
          </CardDescription>
        </CardHeaderContent>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCell
          label={
            <span className="flex items-center gap-1">
              Bull <TrendingUp className="size-3 text-green-600" />
            </span>
          }
          chip={{ label: 'tight', className: 'bg-green-100 text-green-700' }}
          value={bullSL < 0 ? `Rp ${Math.floor(Math.abs(bullSL)).toLocaleString('id-ID')}` : '—'}
          valueClassName={bullSL < 0 ? 'text-green-600' : 'text-slate-400'}
          sub={bullSL < 0 ? 'narrowed by 1σ' : 'volatility exceeds avg loss'}
        />
        <StatCell
          label={
            <span className="flex items-center gap-1">
              Base <Minus className="size-3 text-blue-500" />
            </span>
          }
          chip={{ label: 'expected', className: 'bg-blue-100 text-blue-700' }}
          value={`Rp ${Math.floor(Math.abs(baseSL)).toLocaleString('id-ID')}`}
          valueClassName="text-blue-600"
          sub="avg loss"
        />
        <StatCell
          label={
            <span className="flex items-center gap-1">
              Bear <TrendingDown className="size-3 text-red-400" />
            </span>
          }
          chip={{ label: 'wide', className: 'bg-red-100 text-red-700' }}
          value={`Rp ${Math.floor(Math.abs(bearSL)).toLocaleString('id-ID')}`}
          valueClassName="text-red-500"
          sub="widened by 1σ"
        />
      </CardContent>
    </Card>
  )
}
