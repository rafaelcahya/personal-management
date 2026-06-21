'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Shield, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Minus } from 'lucide-react'

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

export default function RiskSection({ metrics, loading }) {
  if (loading) {
    return (
      <Card className="border border-slate-200/70 shadow-sm px-5 py-5 gap-4 animate-pulse">
        {/* Take Profit */}
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-40 bg-slate-200 rounded" />
          <div className="h-3 w-72 bg-slate-100 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-slate-100 rounded-lg px-4 py-3 flex flex-col gap-1.5">
              <div className="flex items-start justify-between">
                <div className="h-3 w-10 bg-slate-200 rounded" />
                <div className="h-4 w-14 bg-slate-200 rounded-full" />
              </div>
              <div className="h-5 w-28 bg-slate-200 rounded" />
              <div className="h-3 w-20 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
        <div className="border-t border-slate-100" />
        {/* Stop Loss */}
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-36 bg-slate-200 rounded" />
          <div className="h-3 w-72 bg-slate-100 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-slate-100 rounded-lg px-4 py-3 flex flex-col gap-1.5">
              <div className="flex items-start justify-between">
                <div className="h-3 w-10 bg-slate-200 rounded" />
                <div className="h-4 w-14 bg-slate-200 rounded-full" />
              </div>
              <div className="h-5 w-28 bg-slate-200 rounded" />
              <div className="h-3 w-20 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      </Card>
    )
  }

  if (!metrics || metrics.totalTrades === 0) {
    return (
      <Card className="border border-slate-200/70 shadow-sm">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
              <Shield className="size-8 text-slate-400" />
            </div>
            <div>
              <h3 className="font-semibold text-base mb-1">No Risk Data Available</h3>
              <p className="text-sm text-slate-500">
                Add more trades to see risk analysis and suggestions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { bullTP, baseTP, bearTP, bullSL, baseSL, bearSL } = metrics

  return (
    <Card className="border border-slate-200/70 shadow-sm px-5 py-5 gap-4">
      {/* Take Profit row */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <ArrowUpRight className="size-4 text-violet-500 shrink-0" />
          <h3 className="text-sm font-semibold text-slate-700">Take Profit Targets</h3>
        </div>
        <p className="text-xs text-slate-400">
          Tiered targets based on historical average profit and standard deviation.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
      </div>

      <div className="border-t border-slate-100" />

      {/* Stop Loss row */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <ArrowDownRight className="size-4 text-violet-500 shrink-0" />
          <h3 className="text-sm font-semibold text-slate-700">Stop Loss Levels</h3>
        </div>
        <p className="text-xs text-slate-400">
          Tiered stop levels based on historical average loss and standard deviation.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
      </div>
    </Card>
  )
}
