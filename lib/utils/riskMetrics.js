import { RISK_FREE_RATE, TRADING_DAYS_PER_YEAR } from '@/lib/utils/constants/trading'

/**
 * Takes the last N years of prices, based on trading days per year.
 * @param {number[]} prices - oldest-first
 * @param {number} years
 */
export function slicePrices(prices, years) {
  const windowSize = years * TRADING_DAYS_PER_YEAR
  return prices.slice(-windowSize)
}

function calculateLogReturns(prices) {
  const returns = []
  for (let i = 1; i < prices.length; i += 1) {
    returns.push(Math.log(prices[i] / prices[i - 1]))
  }
  return returns
}

function calculateMean(values) {
  if (values.length === 0) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function calculateStd(values, mean) {
  if (values.length === 0) return 0
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length
  return Math.sqrt(variance)
}

/**
 * Calculates maximum drawdown as a negative decimal, e.g. -0.32.
 * @param {number[]} prices - oldest-first
 */
export function calculateMaxDrawdown(prices) {
  let peak = prices[0]
  let maxDrawdown = 0

  for (const price of prices) {
    if (price > peak) peak = price
    const drawdown = (price - peak) / peak
    if (drawdown < maxDrawdown) maxDrawdown = drawdown
  }

  return maxDrawdown
}

/**
 * Calculates annualized return from a price series.
 * @param {number[]} prices - oldest-first
 */
export function calculateAnnualizedReturn(prices) {
  const first = prices[0]
  const last = prices[prices.length - 1]
  const n = prices.length - 1
  if (n <= 0 || first <= 0) return 0
  return (last / first) ** (TRADING_DAYS_PER_YEAR / n) - 1
}

/**
 * Calculates annualized standard deviation of daily log returns.
 * @param {number[]} prices - oldest-first
 */
export function calculateAnnualizedStd(prices) {
  const logReturns = calculateLogReturns(prices)
  const mean = calculateMean(logReturns)
  const std = calculateStd(logReturns, mean)
  return std * Math.sqrt(TRADING_DAYS_PER_YEAR)
}

/**
 * Calculates annualized standard deviation of negative daily log returns only.
 * @param {number[]} prices - oldest-first
 */
export function calculateDownsideStd(prices) {
  const logReturns = calculateLogReturns(prices)
  const downsideReturns = logReturns.filter((value) => value < 0)
  const mean = calculateMean(downsideReturns)
  const std = calculateStd(downsideReturns, mean)
  return std * Math.sqrt(TRADING_DAYS_PER_YEAR)
}

/**
 * Calculates the Sharpe ratio over the last N years.
 * @param {number[]} prices - oldest-first
 * @param {number} years
 */
export function calculateSharpe(prices, years) {
  const windowPrices = slicePrices(prices, years)
  const annualizedReturn = calculateAnnualizedReturn(windowPrices)
  const annualizedStd = calculateAnnualizedStd(windowPrices)
  if (annualizedStd === 0) return 0
  return (annualizedReturn - RISK_FREE_RATE) / annualizedStd
}

/**
 * Calculates the Sortino ratio over the last N years.
 * @param {number[]} prices - oldest-first
 * @param {number} years
 */
export function calculateSortino(prices, years) {
  const windowPrices = slicePrices(prices, years)
  const annualizedReturn = calculateAnnualizedReturn(windowPrices)
  const downsideStd = calculateDownsideStd(windowPrices)
  if (downsideStd === 0) return 0
  return (annualizedReturn - RISK_FREE_RATE) / downsideStd
}

/**
 * Calculates the Calmar ratio using the full price history.
 * @param {number[]} prices - oldest-first
 */
export function calculateCalmar(prices) {
  const annualizedReturn = calculateAnnualizedReturn(prices)
  const maxDrawdown = calculateMaxDrawdown(prices)
  if (maxDrawdown === 0) return 0
  return annualizedReturn / Math.abs(maxDrawdown)
}
