'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Target,
  LayoutDashboard,
  Trophy,
  Star,
  AlertTriangle,
  ArrowDownRight,
  CircleDollarSign,
  ChartNoAxesColumn,
} from 'lucide-react'
import WinRateCircle from './component/WinRateCircle'
import MetricRow from './component/MetricRow'
import EmptyState from '@/components/ui/common/EmptyState'

function formatRp(value) {
  return `Rp ${Number(value ?? 0).toLocaleString('id-ID')}`
}

export default function OverviewSection({ metrics, loading }) {
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {/* Portfolio Summary skeleton */}
        <Card className="border border-slate-200/70 shadow-sm py-5 gap-4">
          <CardContent className="px-5">
            <div className="flex flex-col gap-1.5">
              <div className="h-4 w-36 bg-slate-200 rounded" />
              <div className="h-3 w-60 bg-slate-100 rounded" />
            </div>
          </CardContent>
          <div className="grid grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`px-5 py-3 flex flex-col gap-2 ${i < 3 ? 'border-r border-slate-200' : ''}`}
              >
                <div className="h-3 w-20 bg-slate-200 rounded" />
                <div className="h-6 w-28 bg-slate-200 rounded" />
                <div className="h-3 w-16 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        </Card>
        {/* Performance Distribution skeleton */}
        <Card className="border border-slate-200/70 shadow-sm pt-2">
          <CardContent className="px-5 pt-3 pb-5">
            <div className="flex flex-col gap-1.5 mb-5">
              <div className="h-4 w-48 bg-slate-200 rounded" />
              <div className="h-3 w-72 bg-slate-100 rounded" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <div className="flex justify-center">
                    <div className="w-28 h-28 bg-slate-200 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="flex justify-between">
                        <div className="h-3 w-24 bg-slate-200 rounded" />
                        <div className="h-3 w-20 bg-slate-200 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!metrics || metrics.totalTrades === 0) {
    return (
      <EmptyState
        title="No Trading Data Yet"
        description="Start adding trades to see your performance metrics, win rate, and portfolio growth"
      />
    )
  }

  const {
    initialMargin,
    accountValue,
    portfolioGrowth,
    pnl,
    pnlLastMonth,
    winsLastMonth,
    lossesLastMonth,
    winRate,
    loseRate,
    winCount,
    loseCount,
    totalTrades,
    totalProfit,
    totalLoss,
    avgProfit,
    avgLoss,
    biggestProfit,
    lowestProfit,
    biggestLoss,
    lowestLoss,
    profitPerTrade,
    lossPerTrade,
  } = metrics

  const growthPositive = Number(portfolioGrowth) >= 0
  const pnlPositive = Number(pnl) >= 0
  const pnlLastMonthPositive = Number(pnlLastMonth) >= 0

  return (
    <div className="space-y-4">
      {/* Account Value + Total P/L */}
      <Card className="border border-slate-200/70 shadow-sm py-5 gap-4">
        <CardContent className="px-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="size-4 text-violet-500 shrink-0" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-slate-700">Portfolio Summary</h3>
            </div>
            <p className="text-xs text-slate-400">
              Current account value and total realized profit/loss.
            </p>
          </div>
        </CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {/* Account Value */}
          <div className="px-5 py-3 border-r border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Wallet className="size-3.5 text-slate-400" aria-hidden="true" />
                <span className="text-xs font-medium text-slate-500">Account Value</span>
              </div>
              <span
                className={`text-xs font-semibold tabular-nums ${growthPositive ? 'text-green-600' : 'text-red-500'}`}
              >
                {growthPositive ? '+' : ''}
                {portfolioGrowth}%
              </span>
            </div>
            <p className="text-xl font-semibold text-slate-800 tabular-nums">
              {formatRp(accountValue)}
            </p>
            <p className="text-xs text-slate-400 mt-1">Initial: {formatRp(initialMargin)}</p>
          </div>

          {/* Total P/L */}
          <div className="px-5 py-3 border-r border-slate-200">
            <div className="flex items-center gap-1.5 mb-2">
              {pnlPositive ? (
                <TrendingUp className="size-3.5 text-slate-400" aria-hidden="true" />
              ) : (
                <TrendingDown className="size-3.5 text-slate-400" aria-hidden="true" />
              )}
              <span className="text-xs font-medium text-slate-500">Total P/L</span>
            </div>
            <p
              className={`text-xl font-semibold tabular-nums ${pnlPositive ? 'text-green-600' : 'text-red-500'}`}
            >
              {pnlPositive ? '+' : ''}
              {formatRp(pnl)}
            </p>
            <p
              className={`text-xs mt-1 font-medium tabular-nums ${pnlLastMonthPositive ? 'text-green-500' : 'text-red-400'}`}
            >
              {pnlLastMonthPositive ? '+' : ''}
              {formatRp(pnlLastMonth)}{' '}
              <span className="text-slate-400 font-normal">last 30 days</span>
            </p>
          </div>

          {/* Wins this month */}
          <div className="px-5 py-3 border-r border-slate-200">
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp className="size-3.5 text-slate-400" aria-hidden="true" />
              <span className="text-xs font-medium text-slate-500">Wins</span>
            </div>
            <p className="text-xl font-semibold text-green-600 tabular-nums">
              {winsLastMonth ?? 0}
            </p>
            <p className="text-xs text-slate-400 mt-1">this month</p>
          </div>

          {/* Losses this month */}
          <div className="px-5 py-3">
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingDown className="size-3.5 text-slate-400" aria-hidden="true" />
              <span className="text-xs font-medium text-slate-500">Losses</span>
            </div>
            <p className="text-xl font-semibold text-red-500 tabular-nums">
              {lossesLastMonth ?? 0}
            </p>
            <p className="text-xs text-slate-400 mt-1">this month</p>
          </div>
        </div>
      </Card>

      {/* Performance Distribution + Breakdown — merged */}
      <Card className="border border-slate-200/70 shadow-sm pt-2">
        <CardContent className="px-5">
          <div className="flex flex-col gap-1 pt-3 mb-5">
            <div className="flex items-center gap-2">
              <Target className="size-4 text-violet-500 shrink-0" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-slate-700">Performance Distribution</h3>
            </div>
            <p className="text-xs text-slate-400">
              Win/loss breakdown with profit and loss metrics per trade.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {/* Win side */}
            <div className="pb-6 md:pb-0 md:pr-6">
              <div className="flex justify-center mb-4">
                <WinRateCircle
                  label="Win Rate"
                  count={winCount}
                  percent={winRate}
                  color="#10B981"
                  total={totalTrades}
                />
              </div>
              <div className="space-y-2">
                <MetricRow
                  label="Biggest Win"
                  value={biggestProfit}
                  format="currency"
                  icon={<Trophy className="size-3 text-amber-400" />}
                />
                <MetricRow
                  label="Smallest Win"
                  value={lowestProfit}
                  format="currency"
                  icon={<Star className="size-3 text-violet-400" />}
                />
                <Separator />
                <MetricRow
                  label="Total Profit"
                  value={totalProfit}
                  format="currency"
                  highlight
                  icon={<CircleDollarSign className="size-3 text-green-500" />}
                />
                <MetricRow
                  label="Average Profit"
                  value={avgProfit}
                  format="currency"
                  icon={<ChartNoAxesColumn className="size-3 text-blue-400" />}
                />
                <Separator />
                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs font-medium text-slate-500">Per Trade Impact</span>
                  <span className="text-sm font-medium text-green-600">
                    +Rp {profitPerTrade.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            {/* Loss side */}
            <div className="pt-6 md:pt-0 md:pl-6">
              <div className="flex justify-center mb-4">
                <WinRateCircle
                  label="Loss Rate"
                  count={loseCount}
                  percent={loseRate}
                  color="#EF4444"
                  total={totalTrades}
                />
              </div>
              <div className="space-y-2">
                <MetricRow
                  label="Biggest Loss"
                  value={biggestLoss}
                  format="currency"
                  icon={<AlertTriangle className="size-3 text-red-400" />}
                />
                <MetricRow
                  label="Smallest Loss"
                  value={lowestLoss}
                  format="currency"
                  icon={<ArrowDownRight className="size-3 text-orange-400" />}
                />
                <Separator />
                <MetricRow
                  label="Total Loss"
                  value={totalLoss}
                  format="currency"
                  highlight
                  icon={<CircleDollarSign className="size-3 text-red-500" />}
                />
                <MetricRow
                  label="Average Loss"
                  value={avgLoss}
                  format="currency"
                  icon={<ChartNoAxesColumn className="size-3 text-slate-400" />}
                />
                <Separator />
                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs font-medium text-slate-500">Per Trade Impact</span>
                  <span className="text-sm font-medium text-red-600">
                    -Rp {lossPerTrade.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
