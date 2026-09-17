import { getDashboardMetrics } from '@/lib/services/trade/dashboard/getDashboardMetrics'

/**
 * Lightweight trading highlights for the unified home dashboard. Reuses the
 * existing dashboard metrics service and surfaces only the headline figures:
 * 30-day P&L, all-time portfolio growth, win rate, and 30-day trade count.
 */
export async function getTradingHighlights() {
  const m = await getDashboardMetrics()

  return {
    pnlLastMonth: m.pnlLastMonth,
    portfolioGrowth: m.portfolioGrowth,
    winRate: m.winRate,
    tradesLastMonth: (m.winsLastMonth ?? 0) + (m.lossesLastMonth ?? 0),
    totalTrades: m.totalTrades,
  }
}
