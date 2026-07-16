import { createAdminClient } from '@/lib/supabase/admin'
import { CACHE_TTL_MS } from '@/lib/utils/constants/trading'
import {
  fetchFundamentals,
  fetchHistoricalPrices,
  fetchHistoricalEPS,
  fetchHistoricalBookValue,
} from '@/lib/utils/yahooFinance'
import { runMonteCarlo } from '@/lib/utils/monteCarlo'
import {
  calculateSharpe,
  calculateSortino,
  calculateCalmar,
  calculateMaxDrawdown,
} from '@/lib/utils/riskMetrics'
import {
  getRcAssessment,
  getMetricSignal,
  calculateOverallScore,
} from '@/lib/utils/valuationScoring'

const TABLE_NAME = 'trading_watchlist_fundamentals'
const HISTORICAL_YEARS = 5
const GRAHAM_MULTIPLIER = 22.5
const RF_RATE = 0.065
const EQUITY_RISK_PREMIUM = 0.055
const MAX_SANE_PBV = 20
const TERMINAL_GROWTH_RATE = 0.035
const PROJECTION_YEARS = 10
const COST_OF_DEBT = 0.09
const TAX_RATE = 0.22
const DEFAULT_FCF_GROWTH_RATE = 0.08

async function getCachedValuation(supabaseAdmin, ticker) {
  const { data, error } = await supabaseAdmin
    .from(TABLE_NAME)
    .select('data, fetched_at')
    .eq('ticker', ticker)
    .single()

  // PGRST116 = "no rows returned" — treat as cache miss, not a real error
  if (error && error.code !== 'PGRST116') throw error
  return data ?? null
}

function isCacheFresh(cached) {
  if (!cached) return false
  return Date.now() - new Date(cached.fetched_at).getTime() < CACHE_TTL_MS
}

function buildFundamentals(fundamentalsRaw) {
  // bookValue from defaultKeyStatistics is already per-share (BVPS), not total equity
  const bvps = fundamentalsRaw.bookValue
  const graham = Math.sqrt(GRAHAM_MULTIPLIER * fundamentalsRaw.trailingEps * bvps)
  const currentPrice = fundamentalsRaw.regularMarketPrice

  const rawPeg = fundamentalsRaw.pegRatio
  const peg = rawPeg > 0 && rawPeg <= 10 ? rawPeg : null

  return {
    fundamentals: {
      pbv: fundamentalsRaw.priceToBook,
      per: fundamentalsRaw.trailingPE,
      forwardPE: fundamentalsRaw.forwardPE,
      roe: fundamentalsRaw.returnOnEquity,
      der: fundamentalsRaw.debtToEquity,
      eps: fundamentalsRaw.trailingEps,
      dividendYield: fundamentalsRaw.dividendYield,
      peg,
      insiderOwnership: fundamentalsRaw.heldPercentInsiders,
      institutionalOwnership: fundamentalsRaw.heldPercentInstitutions,
      week52Low: fundamentalsRaw.fiftyTwoWeekLow,
      week52High: fundamentalsRaw.fiftyTwoWeekHigh,
      graham,
      currentPrice,
    },
    currentPrice,
  }
}

function buildRiskMetrics(closes) {
  return {
    sharpe1y: calculateSharpe(closes, 1),
    sharpe3y: calculateSharpe(closes, 3),
    sharpe5y: calculateSharpe(closes, 5),
    sortino1y: calculateSortino(closes, 1),
    sortino3y: calculateSortino(closes, 3),
    sortino5y: calculateSortino(closes, 5),
    calmar: calculateCalmar(closes),
    maxdd: calculateMaxDrawdown(closes),
  }
}

const MAX_SANE_PE = 80

function buildHistoricalPEValue(historicalEPS, historicalPrices, currentEPS) {
  if (!currentEPS || currentEPS <= 0) return { historicalPEValue: null, avgHistoricalPE: null }

  const yearlyPEs = historicalEPS
    .map(({ year, eps }) => {
      if (!eps || eps <= 0) return null
      const yearPrices = historicalPrices.filter((p) => new Date(p.date).getFullYear() === year)
      if (yearPrices.length < 10) return null
      const avgPrice = yearPrices.reduce((s, p) => s + p.close, 0) / yearPrices.length
      const pe = avgPrice / eps
      return pe > 0 && pe < MAX_SANE_PE ? pe : null
    })
    .filter((pe) => pe !== null)

  if (yearlyPEs.length === 0)
    return {
      historicalPEBase: null,
      historicalPEBear: null,
      historicalPEBull: null,
      avgHistoricalPE: null,
      minHistoricalPE: null,
      maxHistoricalPE: null,
    }

  const avgHistoricalPE = yearlyPEs.reduce((s, pe) => s + pe, 0) / yearlyPEs.length
  const minHistoricalPE = Math.min(...yearlyPEs)
  const maxHistoricalPE = Math.max(...yearlyPEs)
  return {
    historicalPEBase: currentEPS * avgHistoricalPE,
    historicalPEBear: currentEPS * minHistoricalPE,
    historicalPEBull: currentEPS * maxHistoricalPE,
    avgHistoricalPE,
    minHistoricalPE,
    maxHistoricalPE,
  }
}

function buildPBVAnalysis(fundamentalsRaw, historicalPrices, historicalBookValue, _currentPrice) {
  const sharesOutstanding = fundamentalsRaw.sharesOutstanding
  // bookValue from defaultKeyStatistics is already per-share (BVPS), not total equity
  const bvps = fundamentalsRaw.bookValue ?? null

  const beta = fundamentalsRaw.beta ?? 1.0
  const costOfEquity = RF_RATE + beta * EQUITY_RISK_PREMIUM
  const roe = fundamentalsRaw.returnOnEquity

  let targetHistoricalPBV = null

  if (bvps && historicalBookValue.length > 0 && sharesOutstanding) {
    const yearlyPBVs = historicalBookValue
      .map(({ year, equity }) => {
        const yearBVPS = equity / sharesOutstanding
        if (!yearBVPS || yearBVPS <= 0) return null
        const yearPrices = historicalPrices.filter((p) => new Date(p.date).getFullYear() === year)
        if (yearPrices.length < 10) return null
        const avgPrice = yearPrices.reduce((s, p) => s + p.close, 0) / yearPrices.length
        const pbv = avgPrice / yearBVPS
        return pbv > 0 && pbv < MAX_SANE_PBV ? pbv : null
      })
      .filter(Boolean)

    if (yearlyPBVs.length > 0) {
      const avgPBV = yearlyPBVs.reduce((s, v) => s + v, 0) / yearlyPBVs.length
      targetHistoricalPBV = avgPBV * bvps
    }
  }

  return { bvps, targetHistoricalPBV, roe, costOfEquity }
}

function buildDCFValuation(fundamentalsRaw, costOfEquity) {
  const fcf = fundamentalsRaw.freeCashflow
  const sharesOutstanding = fundamentalsRaw.sharesOutstanding
  const der = fundamentalsRaw.debtToEquity ?? 0
  const eRatio = der > 0 ? 1 / (1 + der) : 1.0
  const dRatio = der > 0 ? der / (1 + der) : 0.0
  const dcfWACC = costOfEquity * eRatio + COST_OF_DEBT * (1 - TAX_RATE) * dRatio

  const rawGrowth = fundamentalsRaw.earningsGrowth
  const dcfGrowthRate =
    rawGrowth != null && rawGrowth >= -0.2 && rawGrowth <= 0.3 ? rawGrowth : DEFAULT_FCF_GROWTH_RATE

  const base = {
    dcfFCF: fcf != null ? fcf / 1_000_000_000 : null,
    dcfGrowthRate,
    dcfWACC,
    dcfTerminalGrowth: TERMINAL_GROWTH_RATE,
    dcfProjectionYears: PROJECTION_YEARS,
    dcfFairValue: null,
  }

  if (!fcf || fcf <= 0 || !sharesOutstanding || dcfWACC <= TERMINAL_GROWTH_RATE) return base

  let sumPV = 0
  let projectedFCF = fcf
  for (let t = 1; t <= PROJECTION_YEARS; t++) {
    projectedFCF *= 1 + dcfGrowthRate
    sumPV += projectedFCF / Math.pow(1 + dcfWACC, t)
  }

  const terminalValue =
    (projectedFCF * (1 + TERMINAL_GROWTH_RATE)) / (dcfWACC - TERMINAL_GROWTH_RATE)
  const firmValue = sumPV + terminalValue / Math.pow(1 + dcfWACC, PROJECTION_YEARS)

  const totalDebt = fundamentalsRaw.totalDebt ?? 0
  const totalCash = fundamentalsRaw.totalCash ?? 0
  const equityValue = firmValue - totalDebt + totalCash

  return {
    ...base,
    dcfFairValue: equityValue > 0 ? equityValue / sharesOutstanding : null,
  }
}

function buildAnalystConsensus(fundamentalsRaw, currentPrice) {
  const targetMean = fundamentalsRaw.targetMeanPrice ?? null
  const targetHigh = fundamentalsRaw.targetHighPrice ?? null
  const targetLow = fundamentalsRaw.targetLowPrice ?? null
  const upsidePercent =
    targetMean !== null && currentPrice ? ((targetMean - currentPrice) / currentPrice) * 100 : null

  return {
    targetMean,
    targetHigh,
    targetLow,
    upsidePercent,
    recommendationKey: fundamentalsRaw.recommendationKey ?? null,
    numberOfAnalysts: fundamentalsRaw.numberOfAnalystOpinions ?? null,
  }
}

function buildAssessments(
  fundamentals,
  monteCarlo,
  risk,
  analystConsensus,
  pbvAnalysis,
  dcfValuation,
  currentPrice
) {
  const context = { currentPrice }
  const allMetrics = {
    ...fundamentals,
    ...monteCarlo,
    ...risk,
    ...analystConsensus,
    ...pbvAnalysis,
    ...dcfValuation,
  }
  const assessments = {}

  for (const [key, value] of Object.entries(allMetrics)) {
    const label = getRcAssessment(key, value, context)
    const signal = getMetricSignal(key, value, context)
    if (label !== null || signal !== null) {
      assessments[key] = { label, signal }
    }
  }

  return assessments
}

async function computeValuation(ticker) {
  const [fundamentalsRaw, historicalPrices, historicalEPS, historicalBookValue] = await Promise.all(
    [
      fetchFundamentals(ticker),
      fetchHistoricalPrices(ticker, HISTORICAL_YEARS),
      fetchHistoricalEPS(ticker, 10).catch(() => []),
      fetchHistoricalBookValue(ticker, HISTORICAL_YEARS).catch(() => []),
    ]
  )
  const closes = historicalPrices.map((entry) => entry.close)

  const { fundamentals, currentPrice } = buildFundamentals(fundamentalsRaw)
  const {
    historicalPEBase,
    historicalPEBear,
    historicalPEBull,
    avgHistoricalPE,
    minHistoricalPE,
    maxHistoricalPE,
  } = buildHistoricalPEValue(historicalEPS, historicalPrices, fundamentalsRaw.trailingEps)
  fundamentals.historicalPEBase = historicalPEBase
  fundamentals.historicalPEBear = historicalPEBear
  fundamentals.historicalPEBull = historicalPEBull
  fundamentals.avgHistoricalPE = avgHistoricalPE
  fundamentals.minHistoricalPE = minHistoricalPE
  fundamentals.maxHistoricalPE = maxHistoricalPE
  const mc = runMonteCarlo(closes)
  const risk = buildRiskMetrics(closes)
  const analystConsensus = buildAnalystConsensus(fundamentalsRaw, currentPrice)
  const pbvAnalysis = buildPBVAnalysis(
    fundamentalsRaw,
    historicalPrices,
    historicalBookValue,
    currentPrice
  )
  const dcfValuation = buildDCFValuation(fundamentalsRaw, pbvAnalysis.costOfEquity)
  const assessments = buildAssessments(
    fundamentals,
    mc,
    risk,
    analystConsensus,
    pbvAnalysis,
    dcfValuation,
    currentPrice
  )
  const overall = calculateOverallScore(assessments)

  return {
    ticker: ticker.toUpperCase(),
    longName: fundamentalsRaw.longName,
    fetchedAt: new Date().toISOString(),
    fundamentals,
    monteCarlo: { price: currentPrice, ...mc },
    risk,
    analystConsensus,
    pbvAnalysis,
    dcfValuation,
    assessments,
    overall,
  }
}

async function upsertValuationCache(supabaseAdmin, ticker, result) {
  await supabaseAdmin.from(TABLE_NAME).upsert({
    ticker,
    data: result,
    fetched_at: result.fetchedAt,
  })
}

/**
 * Returns the full computed valuation for an IDX ticker (fundamentals,
 * Monte Carlo fair value range, risk metrics, RC Assessment, overall score).
 * Serves a fresh cache entry when available, otherwise recomputes from
 * Yahoo Finance and refreshes the cache. Falls back to a stale cache entry
 * if the live fetch fails.
 * @param {string} ticker
 */
export async function getStockValuation(ticker) {
  const normalizedTicker = ticker.toUpperCase()
  const supabaseAdmin = createAdminClient()

  const cached = await getCachedValuation(supabaseAdmin, normalizedTicker)

  if (isCacheFresh(cached)) {
    return cached.data
  }

  try {
    const result = await computeValuation(normalizedTicker)
    await upsertValuationCache(supabaseAdmin, normalizedTicker, result)
    return result
  } catch (err) {
    if (cached) {
      return { ...cached.data, fromCache: true }
    }
    // Surface "ticker not found" as a typed 404 so the route can return the right status
    const msg = err.message?.toLowerCase() ?? ''
    if (
      msg.includes('no data found') ||
      msg.includes('not found') ||
      msg.includes('no fundamentals') ||
      err.name === 'FailedYahooValidationError'
    ) {
      const notFound = new Error(`Ticker "${normalizedTicker}" not found on Yahoo Finance`)
      notFound.status = 404
      throw notFound
    }
    throw err
  }
}
