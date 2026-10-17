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
