#### 3.2.1 Dashboard (`/main/trading/dashboard`)

**Description:** A single scrollable page giving a complete view of trading performance. Data is fetched once on mount and flows down to three sections: Overview, Performance, and Risk. The dashboard requires at least one trade to show meaningful metrics; otherwise each section shows its own empty state.

**Route:** `/main/trading/dashboard`
**Main Component:** `app/main/trading/dashboard/TradingDashboard.jsx`

**User Stories:**

> As a user, I want to see a summary of my trading account health at a glance, so that I can understand how well I am performing.

> As a user, I want to see a detailed breakdown of profits and losses, so that I can understand where my gains and losses come from.

> As a user, I want to see risk analysis metrics including TP/SL suggestions, so that I can make better-informed position sizing decisions.

**Page Structure:**

The dashboard is a single scrollable page with three sections stacked vertically: Overview, Performance, Risk. There are no tabs.

---

##### Overview Section

Two `Card` components stacked vertically.

**Card 1 — Portfolio Summary**

A 4-column grid (collapses to 1 column on mobile) showing:

| Column        | Value                                                 | Sub-label                                        |
| ------------- | ----------------------------------------------------- | ------------------------------------------------ |
| Account Value | `initial_margin + total realized_gain` (Rp formatted) | Portfolio growth % in green/red; "Initial: Rp X" |
| Total P/L     | Sum of all `realized_gain` (Rp formatted, green/red)  | P/L last 30 days                                 |
| Wins          | Count of wins in the last 30 days (green)             | "this month"                                     |
| Losses        | Count of losses in the last 30 days (red)             | "this month"                                     |

**Card 2 — Performance Distribution**

A 2-column grid (1 column on mobile) split by a vertical divider. Each side has a `WinRateCircle` donut chart at the top followed by metric rows.

Win side:

- WinRateCircle: label "Win Rate", count = `winCount`, percent = `winRate`, color green
- Biggest Win (trophy icon), Smallest Win (star icon)
- Separator
- Total Profit (bold, dollar icon), Average Profit (chart icon)
- Separator
- "Per Trade Impact" row: `+Rp {profitPerTrade}` in green

Loss side:

- WinRateCircle: label "Loss Rate", count = `loseCount`, percent = `loseRate`, color red
- Biggest Loss (alert icon), Smallest Loss (arrow-down icon)
- Separator
- Total Loss (bold, dollar icon), Average Loss (chart icon)
- Separator
- "Per Trade Impact" row: `-Rp {lossPerTrade}` in red

**Metrics Shown — Overview:**

| Metric            | Formula / Source                                  |
| ----------------- | ------------------------------------------------- |
| Account Value     | `initialMargin + pnl`                             |
| Portfolio Growth  | `(pnl / initialMargin) * 100`                     |
| Total P/L         | Sum of all `realized_gain`                        |
| P/L Last 30 Days  | Sum of `realized_gain` for trades in last 30 days |
| Wins This Month   | Count of winning trades in last 30 days           |
| Losses This Month | Count of losing trades in last 30 days            |
| Win Rate          | `(winCount / totalTrades) * 100`                  |
| Loss Rate         | `(loseCount / totalTrades) * 100`                 |
| Win Count         | Count of trades where `realized_gain > 0`         |
| Loss Count        | Count of trades where `realized_gain < 0`         |
| Biggest Win       | Max positive `realized_gain`                      |
| Smallest Win      | Min positive `realized_gain`                      |
| Total Profit      | Sum of positive `realized_gain` values            |
| Average Profit    | `totalProfit / winCount`                          |
| Biggest Loss      | Min `realized_gain` (most negative)               |
| Smallest Loss     | Max negative `realized_gain` (least negative)     |
| Total Loss        | Sum of negative `realized_gain` values            |
| Average Loss      | `totalLoss / loseCount`                           |
| Profit/Trade      | `floor(totalProfit / totalTrades)`                |
| Loss/Trade        | `floor(abs(totalLoss) / totalTrades)`             |

---

##### Performance Section

A single `Card` with three groups separated by a horizontal rule (`<Separator />`).

**Group 1 — Performance Ratios**

Icon+title header: Zap icon, "Performance Ratios"

4 `StatCell` items in a 2-col / 3-col grid (no background):

| Metric          | Formula                                                 | Display if null  |
| --------------- | ------------------------------------------------------- | ---------------- |
| Profit Factor   | `totalProfit / abs(totalLoss)`                          | "∞" in green     |
| Payoff Ratio    | `avgProfit / abs(avgLoss)`                              | "∞" in green     |
| Sharpe BI       | `(avgReturn − riskFreePerTradeBI) / stdDevRupiah`       | Text comment sub |
| Sharpe Personal | `(avgReturn − riskFreePerTradePersonal) / stdDevRupiah` | Text comment sub |

- `riskFreePerTradeBI = (biSharpeRatio/100 × accountValue) / totalTrades`
- `riskFreePerTradePersonal = (personalSharpeRatio/100 × accountValue) / totalTrades`
- `profitFactor` and `payoffRatio` are `null` (not 0) when there are no losses — displayed as "∞" in green
- Each ratio has a color-coded value (green ≥ 1.5×threshold, blue ≥ threshold, red below) and a text comment sub-label (e.g., "Excellent", "Good", "Fair", "Needs Improvement")
- Sharpe labels include the configured rate, e.g., "Sharpe BI 6%", "Personal 10%"

**Group 2 — Trade Efficiency**

Icon+title header: BarChart3 icon, "Trade Efficiency". Sub-title shows the configured margin of error percent.

5 `StatCell` items in a 2-col / 3-col grid (no background):

| Metric              | Formula                                                          |
| ------------------- | ---------------------------------------------------------------- |
| Avg Profit/Trade    | `floor(totalProfit / totalTrades)` — green                       |
| Avg Loss/Trade      | `floor(abs(totalLoss) / totalTrades)` — red                      |
| Win Potential       | `floor(totalProfit / winCount)` — amber, sub "per winning trade" |
| Profit Distribution | `(totalProfit / (totalProfit + abs(totalLoss))) * 100` — violet  |
| Std Deviation       | `floor(stdDevRupiah)` in Rp — comment as sub-label               |

Then below the grid, a highlighted `StatCell` with `bg-slate-50` background:

- Expected Value/Trade: `(winRate/100 × avgProfit) + ((100−winRate)/100 × avgLoss)`, shown as `+Rp X` or `-Rp X`, green/red

**Group 3 — Risk**

Icon+title header: Shield icon, "Risk". A risk level badge (Low / Moderate / High / Very High) appears top-right — computed from `stdDevRupiah` thresholds: Low < 100k, Moderate < 500k, High < 1M, Very High ≥ 1M.

A horizontal bar chart shows R:R ratio split (red = risk side, green = reward side).

6 `StatCell` items with `bg-slate-50` background in a 2-col / 3-col grid:

| Metric             | Formula / Source                                                |
| ------------------ | --------------------------------------------------------------- |
| Risk/Trade %       | `(abs(safeZoneAvgLossWithMoe) / accountValue) * 100` — red      |
| Max Risk (2%)      | `accountValue * 0.02` — amber                                   |
| R:R Ratio          | `safeZoneAvgProfitWithMoe / abs(safeZoneAvgLossWithMoe)` — blue |
| Safe Buffer        | `timesToZeroWithMoe` consecutive losses — violet                |
| Lose Streak Buffer | `timesToZeroWithoutMoe` consecutive losses — slate              |
| Volatility         | `stdDevComment` as value, `σ: Rp X` as sub-label — amber        |

---

##### Risk Section

A single `Card` with two groups separated by a horizontal rule.

**Group 1 — Take Profit Targets**

Icon+title header: ArrowUpRight icon, "Take Profit Targets". Sub-title: "Tiered targets based on historical average profit and standard deviation."

3 `StatCell` items with `bg-slate-50` background in a 1-col / 2-col / 3-col grid:

| Tier | Chip label           | Formula         | Show "—" when                                              |
| ---- | -------------------- | --------------- | ---------------------------------------------------------- |
| Bull | "stretch" green      | `avgProfit + σ` | Never                                                      |
| Base | "expected" blue      | `avgProfit`     | Never                                                      |
| Bear | "conservative" amber | `avgProfit − σ` | `stdDevRupiah > avgProfit` (volatility exceeds avg profit) |

**Group 2 — Stop Loss Levels**

Icon+title header: ArrowDownRight icon, "Stop Loss Levels". Sub-title: "Tiered stop levels based on historical average loss and standard deviation."

3 `StatCell` items with `bg-slate-50` background:

| Tier | Chip label      | Formula       | Show "—" when                                       |
| ---- | --------------- | ------------- | --------------------------------------------------- |
| Bull | "tight" green   | `avgLoss + σ` | Result is positive (stdDev > avgLoss, `bullSL ≥ 0`) |
| Base | "expected" blue | `avgLoss`     | Never                                               |
| Bear | "wide" red      | `avgLoss − σ` | Never                                               |

All TP/SL values shown as absolute Rp amounts (positive numbers regardless of sign).

**TP/SL Formulas in service:**

```
bullTP = avgProfit + stdDevRupiah
baseTP = avgProfit
bearTP = avgProfit − stdDevRupiah

bullSL = avgLoss + stdDevRupiah
baseSL = avgLoss
bearSL = avgLoss − stdDevRupiah
```

---

##### [DEPRECATED] Quick View Tab

> **[DEPRECATED]** The Quick View tab was removed as part of the dashboard redesign (issue #424). The `/api/trade/v1/dashboard/quick-view` API endpoint still exists but is not used on the dashboard page. If Quick View is needed in the future, it should be implemented as a standalone page or as a widget in a different section.

---

**UI States:**

| Section     | Loading State                          | Empty State                                         | Error State                                           |
| ----------- | -------------------------------------- | --------------------------------------------------- | ----------------------------------------------------- |
| Page-level  | n/a                                    | n/a                                                 | Full-page error with AlertTriangle + Try Again button |
| Overview    | Pulse skeleton for both cards          | EmptyState: "No Trading Data Yet"                   | Covered by page-level error                           |
| Performance | Pulse skeleton matching 3-group layout | EmptyState: "No Performance Data"                   | Covered by page-level error                           |
| Risk        | Pulse skeleton for 2-group layout      | Custom card: Shield icon + "No Risk Data Available" | Covered by page-level error                           |

**API Endpoints:**

| Method | Path                                         | Description                                 |
| ------ | -------------------------------------------- | ------------------------------------------- |
| GET    | `/api/trade/v1/dashboard/metrics`            | All metrics for Overview, Performance, Risk |
| GET    | `/api/trade/v1/dashboard/quick-view?limit=5` | [DEPRECATED] Not used on the dashboard page |

**Response shape — metrics:**

```json
{
  "success": true,
  "data": {
    "initialMargin": 10000000,
    "accountValue": 11500000,
    "portfolioGrowth": 15.0,
    "pnl": 1500000,
    "pnlLastMonth": 300000,
    "winsLastMonth": 4,
    "lossesLastMonth": 1,
    "totalTrades": 20,
    "winRate": 60.0,
    "loseRate": 40.0,
    "winCount": 12,
    "loseCount": 8,
    "averagePnL": 75000,
    "totalProfit": 2000000,
    "totalLoss": -500000,
    "avgProfit": 166667,
    "avgLoss": -62500,
    "biggestProfit": 500000,
    "lowestProfit": 10000,
    "biggestLoss": -150000,
    "lowestLoss": -5000,
    "profitPerTrade": 100000,
    "lossPerTrade": 25000,
    "expectedValue": 75000,
    "profitFactor": 4.0,
    "profitFactorComment": "Excellent",
    "payoffRatio": 2.67,
    "payoffComment": "Good",
    "biSharpeRatio": 6,
    "personalSharpeRatio": 10,
    "marginOfError": 10,
    "sharpeBI": 1.2,
    "sharpeBIComment": "Good",
    "sharpePersonal": 0.8,
    "sharpePersonalComment": "Fair",
    "stdDevRupiah": 95000,
    "stdDevComment": "Low Volatility",
    "safeZoneAvgProfitWithMoe": 183334,
    "safeZoneAvgLossWithMoe": -56250,
    "timesToZeroWithoutMoe": 160,
    "timesToZeroWithMoe": 204,
    "bullTP": 261667,
    "baseTP": 166667,
    "bearTP": 71667,
    "bullSL": 32500,
    "baseSL": -62500,
    "bearSL": -157500
  }
}
```

Notes on response shape:

- `profitFactor` and `payoffRatio` are `null` when there are no losses (not zero). The UI displays "∞" in green.
- `bearTP` can be negative if `stdDevRupiah > avgProfit` — the UI shows "—" in that case.
- `bullSL` can be positive if `stdDevRupiah > abs(avgLoss)` — the UI shows "—" in that case.

**Acceptance Criteria:**

```
GIVEN the user opens /main/trading/dashboard
WHEN the page loads
THEN a single scrollable page is shown with Overview, Performance, and Risk sections stacked vertically — no tabs

GIVEN the page is loading
WHEN the API hasn't responded yet
THEN each section shows a pulse skeleton matching its layout

GIVEN the API returns an error
WHEN the error is caught
THEN a full-page error state is shown with an AlertTriangle icon and a "Try Again" button

GIVEN the user clicks "Try Again" on the error state
WHEN the button is clicked
THEN the metrics API is called again

GIVEN the user has no trades
WHEN the Overview section renders
THEN EmptyState "No Trading Data Yet" is shown

GIVEN the user has no trades
WHEN the Performance section renders
THEN EmptyState "No Performance Data" is shown

GIVEN the user has no trades
WHEN the Risk section renders
THEN a card with Shield icon and "No Risk Data Available" is shown

GIVEN data loads successfully
WHEN the Overview section renders
THEN Portfolio Summary card shows Account Value, Total P/L, Wins this month, and Losses this month in a 4-col grid

GIVEN data loads successfully
WHEN the Overview section renders
THEN Performance Distribution card shows Win and Loss sides, each with a WinRateCircle, metric rows, and a Per Trade Impact row

GIVEN data loads successfully
WHEN the Performance section renders
THEN one Card shows three groups: Performance Ratios, Trade Efficiency, and Risk — separated by horizontal rules

GIVEN profitFactor or payoffRatio is null (no losses on record)
WHEN the Performance Ratios group renders
THEN the value is shown as "∞" in green text

GIVEN the sharpe ratio labels are configured in settings
WHEN Performance Ratios renders
THEN the BI rate and Personal rate values appear in the StatCell label (e.g., "Sharpe BI 6%")

GIVEN data loads successfully
WHEN the Trade Efficiency group renders
THEN Expected Value/Trade is shown in a highlighted bg-slate-50 cell below the grid

GIVEN data loads successfully
WHEN the Risk group renders
THEN a risk level badge (Low / Moderate / High / Very High) appears in the header and a R:R bar chart is shown

GIVEN data loads successfully
WHEN the Risk section (TP/SL card) renders
THEN Take Profit Targets (Bull/Base/Bear) and Stop Loss Levels (Bull/Base/Bear) are shown in two groups

GIVEN stdDevRupiah > avgProfit
WHEN the Bear TP cell renders
THEN the value shows "—" with sub-label "volatility exceeds avg profit"

GIVEN stdDevRupiah > abs(avgLoss)
WHEN the Bull SL cell renders
THEN the value shows "—" with sub-label "volatility exceeds avg loss"
```

---
