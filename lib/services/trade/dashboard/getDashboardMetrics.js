import { createClient } from '@/lib/supabase/server'

export async function getDashboardMetrics() {
  const supabase = await createClient()

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error('User not authenticated')
    }

    const [tradesResult, settingsResult] = await Promise.all([
      supabase
        .from('trade_list')
        .select('realized_gain, trade_date')
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .order('trade_date', { ascending: true }),
      supabase
        .from('settings')
        .select('initial_margin,bi_risk_free_rate,personal_risk_free_rate,margin_of_error')
        .eq('user_id', user.id)
        .single(),
    ])

    if (tradesResult.error) throw new Error('Failed to load trades')

    const settings = settingsResult.error
      ? {
          initial_margin: 0,
          bi_risk_free_rate: 6,
          personal_risk_free_rate: 10,
          margin_of_error: 10,
        }
      : settingsResult.data

    const initialMargin = Number(settings.initial_margin) || 0
    const trades = tradesResult.data || []

    if (trades.length === 0) {
      return getEmptyMetrics(initialMargin, settings)
    }

    return calculateMetrics(trades, initialMargin, settings)
  } catch (error) {
    console.error('Failed to fetch dashboard metrics:', error)
    throw new Error('Failed to load dashboard metrics')
  }
}

function calculateMetrics(trades, initialMargin, settings) {
  const totalTrades = trades.length
  const wins = trades.filter((t) => Number(t.realized_gain) > 0)
  const losses = trades.filter((t) => Number(t.realized_gain) < 0)

  const winCount = wins.length
  const loseCount = losses.length
  const winRate = totalTrades > 0 ? ((winCount / totalTrades) * 100).toFixed(1) : 0
  const loseRate = totalTrades > 0 ? ((loseCount / totalTrades) * 100).toFixed(1) : 0

  const profits = wins.map((t) => Number(t.realized_gain))
  const totalProfit = profits.reduce((sum, val) => sum + val, 0)
  const avgProfit = winCount > 0 ? totalProfit / winCount : 0
  const biggestProfit = profits.length > 0 ? Math.max(...profits) : 0
  const lowestProfit = profits.length > 0 ? Math.min(...profits) : 0

  const lossValues = losses.map((t) => Number(t.realized_gain))
  const totalLoss = lossValues.reduce((sum, val) => sum + val, 0)
  const avgLoss = loseCount > 0 ? totalLoss / loseCount : 0
  const biggestLoss = lossValues.length > 0 ? Math.min(...lossValues) : 0
  const lowestLoss = lossValues.length > 0 ? Math.max(...lossValues) : 0

  const pnl = trades.reduce((sum, t) => sum + Number(t.realized_gain || 0), 0)
  const accountValue = initialMargin + pnl
  const averagePnL = totalTrades > 0 ? pnl / totalTrades : 0

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const lastMonthTrades = trades.filter(
    (t) => t.trade_date && new Date(t.trade_date) >= thirtyDaysAgo
  )
  const pnlLastMonth = lastMonthTrades.reduce((sum, t) => sum + Number(t.realized_gain || 0), 0)
  const winsLastMonth = lastMonthTrades.filter((t) => Number(t.realized_gain) > 0).length
  const lossesLastMonth = lastMonthTrades.filter((t) => Number(t.realized_gain) < 0).length
  const portfolioGrowth = initialMargin > 0 ? ((pnl / initialMargin) * 100).toFixed(2) : 0

  // null = no losses (infinite ratio), not zero
  const profitFactor =
    Math.abs(totalLoss) > 0 ? Number((totalProfit / Math.abs(totalLoss)).toFixed(2)) : null
  const payoffRatio =
    Math.abs(avgLoss) > 0 ? Number((avgProfit / Math.abs(avgLoss)).toFixed(2)) : null

  const biSharpeRatio = Number(settings.bi_risk_free_rate) || 6
  const personalSharpeRatio = Number(settings.personal_risk_free_rate) || 10
  const marginOfError = Number(settings.margin_of_error) || 10
  const marginOfErrorDecimal = marginOfError / 100

  const returns = trades.map((t) => Number(t.realized_gain))
  const avgReturn = averagePnL
  const variance =
    returns.reduce((sum, val) => sum + Math.pow(val - avgReturn, 2), 0) / returns.length
  const stdDevRupiah = Math.sqrt(variance)

  // Sharpe: (avgReturn − risk-free per trade) / stdDev
  // risk-free per trade = annual rate × accountValue / totalTrades
  const riskFreePerTradeBI = ((biSharpeRatio / 100) * accountValue) / totalTrades
  const riskFreePerTradePersonal = ((personalSharpeRatio / 100) * accountValue) / totalTrades
  const sharpeBI =
    stdDevRupiah > 0 ? Number(((avgReturn - riskFreePerTradeBI) / stdDevRupiah).toFixed(2)) : 0
  const sharpePersonal =
    stdDevRupiah > 0
      ? Number(((avgReturn - riskFreePerTradePersonal) / stdDevRupiah).toFixed(2))
      : 0

  const safeZoneAvgProfitWithMoe = avgProfit * (1 + marginOfErrorDecimal)
  const safeZoneAvgLossWithMoe = avgLoss * (1 - marginOfErrorDecimal)

  const bullTP = avgProfit + stdDevRupiah
  const baseTP = avgProfit
  const bearTP = avgProfit - stdDevRupiah
  const bullSL = avgLoss + stdDevRupiah
  const baseSL = avgLoss
  const bearSL = avgLoss - stdDevRupiah

  const timesToZeroWithoutMoe = avgLoss !== 0 ? Math.abs(Math.floor(accountValue / avgLoss)) : 0
  const timesToZeroWithMoe =
    safeZoneAvgLossWithMoe !== 0 ? Math.abs(Math.floor(accountValue / safeZoneAvgLossWithMoe)) : 0

  const profitPerTrade = Math.floor(totalProfit / totalTrades)
  const lossPerTrade = Math.floor(Math.abs(totalLoss) / totalTrades)
  const expectedValue =
    (Number(winRate) / 100) * avgProfit + ((100 - Number(winRate)) / 100) * avgLoss

  const profitFactorComment =
    profitFactor === null ? 'Perfect' : getProfitFactorComment(profitFactor)
  const payoffComment = payoffRatio === null ? 'Perfect' : getPayoffComment(payoffRatio)
  const sharpeBIComment = getSharpeComment(sharpeBI)
  const sharpePersonalComment = getSharpeComment(sharpePersonal)
  const stdDevComment = getStdDevComment(stdDevRupiah)

  return {
    initialMargin,
    accountValue,
    pnlLastMonth,
    winsLastMonth,
    lossesLastMonth,
    biSharpeRatio,
    personalSharpeRatio,
    marginOfError,
    portfolioGrowth: Number(portfolioGrowth),
    pnl,
    averagePnL,
    totalTrades,
    winCount,
    loseCount,
    winRate: Number(winRate),
    loseRate: Number(loseRate),
    biggestProfit,
    lowestProfit,
    totalProfit,
    avgProfit,
    biggestLoss,
    lowestLoss,
    totalLoss,
    avgLoss,
    profitPerTrade,
    lossPerTrade,
    expectedValue,
    profitFactor,
    profitFactorComment,
    payoffRatio,
    payoffComment,
    sharpeBI,
    sharpePersonal,
    sharpeBIComment,
    sharpePersonalComment,
    avgReturn,
    stdDevRupiah,
    stdDevComment,
    safeZoneAvgProfitWithMoe,
    safeZoneAvgLossWithMoe,
    timesToZeroWithoutMoe,
    timesToZeroWithMoe,
    bullTP,
    baseTP,
    bearTP,
    bullSL,
    baseSL,
    bearSL,
  }
}

function getProfitFactorComment(value) {
  if (value >= 2) return 'Excellent'
  if (value >= 1.5) return 'Good'
  if (value >= 1) return 'Acceptable'
  return 'Needs Improvement'
}

function getPayoffComment(value) {
  if (value >= 2) return 'Strong'
  if (value >= 1.5) return 'Good'
  if (value >= 1) return 'Fair'
  return 'Weak'
}

function getSharpeComment(value) {
  if (value >= 2) return 'Excellent'
  if (value >= 1) return 'Good'
  if (value >= 0) return 'Fair'
  return 'Poor'
}

function getStdDevComment(value) {
  if (value < 100000) return 'Low Volatility'
  if (value < 500000) return 'Moderate Volatility'
  return 'High Volatility'
}

function getEmptyMetrics(initialMargin, settings) {
  return {
    initialMargin: initialMargin || 0,
    accountValue: initialMargin || 0,
    pnlLastMonth: 0,
    winsLastMonth: 0,
    lossesLastMonth: 0,
    biSharpeRatio: Number(settings.bi_risk_free_rate) || 6,
    personalSharpeRatio: Number(settings.personal_risk_free_rate) || 10,
    marginOfError: Number(settings.margin_of_error) || 10,
    portfolioGrowth: 0,
    pnl: 0,
    averagePnL: 0,
    totalTrades: 0,
    winCount: 0,
    loseCount: 0,
    winRate: 0,
    loseRate: 0,
    biggestProfit: 0,
    lowestProfit: 0,
    totalProfit: 0,
    avgProfit: 0,
    biggestLoss: 0,
    lowestLoss: 0,
    totalLoss: 0,
    avgLoss: 0,
    profitPerTrade: 0,
    lossPerTrade: 0,
    expectedValue: 0,
    profitFactor: null,
    profitFactorComment: 'No Data',
    payoffRatio: null,
    payoffComment: 'No Data',
    sharpeBI: 0,
    sharpePersonal: 0,
    sharpeBIComment: 'No Data',
    sharpePersonalComment: 'No Data',
    avgReturn: 0,
    stdDevRupiah: 0,
    stdDevComment: 'No Data',
    safeZoneAvgProfitWithMoe: 0,
    safeZoneAvgLossWithMoe: 0,
    timesToZeroWithoutMoe: 0,
    timesToZeroWithMoe: 0,
    bullTP: 0,
    baseTP: 0,
    bearTP: 0,
    bullSL: 0,
    baseSL: 0,
    bearSL: 0,
  }
}
