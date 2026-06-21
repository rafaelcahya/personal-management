'use client'

export default function TradeMetricStrip({ summary }) {
  const { totalTrades = 0, totalWins = 0, netPnL = 0 } = summary

  if (totalTrades === 0) return null

  const winRate = ((totalWins / totalTrades) * 100).toFixed(1)
  const isPositive = netPnL >= 0
  const sign = isPositive ? '+' : ''
  const netPnLColor = isPositive
    ? 'text-[var(--color-trade-profit,#16a34a)]'
    : 'text-[var(--color-trade-loss,#dc2626)]'

  return (
    <p
      id="tradeMetricStrip_tradePage"
      className="text-sm text-slate-400 mb-3 block"
      aria-live="polite"
    >
      <span id="tradeMetricStrip_count_tradePage">{totalTrades} trades</span>
      {' · '}
      <span id="tradeMetricStrip_winRate_tradePage">Win Rate {winRate}%</span>
      {' · '}
      <span id="tradeMetricStrip_netPnL_tradePage" className={`font-medium ${netPnLColor}`}>
        Net P/L {sign}Rp {Math.abs(netPnL).toLocaleString('id-ID')}
      </span>
    </p>
  )
}
