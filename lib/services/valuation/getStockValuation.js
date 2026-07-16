import { createAdminClient } from '@/lib/supabase/admin'
import { CACHE_TTL_MS } from '@/lib/utils/constants/trading'
import { fetchFundamentals, fetchHistoricalPrices } from '@/lib/utils/yahooFinance'
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

async function getCachedValuation(supabaseAdmin, ticker) {
  const { data } = await supabaseAdmin
    .from(TABLE_NAME)
    .select('data, fetched_at')
    .eq('ticker', ticker)
    .single()

  return data ?? null
}

function isCacheFresh(cached) {
  if (!cached) return false
  return Date.now() - new Date(cached.fetched_at).getTime() < CACHE_TTL_MS
}

function buildFundamentals(fundamentalsRaw) {
  const bvps = fundamentalsRaw.bookValue / fundamentalsRaw.sharesOutstanding
  const graham = Math.sqrt(GRAHAM_MULTIPLIER * fundamentalsRaw.trailingEps * bvps)
  const currentPrice = fundamentalsRaw.regularMarketPrice

  return {
    fundamentals: {
      pbv: fundamentalsRaw.priceToBook,
      per: fundamentalsRaw.trailingPE,
      roe: fundamentalsRaw.returnOnEquity,
      der: fundamentalsRaw.debtToEquity,
      eps: fundamentalsRaw.trailingEps,
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

function buildAssessments(fundamentals, monteCarlo, risk, currentPrice) {
  const context = { currentPrice }
  const allMetrics = { ...fundamentals, ...monteCarlo, ...risk }
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
  const fundamentalsRaw = await fetchFundamentals(ticker)
  const historicalPrices = await fetchHistoricalPrices(ticker, HISTORICAL_YEARS)
  const closes = historicalPrices.map((entry) => entry.close)

  const { fundamentals, currentPrice } = buildFundamentals(fundamentalsRaw)
  const mc = runMonteCarlo(closes)
  const risk = buildRiskMetrics(closes)
  const assessments = buildAssessments(fundamentals, mc, risk, currentPrice)
  const overall = calculateOverallScore(assessments)

  return {
    ticker: ticker.toUpperCase(),
    longName: fundamentalsRaw.longName,
    fetchedAt: new Date().toISOString(),
    fundamentals,
    monteCarlo: { price: currentPrice, ...mc },
    risk,
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
    throw err
  }
}
