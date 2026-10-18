#### 3.2.8 Stock Valuation (`/main/trading/valuation`)

**Description:** A multi-method fundamental valuation page for IDX stocks. The user maintains a personal watchlist of tickers; each ticker is analyzed using six valuation frameworks displayed as a comparative table. Market data is sourced from Yahoo Finance and cached in Supabase for 24 hours to avoid redundant API calls.

**Route:** `/main/trading/valuation`
**Main Component:** `app/main/trading/valuation/ValuationPage.jsx`

**User Stories:**

> As a user, I want to see multi-method valuation analysis for IDX stocks I'm watching, so that I can identify undervalued or overvalued stocks before making a trading decision.

> As a user, I want to manage my watchlist of tickers, so that I can track only the stocks relevant to me.

> As a user, I want to see an overall score for each stock, so that I can quickly compare them at a glance.

---

**Watchlist Management:**

A "Manage Watchlist" sheet (side drawer) accessible from the page header. The user can:

- View all tickers currently in the watchlist (with skeleton loading while fetching)
- Add a new ticker by entering its IDX code — the system validates the ticker against Yahoo Finance before saving
- Remove a ticker from the watchlist with a confirmation step (confirm button replaces remove button inline)
- On open and close, any pending confirm state resets to the default remove button

Ticker validation (create):

- Letters only, 1–10 characters (regex `/^[A-Za-z]{1,10}$/`)
- Must exist on Yahoo Finance — returns 422 if not found
- Returns 409 if the ticker is already in the watchlist

---

**Valuation Table:**

A wide scrollable table with one column per ticker. The first column shows the metric name and its info tooltip. Each ticker column shows the metric value and a signal badge (BUY / SELL / HOLD / NEUTRAL / N/A).

**Table sections (in order):**

| Section                 | Group Key          | Description                                             |
| ----------------------- | ------------------ | ------------------------------------------------------- |
| Overall Score           | —                  | Summary row: score out of 100, composite signal badge   |
| Fundamental Metrics     | `fundamentals`     | Core ratios from Yahoo Finance                          |
| Monte Carlo             | `monteCarlo`       | 1,000-path simulation; range gauge visualization        |
| Historical PE Valuation | `fundamentals`     | Bear/Base/Bull fair values from historical PE multiples |
| P/BV Valuation          | `pbvAnalysis`      | Book-value-based valuation via avg historical P/BV      |
| DCF Valuation           | `dcfValuation`     | Discounted Cash Flow intrinsic value                    |
| Risk Metrics            | `risk`             | Sharpe, Sortino, Calmar, Max Drawdown                   |
| Analyst Consensus       | `analystConsensus` | Sell-side price targets; gauge visualization            |

**Metrics per section:**

_Fundamental Metrics:_

| Metric                  | Key                      | Signal                                               |
| ----------------------- | ------------------------ | ---------------------------------------------------- |
| PBV                     | `pbv`                    | BUY ≤1, HOLD ≤2, SELL >2                             |
| PER                     | `per`                    | BUY ≤12, HOLD ≤20, SELL >20                          |
| Forward PE              | `forwardPE`              | BUY ≤12, HOLD ≤20, SELL >20                          |
| ROE                     | `roe`                    | BUY ≥20%, HOLD ≥12%, SELL <12%                       |
| DER                     | `der`                    | BUY ≤0.5, HOLD ≤1.5, SELL >1.5                       |
| EPS                     | `eps`                    | BUY >0, SELL ≤0                                      |
| Dividend Yield          | `dividendYield`          | BUY ≥4%, HOLD ≥2%, SELL <2%                          |
| Insider Ownership       | `insiderOwnership`       | BUY ≥20%, HOLD ≥10%, SELL <10%                       |
| Institutional Ownership | `institutionalOwnership` | BUY ≥40%, HOLD ≥15%, SELL <15%                       |
| PEG Ratio               | `peg`                    | BUY <1, HOLD ≤1.5, SELL >1.5; N/A if negative or >10 |
| Graham Number           | `graham`                 | BUY if price < Graham Number, SELL if above          |

_Monte Carlo (1,000 simulations, 1-year horizon, Rf = 6.5%):_

| Metric        | Key     | Signal                                               |
| ------------- | ------- | ---------------------------------------------------- |
| Current Price | `price` | Informational                                        |
| P10 Bear      | `p10`   | BUY if current price < P10, else based on upside %   |
| P50 Base      | `p50`   | BUY if price < P50, HOLD if within 5%, SELL if above |
| P90 Bull      | `p90`   | Informational                                        |

_Historical PE Valuation (computed from Yahoo Finance `fundamentalsTimeSeries`):_

| Metric             | Key                | Signal                             |
| ------------------ | ------------------ | ---------------------------------- |
| Bear Case (Min PE) | `historicalPEBear` | BUY if current price < bear target |
| Base Case (Avg PE) | `historicalPEBase` | BUY if price < base, SELL if above |
| Bull Case (Max PE) | `historicalPEBull` | Informational (upside reference)   |
| Avg Historical PE  | `avgHistoricalPE`  | Informational                      |
| Min Historical PE  | `minHistoricalPE`  | Informational                      |
| Max Historical PE  | `maxHistoricalPE`  | Informational                      |

PE values outside 0–80 are excluded as outliers. At least 10 price data points per year required to include a year.

_P/BV Valuation:_

| Metric            | Key                   | Notes                                                     |
| ----------------- | --------------------- | --------------------------------------------------------- |
| BVPS              | `bvps`                | From `defaultKeyStatistics.bookValue` — already per-share |
| Hist. P/BV Target | `targetHistoricalPBV` | Avg historical P/BV × current BVPS; BUY if price < target |
| ROE               | `roe`                 | Cross-reference with Cost of Equity                       |
| Cost of Equity    | `costOfEquity`        | CAPM: Rf (6.5%) + β × ERP (5.5%)                          |

Historical P/BV computed from annual balance sheet total equity (from `fundamentalsTimeSeries`) divided by shares outstanding, then paired with annual average price.

_DCF Valuation (FCFF model):_

| Metric               | Key                  | Notes                                                               |
| -------------------- | -------------------- | ------------------------------------------------------------------- |
| Free Cash Flow       | `dcfFCF`             | Displayed in IDR Billion                                            |
| Growth Rate FCF      | `dcfGrowthRate`      | From analyst earnings growth; range −20% to +30%; default 8%        |
| WACC                 | `dcfWACC`            | Ke × E/(D+E) + 9% × (1−22%) × D/(D+E)                               |
| Terminal Growth Rate | `dcfTerminalGrowth`  | Fixed 3.5% (long-run Indonesia nominal GDP)                         |
| Projection Years     | `dcfProjectionYears` | Fixed 10 years                                                      |
| DCF Fair Value       | `dcfFairValue`       | (Σ PV(FCF) + PV(TV) − net debt) ÷ shares; BUY if price < fair value |

DCF returns null if FCF ≤ 0, shares outstanding is missing, or WACC ≤ terminal growth rate.

_Risk Metrics (computed from 5 years of daily historical prices):_

| Metric               | Key                                   |
| -------------------- | ------------------------------------- |
| Sharpe 1Y / 3Y / 5Y  | `sharpe1y`, `sharpe3y`, `sharpe5y`    |
| Sortino 1Y / 3Y / 5Y | `sortino1y`, `sortino3y`, `sortino5y` |
| Calmar Ratio         | `calmar`                              |
| Max Drawdown         | `maxdd`                               |

_Analyst Consensus:_

| Metric              | Key                 |
| ------------------- | ------------------- |
| Target Mean Price   | `targetMean`        |
| Upside / Downside % | `upsidePercent`     |
| Recommendation      | `recommendationKey` |
| Analyst Count       | `numberOfAnalysts`  |

---

**Overall Score:**

Weighted composite score (0–100) computed from individual metric signals. Shown as a score value and a label: Strong Buy / Buy / Hold / Sell / Strong Sell.

---

**Data Source & Caching:**

- All market data fetched from Yahoo Finance via `yahoo-finance2` library
- Cached in `trading_watchlist_fundamentals` table (Supabase) per ticker, TTL = 24 hours
- Cache miss or stale cache triggers a fresh Yahoo Finance fetch
- Supabase "no rows" error (PGRST116) is treated as a cache miss, not an error
- Ticker not found on Yahoo Finance → typed 404 error → API returns HTTP 404

---

**UI States:**

| State                   | Behavior                                                                   |
| ----------------------- | -------------------------------------------------------------------------- |
| No watchlist            | Empty state: "Add tickers to your watchlist to start comparing valuations" |
| Loading ticker data     | Skeleton columns for each ticker while API fetches                         |
| Ticker not found        | Error cell across all rows for that ticker column                          |
| Metric value null       | Shows "N/A" with neutral badge                                             |
| Watchlist sheet loading | 3 skeleton rows instead of ticker list                                     |

---

**API Endpoints:**

| Method | Path                               | Description                                         |
| ------ | ---------------------------------- | --------------------------------------------------- |
| GET    | `/api/watchlist/v1/list`           | Return all tickers in the user's watchlist          |
| POST   | `/api/watchlist/v1/create`         | Add a new ticker (validates format + Yahoo Finance) |
| DELETE | `/api/watchlist/v1/delete/:ticker` | Remove a ticker from the watchlist                  |
| GET    | `/api/valuation/v1/detail/:ticker` | Fetch full valuation data for a single ticker       |

**Request body — create:**

```json
{ "ticker": "BBCA" }
```

**Response — list:**

```json
{
  "success": true,
  "data": [{ "id": 1, "ticker": "BBCA", "created_at": "2026-07-16T..." }]
}
```

**Response — valuation detail:**

```json
{
  "success": true,
  "data": {
    "ticker": "BBCA",
    "fundamentals": { "pbv": 3.1, "per": 18.5, "eps": 1050, "graham": 12400, "currentPrice": 9850, ... },
    "monteCarlo": { "price": 9850, "p10": 8200, "p50": 10100, "p90": 12500 },
    "risk": { "sharpe1y": 0.82, "sharpe3y": 0.71, "maxdd": -0.34, ... },
    "analystConsensus": { "targetMean": 11000, "upsidePercent": 11.7, "recommendationKey": "buy", "numberOfAnalysts": 12 },
    "pbvAnalysis": { "bvps": 3200, "targetHistoricalPBV": 10240, "roe": 0.21, "costOfEquity": 0.117 },
    "dcfValuation": { "dcfFCF": 45.2, "dcfGrowthRate": 0.08, "dcfWACC": 0.105, "dcfTerminalGrowth": 0.035, "dcfProjectionYears": 10, "dcfFairValue": 11200 },
    "assessments": { "pbv": { "signal": "HOLD", "label": "...", "rc": "HOLD" }, ... },
    "overall": { "score": 72, "label": "Buy", "signal": "BUY" }
  }
}
```

**Error Responses:**

| Code | Condition                                                       |
| ---- | --------------------------------------------------------------- |
| 400  | Invalid ticker format (not 1–10 letters)                        |
| 401  | Unauthenticated request                                         |
| 404  | Ticker not found on Yahoo Finance                               |
| 409  | Ticker already exists in the watchlist (create only)            |
| 422  | Ticker format valid but rejected by Yahoo Finance (create only) |
| 500  | Internal server error                                           |

---

**Database Tables:**

| Table                            | Purpose                                                                    |
| -------------------------------- | -------------------------------------------------------------------------- |
| `trading_watchlist`              | Stores the user's list of watched tickers (user_id, ticker)                |
| `trading_watchlist_fundamentals` | Cache store for valuation data per ticker (ticker, data JSONB, fetched_at) |

---

**Acceptance Criteria:**

```
GIVEN the user opens /main/trading/valuation with an empty watchlist
WHEN the page loads
THEN an empty state is shown prompting the user to add tickers

GIVEN the user opens the Manage Watchlist sheet
WHEN the sheet opens
THEN a skeleton loading state is shown while the watchlist fetches, then the ticker list appears

GIVEN the user types a valid IDX ticker and saves
WHEN the ticker exists on Yahoo Finance
THEN the ticker is added to the watchlist and appears in the table

GIVEN the user types a ticker that already exists in the watchlist
WHEN the form is submitted
THEN the API returns 409 and an error message is shown

GIVEN the user types a ticker not found on Yahoo Finance
WHEN the form is submitted
THEN the API returns 422 and an error message is shown

GIVEN the user removes a ticker from the watchlist
WHEN the remove button is clicked
THEN a confirm button appears inline; on confirm, the ticker is deleted and removed from the table

GIVEN the user opens or closes the Manage Watchlist sheet
WHEN the sheet state changes
THEN any in-progress confirm state resets to the default remove button

GIVEN the watchlist has tickers
WHEN the valuation table loads
THEN each ticker column shows skeleton cells while the API fetches, then fills in values

GIVEN a metric value is null or unavailable
WHEN the cell renders
THEN the value shows "N/A" with a neutral badge

GIVEN the ticker is not found on Yahoo Finance at fetch time
WHEN the detail API returns 404
THEN all cells in that ticker column show an error state

GIVEN the valuation data loads successfully
WHEN the table renders
THEN all 7 sections (Fundamental, Monte Carlo, Historical PE, P/BV, DCF, Risk, Analyst Consensus) are shown with correct values and signal badges

GIVEN the user clicks the info icon next to a metric
WHEN the tooltip opens
THEN a description of the metric and its interpretation is shown

GIVEN the valuation data was cached less than 24 hours ago
WHEN the detail API is called
THEN the cached data is returned without hitting Yahoo Finance
```

---
