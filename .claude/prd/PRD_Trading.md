# PRD — Trading Management Module

> Part of PRD_Personal_Management. Shared standards: [PRD_Shared.md](./PRD_Shared.md)

**Version:** 1.4
**Last Updated:** 2026-07-17

---

### 3.2 Trading Management Module

**Purpose:** Record, analyze, and evaluate stock trading performance. The module covers trade logging, fee tracking, market event management, an AI chat assistant, AI-powered event analysis, stock valuation, and US stock research (analyst intelligence, technicals, corporate events).

---

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

#### 3.2.2 Trade List (`/main/trading/trade`)

**Description:** Full CRUD for individual stock trades. The page shows a summary bar at the top and a scrollable table below. Clicking any row opens an edit dialog. Trades cannot be filtered or sorted from the UI — all trades are returned in DB order.

**Route:** `/main/trading/trade`
**Main Component:** `app/main/trading/trade/TradesPageClient.jsx`

**User Stories:**

> As a user, I want to see all my trades in a table, so that I can review my trading history.

> As a user, I want to add a new trade, so that I can record every position I take.

> As a user, I want to edit or delete an existing trade, so that I can fix mistakes or remove stale records.

**Summary Cards (Trade List):**

Shown above the table. Collapses to a single card on mobile (collapsible trigger).

| Card         | Value                                                       |
| ------------ | ----------------------------------------------------------- |
| Total Trades | Count of all trades                                         |
| Win Rate     | `(totalWins / totalTrades) * 100`, sub-label: `{W}W / {L}L` |
| Total Profit | Sum of all positive `realized_gain`                         |
| Net P/L      | Sum of all `realized_gain`                                  |

**Table Columns:**

| Column   | Field               | Notes                                     |
| -------- | ------------------- | ----------------------------------------- |
| Date     | `trade_date`        | Formatted as `dd MMM yyyy`                |
| Ticker   | `ticker`            | Uppercase, violet text                    |
| Margin   | `margin`            | Right-aligned, Rp formatted               |
| Proceeds | `proceeds`          | Right-aligned, Rp formatted               |
| Return % | `return_percent`    | Color: green if positive, red if negative |
| P/L      | `realized_gain`     | Right-aligned, color-coded                |
| Type     | `stock_type_option` | Stock type label                          |

**Add Trade Form Fields:**

| Field              | Required | Notes                                       |
| ------------------ | -------- | ------------------------------------------- |
| Trade Date         | Yes      | Date picker, defaults to today              |
| Ticker             | Yes      | Text input, forced uppercase, max 10 chars  |
| Margin (Capital)   | Yes      | Currency input, must be positive            |
| Proceeds (Return)  | Yes      | Currency input, must be positive            |
| Realized Gain/Loss | Auto     | `proceeds - margin`, read-only              |
| Return %           | Auto     | `(realized_gain / margin) * 100`, read-only |
| Stock Type         | Yes      | Select from options endpoint                |
| Entry Session      | Yes      | Select from options endpoint                |
| Entry Occasion     | Yes      | Select from options endpoint                |
| Buy Reason         | Yes      | Select from options endpoint                |
| Sell Reason        | Yes      | Select from options endpoint                |
| Notes              | No       | Textarea, free text                         |

**Edit Trade:** Clicking a table row opens `UpdateTrade` dialog pre-populated with all fields. Same form layout as Add. Includes a Delete button inside the edit dialog.

**Delete Trade:** Triggered from within the UpdateTrade dialog. Shows a confirmation dialog before deleting.

**Select Options (loaded on form open):**

All options are loaded in a single call to `/api/trade/v1/trade/options/all`. Individual endpoints also exist per type.

| Option         | Endpoint                                   |
| -------------- | ------------------------------------------ |
| Stock Type     | `GET /api/trade/v1/options/stock-type`     |
| Entry Session  | `GET /api/trade/v1/options/entry-session`  |
| Entry Occasion | `GET /api/trade/v1/options/entry-occasion` |
| Buy Reason     | `GET /api/trade/v1/options/buy-reason`     |
| Sell Reason    | `GET /api/trade/v1/options/sell-reason`    |

**Validations:**

- `trade_date`: required
- `ticker`: required, 1–10 characters, forced uppercase
- `margin`: required, must be a positive number
- `proceeds`: required, must be a positive number
- `stock_type_option`, `entry_session_option`, `entry_occasion_option`, `buy_reason_option`, `sell_reason_option`: all required

**API Endpoints:**

| Method | Path                                | Description                                   |
| ------ | ----------------------------------- | --------------------------------------------- |
| GET    | `/api/trade/v1/trade/list`          | Return all trades for the user, no pagination |
| GET    | `/api/trade/v1/trade/summary`       | Return summary counts and totals              |
| POST   | `/api/trade/v1/trade/create`        | Create a new trade                            |
| PUT    | `/api/trade/v1/trade/update/:id`    | Update an existing trade                      |
| DELETE | `/api/trade/v1/trade/delete/:id`    | Delete a trade                                |
| GET    | `/api/trade/v1/trade/options/all`   | Return all option lists in one call           |
| GET    | `/api/trade/v1/trade/options/:type` | Return options for one type                   |

**Request body — create/update:**

```json
{
  "trade_date": "2026-06-10",
  "ticker": "BBCA",
  "margin": "5000000",
  "proceeds": "5500000",
  "realized_gain": "500000",
  "return_percent": "10.00%",
  "stock_type_option": "IDX LQ45",
  "entry_session_option": "Opening",
  "entry_occasion_option": "Breakout",
  "buy_reason_option": "Technical",
  "sell_reason_option": "Target Hit",
  "notes": "Clean breakout above resistance"
}
```

**Response — create:** `{ "success": true, "trade": { ...tradeObject } }` — HTTP 201

**Response — list:** `{ "success": true, "trades": [...] }` — HTTP 200

**Response — summary:**

```json
{
  "success": true,
  "data": {
    "totalTrades": 20,
    "totalWins": 12,
    "totalLosses": 8,
    "totalProfit": 2000000,
    "netPnL": 1500000
  }
}
```

**Error States:**

- Options fail to load: toast error, form shows with empty selects
- Create/update fails: toast error, dialog stays open
- Delete fails: toast error

**UI States:**

| State   | Behavior                                          |
| ------- | ------------------------------------------------- |
| Loading | Spinner with "Loading trades..." text             |
| Empty   | "No trades yet. Start by adding your first trade" |
| Loaded  | Table with rows                                   |

**Acceptance Criteria:**

```
GIVEN the user opens /main/trading/trade
WHEN data loads
THEN summary cards and trade table are shown

GIVEN the user clicks "Add Trade"
WHEN the dialog opens
THEN options are loaded and all required fields are shown

GIVEN the user fills all required fields and submits
WHEN the API responds with 201
THEN the dialog closes, table refreshes, summary updates

GIVEN the user leaves a required field empty and submits
WHEN validation runs
THEN the field shows an inline error message and the form does not submit

GIVEN the user types a ticker in lowercase
WHEN the field renders
THEN the ticker is forced to uppercase automatically

GIVEN the user enters margin and proceeds values
WHEN either value changes
THEN Realized Gain/Loss and Return % are auto-calculated and shown as read-only

GIVEN the user clicks a table row
WHEN the edit dialog opens
THEN all fields are pre-populated with the trade's existing data

GIVEN the user confirms delete inside the edit dialog
WHEN the API responds with 200
THEN the row is removed from the table and summary updates
```

---

#### 3.2.3 Event (`/main/trading/event`)

**Description:** Record and manage market events that affect trading decisions. Events support favoriting, filtering, search, pagination, a detail page, and AI analysis.

**Route:** `/main/trading/event` (list), `/main/trading/event/:id` (detail)

**User Stories:**

> As a user, I want to record market events with links and impact direction, so that I can track what happened and why.

> As a user, I want to filter events by type and search by title or description, so that I can quickly find relevant events.

> As a user, I want to favorite events, so that I can easily revisit the most important ones.

> As a user, I want to open a detail page for each event, so that I can read full notes, view links, and see AI analysis.

**Features:**

- Display all events with pagination (10 per page)
- Search by title and description (case-insensitive)
- Filter: All / Bullish / Bearish / Favorites / Upcoming / Past — persisted to localStorage
- Add event, Edit event, Delete event (soft-delete)
- Favorite toggle per event
- Summary cards: total events, bullish count, bearish count, favorites count
- Event detail page (`/main/trading/event/:id`) with full description (markdown rendered), reference links, tags, AI analysis panel

**Field Definitions:**

| Field            | Required    | Constraints                                                                          |
| ---------------- | ----------- | ------------------------------------------------------------------------------------ |
| Title            | Yes         | 1–100 characters                                                                     |
| Description      | No          | Max 2000 characters, markdown supported                                              |
| Event Type       | No          | Earnings / Central Bank / Macro / Corporate Action / Geopolitical / Personal / Other |
| Impact Direction | Yes         | UP (Bullish) or DOWN (Bearish)                                                       |
| Actual Outcome   | No          | UP or DOWN — what actually happened                                                  |
| Event Date       | Yes         | Stored as `yyyy-MM-dd` string (no timezone shift)                                    |
| Tags             | No          | Array of free-text tag strings                                                       |
| Links            | Yes (min 1) | Array of `{ hyperlink, link }` objects; each link must be a valid URL                |

**Links Sub-Component (`EventLinksInput`):**

- Inline sub-form inside the Add/Edit dialog
- User fills Hyperlink (display label) + Link (URL), presses Add → entry appended to list below
- Each entry in the list can be deleted individually
- No maximum number of links
- Form cannot be submitted if the links list is empty
- On edit, existing links are pre-loaded into the list

**Tags Sub-Component (`EventTagsInput`):**

- Inline free-text tag input inside the Add/Edit dialog
- User types a tag and presses Enter or comma to add it to the tag list
- Each tag can be removed individually
- Tags are stored as a plain string array in the database

**Delete Behavior:**

- Confirmation dialog before delete
- Soft-delete only — sets `deleted_at` on the row; data is not removed from the database
- Delete dialog copy does not mention "archived records" (no restore UI exists)

**Event Detail Page (`/main/trading/event/:id`):**

- Shows event title, impact badge, actual outcome badge (if set), event date, tags
- Markdown-rendered description (left column, ~67% width)
- Right sidebar: Analyze with AI button, reference links
- AI analysis panel below body (if an analysis exists for this event)
- Edit and Delete actions via icon buttons (desktop) or dropdown menu (mobile)
- Not-found state with back button if the event does not exist or is soft-deleted

**UI States:**

| State          | Behavior                                          |
| -------------- | ------------------------------------------------- |
| Loading        | Skeleton on table and summary cards               |
| Empty (all)    | Empty state message                               |
| Empty (filter) | Empty state message specific to the active filter |
| Error          | Toast error if fetch/save/delete fails            |
| Pagination     | Prev/Next buttons + page indicator                |

**API Endpoints:**

| Method | Path                               | Description                                                          |
| ------ | ---------------------------------- | -------------------------------------------------------------------- |
| GET    | `/api/trade/v1/event/list`         | Paginated event list; params: `page`, `limit=10`, `search`, `filter` |
| POST   | `/api/trade/v1/event/create`       | Create event (including links JSONB and tags array)                  |
| PUT    | `/api/trade/v1/event/update/:id`   | Update event (including links JSONB and tags array)                  |
| DELETE | `/api/trade/v1/event/delete/:id`   | Soft-delete event                                                    |
| GET    | `/api/trade/v1/event/summary`      | Summary counts: total, bullish, bearish, favorites                   |
| GET    | `/api/trade/v1/event/:id`          | Fetch single event detail                                            |
| PATCH  | `/api/trade/v1/event/favorite/:id` | Toggle favorite status                                               |
| GET    | `/api/trade/v1/event/tags`         | Fetch all distinct tags for autocomplete                             |

**Links data model (JSONB):**

```json
[
  { "hyperlink": "Reuters article", "link": "https://reuters.com/..." },
  { "hyperlink": "BI Rate Decision", "link": "https://bi.go.id/..." }
]
```

**Acceptance Criteria:**

```
GIVEN the user opens /main/trading/event
WHEN data loads
THEN summary cards and paginated event list are shown

GIVEN the user types in the search bar
WHEN the input changes
THEN events are filtered by title and description match

GIVEN the user selects "Bullish" filter
WHEN the filter is applied
THEN only events with impact_direction = "UP" are shown

GIVEN the user refreshes the page after selecting "Favorites" filter
WHEN the page loads
THEN the Favorites filter is still active (persisted in localStorage)

GIVEN the user clicks "Add Event"
WHEN the form opens and is submitted with all required fields
THEN the event is created and appears in the list

GIVEN the user submits the form with no links added
WHEN validation runs
THEN the form shows a validation error and does not submit

GIVEN the user adds a link entry and both Hyperlink and Link fields are filled
WHEN Add is clicked in EventLinksInput
THEN the entry appears in the list below the input

GIVEN the user selects a date of June 2
WHEN the event is saved and displayed
THEN the stored and displayed date is June 2 (no UTC timezone shift)

GIVEN the user clicks the favorite icon on an event
WHEN the toggle completes
THEN the event's favorite state is flipped and the summary card count updates

GIVEN the user opens a specific event row
WHEN the detail page loads
THEN title, date, impact badge, description (markdown rendered), and reference links are shown

GIVEN the user clicks the delete button and confirms
WHEN the delete completes
THEN the event is soft-deleted and removed from the list; the delete dialog does not mention "archived records"

GIVEN the event list has more than 10 events
WHEN the page renders
THEN pagination controls are shown; Previous is disabled on page 1
```

---

#### 3.2.4 Fee (`/main/trading/fee`)

**Description:** Log and manage trading fees (commissions, admin fees, etc.). Fees are tracked separately from trades and contribute to cost awareness.

**Route:** `/main/trading/fee`
**Main Component:** `app/main/trading/fee/FeesPageClient.jsx`

**User Stories:**

> As a user, I want to log fees I pay to my broker, so that I can account for all trading costs.

> As a user, I want to see a total of all fees paid, so that I can understand how much I spend on trading costs.

**Summary Cards (Fee List):**

| Card      | Value                                    |
| --------- | ---------------------------------------- |
| Fee Count | Total number of fee records              |
| Total Fee | Sum of all `fee` values, formatted as Rp |

**Table Columns:**

| Column   | Field      | Notes                                 |
| -------- | ---------- | ------------------------------------- |
| Fee Date | `fee_date` | Formatted as `dd MMM yyyy`            |
| Fee Name | `fee_name` | Label/description for the fee         |
| Amount   | `fee`      | Right-aligned, red text, Rp formatted |

**Add Fee Form Fields:**

| Field      | Required | Notes                                               |
| ---------- | -------- | --------------------------------------------------- |
| Fee Date   | Yes      | Date picker, defaults to today                      |
| Fee Name   | Yes      | Text input (e.g., "Admin Fee", "Broker Commission") |
| Fee Amount | Yes      | Currency input, must be a positive number           |

**Edit Fee:** Clicking a table row opens `UpdateFee` dialog pre-populated with all fields. Same form layout as Add. Includes a Delete button inside the edit dialog.

**Delete Fee:** Triggered from within the UpdateFee dialog. Shows a confirmation dialog before deleting. Hard-delete (row is removed from the database).

**Validations:**

- `fee_date`: required
- `fee_name`: required, non-empty string
- `fee`: required, must be a positive number

**API Endpoints:**

| Method | Path                           | Description                  |
| ------ | ------------------------------ | ---------------------------- |
| GET    | `/api/trade/v1/fee/list`       | Return all fees for the user |
| GET    | `/api/trade/v1/fee/summary`    | Return fee count and total   |
| POST   | `/api/trade/v1/fee/create`     | Create a new fee record      |
| PUT    | `/api/trade/v1/fee/update/:id` | Update an existing fee       |
| DELETE | `/api/trade/v1/fee/delete/:id` | Delete a fee record          |

**Request body — create/update:**

```json
{
  "fee_name": "Admin Fee",
  "fee": "10000",
  "fee_date": "2026-06-10"
}
```

**Response — create:** `{ "success": true, "fee": { ...feeObject } }` — HTTP 201

**Response — list:** `{ "success": true, "fees": [...] }` — HTTP 200

**Response — summary:**

```json
{
  "success": true,
  "feeCount": 5,
  "totalFee": 50000
}
```

**Error States:**

- Create/update fails: toast error, dialog stays open
- Delete fails: toast error

**UI States:**

| State   | Behavior                                                         |
| ------- | ---------------------------------------------------------------- |
| Loading | Spinner with "Loading fees..." text                              |
| Empty   | "No fees yet. Start by adding your first fee to track expenses!" |
| Loaded  | Table with rows                                                  |

**Acceptance Criteria:**

```
GIVEN the user opens /main/trading/fee
WHEN data loads
THEN summary cards and fee table are shown

GIVEN the user clicks "Add Fee"
WHEN all required fields are filled and the form is submitted
THEN the fee is created, the table refreshes, and summary cards update

GIVEN the user leaves Fee Name or Fee Amount empty and submits
WHEN validation runs
THEN inline error messages appear and the form does not submit

GIVEN the user enters a fee amount of 10000
WHEN the field renders
THEN the value displays as formatted Rp (e.g., Rp 10.000)

GIVEN the user clicks a table row
WHEN the edit dialog opens
THEN all fields are pre-populated with the fee's existing data

GIVEN the user confirms delete inside the edit dialog
WHEN the API responds with 200
THEN the row is removed from the table and summary cards update
```

---

#### 3.2.5 Settings (`/main/trading/settings`)

**Description:** A configuration page for trading metrics parameters. Settings affect how dashboard metrics (Sharpe ratio, TP/SL suggestions, risk calculations) are computed. Settings are stored per user in the `settings` table and upserted on save.

**Route:** `/main/trading/settings`

**User Stories:**

> As a user, I want to set my initial margin, so that my account value and portfolio growth are calculated correctly.

> As a user, I want to set risk-free rates and margin of error, so that Sharpe ratios and TP/SL suggestions reflect my personal parameters.

**Settings Fields:**

| Field                   | Required | Constraints         | Purpose                                                                    |
| ----------------------- | -------- | ------------------- | -------------------------------------------------------------------------- |
| Initial Margin          | Yes      | Non-negative number | Starting capital; used to compute account value and portfolio growth %     |
| BI Risk Free Rate       | Yes      | 0–100 (percent)     | Bank Indonesia reference rate; used in Sharpe ratio (BI) calculation       |
| Personal Risk Free Rate | Yes      | 0–100 (percent)     | User's own target return rate; used in Sharpe ratio (personal) calculation |
| Margin of Error         | Yes      | 0–100 (percent)     | Safety buffer applied to TP/SL suggestions and risk calculations           |

**Behavior:**

- Settings are loaded when the dialog/page opens
- Save triggers an upsert (creates a record if none exists; updates the existing one)
- Success: toast "Settings updated successfully!" and dialog closes
- The Settings page is also accessible via a button on the Dashboard page header

**API Endpoints:**

| Method | Path                            | Description                         |
| ------ | ------------------------------- | ----------------------------------- |
| GET    | `/api/trade/v1/settings`        | Fetch current settings for the user |
| PUT    | `/api/trade/v1/settings/update` | Upsert settings                     |

**Request body — update:**

```json
{
  "initial_margin": 10000000,
  "bi_risk_free_rate": 6.5,
  "personal_risk_free_rate": 8.0,
  "margin_of_error": 10
}
```

**Response — get:**

```json
{
  "success": true,
  "settingsList": {
    "initial_margin": 10000000,
    "bi_risk_free_rate": 6.5,
    "personal_risk_free_rate": 8.0,
    "margin_of_error": 10
  }
}
```

**Validations (server-side):**

- `initial_margin` must be >= 0
- `bi_risk_free_rate` must be between 0 and 100
- `personal_risk_free_rate` must be between 0 and 100
- `margin_of_error` must be between 0 and 100

**Error States:**

- Load fails: toast error; form shows loading state
- Save fails: toast error; dialog stays open

**Acceptance Criteria:**

```
GIVEN the user opens the Settings dialog
WHEN the dialog opens
THEN existing settings are pre-loaded into all fields

GIVEN the user changes the initial margin and saves
WHEN the API responds with 200
THEN the dialog closes and a success toast fires

GIVEN the user enters a BI Risk Free Rate above 100
WHEN the user submits
THEN the server returns a 400 error and the dialog shows a toast error

GIVEN no settings exist yet for the user
WHEN the user saves for the first time
THEN a new settings record is created (upsert behavior)
```

---

#### 3.2.6 Trading AI Chat

**Description:** A floating chat interface powered by Claude Sonnet 4.6 that lets the user ask questions about their trading data in natural language. The AI has full context of the user's trades, fees, events, and settings.

**User Stories:**

> As a user, I want to chat with an AI about my trading data, so that I can get insights without manually computing metrics.

**AI Context Injected at Runtime:**

| Data          | Source             | Limit           |
| ------------- | ------------------ | --------------- |
| Trade list    | `trade_list` table | Most recent 200 |
| Fee list      | `fee_list` table   | Most recent 100 |
| Event list    | `event_list` table | Most recent 50  |
| User settings | `settings` table   | 1 row           |

**AI Capabilities:**

- Calculate win rate and trade counts from real data
- Analyze best and worst individual trades
- Compute total P/L, profit factor, and other metrics on demand
- Compare performance across time periods or tickers
- Suggest areas for improvement based on patterns
- Answer natural language questions about any part of the trading data

**AI Response Rules:**

- Answers only in English
- Uses only the injected data — never fabricates
- Formats currency as Rp (e.g., `+Rp 1,500,000`)
- Uses tables when comparing multiple trades or metrics
- When the user is in a losing streak, provides constructive analysis rather than only negative feedback

**Streaming:** Responses are streamed token-by-token to the frontend (streaming SSE/chunked transfer encoding).

**API Endpoint:**

| Method | Path              | Description                                 |
| ------ | ----------------- | ------------------------------------------- |
| POST   | `/api/trade-chat` | Send a message and stream Claude's response |

**Request body:**

```json
{
  "messages": [{ "role": "user", "content": "What is my win rate this year?" }]
}
```

**Response:** Streaming plain text — `Content-Type: text/plain; charset=utf-8`, `Transfer-Encoding: chunked`

**UI Behavior:**

- Floating chat button accessible from any trading page
- Message history maintained in local component state (not persisted to DB)
- Streaming indicator while AI is responding
- User can send follow-up messages within the same session

**Acceptance Criteria:**

```
GIVEN the user opens the AI chat
WHEN the user types a question about their trades and sends it
THEN the AI response streams in token by token

GIVEN the user asks "What is my win rate?"
WHEN the AI responds
THEN the answer includes the exact win rate computed from the user's real trade data

GIVEN the AI response includes a currency value
WHEN the response is rendered
THEN currency values are shown as Rp formatted (not USD)

GIVEN the user sends a follow-up message in the same session
WHEN the request is sent
THEN prior messages are included in the context so the AI maintains conversation continuity

GIVEN the user has no trades
WHEN the AI is asked about performance
THEN the AI acknowledges there is no data rather than making up numbers
```

---

#### 3.2.7 Trading AI Event Analysis

**Description:** AI-powered analysis of one or more market events. Triggered from the event detail page (single event) or from the event list page (multi-event, when multiple events are selected). The analysis is streamed in real time, persisted after completion, and can be refreshed at any time. A full analysis history modal is also available.

**Route (UI entry points):**

- Event detail page (`/main/trading/event/:id`) — single event analysis
- Event list page (`/main/trading/event`) — multi-event analysis (multi-select)

**User Stories:**

> As a user, I want to analyze a single market event with AI, so that I can understand its likely impact on the market and my trades.

> As a user, I want to analyze multiple events together, so that I can understand combined market dynamics.

> As a user, I want to view past analyses, so that I can compare my previous interpretations over time.

**Analysis Types:**

| Type   | Trigger                                                        | Input                |
| ------ | -------------------------------------------------------------- | -------------------- |
| Single | "Analyze with AI" button on event detail page                  | One `event_id`       |
| Multi  | Bulk-select events on event list page, then "Analyze Selected" | Array of `event_ids` |

**Additional Context (optional):**

Both single and multi analyses accept an optional `additional_context` field (max 500 characters). The user can enter extra context not already in the event description — e.g., "market opened -1.2% today, rupiah weakened past 16.400".

**Content Gate:**

The Analyze button is disabled if the event has no description AND no additional context has been entered. For multi-analysis, at least one selected event must have a description.

**Daily Limit:**

- 50 analyses per day per user (resets at UTC midnight)
- If exceeded, the API returns HTTP 429 with a message to try again after midnight

**Persistence:**

- Each analysis is saved to the `event_ai_analysis` table after the stream completes
- Before saving, the previous analysis for the same event (or same set of event IDs for multi) is soft-deleted
- The event detail page shows the latest cached analysis inline, without needing to re-run it

**Analysis History Modal:**

Accessible from the event list page. Shows the most recent 50 analyses (single and multi) across all events, in reverse chronological order. Each item shows: analysis type (Single/Multi), event title(s), and generated timestamp. Clicking an item shows the full markdown output.

**Streaming Behavior:**

- The POST endpoint streams the AI output as plain text chunks
- The UI renders the streamed markdown progressively using `ReactMarkdown`
- A pulsing cursor indicator shows that streaming is in progress
- If streaming fails mid-way, the error state shows with a Retry button

**UI States — Analysis Modal:**

| State     | Behavior                                                                          |
| --------- | --------------------------------------------------------------------------------- |
| Idle      | Shows event summary, optional context textarea, and Analyze button                |
| Streaming | Shows progressive markdown output, Analyzing... button (disabled), pulsing cursor |
| Complete  | Shows full result, timestamp, and Refresh button                                  |
| Error     | Shows error message and Retry button                                              |

**API Endpoints:**

| Method | Path                                           | Description                                  |
| ------ | ---------------------------------------------- | -------------------------------------------- |
| POST   | `/api/trade/v1/ai/event-analysis`              | Generate a new analysis (streaming response) |
| GET    | `/api/trade/v1/ai/event-analysis?event_id=:id` | Fetch cached analysis for an event           |
| GET    | `/api/trade/v1/ai/event-analysis/history`      | Fetch full analysis history (latest 50)      |

**Request body — single analysis:**

```json
{
  "event_id": 42,
  "additional_context": "Market opened -1.2% today"
}
```

**Request body — multi analysis:**

```json
{
  "event_ids": [42, 43, 44],
  "additional_context": "All three events happened within the same week"
}
```

**Response — POST:** Streaming plain text — `Content-Type: text/plain; charset=utf-8`, `Transfer-Encoding: chunked`. The response is the raw markdown text of the analysis.

**Response — GET (single event cached analysis):**

```json
{
  "data": {
    "single": {
      "id": 1,
      "analysis_type": "single",
      "model": "claude-sonnet-4-6",
      "output_md": "## Analysis\n...",
      "input_tokens": 1200,
      "output_tokens": 450,
      "cost_usd": 0.0021,
      "generated_at": "2026-06-17T10:30:00Z",
      "event_ids": null
    },
    "multi": [
      {
        "id": 2,
        "analysis_type": "multi",
        "event_ids": [42, 43],
        "generated_at": "2026-06-17T11:00:00Z"
      }
    ]
  },
  "message": "OK"
}
```

**Response — GET (history):**

```json
{
  "data": [
    {
      "id": 1,
      "analysis_type": "single",
      "event_id": 42,
      "event_title": "BI Rate Decision",
      "event_titles": [],
      "output_md": "## Analysis\n...",
      "generated_at": "2026-06-17T10:30:00Z"
    },
    {
      "id": 2,
      "analysis_type": "multi",
      "event_ids": [42, 43],
      "event_titles": ["BI Rate Decision", "USD/IDR spike"],
      "output_md": "## Combined Analysis\n...",
      "generated_at": "2026-06-17T11:00:00Z"
    }
  ],
  "message": "OK"
}
```

**Error Responses:**

| Code | Condition                                                                       |
| ---- | ------------------------------------------------------------------------------- |
| 400  | Validation failed (missing event_id / event_ids, no description and no context) |
| 401  | User not authenticated                                                          |
| 403  | Event not found or does not belong to the user                                  |
| 404  | Event not found (single analysis)                                               |
| 429  | Daily cap of 50 analyses exceeded                                               |
| 500  | Internal server error                                                           |

**Acceptance Criteria:**

```
GIVEN the user opens an event detail page with a description
WHEN the user clicks "Analyze with AI"
THEN the EventAnalysisModal opens showing the event summary and an optional context textarea

GIVEN the event has no description and the user has not entered additional context
WHEN the Analyze button is visible
THEN the Analyze button is disabled

GIVEN the user clicks Analyze with an event that has a description
WHEN the analysis starts
THEN the output streams in progressively with a pulsing cursor

GIVEN the stream completes successfully
WHEN the streaming ends
THEN the full markdown output is shown, a generated timestamp appears, and a Refresh button is visible

GIVEN the stream fails mid-way
WHEN the error is caught
THEN an error message and Retry button are shown

GIVEN the user has already run an analysis on this event
WHEN the event detail page loads
THEN the cached analysis is shown inline below the description without re-running

GIVEN the user clicks Refresh Analysis
WHEN the new analysis completes
THEN the previous analysis is soft-deleted and the new result is saved and displayed

GIVEN the user selects multiple events on the event list page and clicks "Analyze Selected"
WHEN the modal opens
THEN all selected events are listed and a multi-event analysis can be triggered

GIVEN the user has generated 50 analyses today
WHEN the user triggers another analysis
THEN the API returns 429 and the modal shows a toast error with a message about the daily limit

GIVEN the user opens the Analysis History modal
WHEN the modal loads
THEN the 50 most recent analyses are listed with type, event title(s), and timestamp

GIVEN the user clicks a history item
WHEN the detail view opens
THEN the full markdown output for that analysis is shown

GIVEN a multi-analysis references event ID 42
WHEN GET /api/trade/v1/ai/event-analysis?event_id=42 is called
THEN both the single analysis for event 42 and any multi-analyses containing event 42 are returned
```

---

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

### Version History

| Version | Date       | Author   | Changes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1.0     | (original) | PM Agent | Initial Indonesian stub — Dashboard, Trade List, Event, Fee, Settings, AI Chat                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 1.1     | 2026-06-17 | PM Agent | Full rewrite in English; complete specs for all 7 sections based on codebase review; added section 3.2.7 (AI Event Analysis)                                                                                                                                                                                                                                                                                                                                                                                 |
| 1.2     | 2026-06-21 | PM Agent | Rewrote section 3.2.1 to reflect the dashboard redesign from issue #424: removed tab structure, documented single-page layout with Overview/Performance/Risk sections; updated API response shape with new fields (profitPerTrade, lossPerTrade, expectedValue, biSharpeRatio, personalSharpeRatio, marginOfError, stdDevRupiah, stdDevComment, bullTP/baseTP/bearTP, bullSL/baseSL/bearSL); documented null handling for profitFactor and payoffRatio; documented Sharpe formula; deprecated Quick View tab |
| 1.3     | 2026-07-17 | PM Agent | Added section 3.2.8 (Stock Valuation page, issue #672): watchlist management, 7-section valuation table (Fundamental, Monte Carlo, Historical PE, P/BV, DCF, Risk, Analyst Consensus), scoring system, caching behavior, all API endpoints, DB tables, and full acceptance criteria                                                                                                                                                                                                                          |
| 1.4     | 2026-07-17 | PM Agent | Added section 3.2.9 (Research page, issue #693): ticker Combobox with portfolio defaults + Finnhub symbol search, Overview tab (analyst recommendation + price target), Technicals tab (RSI, MACD, candlestick patterns), Corporate Events tab (earnings history, insider transactions, upcoming dividend); 4 new API endpoints; coverage note for IDX and Finnhub free plan limitations                                                                                                                     |
