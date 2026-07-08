'use client'

import {
  EmptyState,
  EmptyStateTitle,
  EmptyStateDescription,
} from '@/components/base/EmptyState/EmptyState'
import OverviewSkeleton from './component/OverviewSkeleton'
import PortfolioSummaryCard from './component/PortfolioSummaryCard'
import PerformanceDistributionCard from './component/PerformanceDistributionCard'

export default function OverviewSection({ metrics, loading }) {
  if (loading) return <OverviewSkeleton />

  if (!metrics || metrics.totalTrades === 0) {
    return (
      <EmptyState>
        <EmptyStateTitle>No Trading Data Yet</EmptyStateTitle>
        <EmptyStateDescription>
          Start adding trades to see your performance metrics, win rate, and portfolio growth
        </EmptyStateDescription>
      </EmptyState>
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

  return (
    <div className="space-y-4">
      <PortfolioSummaryCard
        accountValue={accountValue}
        initialMargin={initialMargin}
        portfolioGrowth={portfolioGrowth}
        pnl={pnl}
        pnlLastMonth={pnlLastMonth}
        winsLastMonth={winsLastMonth}
        lossesLastMonth={lossesLastMonth}
      />
      <PerformanceDistributionCard
        winCount={winCount}
        winRate={winRate}
        loseCount={loseCount}
        loseRate={loseRate}
        totalTrades={totalTrades}
        totalProfit={totalProfit}
        totalLoss={totalLoss}
        avgProfit={avgProfit}
        avgLoss={avgLoss}
        biggestProfit={biggestProfit}
        lowestProfit={lowestProfit}
        biggestLoss={biggestLoss}
        lowestLoss={lowestLoss}
        profitPerTrade={profitPerTrade}
        lossPerTrade={lossPerTrade}
      />
    </div>
  )
}
