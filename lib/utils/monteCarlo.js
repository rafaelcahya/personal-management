import { MONTE_CARLO_SIMULATIONS, MONTE_CARLO_DAYS } from '@/lib/utils/constants/trading'

const TRADING_DAYS_PER_STEP = 1

/**
 * Generates a standard-normal random variable using the Box-Muller transform.
 */
function generateStandardNormal() {
  const u1 = Math.random()
  const u2 = Math.random()
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
}

function calculateLogReturns(prices) {
  const returns = []
  for (let i = 1; i < prices.length; i += 1) {
    returns.push(Math.log(prices[i] / prices[i - 1]))
  }
  return returns
}

function calculateMean(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function calculateStd(values, mean) {
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length
  return Math.sqrt(variance)
}

function getPercentile(sortedValues, percentile) {
  const index = Math.floor(percentile * (sortedValues.length - 1))
  return sortedValues[index]
}

/**
 * Runs a Monte Carlo simulation (Geometric Brownian Motion) over historical
 * closing prices and returns the 10th/50th/90th percentile of simulated
 * final prices after MONTE_CARLO_DAYS trading days.
 * @param {number[]} prices - historical close prices, oldest-first
 * @returns {{ p10: number, p50: number, p90: number }}
 */
export function runMonteCarlo(prices) {
  const logReturns = calculateLogReturns(prices)
  const mu = calculateMean(logReturns)
  const sigma = calculateStd(logReturns, mu)
  const startPrice = prices[prices.length - 1]
  const dt = TRADING_DAYS_PER_STEP

  const finalPrices = []

  for (let sim = 0; sim < MONTE_CARLO_SIMULATIONS; sim += 1) {
    let price = startPrice
    for (let day = 0; day < MONTE_CARLO_DAYS; day += 1) {
      const z = generateStandardNormal()
      price *= Math.exp((mu - 0.5 * sigma ** 2) * dt + sigma * Math.sqrt(dt) * z)
    }
    finalPrices.push(price)
  }

  finalPrices.sort((a, b) => a - b)

  return {
    p10: getPercentile(finalPrices, 0.1),
    p50: getPercentile(finalPrices, 0.5),
    p90: getPercentile(finalPrices, 0.9),
  }
}
