'use client'

import { Card } from '@/components/ui/card'
import {
  Target,
  Shield,
  Zap,
  BarChart3,
  Activity,
  TrendingUp,
  TrendingDown,
  Trophy,
  ChartNoAxesColumn,
  TrendingUpDown,
  AlertTriangle,
} from 'lucide-react'
import EmptyState from '@/components/ui/common/EmptyState'

const MAX_RISK_PCT = 0.02

function getRatioColor(value, threshold) {
  if (value >= threshold * 1.5)
    return { text: 'text-green-600', bg: 'bg-green-50', icon: 'text-green-500' }
  if (value >= threshold) return { text: 'text-blue-600', bg: 'bg-blue-50', icon: 'text-blue-500' }
  return { text: 'text-red-500', bg: 'bg-red-50', icon: 'text-red-400' }
}

function StatCell({ label, value, sub, valueClassName, className = '' }) {
  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      <div className="flex items-center gap-1">
        <span className="text-xs text-slate-400">{label}</span>
      </div>
      <span className={`text-sm font-semibold tabular-nums ${valueClassName ?? 'text-slate-800'}`}>
        {value ?? '—'}
      </span>
      {sub && <span className="text-xs text-slate-400">{sub}</span>}
    </div>
  )
}

export default function PerformanceSection({ metrics, loading }) {
  if (loading) {
    return (
      <Card className="border border-slate-200/70 shadow-sm px-5 py-5 gap-6 animate-pulse">
        <div className="space-y-3">
          <div className="flex flex-col gap-1.5">
            <div className="h-4 w-40 bg-slate-200 rounded" />
            <div className="h-3 w-72 bg-slate-100 rounded" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="h-3 w-20 bg-slate-200 rounded" />
                <div className="h-5 w-12 bg-slate-200 rounded" />
                <div className="h-3 w-16 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-slate-100" />
        <div className="space-y-3">
          <div className="flex flex-col gap-1.5">
            <div className="h-4 w-36 bg-slate-200 rounded" />
            <div className="h-3 w-80 bg-slate-100 rounded" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="h-3 w-20 bg-slate-200 rounded" />
                <div className="h-5 w-24 bg-slate-200 rounded" />
                <div className="h-3 w-14 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
          <div className="bg-slate-100 rounded-lg px-4 py-3 flex flex-col gap-1.5">
            <div className="h-3 w-32 bg-slate-200 rounded" />
            <div className="h-5 w-40 bg-slate-200 rounded" />
            <div className="h-3 w-52 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="border-t border-slate-100" />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-4 w-12 bg-slate-200 rounded" />
            <div className="h-5 w-16 bg-slate-200 rounded-full" />
          </div>
          <div className="h-6 bg-slate-200 rounded-lg" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-100 rounded-lg px-4 py-3 flex flex-col gap-1.5">
                <div className="h-3 w-20 bg-slate-200 rounded" />
                <div className="h-5 w-16 bg-slate-200 rounded" />
                <div className="h-3 w-24 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  if (!metrics || metrics.totalTrades === 0) {
    return (
      <EmptyState
        title="No Performance Data"
        description="Add trades to see detailed performance analysis"
      />
    )
  }

  const {
    totalProfit,
    totalLoss,
    profitFactor,
    profitFactorComment,
    payoffRatio,
    payoffComment,
    sharpeBI,
    sharpePersonal,
    sharpeBIComment,
    sharpePersonalComment,
    biSharpeRatio,
    personalSharpeRatio,
    marginOfError,
    winCount,
    totalTrades,
    profitPerTrade,
    lossPerTrade,
    expectedValue,
    safeZoneAvgLossWithMoe,
    safeZoneAvgProfitWithMoe,
    timesToZeroWithoutMoe,
    timesToZeroWithMoe,
    stdDevRupiah,
    stdDevComment,
    accountValue,
  } = metrics

  const profitContribution =
    totalProfit + Math.abs(totalLoss) > 0
      ? ((totalProfit / (totalProfit + Math.abs(totalLoss))) * 100).toFixed(1)
      : 0
  const winStreakPotential = winCount > 0 ? Math.floor(totalProfit / winCount) : 0

  const pfColor = getRatioColor(profitFactor ?? Infinity, 1)
  const prColor = getRatioColor(payoffRatio ?? Infinity, 1)
  const sharpeBIColor = getRatioColor(sharpeBI, 1)
  const sharpePersonalColor = getRatioColor(sharpePersonal, 1)

  const riskPerTrade = Math.abs(safeZoneAvgLossWithMoe)
  const rewardPerTrade = safeZoneAvgProfitWithMoe
  const riskRewardRatio = riskPerTrade > 0 ? Number((rewardPerTrade / riskPerTrade).toFixed(2)) : 0
  const riskPercentage = accountValue > 0 ? ((riskPerTrade / accountValue) * 100).toFixed(2) : 0
  const maxRiskCapital = accountValue > 0 ? Math.floor(accountValue * MAX_RISK_PCT) : 0

  const riskBarPct = riskRewardRatio > 0 ? ((1 / (1 + riskRewardRatio)) * 100).toFixed(1) : 50
  const rewardBarPct =
    riskRewardRatio > 0 ? ((riskRewardRatio / (1 + riskRewardRatio)) * 100).toFixed(1) : 50

  const riskLevel =
    stdDevRupiah < 100000
      ? { label: 'Low', className: 'bg-green-100 text-green-700' }
      : stdDevRupiah < 500000
        ? { label: 'Moderate', className: 'bg-yellow-100 text-yellow-700' }
        : stdDevRupiah < 1000000
          ? { label: 'High', className: 'bg-orange-100 text-orange-700' }
          : { label: 'Very High', className: 'bg-red-100 text-red-700' }

  return (
    <Card className="border border-slate-200/70 shadow-sm px-5 py-5 gap-4">
      {/* Performance Ratios */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Zap className="size-4 text-violet-500 shrink-0" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-slate-700">Performance Ratios</h3>
        </div>
        <p className="text-xs text-slate-400">
          Key ratios measuring your trading edge, reward-risk balance, and capital efficiency.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
        <StatCell
          label={
            <span className="flex items-center gap-1">
              Profit Factor <Target className={`size-3 ${pfColor.icon}`} />
            </span>
          }
          value={profitFactor ?? '∞'}
          valueClassName={pfColor.text}
          sub={profitFactorComment}
        />
        <StatCell
          label={
            <span className="flex items-center gap-1">
              Payoff Ratio <Activity className={`size-3 ${prColor.icon}`} />
            </span>
          }
          value={payoffRatio ?? '∞'}
          valueClassName={prColor.text}
          sub={payoffComment}
        />
        <StatCell
          label={
            <span className="flex items-center gap-1">
              Sharpe BI {biSharpeRatio}% <Shield className={`size-3 ${sharpeBIColor.icon}`} />
            </span>
          }
          value={sharpeBI}
          valueClassName={sharpeBIColor.text}
          sub={sharpeBIComment}
        />
        <StatCell
          label={
            <span className="flex items-center gap-1">
              Personal {personalSharpeRatio}%{' '}
              <Shield className={`size-3 ${sharpePersonalColor.icon}`} />
            </span>
          }
          value={sharpePersonal}
          valueClassName={sharpePersonalColor.text}
          sub={sharpePersonalComment}
        />
      </div>

      <div className="border-t border-slate-100" />

      {/* Trade Efficiency */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <BarChart3 className="size-4 text-violet-500 shrink-0" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-slate-700">Trade Efficiency</h3>
        </div>
        <p className="text-xs text-slate-400">
          Average impact per trade and profit concentration — applies {marginOfError}% margin of
          error to safe-zone estimates.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
        <StatCell
          label={
            <span className="flex items-center gap-1">
              Avg Profit/Trade <TrendingUp className="size-3 text-green-500" />
            </span>
          }
          value={`Rp ${profitPerTrade.toLocaleString('id-ID')}`}
          valueClassName="text-green-600"
        />
        <StatCell
          label={
            <span className="flex items-center gap-1">
              Avg Loss/Trade <TrendingDown className="size-3 text-red-400" />
            </span>
          }
          value={`Rp ${lossPerTrade.toLocaleString('id-ID')}`}
          valueClassName="text-red-500"
        />
        <StatCell
          label={
            <span className="flex items-center gap-1">
              Win Potential <Trophy className="size-3 text-amber-500" />
            </span>
          }
          value={`Rp ${winStreakPotential.toLocaleString('id-ID')}`}
          valueClassName="text-amber-600"
          sub="per winning trade"
        />
        <StatCell
          label={
            <span className="flex items-center gap-1">
              Profit Distribution <ChartNoAxesColumn className="size-3 text-violet-500" />
            </span>
          }
          value={`${profitContribution}%`}
          valueClassName="text-violet-600"
          sub="of total P/L volume"
        />
        <StatCell
          label={
            <span className="flex items-center gap-1">
              Std Deviation <Activity className="size-3 text-slate-400" />
            </span>
          }
          value={`Rp ${Math.floor(stdDevRupiah).toLocaleString('id-ID')}`}
          sub={stdDevComment}
        />
      </div>
      <StatCell
        label={
          <span className="flex items-center gap-1">
            Expected Value/Trade <TrendingUpDown className="size-3 text-slate-400" />
          </span>
        }
        value={`${expectedValue >= 0 ? '+' : ''}Rp ${Math.floor(expectedValue).toLocaleString('id-ID')}`}
        valueClassName={expectedValue >= 0 ? 'text-green-600' : 'text-red-500'}
        sub="(Win% × Avg Win) − (Loss% × Avg Loss)"
        className="bg-slate-50 rounded-lg px-4 py-3"
      />

      <div className="border-t border-slate-100" />

      {/* Risk */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-violet-500 shrink-0" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-slate-700">Risk</h3>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${riskLevel.className}`}
          >
            {riskLevel.label}
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Key risk metrics across your trades — reward-to-risk ratio, volatility, and capital
          buffer.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Risk</span>
          <span className="font-semibold text-slate-700">1:{riskRewardRatio} R:R</span>
          <span>Reward</span>
        </div>
        <div className="h-6 bg-slate-100 rounded-lg overflow-hidden flex">
          <div
            className="bg-red-400 flex items-center justify-center text-white text-xs font-semibold"
            style={{ width: `${riskBarPct}%` }}
          >
            Risk
          </div>
          <div
            className="bg-green-500 flex items-center justify-center text-white text-xs font-semibold"
            style={{ width: `${rewardBarPct}%` }}
          >
            Reward
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCell
          label={
            <span className="flex items-center gap-1">
              Risk/Trade <AlertTriangle className="size-3 text-red-400" />
            </span>
          }
          value={`${riskPercentage}%`}
          valueClassName="text-red-500"
          sub={`Rp ${Math.floor(riskPerTrade).toLocaleString('id-ID')}`}
          className="bg-slate-50 rounded-lg px-4 py-3"
        />
        <StatCell
          label={
            <span className="flex items-center gap-1">
              Max Risk (2%) <AlertTriangle className="size-3 text-amber-400" />
            </span>
          }
          value={`Rp ${maxRiskCapital.toLocaleString('id-ID')}`}
          valueClassName="text-amber-600"
          sub="2% of capital"
          className="bg-slate-50 rounded-lg px-4 py-3"
        />
        <StatCell
          label={
            <span className="flex items-center gap-1">
              R:R Ratio <Target className="size-3 text-blue-400" />
            </span>
          }
          value={`1:${riskRewardRatio}`}
          valueClassName="text-blue-600"
          sub="Risk vs Reward"
          className="bg-slate-50 rounded-lg px-4 py-3"
        />
        <StatCell
          label={
            <span className="flex items-center gap-1">
              Safe Buffer <Shield className="size-3 text-violet-400" />
            </span>
          }
          value={`${timesToZeroWithMoe}x`}
          valueClassName="text-violet-600"
          sub="Consecutive losses (adjusted)"
          className="bg-slate-50 rounded-lg px-4 py-3"
        />
        <StatCell
          label={
            <span className="flex items-center gap-1">
              Lose Streak Buffer <Shield className="size-3 text-slate-400" />
            </span>
          }
          value={`${timesToZeroWithoutMoe}x`}
          valueClassName="text-slate-700"
          sub="Consecutive losses (base)"
          className="bg-slate-50 rounded-lg px-4 py-3"
        />
        <StatCell
          label={
            <span className="flex items-center gap-1">
              Volatility <Activity className="size-3 text-amber-400" />
            </span>
          }
          value={stdDevComment}
          valueClassName="text-amber-600"
          sub={`σ: Rp ${Math.floor(stdDevRupiah).toLocaleString('id-ID')}`}
          className="bg-slate-50 rounded-lg px-4 py-3"
        />
      </div>
    </Card>
  )
}
