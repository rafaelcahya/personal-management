# PRD — Trading Management Module

> Part of PRD_Personal_Management. Shared standards: [PRD_Shared.md](./PRD_Shared.md)

**Version:** 1.2
**Last Updated:** 2026-06-21

---

### 3.2 Trading Management Module

**Purpose:** Record, analyze, and evaluate stock trading performance. The module covers trade logging, fee tracking, market event management, an AI chat assistant, and AI-powered event analysis.

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

### Version History

| Version | Date       | Author   | Changes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1.0     | (original) | PM Agent | Initial Indonesian stub — Dashboard, Trade List, Event, Fee, Settings, AI Chat                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 1.1     | 2026-06-17 | PM Agent | Full rewrite in English; complete specs for all 7 sections based on codebase review; added section 3.2.7 (AI Event Analysis)                                                                                                                                                                                                                                                                                                                                                                                 |
| 1.2     | 2026-06-21 | PM Agent | Rewrote section 3.2.1 to reflect the dashboard redesign from issue #424: removed tab structure, documented single-page layout with Overview/Performance/Risk sections; updated API response shape with new fields (profitPerTrade, lossPerTrade, expectedValue, biSharpeRatio, personalSharpeRatio, marginOfError, stdDevRupiah, stdDevComment, bullTP/baseTP/bearTP, bullSL/baseSL/bearSL); documented null handling for profitFactor and payoffRatio; documented Sharpe formula; deprecated Quick View tab |
