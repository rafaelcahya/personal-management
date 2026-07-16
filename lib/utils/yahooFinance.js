import yahooFinance from 'yahoo-finance2'

const IDX_SUFFIX = '.JK'

/**
 * Fetches fundamental data for an IDX ticker from Yahoo Finance.
 * @param {string} ticker - IDX ticker without suffix, e.g. "BBCA"
 * @returns {Promise<object>} flat fundamentals object
 */
export async function fetchFundamentals(ticker) {
  const symbol = `${ticker.toUpperCase()}${IDX_SUFFIX}`

  const result = await yahooFinance.quoteSummary(symbol, {
    modules: ['summaryDetail', 'defaultKeyStatistics', 'financialData', 'price'],
  })

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
    longName: price.longName ?? price.shortName ?? null,
  }
}

/**
 * Fetches historical daily close prices for an IDX ticker.
 * @param {string} ticker - IDX ticker without suffix, e.g. "BBCA"
 * @param {number} years - number of years of history to fetch
 * @returns {Promise<Array<{ date: Date, close: number }>>} oldest-first
 */
export async function fetchHistoricalPrices(ticker, years) {
  const symbol = `${ticker.toUpperCase()}${IDX_SUFFIX}`
  const period1 = new Date(Date.now() - years * 365 * 24 * 60 * 60 * 1000)

  const rows = await yahooFinance.historical(symbol, {
    period1,
    interval: '1d',
  })

  return rows.map((row) => ({ date: row.date, close: row.close })).sort((a, b) => a.date - b.date)
}
