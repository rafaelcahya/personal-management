const SIGNAL = {
  BUY: 'BUY',
  HOLD: 'HOLD',
  SELL: 'SELL',
}

const SIGNAL_POINTS = {
  [SIGNAL.BUY]: 10,
  [SIGNAL.HOLD]: 5,
  [SIGNAL.SELL]: 0,
}

const ROE_WEIGHT = 1.5

const SCORED_METRICS = [
  'pbv',
  'per',
  'roe',
  'der',
  'graham',
  'p50',
  'sharpe1y',
  'sortino1y',
  'calmar',
  'maxdd',
]

const MAX_RAW_SCORE = SCORED_METRICS.reduce(
  (sum, metric) => sum + SIGNAL_POINTS[SIGNAL.BUY] * (metric === 'roe' ? ROE_WEIGHT : 1),
  0
)

const OVERALL_BUY_THRESHOLD = 70
const OVERALL_HOLD_THRESHOLD = 40

/**
 * Returns the human-readable RC Assessment label for a given metric value.
 * Returns null for metrics that have no qualitative label.
 * @param {string} metric
 * @param {number} value
 * @param {{ currentPrice?: number }} context
 */
export function getRcAssessment(metric, value, context = {}) {
  switch (metric) {
    case 'pbv':
      if (value < 1) return 'Undervalued'
      if (value <= 3) return 'Fair Value'
      return 'Overvalued'
    case 'per':
      if (value < 15) return 'Cheap'
      if (value <= 25) return 'Fair'
      return 'Expensive'
    case 'roe':
      if (value > 0.15) return 'Strong'
      if (value >= 0.1) return 'Moderate'
      return 'Weak'
    case 'der':
      if (value < 1) return 'Low Risk'
      if (value <= 2) return 'Moderate Risk'
      return 'High Risk'
    case 'eps':
      return null
    case 'dividendYield':
      if (value === null || value === 0) return 'No Dividend'
      if (value >= 0.04) return 'High Yield'
      if (value >= 0.02) return 'Moderate Yield'
      return 'Low Yield'
    case 'forwardPE':
      if (value < 15) return 'Cheap'
      if (value <= 25) return 'Fair'
      return 'Expensive'
    case 'peg':
      if (value < 1) return 'Undervalued'
      if (value <= 1.5) return 'Fair'
      return 'Overvalued'
    case 'insiderOwnership':
      if (value >= 0.2) return 'High Alignment'
      if (value >= 0.05) return 'Moderate'
      return 'Low Alignment'
    case 'institutionalOwnership':
      if (value >= 0.4) return 'High Interest'
      if (value >= 0.1) return 'Moderate'
      return 'Low Interest'
    case 'historicalPEBase':
      return context.currentPrice < value ? 'Below Hist. PE' : 'Above Hist. PE'
    case 'historicalPEBear':
    case 'historicalPEBull':
    case 'avgHistoricalPE':
    case 'minHistoricalPE':
    case 'maxHistoricalPE':
      return null
    case 'graham':
      return context.currentPrice < value ? 'Below Graham' : 'Above Graham'
    case 'p50':
      return context.currentPrice < value ? 'Undervalued' : 'Overvalued'
    case 'sharpe1y':
    case 'sharpe3y':
    case 'sharpe5y':
      if (value > 1) return 'Excellent'
      if (value >= 0.5) return 'Good'
      return 'Poor'
    case 'sortino1y':
    case 'sortino3y':
    case 'sortino5y':
      if (value > 1.5) return 'Excellent'
      if (value >= 1) return 'Good'
      return 'Poor'
    case 'calmar':
      if (value > 1) return 'Strong'
      if (value >= 0.5) return 'Moderate'
      return 'Weak'
    case 'maxdd':
      if (Math.abs(value) < 0.15) return 'Low Risk'
      if (Math.abs(value) <= 0.3) return 'Moderate Risk'
      return 'High Risk'
    case 'upsidePercent':
      if (value > 20) return 'High Upside'
      if (value >= 0) return 'Moderate Upside'
      return 'Downside Risk'
    case 'recommendationKey': {
      const map = {
        strong_buy: 'Strong Buy',
        buy: 'Buy',
        hold: 'Hold',
        sell: 'Sell',
        strong_sell: 'Strong Sell',
      }
      return map[value] ?? null
    }
    case 'bvps':
      return null
    case 'targetHistoricalPBV':
      return context.currentPrice < value ? 'Below Hist. P/BV' : 'Above Hist. P/BV'
    case 'costOfEquity':
      return null
    case 'dcfFairValue':
      return context.currentPrice < value ? 'Below DCF Value' : 'Above DCF Value'
    case 'dcfFCF':
    case 'dcfGrowthRate':
    case 'dcfWACC':
    case 'dcfTerminalGrowth':
    case 'dcfProjectionYears':
      return null
    case 'price':
    case 'p10':
    case 'p90':
    case 'currentPrice':
    case 'targetMean':
    case 'targetHigh':
    case 'targetLow':
    case 'numberOfAnalysts':
    case 'week52Low':
    case 'week52High':
      return null
    default:
      return null
  }
}

/**
 * Returns the trade signal (BUY/HOLD/SELL) for a given metric value.
 * Returns null for metrics that have no signal.
 * @param {string} metric
 * @param {number} value
 * @param {{ currentPrice?: number }} context
 */
export function getMetricSignal(metric, value, context = {}) {
  switch (metric) {
    case 'pbv':
      if (value < 1) return SIGNAL.BUY
      if (value <= 3) return SIGNAL.HOLD
      return SIGNAL.SELL
    case 'per':
      if (value < 15) return SIGNAL.BUY
      if (value <= 25) return SIGNAL.HOLD
      return SIGNAL.SELL
    case 'roe':
      if (value > 0.15) return SIGNAL.BUY
      if (value >= 0.1) return SIGNAL.HOLD
      return SIGNAL.SELL
    case 'der':
      if (value < 1) return SIGNAL.BUY
      if (value <= 2) return SIGNAL.HOLD
      return SIGNAL.SELL
    case 'eps':
      return null
    case 'dividendYield':
      if (!value || value === 0) return null
      if (value >= 0.04) return SIGNAL.BUY
      if (value >= 0.02) return SIGNAL.HOLD
      return SIGNAL.SELL
    case 'forwardPE':
      if (value < 15) return SIGNAL.BUY
      if (value <= 25) return SIGNAL.HOLD
      return SIGNAL.SELL
    case 'peg':
      if (value < 1) return SIGNAL.BUY
      if (value <= 1.5) return SIGNAL.HOLD
      return SIGNAL.SELL
    case 'insiderOwnership':
      if (value >= 0.2) return SIGNAL.BUY
      if (value >= 0.05) return SIGNAL.HOLD
      return SIGNAL.SELL
    case 'institutionalOwnership':
      if (value >= 0.4) return SIGNAL.BUY
      if (value >= 0.1) return SIGNAL.HOLD
      return SIGNAL.SELL
    case 'historicalPEBase':
      return context.currentPrice < value ? SIGNAL.BUY : SIGNAL.SELL
    case 'historicalPEBear':
    case 'historicalPEBull':
    case 'avgHistoricalPE':
    case 'minHistoricalPE':
    case 'maxHistoricalPE':
      return null
    case 'graham':
      return context.currentPrice < value ? SIGNAL.BUY : SIGNAL.SELL
    case 'p50':
      return context.currentPrice < value ? SIGNAL.BUY : SIGNAL.SELL
    case 'sharpe1y':
    case 'sharpe3y':
    case 'sharpe5y':
      if (value > 1) return SIGNAL.BUY
      if (value >= 0.5) return SIGNAL.HOLD
      return SIGNAL.SELL
    case 'sortino1y':
    case 'sortino3y':
    case 'sortino5y':
      if (value > 1.5) return SIGNAL.BUY
      if (value >= 1) return SIGNAL.HOLD
      return SIGNAL.SELL
    case 'calmar':
      if (value > 1) return SIGNAL.BUY
      if (value >= 0.5) return SIGNAL.HOLD
      return SIGNAL.SELL
    case 'maxdd':
      if (Math.abs(value) < 0.15) return SIGNAL.BUY
      if (Math.abs(value) <= 0.3) return SIGNAL.HOLD
      return SIGNAL.SELL
    case 'upsidePercent':
      if (value > 20) return SIGNAL.BUY
      if (value >= 0) return SIGNAL.HOLD
      return SIGNAL.SELL
    case 'recommendationKey':
      if (['strong_buy', 'buy'].includes(value)) return SIGNAL.BUY
      if (value === 'hold') return SIGNAL.HOLD
      if (['sell', 'strong_sell'].includes(value)) return SIGNAL.SELL
      return null
    case 'bvps':
      return null
    case 'targetHistoricalPBV':
      return context.currentPrice < value ? SIGNAL.BUY : SIGNAL.SELL
    case 'costOfEquity':
      return null
    case 'dcfFairValue':
      return context.currentPrice < value ? SIGNAL.BUY : SIGNAL.SELL
    case 'dcfFCF':
    case 'dcfGrowthRate':
    case 'dcfWACC':
    case 'dcfTerminalGrowth':
    case 'dcfProjectionYears':
      return null
    case 'price':
    case 'p10':
    case 'p90':
    case 'currentPrice':
    case 'targetMean':
    case 'targetHigh':
    case 'targetLow':
    case 'numberOfAnalysts':
    case 'week52Low':
    case 'week52High':
      return null
    default:
      return null
  }
}

/**
 * Calculates the overall valuation score, signal, and label from a full
 * assessments object (metric -> { label, signal }).
 * @param {Record<string, { label: string | null, signal: string | null }>} assessments
 * @returns {{ score: number, signal: string, label: string }}
 */
export function calculateOverallScore(assessments) {
  const rawScore = SCORED_METRICS.reduce((sum, metric) => {
    const signal = assessments[metric]?.signal
    if (!signal) return sum
    const points = SIGNAL_POINTS[signal] ?? 0
    const weight = metric === 'roe' ? ROE_WEIGHT : 1
    return sum + points * weight
  }, 0)

  const score = Math.round((rawScore / MAX_RAW_SCORE) * 100)

  let signal
  let label
  if (score >= OVERALL_BUY_THRESHOLD) {
    signal = SIGNAL.BUY
    label = 'Strong Buy'
  } else if (score >= OVERALL_HOLD_THRESHOLD) {
    signal = SIGNAL.HOLD
    label = 'Moderate'
  } else {
    signal = SIGNAL.SELL
    label = 'Sell'
  }

  return { score, signal, label }
}
