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
