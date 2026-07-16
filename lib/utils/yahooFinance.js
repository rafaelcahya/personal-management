import YahooFinance from 'yahoo-finance2'

const IDX_SUFFIX = '.JK'
const yahooFinance = new YahooFinance({ suppressNotices: ['ripHistorical'] })

export async function fetchFundamentals(ticker) {
  const symbol = `${ticker.toUpperCase()}${IDX_SUFFIX}`

  const result = await yahooFinance.quoteSummary(
    symbol,
    { modules: ['summaryDetail', 'defaultKeyStatistics', 'financialData', 'price'] },
    { validateResult: false }
  )

  const summaryDetail = result.summaryDetail || {}
  const keyStatistics = result.defaultKeyStatistics || {}
  const financialData = result.financialData || {}
  const price = result.price || {}

  return {
    priceToBook: keyStatistics.priceToBook ?? null,
    trailingPE: summaryDetail.trailingPE ?? null,
    returnOnEquity: financialData.returnOnEquity ?? null,
    debtToEquity: financialData.debtToEquity ?? null,
    trailingEps: keyStatistics.trailingEps ?? null,
    bookValue: keyStatistics.bookValue ?? null,
    sharesOutstanding: keyStatistics.sharesOutstanding ?? null,
    regularMarketPrice: price.regularMarketPrice ?? null,
    dividendYield: summaryDetail.dividendYield ?? null,
    forwardPE: summaryDetail.forwardPE ?? null,
    pegRatio: keyStatistics.pegRatio ?? null,
    heldPercentInsiders: keyStatistics.heldPercentInsiders ?? null,
    heldPercentInstitutions: keyStatistics.heldPercentInstitutions ?? null,
    fiftyTwoWeekLow: summaryDetail.fiftyTwoWeekLow ?? null,
    fiftyTwoWeekHigh: summaryDetail.fiftyTwoWeekHigh ?? null,
    targetMeanPrice: financialData.targetMeanPrice ?? null,
    targetHighPrice: financialData.targetHighPrice ?? null,
    targetLowPrice: financialData.targetLowPrice ?? null,
    recommendationKey: financialData.recommendationKey ?? null,
    numberOfAnalystOpinions: financialData.numberOfAnalystOpinions ?? null,
    freeCashflow: financialData.freeCashflow ?? null,
    totalDebt: financialData.totalDebt ?? null,
    totalCash: financialData.totalCash ?? null,
    earningsGrowth: financialData.earningsGrowth ?? null,
    longName: price.longName ?? price.shortName ?? null,
    beta: summaryDetail.beta ?? null,
  }
}

/**
 * Fetches annual EPS history for an IDX ticker (up to `years` years back).
 * Uses fundamentalsTimeSeries which Yahoo Finance limits to ~4 years for IDX.
 * @param {string} ticker - IDX ticker without suffix
 * @param {number} years
 * @returns {Promise<Array<{ year: number, eps: number }>>} oldest-first
 */
export async function fetchHistoricalEPS(ticker, years) {
  const symbol = `${ticker.toUpperCase()}${IDX_SUFFIX}`
  const period1 = new Date(Date.now() - years * 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10)
  const period2 = new Date().toISOString().slice(0, 10)

  const rows = await yahooFinance.fundamentalsTimeSeries(
    symbol,
    { module: 'financials', type: 'annual', period1, period2 },
    { validateResult: false }
  )

  return rows
    .filter((r) => r.basicEPS != null || r.dilutedEPS != null)
    .map((r) => ({
      year: new Date(r.date).getFullYear(),
      eps: r.basicEPS ?? r.dilutedEPS,
    }))
    .sort((a, b) => a.year - b.year)
}

/**
 * Fetches annual balance sheet data for historical BVPS computation.
 * Returns year + total equity (stockholders' equity) per year, oldest first.
 */
export async function fetchHistoricalBookValue(ticker, years) {
  const symbol = `${ticker.toUpperCase()}${IDX_SUFFIX}`
  const period1 = new Date(Date.now() - years * 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10)
  const period2 = new Date().toISOString().slice(0, 10)

  const rows = await yahooFinance.fundamentalsTimeSeries(
    symbol,
    { module: 'balanceSheet', type: 'annual', period1, period2 },
    { validateResult: false }
  )

  return rows
    .filter(
      (r) =>
        r.commonStockEquity != null ||
        r.stockholdersEquity != null ||
        r.totalEquityGrossMinorityInterest != null
    )
    .map((r) => ({
      year: new Date(r.date).getFullYear(),
      equity: r.commonStockEquity ?? r.stockholdersEquity ?? r.totalEquityGrossMinorityInterest,
    }))
    .sort((a, b) => a.year - b.year)
}

export async function fetchHistoricalPrices(ticker, years) {
  const symbol = `${ticker.toUpperCase()}${IDX_SUFFIX}`
  const period1 = new Date(Date.now() - years * 365 * 24 * 60 * 60 * 1000)

  const rows = await yahooFinance.historical(symbol, {
    period1,
    period2: new Date(),
    interval: '1d',
  })

  return rows.map((row) => ({ date: row.date, close: row.close })).sort((a, b) => a.date - b.date)
}
