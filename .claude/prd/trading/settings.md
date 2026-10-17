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
