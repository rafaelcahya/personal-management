#### 3.2.9 Research (`/main/trading/research`)

**Description:** A read-only intelligence page for US stocks. The user selects a ticker from their portfolio or searches any US symbol via Finnhub's symbol search, then views three tabs of market data: analyst consensus, technical indicators, and corporate events. Each section fetches independently so one failing section does not block others.

**Route:** `/main/trading/research`
**Main Component:** `app/main/trading/research/ResearchPageClient.jsx`

> **Coverage note:** Finnhub data is primarily US-centric. IDX tickers (e.g. `BBCA`) may return empty data for most sections. Technical indicators (RSI, MACD, pattern recognition) may require a Finnhub premium plan — the UI handles null responses with graceful empty states.

**User Stories:**

> As a trader, I want to view analyst recommendations and price targets for US stocks, so that I can gauge market consensus before entering a trade.

> As a trader, I want to see RSI, MACD, and candlestick patterns for a stock, so that I can assess technical momentum without leaving the app.

> As a trader, I want to see earnings history, insider transactions, and upcoming dividends, so that I can track corporate events that may affect a stock's price.

---

**Ticker Selector (Combobox):**

A single `Combobox` component in the page toolbar that serves two purposes:

- **Default options:** All distinct tickers from the user's `trade_list` (loaded server-side on page load, sorted alphabetically)
- **Async search:** When the user types, a debounced (300ms) call to Finnhub `/search` returns matching symbols (filtered to Common Stock, ETF, ADR — max 10 results), displayed as `SYMBOL — COMPANY NAME`

Selecting a ticker (from portfolio or search) triggers a parallel fetch of all three tabs' data. Clearing the selection via the `×` button shows an empty state.

---

**Tab: Overview**

Two cards side by side (stacked on mobile).

**Card 1 — Analyst Recommendations:**

| Data point  | Source                                                                            |
| ----------- | --------------------------------------------------------------------------------- |
| Consensus   | Derived: Buy if bullish > bearish, Sell if bearish > bullish, else Hold           |
| Period      | Most recent recommendation period                                                 |
| Total count | Sum of all analyst ratings                                                        |
| Breakdown   | Strong Buy / Buy / Hold / Sell / Strong Sell counts as horizontal percentage bars |

**Card 2 — Price Target:**

| Data point   | Source                                                               |
| ------------ | -------------------------------------------------------------------- |
| Avg target   | `targetMean` from Finnhub                                            |
| Range        | `targetLow` to `targetHigh` shown as a range slider with mean marker |
| Last updated | `lastUpdated` from Finnhub                                           |

Empty state shown per card if Finnhub returns no data for the ticker.

---

**Tab: Technicals**

Three cards (RSI and MACD side by side; Patterns full-width below).

**RSI (14):**

| Data point     | Details                                                              |
| -------------- | -------------------------------------------------------------------- |
| Value          | Last RSI value from Finnhub `/indicator?indicator=rsi`               |
| Gauge bar      | 0–100 horizontal bar with markers at 30 and 70                       |
| Interpretation | Oversold (≤30, green), Neutral (31–69, amber), Overbought (≥70, red) |

**MACD (12, 26, 9):**

| Data point  | Details                                                        |
| ----------- | -------------------------------------------------------------- |
| Histogram   | Last `macdHist` value — positive = Bullish, negative = Bearish |
| MACD line   | Last `macd` value                                              |
| Signal line | Last `macdSignal` value                                        |

**Candlestick Patterns:**

List of detected patterns from Finnhub `/scan/pattern`, each showing pattern name, type (reversal / continuation), status (partial / complete), and breakout direction badge (Bullish / Bearish).

All three cards show a dedicated empty state ("unavailable — may require a premium Finnhub plan") if the endpoint returns null.

---

**Tab: Corporate Events**

Three stacked cards.

**Earnings History (last 4 quarters):**

Table columns: Period | EPS Estimate | EPS Actual | Surprise %

Surprise % is color-coded: green if positive, red if negative.

**Insider Transactions (last 6 months):**

List of up to 10 transactions showing: name, filing date, Buy/Sell badge, share count changed. Fetched from Finnhub `/stock/insider-transactions`.

**Upcoming Dividend:**

4-cell grid showing: Amount (currency + value), Ex-Date, Pay Date, Frequency (Annual / Semi-annual / Quarterly / Monthly). Shows next upcoming dividend within 12 months. Empty state if none scheduled.

---

**UI States:**

| State                   | Behavior                                                                |
| ----------------------- | ----------------------------------------------------------------------- |
| No ticker selected      | EmptyState: "No ticker selected — search any US stock ticker above"     |
| Section loading         | Pulse skeleton per card/section                                         |
| Section error           | AlertTriangle + error message + "Try again" button per section          |
| Data null (unsupported) | EmptyState per card: "No data available for this ticker"                |
| Technicals null         | EmptyState per card: "Unavailable — may require a premium Finnhub plan" |

---

**API Endpoints:**

| Method | Path                                              | Description                                                          |
| ------ | ------------------------------------------------- | -------------------------------------------------------------------- |
| GET    | `/api/trade/v1/research/symbol-search?q=`         | Proxy to Finnhub `/search`; returns max 10 Common Stock/ETF/ADR      |
| GET    | `/api/trade/v1/research/overview?ticker=`         | Analyst recommendation (latest period) + price target                |
| GET    | `/api/trade/v1/research/technicals?ticker=`       | RSI(14), MACD(12,26,9), candlestick patterns (last 180 days of data) |
| GET    | `/api/trade/v1/research/corporate-events?ticker=` | Earnings (last 4Q), insider transactions (last 6mo), next dividend   |

All endpoints: auth guard + `FINNHUB_API_KEY` check. Per-section data is null (not an error) when Finnhub returns no data for the ticker — the client handles null with empty states.

**Response — overview:**

```json
{
  "success": true,
  "data": {
    "ticker": "AAPL",
    "recommendation": {
      "period": "2025-06-01",
      "strongBuy": 18,
      "buy": 12,
      "hold": 8,
      "sell": 2,
      "strongSell": 0,
      "total": 40
    },
    "priceTarget": {
      "low": 180.0,
      "mean": 220.5,
      "high": 260.0,
      "median": 218.0,
      "lastUpdated": "2025-06-15"
    }
  }
}
```

**Response — technicals:**

```json
{
  "success": true,
  "data": {
    "ticker": "AAPL",
    "rsi": { "value": 58.42, "interpretation": "neutral" },
    "macd": { "macd": 1.2345, "signal": 0.9876, "histogram": 0.2469, "trend": "bullish" },
    "patterns": [
      { "name": "Double Bottom", "type": "reversal", "status": "complete", "breakout": "bullish" }
    ]
  }
}
```

**Response — corporate-events:**

```json
{
  "success": true,
  "data": {
    "ticker": "AAPL",
    "earnings": [
      {
        "period": "2025-03-31",
        "quarter": 2,
        "year": 2025,
        "epsEstimate": 1.6,
        "epsActual": 1.65,
        "surprise": 0.05,
        "surprisePercent": 3.13
      }
    ],
    "insiderTransactions": [
      {
        "name": "Tim Cook",
        "transactionCode": "S",
        "change": -100000,
        "share": 900000,
        "transactionPrice": 195.0,
        "filingDate": "2025-05-10"
      }
    ],
    "upcomingDividend": {
      "amount": 0.25,
      "currency": "USD",
      "date": "2025-08-09",
      "payDate": "2025-08-15",
      "frequency": 4
    }
  }
}
```

**Client API functions (`lib/api/research.js`):**

| Function                               | Description                       |
| -------------------------------------- | --------------------------------- |
| `searchSymbols(query)`                 | Calls `/symbol-search?q=`         |
| `fetchResearchOverview(ticker)`        | Calls `/overview?ticker=`         |
| `fetchResearchTechnicals(ticker)`      | Calls `/technicals?ticker=`       |
| `fetchResearchCorporateEvents(ticker)` | Calls `/corporate-events?ticker=` |

**Acceptance Criteria:**

```
GIVEN the user opens /main/trading/research
WHEN the page loads
THEN the toolbar shows a Combobox pre-populated with portfolio tickers
AND the content area shows an empty state prompting the user to select a ticker

GIVEN the user opens the Combobox without typing
WHEN the dropdown opens
THEN portfolio tickers are shown as default options

GIVEN the user types "apple" in the Combobox
WHEN the debounce (300ms) fires
THEN Finnhub symbol search results appear in the dropdown (e.g. "AAPL — APPLE INC")

GIVEN the user selects a ticker
WHEN the selection is made
THEN all three tabs (Overview, Technicals, Corporate Events) begin fetching in parallel

GIVEN the user selects the Overview tab
WHEN data loads
THEN the Analyst Recommendations card shows buy/hold/sell bars and the consensus label
AND the Price Target card shows the mean target with a low-high range marker

GIVEN the Technicals data loads
WHEN RSI is in the overbought zone (≥70)
THEN the gauge bar is red and the badge shows "Overbought"

GIVEN the Finnhub endpoint returns null for RSI (free plan or unsupported ticker)
WHEN the RSI card renders
THEN an empty state is shown: "RSI unavailable — may require a premium Finnhub plan"

GIVEN the Corporate Events tab loads
WHEN earnings data is available
THEN a table shows the last 4 quarters with EPS estimate, actual, and surprise %
AND positive surprise % is green, negative is red

GIVEN one section's API call fails
WHEN the error is caught
THEN only that section shows an error state with a "Try again" button
AND other sections remain unaffected

GIVEN the user clicks "Try again" on a failed section
WHEN the button is clicked
THEN only that section refetches

GIVEN the user selects an IDX ticker (e.g. BBCA)
WHEN data is fetched from Finnhub
THEN empty states are shown per section (Finnhub has limited IDX coverage)

GIVEN the user clears the ticker selection via the × button
WHEN the Combobox is cleared
THEN the content area returns to the empty state
```

---
