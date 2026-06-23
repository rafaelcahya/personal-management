'use client'

import { useMemo } from 'react'

function formatIDR(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatRate(rate) {
  if (!rate) return '—'
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(rate)
}

function StatCard({ label, value, valueClass }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">{label}</p>
      <p className={`font-mono font-semibold text-sm ${valueClass || 'text-slate-900'}`}>{value}</p>
    </div>
  )
}

export default function SummaryStats({ investments, currentRate }) {
  const stats = useMemo(() => {
    const buys = (investments || []).filter((i) => i.type === 'buy')
    const sells = (investments || []).filter((i) => i.type === 'sell')

    const totalBuyForeign = buys.reduce((s, i) => s + (i.foreign_amount || 0), 0)
    const totalSellForeign = sells.reduce((s, i) => s + (i.foreign_amount || 0), 0)
    const totalBuyIDR = buys.reduce((s, i) => s + (i.idr_amount || 0), 0)

    const avgBuyRate = totalBuyForeign > 0 ? totalBuyIDR / totalBuyForeign : 0
    const totalSellIDR = sells.reduce((s, i) => s + (i.idr_amount || 0), 0)
    const avgSellRate = totalSellForeign > 0 ? totalSellIDR / totalSellForeign : 0

    const totalForeignHeld = totalBuyForeign - totalSellForeign
    const currentValue = totalForeignHeld * (currentRate || 0)
    const unrealizedPnl = currentValue - totalBuyIDR + totalSellIDR

    return {
      avgBuyRate,
      avgSellRate,
      totalBuyIDR,
      currentValue,
      unrealizedPnl,
      hasSells: sells.length > 0,
    }
  }, [investments, currentRate])

  const pnlClass =
    stats.unrealizedPnl > 0
      ? 'text-emerald-600'
      : stats.unrealizedPnl < 0
        ? 'text-red-500'
        : 'text-slate-900'

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <StatCard label="Avg Buy Rate" value={formatRate(stats.avgBuyRate)} />
      <StatCard
        label="Avg Sell Rate"
        value={stats.hasSells ? formatRate(stats.avgSellRate) : '—'}
      />
      <StatCard label="Total Invested" value={formatIDR(stats.totalBuyIDR)} />
      <StatCard label="Current Value" value={formatIDR(stats.currentValue)} />
      <StatCard
        label="Unrealized P&L"
        value={`${stats.unrealizedPnl >= 0 ? '+' : ''}${formatIDR(stats.unrealizedPnl)}`}
        valueClass={pnlClass}
      />
    </div>
  )
}
