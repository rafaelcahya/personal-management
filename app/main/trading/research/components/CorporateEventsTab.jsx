'use client'

import { format, parseISO } from 'date-fns'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import { Badge } from '@/components/base/Badge/Badge'
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateTitle,
} from '@/components/base/EmptyState/EmptyState'

function formatDate(str) {
  if (!str) return '—'
  try {
    return format(parseISO(str), 'dd MMM yyyy')
  } catch {
    return str
  }
}

function surpriseColor(pct) {
  if (pct == null) return 'text-slate-400'
  if (pct > 0) return 'text-green-600'
  if (pct < 0) return 'text-red-500'
  return 'text-slate-500'
}

function EarningsSection({ earnings }) {
  if (!earnings) {
    return (
      <EmptyState size="sm">
        <EmptyStateTitle>No earnings data</EmptyStateTitle>
        <EmptyStateDescription>Earnings history unavailable for this ticker.</EmptyStateDescription>
      </EmptyState>
    )
  }

  if (earnings.length === 0) {
    return (
      <EmptyState size="sm">
        <EmptyStateTitle>No recent earnings</EmptyStateTitle>
        <EmptyStateDescription>
          No earnings history found in the last 4 quarters.
        </EmptyStateDescription>
      </EmptyState>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide pb-2 pr-3">
              Period
            </th>
            <th className="text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wide pb-2 pr-3">
              EPS Est.
            </th>
            <th className="text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wide pb-2 pr-3">
              EPS Actual
            </th>
            <th className="text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wide pb-2">
              Surprise
            </th>
          </tr>
        </thead>
        <tbody>
          {earnings.map((e, i) => (
            <tr key={i} className="border-b border-slate-50 last:border-0">
              <td className="py-2 pr-3 text-slate-600 whitespace-nowrap">
                {e.period ? formatDate(e.period) : '—'}
              </td>
              <td className="py-2 pr-3 text-right text-slate-600">
                {e.epsEstimate != null ? e.epsEstimate.toFixed(2) : '—'}
              </td>
              <td className="py-2 pr-3 text-right font-medium text-slate-700">
                {e.epsActual != null ? e.epsActual.toFixed(2) : '—'}
              </td>
              <td className={`py-2 text-right font-medium ${surpriseColor(e.surprisePercent)}`}>
                {e.surprisePercent != null
                  ? `${e.surprisePercent > 0 ? '+' : ''}${e.surprisePercent}%`
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function InsiderSection({ transactions }) {
  if (!transactions) {
    return (
      <EmptyState size="sm">
        <EmptyStateTitle>No insider data</EmptyStateTitle>
        <EmptyStateDescription>
          Insider transactions unavailable for this ticker.
        </EmptyStateDescription>
      </EmptyState>
    )
  }

  if (transactions.length === 0) {
    return (
      <EmptyState size="sm">
        <EmptyStateTitle>No insider activity</EmptyStateTitle>
        <EmptyStateDescription>No insider transactions in the last 6 months.</EmptyStateDescription>
      </EmptyState>
    )
  }

  return (
    <div className="space-y-2">
      {transactions.map((t, i) => {
        const isBuy = t.change > 0
        const badgeColor = isBuy
          ? 'bg-green-50 text-green-700 border-transparent'
          : 'bg-red-50 text-red-600 border-transparent'
        return (
          <div
            key={i}
            className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{t.name || 'Unknown'}</p>
              <p className="text-xs text-slate-400">{formatDate(t.filingDate)}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-3">
              <Badge className={badgeColor}>{isBuy ? 'Buy' : 'Sell'}</Badge>
              <span className="text-xs font-medium text-slate-600">
                {Math.abs(t.change).toLocaleString()} shares
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DividendSection({ dividend }) {
  if (!dividend) {
    return (
      <EmptyState size="sm">
        <EmptyStateTitle>No upcoming dividend</EmptyStateTitle>
        <EmptyStateDescription>No dividend scheduled in the next 12 months.</EmptyStateDescription>
      </EmptyState>
    )
  }

  const freqLabel = { 1: 'Annual', 2: 'Semi-annual', 4: 'Quarterly', 12: 'Monthly' }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="bg-slate-50 rounded-lg p-3">
        <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Amount</p>
        <p className="text-sm font-semibold text-slate-700">
          {dividend.amount != null ? `${dividend.currency} ${dividend.amount}` : '—'}
        </p>
      </div>
      <div className="bg-slate-50 rounded-lg p-3">
        <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Ex-Date</p>
        <p className="text-sm font-semibold text-slate-700">{formatDate(dividend.date)}</p>
      </div>
      <div className="bg-slate-50 rounded-lg p-3">
        <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Pay Date</p>
        <p className="text-sm font-semibold text-slate-700">{formatDate(dividend.payDate)}</p>
      </div>
      <div className="bg-slate-50 rounded-lg p-3">
        <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Frequency</p>
        <p className="text-sm font-semibold text-slate-700">
          {freqLabel[dividend.frequency] ?? '—'}
        </p>
      </div>
    </div>
  )
}

export default function CorporateEventsTab({ ticker, state, onRetry }) {
  const { loading, error, data } = state

  if (loading) {
    return (
      <div className="space-y-4 pt-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <Skeleton className="h-4 w-32" />
            <div className="space-y-2">
              {[...Array(3)].map((_, j) => (
                <Skeleton key={j} className="h-8 w-full" />
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
    <div className="space-y-4 pt-4">
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
          Earnings History
        </p>
        <EarningsSection earnings={data?.earnings} />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
          Insider Transactions (last 6 months)
        </p>
        <InsiderSection transactions={data?.insiderTransactions} />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
          Upcoming Dividend
        </p>
        <DividendSection dividend={data?.upcomingDividend} />
      </div>
    </div>
  )
}
