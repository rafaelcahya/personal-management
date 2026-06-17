# PRD — Inventory Management Module

> Part of PRD_Personal_Management. Shared standards: [PRD_Shared.md](./PRD_Shared.md)

**Version:** 1.1
**Last Updated:** 2026-06-17

---

### 3.1 Inventory Management Module

**Purpose:** Track household product stock, usage, and consumption history.

---

#### 3.1.0 Inventory Dashboard (`/main/inventory`)

**Description:** The main page of the Inventory module. It gives a full overview of stock conditions and product consumption analytics. The dashboard has 6 summary cards and 11 analytics sections designed to help the user make timely, data-driven restock decisions.

**Route:** `/main/inventory`
**Entry Point:** `app/main/inventory/page.jsx`
**Main Component:** `app/main/inventory/InventoryDashboard.jsx`

**User Stories:**

> As a user, I want to see a high-level overview of my inventory, so that I can quickly understand the current state of my stock without navigating to individual product pages.

> As a user, I want to be alerted when products are running low, so that I can restock before they run out.

> As a user, I want to know how much I spend per product and per category, so that I can make smarter purchasing decisions.

> As a user, I want to see how my spending compares month-over-month, so that I can track whether I'm spending more or less than before.

> As a user, I want to know which products I restock most often, so that I can prioritize them and plan ahead.

> As a user, I want to see how my cost per use has trended over time per product, so that I can evaluate whether my purchasing decisions are improving.

> As a user, I want to know when each product will likely run out, so that I can plan restocks in advance before running out.

> As a user, I want to set a monthly budget per product category and track actual spend against it, so that I can control my spending.

> As a user, I want to see a heatmap of my purchase activity over the past year, so that I can identify spending patterns and seasonal trends.

> As a user, I want to see a composite score for each product combining cost efficiency and usage duration, so that I can identify which products are the best value.

---

##### Summary Cards (6 Cards)

**Description:** 6 summary cards giving a quick overview of the current inventory state. Each card is clickable and navigates to the Product List with a relevant filter applied.

| Card           | Calculation                                            | Data Source    | Filter Applied to Product List |
| -------------- | ------------------------------------------------------ | -------------- | ------------------------------ |
| Total Products | Count of all products (active + inactive, not deleted) | `product_list` | All products                   |
| Active         | Products where `product_status = 'active'`             | `product_list` | Filter: active                 |
| Low Stock      | Products where `quantity ≤ 2` (from `lowStockAlerts`)  | Dashboard API  | Filter: low-stock              |
| Total Stock    | SUM(`quantity`) across all products                    | `product_list` | All products                   |
| In Use         | SUM(`usage_quantity`) across all products              | `product_list` | All products                   |
| Favorites      | Products where `is_favorite = true`                    | `product_list` | Filter: favorites              |

**Notes:**

- The **Active** card shows a sub-label `"of X products"` (X = totalProducts) for quick context
- The **Low Stock** card replaces the old "Inactive" card — its value is `lowStockAlerts.length` (products where `quantity ≤ 2`)
- Clicking a card saves the filter to `localStorage` (`statusFilter` key) then navigates to `/main/inventory/product-list`

**Layout:** Responsive — 2 columns (mobile) → 3 columns (tablet) → 6 columns (desktop)

**Accessibility:**

- Each card is wrapped in a native `<button>` (keyboard accessible: Enter/Space)
- Icons use `aria-hidden="true"` (decorative)
- Focus ring: `focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:ring-offset-2`
- Numbers use `tabular-nums` for stable rendering

**Acceptance Criteria:**

```
GIVEN the user opens /main/inventory
WHEN data loads successfully
THEN 6 summary cards are shown with numbers that reflect the current inventory state

GIVEN data is still loading
WHEN the API hasn't responded yet
THEN each card shows a skeleton/pulse loading state

GIVEN the user clicks the "Active" card
WHEN navigation happens
THEN localStorage["statusFilter"] = "active" and the user is taken to /main/inventory/product-list

GIVEN the user clicks the "Low Stock" card
WHEN navigation happens
THEN localStorage["statusFilter"] = "low-stock" and the user is taken to /main/inventory/product-list

GIVEN the user navigates to a summary card via keyboard (Tab)
WHEN the user presses Enter or Space on the card
THEN navigation happens the same as a mouse click
```

**API:** `GET /api/inventory/v1/product/summary` (Total Products, Active, Total Stock, In Use, Favorites)
`GET /api/inventory/v1/dashboard` → `lowStockAlerts` (for Low Stock count)

---

##### Section 0: Spend This Month vs Last Month

**Description:** A comparison chart showing total spend this month vs last month, including a delta (up/down). Gives the user a quick read on whether they're spending more or less than the previous month.

**Calculation:**

- `thisMonth.total` = SUM(`price`) from `product_quantity` in the current month (format YYYY-MM)
- `lastMonth.total` = SUM(`price`) from `product_quantity` in the previous month
- `delta` = `thisMonth.total - lastMonth.total`
- `deltaPercent` = `(delta / lastMonth.total) * 100` — null if `lastMonth.total = 0`

**Display:**

- Two large numbers: This Month (black) and Last Month (gray)
- Delta badge: red if up (▲), green if down (▼), with percentage
- Bar chart: 2 bars (last month in light purple/gray, this month in dark purple)

**Behavior:**

- Empty state when there's no data at all: "No purchase data yet 📋"

**Acceptance Criteria:**

```
GIVEN there is purchase data for both this month and last month
WHEN the section loads
THEN both numbers are shown along with the delta badge and bar chart

GIVEN this month's total is greater than last month's
WHEN the section loads
THEN the delta badge is red with arrow ▲ and the percentage increase

GIVEN this month's total is less than last month's
WHEN the section loads
THEN the delta badge is green with arrow ▼ and the percentage decrease

GIVEN there is no purchase data at all
WHEN the section loads
THEN show empty state "No purchase data yet 📋"
```

---

##### Section 1: Cost Per Use

**Description:** Shows the cost per unit of usage for each product, helping the user evaluate the economic value of every product and make more rational purchasing decisions.

**Calculation:**

- `total_spent` = SUM(`price`) from `product_quantity` per product
- `total_units` = current `quantity` + total units ever used (from `product_history.depleted_quantity`)
- `cost_per_use` = `total_spent` / `total_units`

**Display:** Table with columns: No, Product (brand + name + type badge), Total Spent, Total Units, Cost/Use, Status

**Behavior:**

- Default: top 5 products with the highest cost per use
- View All: modal `max-w-6xl`, shows all products sorted by `cost_per_use DESC`
- Empty state: "No products yet."

**Acceptance Criteria:**

```
GIVEN there are products with purchase data (product_quantity)
WHEN the Cost Per Use section loads
THEN up to 5 products are shown sorted by cost per use descending

GIVEN the user clicks "View All"
WHEN the modal opens
THEN all products are shown sorted by cost per use DESC

GIVEN no products have purchase data
WHEN the section loads
THEN show empty state "No products yet."
```

---

##### Section 2: Low Stock Alert

**Description:** An early warning for products that are nearly out of stock so the user can restock before running out.

**Trigger:** Products where `quantity ≤ 2` (all statuses, including inactive)

**Display:** Table with columns: No, Product (brand + name + type badge), Status, Stock

**Stock Badge:**
| Condition | Badge |
|-----------|-------|
| `quantity === 0` | Red badge "Out of Stock" |
| `quantity ≤ 2` | Orange badge "Low: X left" |

**Behavior:**

- Default: top 5 products sorted by `quantity ASC` (most critical at the top)
- View All: modal `max-w-2xl`
- Empty state: "All good! Stock levels are healthy 🎉"

**Acceptance Criteria:**

```
GIVEN there are products with quantity ≤ 2
WHEN the Low Stock Alert section loads
THEN those products are shown with the correct badge (red if 0, orange if ≤ 2)

GIVEN a product has quantity = 0
WHEN the section loads
THEN that product appears at the top with the red "Out of Stock" badge

GIVEN all products have quantity > 2
WHEN the section loads
THEN show empty state "All good! Stock levels are healthy 🎉"
```

---

##### Section 3: Most Restocked Products

**Description:** Shows which products the user restocks most often, helping identify the most-consumed products that need extra stock planning.

**Data:** Count of records per product from `product_quantity` + date of last restock

**Display:** Table with columns: No, Product (brand + name + type badge), Last Restock, Restocks (count badge)

**Behavior:**

- Default: top 5 products sorted by `restock_count DESC`
- View All: modal `max-w-2xl`
- Empty state: "No restock history yet 📦"

**Acceptance Criteria:**

```
GIVEN there are products with multiple purchase records in product_quantity
WHEN the Most Restocked section loads
THEN products are shown sorted by restock_count DESC

GIVEN the user clicks "View All"
WHEN the modal opens
THEN all products are shown sorted by restock_count DESC

GIVEN there is no purchase data at all
WHEN the section loads
THEN show empty state "No restock history yet 📦"
```

---

##### Section 4: Monthly Spend by Type

**Description:** Helps the user understand their spending patterns per product per month for better budget planning.

**Data:** Join `product_quantity` (purchase records) with `product_list` (for `product`, `brand`, `type`)

**Period:** Last 6 months

**Granularity:** Per product (not per category) — each row represents 1 product per month

**Display:**

- Header: section title + "This Month" total in the top-right corner (total spend for the current month)
- Grouped list by month — each month has a header, followed by rows per product:
  - Brand (small gray text above)
  - Product name (bold) + type badge next to it
  - Total spent (right-aligned)

**Behavior:**

- Header shows this month's total spend (Rupiah format) in the top right if data exists
- Default: shows first 5 data entries
- View All: modal `max-w-md`, shows all data for 6 months
- Sort: month DESC, `total_spent DESC` within a month
- Empty state: "No purchase data yet 📋"
- Number format: Rupiah (Rp X.XXX.XXX)

**Acceptance Criteria:**

```
GIVEN there is purchase data in the last 6 months
WHEN the Monthly Spend by Type section loads
THEN data is shown grouped by month, per product, sorted from most recent month

GIVEN there is purchase data for the current month
WHEN the section loads
THEN this month's total spend is shown in the top-right corner of the section header

GIVEN the user clicks "View All"
WHEN the modal opens
THEN all 6 months of data are shown per product, sorted by month DESC then total_spent DESC

GIVEN there is no purchase data
WHEN the section loads
THEN show empty state "No purchase data yet 📋"
```

---

##### Section 5: Avg Usage Duration

**Description:** Shows the average duration of a single usage session per product, helping the user estimate when they'll need to restock.

**Calculation:**

- If a product has ≥ 2 history records: average gap between consecutive `start_usage_date` values
- If it has only 1 history record: `(NOW - start_usage_date)` in days

**Display:** Table with columns: No, Product (brand + name + type badge), Avg Duration

**Duration Badge:**
| Condition | Badge |
|-----------|-------|
| `< 30 days` | Red badge (consumed quickly) |
| `30–59 days` | Yellow badge |
| `≥ 60 days` | Green badge (long-lasting) |
| Format | `X days` |

**Behavior:**

- Default: top 5 products sorted by `avg_days DESC`
- View All: modal `max-w-2xl`, subtitle "Sorted by longest average duration"
- Empty state: "Not enough usage data yet 📊"

**Acceptance Criteria:**

```
GIVEN a product has ≥ 2 product_history records
WHEN the Avg Usage Duration section loads
THEN avg duration is calculated from the average gap between consecutive start_usage_date values

GIVEN a product has only 1 product_history record
WHEN the section loads
THEN avg duration is calculated as (NOW - start_usage_date) in days

GIVEN a product has avg duration < 30 days
WHEN the section loads
THEN the badge is red (indicating the product is consumed quickly)

GIVEN no products have usage history data
WHEN the section loads
THEN show empty state "Not enough usage data yet 📊"
```

---

##### Section 6: Avg Cost/Use Over Time (CostPerUseHistory)

**Description:** A chart showing the cumulative cost per use trend for a product over time. Each data point represents one purchase event. Helps the user see whether their cost per use is going up or down with each restock.

**Calculation per data point:**

- `cumulative_spent` = total cumulative spend for the product up to that purchase date
- `total_units` = `current_quantity` + all `product_history.quantity` (units ever consumed)
- `cost_per_use` = `cumulative_spent` / `total_units`
- `delta` = `cost_per_use[i]` - `cost_per_use[i-1]` (change from the previous purchase)
- `delta_percent` = `delta / cost_per_use[i-1] * 100`

**Display:**

- Header: title + product selector dropdown (top right)
- Line chart: x-axis = purchase date, y-axis = cost per use (formatted with k for thousands)
- Hover tooltip: date, purchase price for that event, cumulative cost/use, delta from previous purchase (▲/▼ + Rp + %)

**Behavior:**

- Default: first product in the list (sorted by most purchase points)
- Product selector: all products that have ≥ 1 purchase
- If a product has only 1 purchase: show message "Not enough purchases to show a trend yet."
- Empty state (no products at all): "No purchase history yet 📊"

**Acceptance Criteria:**

```
GIVEN a product has ≥ 2 purchase records
WHEN the Avg Cost/Use Over Time section loads
THEN a line chart is shown with data points per purchase event

GIVEN the user hovers over a data point on the chart
WHEN the tooltip appears
THEN the tooltip shows: date, purchase price, cumulative cost/use, and delta vs previous purchase (▲/▼)

GIVEN the user selects a different product via the selector
WHEN the selector changes
THEN the chart updates to show data for the selected product

GIVEN a product has only 1 purchase record
WHEN that product is selected
THEN show the message "Not enough purchases to show a trend yet."

GIVEN no products have purchase data
WHEN the section loads
THEN show empty state "No purchase history yet 📊"
```

---

##### Section 7: Restock Prediction

**Description:** Predicts when each product will run out based on the average usage duration and current stock. Helps the user plan restocks before running out.

**Calculation:**

- `days_until_empty` = `avg_days × quantity` (rounded to integer)
- `predicted_date` = `today + days_until_empty` in days
- Products with `quantity = 0`: `days_until_empty = 0`, `predicted_date = null`
- Active products without usage history are skipped (cannot be predicted)

**Filter:** Only products with `product_status = 'active'`

**Display:** Table with columns: No, Product (brand + name + type badge), Qty, Est. Empty, Status badge

**Urgency Badge:**
| Condition | Badge |
|-----------|-------|
| `quantity = 0` | Red badge "Out of Stock" |
| `days_until_empty ≤ 7` | Red badge "Critical" |
| `days_until_empty ≤ 14` | Orange badge "Soon" |
| `days_until_empty ≤ 30` | Yellow badge "This Month" |
| `days_until_empty > 30` | Green badge "6+ Months" |

**Behavior:**

- Default: top 5, sorted by `days_until_empty DESC` (longest until empty at the top)
- View All: modal `max-w-2xl`, subtitle "Sorted by most urgent first"
- Empty state: "Not enough usage data to predict 🔍"

**Acceptance Criteria:**

```
GIVEN there are active products with usage history and quantity > 0
WHEN the Restock Prediction section loads
THEN predicted_date is calculated as today + (avg_days × quantity)

GIVEN a product has quantity = 0
WHEN the section loads
THEN the product is shown with the "Out of Stock" badge and no predicted_date

GIVEN an active product has no usage history
WHEN the section loads
THEN that product is not shown (cannot be predicted)
```

---

##### Section 8: Monthly Budget Tracker

**Description:** Lets the user set a monthly budget per product category (`type`) and track actual spend for the current month against that budget.

**Data:**

- Actual spend: aggregate `total_spent` for this month from `monthlySpendByType` per `type`
- Budget settings: `inventory_budget` table (user-defined, persisted to Supabase)

**Display:** List per type with:

- Type name + percentage badge (%) on the left
- Actual spend / budget amount (click to edit inline) on the right
- Progress bar with color coding

**Progress Bar Color:**
| Condition | Color |
|-----------|-------|
| `< 75%` | Violet |
| `75–99%` | Yellow |
| `≥ 100%` | Red (over budget) |

**Inline Edit Budget:**

- Click budget amount → a number input appears
- Press Enter or click "Save" to save
- Press Escape to cancel
- Validation: number ≥ 0

**Behavior:**

- Shows all types that have spend this month OR a budget already set
- Types without a budget show a "Set budget" placeholder button
- Budget is fetched separately from `/api/inventory/v1/budget` (not from the dashboard API)
- Skeleton loading while dashboard or budget data is still loading
- Empty state: "No spend data this month 📋"

**API:**

- `GET /api/inventory/v1/budget` → list of all budget settings per user
- `POST /api/inventory/v1/budget` → upsert budget (body: `{ type, monthly_budget }`)

**Acceptance Criteria:**

```
GIVEN there is spend this month for the type "Skincare"
WHEN the Monthly Budget Tracker section loads
THEN "Skincare" is shown with actual spend and a progress bar

GIVEN the user has not set a budget for a type
WHEN that type is shown
THEN a "Set budget" placeholder button appears instead of a budget amount

GIVEN the user clicks the budget amount and enters a new value
WHEN the user presses Enter or clicks Save
THEN the budget is saved to Supabase and the progress bar updates

GIVEN actual spend ≥ budget
WHEN the section loads
THEN the progress bar is red and the percentage badge shows ≥ 100%
```

---

##### Section 9: Spending Heatmap

**Description:** A daily purchase activity visualization for the last 12 months in a calendar heatmap format (GitHub-style). Helps the user identify spending patterns and seasonal trends.

**Data:** Aggregate `SUM(price)` per day from `product_quantity`, over the last 12 months

**Display:**

- Grid of 52 weeks × 7 days (Sunday–Saturday), rendered left to right
- Month labels above the grid
- Day labels (Mon, Wed, Fri) on the left of the grid
- Legend at the bottom left: "Less → More" with 5 color boxes

**Color Levels (5 levels):**
| Level | Range | Tailwind Color |
|-------|-------|----------------|
| 0 | No spend | `bg-slate-100` |
| 1 | > 0 – < 50k | `bg-violet-200` |
| 2 | 50k – 200k | `bg-violet-400` |
| 3 | 200k – 500k | `bg-violet-600` |
| 4 | > 500k | `bg-violet-800` |

**Hover Tooltip:** Date (dd MMM yyyy) + amount (Rupiah format or "No spend")

**Behavior:**

- Future days are not rendered (left empty)
- Custom implementation — no additional library (pure React + Tailwind + date-fns)
- Loading state: skeleton `h-24` full width
- Position in dashboard: after SpendComparison

**Acceptance Criteria:**

```
GIVEN there is purchase data on a specific date
WHEN the user hovers over that cell in the heatmap
THEN the tooltip shows the date and total spend for that day

GIVEN there is no purchase on a specific day
WHEN the user hovers over that cell
THEN the tooltip shows "No spend" and the cell is bg-slate-100

GIVEN daily total spend > 500k
WHEN the cell renders
THEN the cell is bg-violet-800 (level 4, highest)
```

---

##### Section 10: Product Lifecycle Score

**Description:** A composite score from 0–100 per product that combines cost efficiency (cost per use) and durability (avg usage duration). Helps the user identify the "hero" products in their inventory.

**Calculation:**

- Only products that have **both**: `cost_per_use ≠ null` and `avg_days ≠ null`
- `cost_score` = inverted min-max normalization: `(1 - (cost_per_use - min) / (max - min)) × 100` — lower cost = higher score
- `duration_score` = min-max normalization: `((avg_days - min) / (max - min)) × 100` — longer = higher score
- Edge case: if all products have the same value, score = 100
- `lifecycle_score` = `round(cost_score × 0.5 + duration_score × 0.5)`

**Tier Badge:**
| Score | Tier | Color |
|-------|------|-------|
| ≥ 80 | S | Violet |
| 60–79 | A | Green |
| 40–59 | B | Yellow |
| < 40 | C | Slate |

**Display:** Table with columns: No, Product (brand + name + type badge), Cost/Use, Avg Duration, Tier, Score (progress bar + number)

**Behavior:**

- Default: top 5 sorted by `score DESC`
- View All: modal `max-w-2xl`
- Empty state: "Not enough data to score products 📊"

**Acceptance Criteria:**

```
GIVEN there are ≥ 2 products with both cost_per_use and avg_days
WHEN the Product Lifecycle Score section loads
THEN each product gets a score from 0–100 based on relative normalization within the dataset

GIVEN a product has the highest score in the dataset
WHEN the section loads
THEN that product gets a score close to 100

GIVEN a product has no cost_per_use or no avg_days
WHEN the section loads
THEN that product is not shown

GIVEN only 1 eligible product exists
WHEN the section loads
THEN that product gets a score of 100
```

---

##### Layout & UX

**Section order:**

1. Summary Cards — 2 columns mobile → 3 columns tablet → 6 columns desktop
2. Spend This Month vs Last Month — full width
3. Spending Heatmap — full width
4. Low Stock Alert + Most Restocked — 2-column grid (`md:grid-cols-2`), 1 column on mobile
5. Restock Prediction — full width
6. Monthly Budget Tracker — full width
7. Monthly Spend by Type — full width
8. Cost Per Use — full width
9. Avg Cost/Use Over Time — full width
10. Avg Usage Duration — full width
11. Product Lifecycle Score — full width

**Loading State:** Skeleton rows / pulse animation on all sections while data is loading

**Scrollable:** Layout uses `overflow-y-auto` so the dashboard can be scrolled

**Acceptance Criteria:**

```
GIVEN the user opens the dashboard on a mobile device
WHEN the page renders
THEN summary cards show in 2 columns, Low Stock Alert and Most Restocked show in 1 column (full width)

GIVEN the user opens the dashboard on desktop
WHEN the page renders
THEN summary cards show in 6 columns, Low Stock Alert and Most Restocked show in a 2-column grid

GIVEN the API is still loading data
WHEN the page renders
THEN all sections show a skeleton loading state
```

---

##### Validations

- Dashboard only loads products that have not been soft-deleted (`deleted_at IS NULL`)
- Summary counts and analytics are calculated server-side for data consistency
- `cost_per_use` is only calculated when `total_units > 0` (avoid division by zero)
- `cost_per_use_history` is only calculated when `total_units > 0` (avoid division by zero)

---

##### Error States

| Condition              | Display                                |
| ---------------------- | -------------------------------------- |
| API failure (5xx)      | Generic error message at section level |
| Empty data per section | Section-specific empty state           |
| Loading                | Skeleton animation                     |

---

##### API Endpoints

`GET /api/inventory/v1/dashboard`

- Auth: Required
- Description: Returns all data needed by the dashboard — summary cards + 11 analytics sections
- Response: `{ success: true, data: { summary, top5, all, lowStockAlerts, monthlySpendByType, avgUsageDuration, mostRestocked, spendComparison, costPerUseHistory, restockPrediction, spendingHeatmap, lifecycleScore } }`

`GET /api/inventory/v1/product/summary`

- Auth: Required
- Description: Returns summary counts (total, active, inactive, totalStock, inUse, favorites)
- Response: `{ data: { total, active, inactive, totalStock, inUse, favorites } }`

`GET /api/inventory/v1/budget`

- Auth: Required
- Description: Returns all budget settings for the user per type
- Response: `{ data: [{ type, monthly_budget }] }`

`POST /api/inventory/v1/budget`

- Auth: Required
- Body: `{ type: string, monthly_budget: number }`
- Description: Upsert a budget for one type (insert or update if it already exists)
- Response: `{ success: true }`

`GET /api/inventory/v1/product/restock-predictions` _(implemented — v1.11)_

- Auth: Required
- Description: Returns `days_until_empty` predictions per active product based on average usage interval (avg_days × quantity). Products without usage history are skipped.
- Response: `{ data: [{ product_list_id, days_until_empty, ... }], message: "OK" }`
- Used by: `ProductsPage` to display the `~Xd left` hint in the table

`GET /api/inventory/v1/product/[id]/last-price` _(implemented — v1.11)_

- Auth: Required
- Param: `id` — integer, product_list_id
- Description: Returns the price and date of the last purchase for a specific product
- Response: `{ success: true, data: { last_purchase_price, last_purchase_date } }`
- Error: 400 if ID is invalid; 404 if product not found
- Used by: `AddStockForm` (hint below the Price field)

`GET /api/inventory/v1/product/stock/history/[id]`

- Auth: Required
- Param: `id` — product_list_id
- Description: Returns all purchase/restock history for a specific product, sorted most recent first
- Response: array of `{ id, purchase_date, quantity_added, price, note }`
- Used by: `AddStockForm` (Recent Purchases section) and `ProductDetailPage` (Purchase History table)

---

##### Database Tables Used

| Table              | Relevant Columns                                                                                                                       | Purpose                                                                                               |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `product_list`     | `id`, `user_id`, `product`, `brand`, `type`, `quantity`, `usage_quantity`, `product_status`, `is_favorite`, `usage_date`, `deleted_at` | Main product data                                                                                     |
| `product_quantity` | `product_list_id`, `price`, `purchase_date`                                                                                            | Purchase/restock history for calculating total spent, monthly spend, heatmap, and restock predictions |
| `product_history`  | `product_list_id`, `depleted_quantity`, `start_usage_date`                                                                             | Usage session history for calculating avg duration and lifecycle score                                |
| `inventory_budget` | `id`, `user_id`, `type`, `monthly_budget`, `created_at`, `updated_at`                                                                  | Monthly budget per product category (user-defined, RLS enabled, UNIQUE per user+type)                 |

---

#### 3.1.1 Product List (`/main/inventory/product-list`)

**Description:** The main product management page. Displays all products in a table with search, filter, and per-product actions.

**Route:** `/main/inventory/product-list`
**Entry Point:** `app/main/inventory/product-list/page.jsx`

---

**User Stories:**

> As a user, I want to search products by brand or name, so that I can quickly find a specific product without scrolling through the entire list.

> As a user, I want to filter products by status or stock level, so that I can focus on products that need attention.

> As a user, I want to edit product details, so that I can correct mistakes or update product information.

> As a user, I want to see at a glance which products are out of stock or running low, so that I can prioritize restocking.

> As a user, I want to add stock with the last purchase price visible, so that I can make an informed decision about the price I enter.

> As a user, I want to record when I start using a product, so that I can track usage duration and consumption patterns.

---

**Features & Acceptance Criteria:**

**A. Product Table**

Columns shown:

| Column         | Data                | Alignment | Note                                                                                           |
| -------------- | ------------------- | --------- | ---------------------------------------------------------------------------------------------- |
| Product        | brand + type + name | Left      | Favorite star icon on the left — space is always reserved (visibility:hidden if not favorited) |
| Quantity       | `quantity`          | Right     | Monospace font                                                                                 |
| In Use         | `usage_quantity`    | Right     | Monospace font — number of units currently in use                                              |
| Usage Date     | `usage_date`        | Center    | Format: DD MMM YYYY, "-" if never used                                                         |
| Product Status | `product_status`    | Center    | Badge: active (green) / inactive (red)                                                         |
| Actions        | —                   | Center    | 3-dot dropdown                                                                                 |

```
GIVEN products exist in the database
WHEN the page loads
THEN all products are shown in the table, with favorites at the top
```

**B. Search Bar**

```
GIVEN the user is on the Product List page
WHEN the user types in the search bar
THEN the table filters by brand OR product name (AND with any active filter)
AND filtering happens after a 300ms debounce
AND a clear (×) button appears when there is text

GIVEN the search bar has text
WHEN the user clicks the clear (×) button
THEN the search resets and all products are shown (filter remains active)
```

**C. Filter Dropdown**

Filter options (by status/stock level — separate from text search):

| Filter       | Condition                                         | Group     |
| ------------ | ------------------------------------------------- | --------- |
| All Products | all products                                      | General   |
| Active       | `product_status = 'active'`                       | Status    |
| Inactive     | `product_status = 'inactive'`                     | Status    |
| Favorite     | `is_favorite = true`                              | Status    |
| Low Stock    | `quantity < LOW_STOCK_THRESHOLD AND quantity > 0` | Inventory |
| Out of Stock | `quantity = 0`                                    | Inventory |
| Never Used   | `usage_date IS NULL`                              | Usage     |
| [Type name]  | `product.type === type` (dynamic)                 | Category  |

**Category filter (dynamic):** The dropdown shows a "Category" section listing all unique `product.type` values in the current product list. Filter values use the prefix `"type:"` — e.g. `"type:Skincare"`. Each category item shows the count of products per type.

**Filter counts:** Each dropdown item shows how many products match. The Status group uses data from the `summary` API; Inventory and Usage groups are calculated client-side from the `products` array.

```
GIVEN an active filter + active search together produce 0 products
WHEN the combined result is zero
THEN show empty state: icon 📦 + "No products match your filters"
AND show the active filter label and/or search text
AND show a "Clear filters & search" button to reset both at once

GIVEN there are products with type "Skincare" in the list
WHEN the user opens the filter dropdown
THEN a "Category" section appears with "Skincare" and the product count

GIVEN the user clicks the "Skincare" filter in the Category section
WHEN the filter is applied
THEN only products with type = "Skincare" are shown
AND the filter value is stored as "type:Skincare"
```

**Controls Bar (Search + Filter + Add Button) — Sticky Behavior**

The controls bar uses `sticky top-0 z-10 bg-white` so it stays visible when the user scrolls through the product list. The page scrolls naturally inside `main` (the global scroll container) — there is no separate inner scroll container.

```
GIVEN the Product List has many products (list longer than the viewport)
WHEN the user scrolls down
THEN the controls bar (search, filter dropdown, "+ Add Product" button) stays visible at the top of the page
AND the product table scrolls below it
```

**D. Add Product**

```
GIVEN the user clicks "+ Add Product"
WHEN the form opens (Dialog)
THEN fields shown: Brand (Select, required), Type (Select, required), Product Name (Input, required), Initial Quantity (Number, default 0)

GIVEN all fields are valid
WHEN the user submits
THEN the new product is saved and appears in the table
AND a success toast is shown
```

**E. Edit Product**

```
GIVEN the user clicks "Edit Product" in the action dropdown
WHEN the Dialog opens
THEN fields are pre-filled: Brand (Select), Product Name (Select), Type (Input), Status (Select active/inactive)
AND each field has a guide message below it

GIVEN the changes are valid
WHEN the user clicks "Save Changes"
THEN the product is updated in the table
AND a success toast is shown
AND the Dialog closes
```

UI: Use `<Dialog>` — consistent with all other actions (Add Stock, Record Usage, Delete, Add Product).

**F. Add Stock**

```
GIVEN the user clicks "Add Stock" in the action dropdown
WHEN the Dialog opens
THEN show: Quantity to Add, Price (Rp), Purchase Date, Note (optional)
AND below the Price field show the last purchase price hint (see F.1)
AND above the form fields show the Recent Purchases section (see F.2)

GIVEN quantity_added ≥ 1 and price ≥ 0
WHEN the user submits
THEN stock increases and the history record is saved
```

**F.1 Last Purchase Price Hint (implemented — v1.11)**

When the Add Stock dialog opens, the system calls `GET /api/inventory/v1/product/[id]/last-price` and shows the result below the Price field.

| Condition  | Display                                      |
| ---------- | -------------------------------------------- |
| Loading    | "Loading last price..."                      |
| Data found | "Last purchase price: Rp X.XXX — d MMM yyyy" |
| No data    | "No previous purchase data available"        |

```
GIVEN the user opens the Add Stock dialog for a product that has been bought before
WHEN the last-price API responds
THEN the hint "Last purchase price: Rp X — d MMM yyyy" is shown below the Price field

GIVEN the user opens the Add Stock dialog for a product that has never been bought
WHEN the last-price API responds with no data
THEN the text "No previous purchase data available" is shown
```

**F.2 Recent Purchases Section (implemented — v1.11)**

When the Add Stock dialog opens, the system calls `GET /api/inventory/v1/product/stock/history/[id]` and shows the 3 most recent purchases above the form fields (before Quantity to Add).

Each row shows: date (mono font), qty, price (Rp, id-ID format, mono font).
This section is only shown if there is purchase history (hidden if history is empty).

```
GIVEN the user opens the Add Stock dialog and there is previous purchase history
WHEN the stock-history API responds
THEN the "Recent Purchases" section is shown above the form with up to 3 most recent entries

GIVEN the user opens the Add Stock dialog and there is no purchase history
WHEN the stock-history API responds with empty data
THEN the "Recent Purchases" section is not shown
```

**API for Add Stock:**

- `GET /api/inventory/v1/product/[id]/last-price` — Response: `{ success: true, data: { last_purchase_price, last_purchase_date } }`
- `GET /api/inventory/v1/product/stock/history/[id]` — Response: array of `{ purchase_date, quantity_added, price }`

**G. Record Usage** _(previously called "Update Usage" — renamed for clarity)_

```
GIVEN the user clicks "Record Usage" in the action dropdown
WHEN the dialog opens
THEN the user can record when they started using the product and the quantity being used

GIVEN usage is recorded
WHEN it saves successfully
THEN the "Usage Date" and "In Use" columns in the table update
```

**G.1 Note Display in Usage Log (implemented — v1.11)**

On the product detail page (Usage History), when the user expands a log row, if `item.note` is present it is shown above the `UsageCompletionForm` in a card styled as: label "Note" (text-xs, text-slate-500) and note content (text-sm, text-slate-700).

```
GIVEN a usage log item has a note field with content
WHEN the user expands that row
THEN a "Note" card is shown above the completion form with the note content

GIVEN a usage log item has no note
WHEN the user expands that row
THEN the "Note" card is not shown (conditional rendering)
```

**H. Favorites**

```
GIVEN the user clicks "Add to Favorites" in the action dropdown
WHEN the action succeeds
THEN the product moves to the top of the table
AND the star icon appears in the Product column
AND the menu item changes to "Remove from Favorites"
```

**I. Delete Product**

```
GIVEN the user clicks "Delete Product" in the action dropdown
WHEN a confirmation dialog appears
THEN the user must confirm before the product is deleted (destructive action)

GIVEN the user confirms
WHEN deletion succeeds
THEN the product disappears from the table and a success toast is shown
```

---

**Validations:**

- Brand is required
- Product type is required
- Product name is required
- Quantity cannot be negative
- Quantity to Add must be at least 1
- Price must be at least 0
- Stock reduction cannot exceed available stock

---

**Stock Status & Error States:**

| Condition                                         | Display                                           |
| ------------------------------------------------- | ------------------------------------------------- |
| `quantity = 0`                                    | Red badge "Out of Stock" in the Quantity column   |
| `quantity < LOW_STOCK_THRESHOLD AND quantity > 0` | Yellow badge "Low Stock" in the Quantity column   |
| `quantity ≥ LOW_STOCK_THRESHOLD`                  | Plain number (monospace font)                     |
| `product_status = 'inactive'`                     | Red badge "inactive" in the Product Status column |

**`LOW_STOCK_THRESHOLD` constant (implemented — v1.11):** Default value = `5`. This constant is defined in 3 files:

- `ProductFilterDropdown.jsx` — to calculate the low stock product count in the dropdown
- `ProductsTable.jsx` — for `QuantityBadge` and restock hint display
- `ProductsPage.jsx` — for the "low-stock" filter logic

To change the threshold, update the value in all three files. There are no magic number `5` values scattered outside these constants.

---

**Empty States:**

| Condition                       | Display                                                                                                  |
| ------------------------------- | -------------------------------------------------------------------------------------------------------- |
| No products yet                 | Text "No products yet. Start by adding a new product 🚀"                                                 |
| Search/filter active, 0 results | Icon 📦 + "No products match your filters" + active filter/search info + "Clear filters & search" button |

---

**J. Column Sorting (implemented — v1.11)**

Column headers on the desktop table are clickable to sort ascending/descending. Sorting is done client-side on the already-filtered `products` array.

| Column     | Sort Key                                | Sort Type                        |
| ---------- | --------------------------------------- | -------------------------------- |
| Product    | `brand + product` (combined, lowercase) | String                           |
| Quantity   | `quantity`                              | Numeric                          |
| In Use     | `usage_quantity`                        | Numeric                          |
| Usage Date | `usage_date` (timestamp)                | Date — null always at the bottom |

Product Status and Actions columns are not sortable.

UI: Sortable headers show an `ArrowUpDown` icon (inactive) → `ArrowUp` (asc) → `ArrowDown` (desc). Clicking the same column again reverses the sort direction.

```
GIVEN the user clicks the "Quantity" column header
WHEN the sort is applied
THEN products are sorted ascending by quantity
AND the header icon changes to ArrowUp

GIVEN the user clicks the "Quantity" header again
WHEN the sort is reversed
THEN products are sorted descending by quantity
AND the header icon changes to ArrowDown

GIVEN a product has usage_date = null
WHEN sorting by usage_date (ascending or descending)
THEN products without a usage_date always appear at the bottom
```

**K. Restock Prediction Hint in Table (implemented — v1.11)**

Below the `QuantityBadge` in the Quantity column (desktop) and in the stats row (mobile), a time-until-empty prediction is shown per active product when data is available.

Format: `~Xd left` (mono font)

| Condition                                | Display                              |
| ---------------------------------------- | ------------------------------------ |
| `days_until_empty ≤ 7`                   | Orange text (`text-orange-500`)      |
| `days_until_empty > 7`                   | Muted text (`text-muted-foreground`) |
| `quantity = 0`                           | Not shown                            |
| No prediction available for this product | Not shown                            |

Data is fetched via `GET /api/inventory/v1/product/restock-predictions` on first page load, stored as a map `{ [product_list_id]: { days_until_empty } }` in `ProductsPage` state.

```
GIVEN an active product has restock prediction data
WHEN the Product List page loads
THEN "~Xd left" is shown below the QuantityBadge in the Quantity column

GIVEN days_until_empty = 5 (≤ 7) for a product
WHEN the table renders
THEN the text "~5d left" is shown in orange

GIVEN a product has quantity = 0
WHEN the table renders
THEN the prediction hint is not shown for that product
```

**L. Summary Cards — Clickable to Filter (implemented — v1.11)**

Cards in `ProductListSummary` that have a `filterValue` are clickable to directly apply a filter to the table. Cards without a filterValue (Total Stock, In Use) are not clickable.

| Card           | Filter Value | Clickable |
| -------------- | ------------ | --------- |
| Total Products | `null` (all) | Yes       |
| Active         | `"active"`   | Yes       |
| Inactive       | `"inactive"` | Yes       |
| Total Stock    | —            | No        |
| In Use         | —            | No        |
| Favorites      | `"favorite"` | Yes       |

UI: Clickable cards get `cursor-pointer` and `hover:shadow-md transition-shadow`. Same behavior applies on the mobile collapsible view.

```
GIVEN the user clicks the "Active" card in ProductListSummary
WHEN the filter is applied
THEN the table filters to show only active products
AND a toast "Showing active products" appears

GIVEN the user clicks the "Favorites" card
WHEN the filter is applied
THEN the table filters to show only favorite products

GIVEN the user clicks the "Total Stock" card
WHEN there is no filterValue
THEN no action is taken (card is not clickable)
```

**Action Dropdown per Product (order):**

1. Edit Product _(new)_
2. Add Stock
3. Record Usage _(previously: Update Usage)_
4. — separator —
5. Add to Favorites / Remove from Favorites
6. — separator —
7. Delete Product _(only shown if not yet deleted)_

---

#### 3.1.2 Product Brand (`/main/inventory/product-brand`)

**Description:** This is the master data page for product brands. Brands are used as a foreign key in `product_list`, so every brand needs to have a unique name per user. You also can't delete a brand while it's still being used by active products — that would break your product data.

**Route:** `/main/inventory/product-brand`

**What it does:**

- Show all brands along with how many active products are using each one (`product_count`)
- Add a new brand (with a uniqueness check)
- Edit a brand name (also checks uniqueness, but skips the brand itself when checking)
- Delete a brand — only allowed if no active products are using it

---

**User Stories:**

> As a user, I want to see all my product brands in one place, so that I can manage and maintain my brand master data.

> As a user, I want to know how many active products use each brand, so that I can make informed decisions before editing or deleting a brand.

> As a user, I want to be prevented from creating a duplicate brand name, so that my brand list stays clean and unambiguous.

> As a user, I want to be prevented from deleting a brand that is still in use by active products, so that I don't accidentally break product data integrity.

> As a user, I want to see a clear warning when a brand cannot be deleted, so that I understand why the delete action is disabled before I try.

---

**Acceptance Criteria:**

**A. Show Brand List**

Each brand shows its name and how many active products are using it (`product_count`). The count comes from joining `product_brand` with `product_list`, counting only products where `deleted_at IS NULL`.

```
GIVEN the user opens /main/inventory/product-brand
WHEN data loads successfully
THEN all brands are shown, each with their product_count

GIVEN data is still loading
WHEN the API hasn't responded yet
THEN show a loading state (skeleton or spinner)

GIVEN no brands have been saved yet
WHEN the page loads
THEN show an appropriate empty state
```

**B. Add a New Brand**

```
GIVEN the user opens the add brand form and types a brand name
WHEN that name already exists (case-insensitive) and isn't soft-deleted
THEN the API returns HTTP 409 and the form shows "Brand name already exists"

GIVEN the user types a brand name that doesn't exist yet
WHEN the user submits the form
THEN the new brand is saved and appears in the list with product_count = 0
AND a success toast is shown

GIVEN the user submits the form with an empty brand name
WHEN frontend validation runs
THEN the form doesn't submit and shows "Brand name is required"
```

**C. Edit a Brand Name**

```
GIVEN the user opens the edit modal and changes the name to one already used by another brand
WHEN the user submits the form
THEN the API returns HTTP 409 and the form shows "Brand name already exists"

GIVEN the user opens the edit modal and saves without changing the name
WHEN the user submits the form
THEN there's no conflict — the update goes through (the API excludes the brand itself from the uniqueness check)

GIVEN the user changes the brand name to something genuinely new
WHEN the user submits the form
THEN the brand is updated in the list and a success toast is shown
```

**D. Delete Brand — Guard: Brand Still in Use**

This is a P0 validation. The delete button is disabled upfront — not after a failed attempt.

```
GIVEN the user opens the edit modal for a brand with product_count > 0
WHEN the modal opens
THEN a warning box appears below the Note field with the message:
     "Brand is still used by X product(s) and cannot be deleted."
AND the delete button is disabled (opacity-40, cursor-not-allowed)

GIVEN the user opens the edit modal for a brand with product_count = 0
WHEN the modal opens
THEN no warning box is shown
AND the delete button is active and clickable

GIVEN a brand has product_count > 0 and the delete API is called directly (bypassing the UI)
WHEN the deleteProductBrand service runs
THEN it throws an error with status 409 and message "Brand is still used by X product(s) and cannot be deleted"
AND the API route returns HTTP 409

GIVEN the user confirms deletion of a brand with product_count = 0
WHEN it succeeds
THEN the brand disappears from the list and a success toast is shown
```

---

**Validations:**

| Rule                                                                                 | Scope           | How it's enforced                                                                    |
| ------------------------------------------------------------------------------------ | --------------- | ------------------------------------------------------------------------------------ |
| Brand name is required                                                               | Create + Update | Frontend form validation                                                             |
| Brand name must be unique (case-insensitive, excluding soft-deleted)                 | Create          | Backend service — HTTP 409 if duplicate                                              |
| Brand name must be unique (case-insensitive, excluding self, excluding soft-deleted) | Update          | Backend service — HTTP 409 if it conflicts with another brand                        |
| Can't delete a brand that's still used by active products                            | Delete          | Backend service — HTTP 409; Frontend — delete button disabled if `product_count > 0` |

---

**Error States:**

| Situation                                            | Layer                 | What the user sees                                    |
| ---------------------------------------------------- | --------------------- | ----------------------------------------------------- |
| Brand name already taken (create)                    | Backend → Frontend    | Form error: "Brand name already exists"               |
| Brand name conflicts with another brand (update)     | Backend → Frontend    | Form error: "Brand name already exists"               |
| Brand is still used by products (delete via UI)      | Frontend (preventive) | Red warning box in modal + delete button disabled     |
| Brand is still used by products (delete bypasses UI) | Backend → Frontend    | HTTP 409 + `toast.error(err.message)` as a safety net |
| API fails (5xx)                                      | Backend → Frontend    | Generic error toast                                   |

**Warning Box — Visual Spec (Edit modal):**

- Position: below the Note field
- Style: red border, light red background
- Icon: `AlertCircle` in the top-left, red color
- Text: `"Brand is still used by X product(s) and cannot be deleted."` (X = `product_count`)
- Render condition: `isInUse && !isDeleted` where `isInUse = product_count > 0`

---

**API Endpoints:**

`GET /api/inventory/v1/product-brand`

- Auth: Required
- What it does: Returns all brands for the user, each with a `product_count` (number of active products using that brand)
- Implementation: `Promise.all` — fetch `product_brand` + `product_list` (active only) in parallel, then merge the results
- Response: `{ data: [{ id, brand, brand_status, product_count, ... }] }`

`GET /api/inventory/v1/product-brand/[id]`

- Auth: Required
- Param: `id` — integer, brand ID
- What it does: Returns a single brand record by ID
- Response: `{ success: true, data: { id, brand, brand_status, product_count, ... } }`
- Error: 404 if brand not found or does not belong to the user

`GET /api/inventory/v1/product-brand/summary`

- Auth: Required
- What it does: Returns aggregate stats — total brand count, count per status
- Response: `{ success: true, data: { total: number, active: number, inactive: number } }`

`POST /api/inventory/v1/product-brand`

- Auth: Required
- Body: `{ brand: string }`
- Validation: uniqueness check — query `product_brand` where `brand ilike newName AND user_id = userId AND brand_status != 'deleted'`
- Success response: `{ data: {...}, message: "Brand created" }` (201)
- Error response: HTTP 409 `{ error: "CONFLICT", message: "Brand name already exists" }` if duplicate

`PUT /api/inventory/v1/product-brand/[id]`

- Auth: Required
- Param: `id` — integer, brand ID
- Body: `{ brand: string }`
- Validation: same uniqueness check as create, but adds `.neq("id", id)` to exclude the current brand from the check
- Success response: `{ data: {...}, message: "Brand updated" }` (200)
- Error response: HTTP 409 `{ error: "CONFLICT", message: "Brand name already exists" }` if conflict

`DELETE /api/inventory/v1/product-brand/[id]`

- Auth: Required
- Param: `id` — integer, brand ID
- Guard: query `product_list` where `brand_id = id AND user_id = userId AND deleted_at IS NULL` — if any records exist, throw 409
- Implementation: soft-delete (set `brand_status = 'deleted'` or equivalent)
- Success response: `{ message: "Brand deleted" }` (200)
- Error response: HTTP 409 `{ error: "CONFLICT", message: "Brand is still used by X product(s) and cannot be deleted" }` if still in use

---

**Database Tables:**

| Table           | Relevant columns                          | What it's used for                                  |
| --------------- | ----------------------------------------- | --------------------------------------------------- |
| `product_brand` | `id`, `user_id`, `brand`, `brand_status`  | Brand master data                                   |
| `product_list`  | `id`, `brand_id`, `user_id`, `deleted_at` | Used to calculate `product_count` and guard deletes |

---

**New Features — implemented v1.13**

---

**E. Search Bar**

There's a text input on the left side of the controls bar. Placeholder: "Search brands...". Filtering is purely client-side — it filters the already-fetched brand list by checking if the `brand` name contains the search query (case-insensitive substring match). All three client-side filters (search, status filter, sort) are applied together in one pass, so they all work in combination without any conflicts.

The input has a clear (X) button that appears when the query is non-empty. Clicking it resets the search to empty.

**User Story:**

> As a user, I want to search for a brand by name, so that I can quickly find the one I'm looking for without scrolling through the whole list.

```
GIVEN the user types in the search box
WHEN a query is present
THEN the table shows only brands whose name contains that query (case-insensitive)
AND the status filter and sort still apply on top of the search results

GIVEN the query is non-empty
WHEN the clear (X) button is clicked
THEN the search resets and all brands matching the current filter/sort are shown again
```

---

**F. Product Count Badge on Table**

A new "Products" column sits between the Status and Notes columns in the table. Each row shows a badge displaying the brand's `product_count`.

- Badge is **blue** when `product_count > 0`
- Badge is **gray** when `product_count === 0`
- When `product_count > 0`, the badge is **clickable** — clicking it navigates to `/main/inventory/product-list?brand=<brandName>`, which pre-populates the product list search with that brand name so the user lands directly on filtered results

**User Story:**

> As a user, I want to see how many products use each brand at a glance, so that I can click through to that brand's products without manually searching.

```
GIVEN the brand list is loaded
WHEN product_count > 0
THEN the badge is blue and clickable

GIVEN the user clicks a blue product count badge
WHEN the click is handled
THEN the user is navigated to /main/inventory/product-list?brand=<brandName>

GIVEN product_count === 0
WHEN the badge renders
THEN it is gray and not clickable (no navigation)
```

---

**G. Filter & Sort Dropdown (merged)**

The old separate Filter and Sort controls are now merged into a single "Filter & Sort" dropdown button. The button uses a `SlidersHorizontal` icon. Inside the dropdown there are two distinct sections:

- **Filter section** — same status filter as before (Active / Inactive / Deleted / All)
- **Sort section** — four options: A → Z (default), Z → A, Most products first, Fewest products first

Each section has its own Clear/Reset button inside the dropdown so the user can reset filter and sort independently.

The button shows a small violet badge dot in the top-right corner counting how many active filters or non-default sort options are currently applied. So if the user has a status filter active and a non-default sort, the dot shows "2".

**User Stories:**

> As a user, I want to filter and sort brands in one place, so that the controls bar stays clean and easy to use.

> As a user, I want to sort brands by name or product count, so that I can find what I need faster.

> As a user, I want to know at a glance whether any filters or non-default sorts are active, so that I'm not confused about why I'm seeing fewer results.

```
GIVEN the Filter & Sort dropdown is opened
WHEN the user selects a sort option
THEN the brand list re-sorts accordingly (client-side)
AND the dropdown badge counter increments if the selected sort is non-default

GIVEN the user has an active filter or non-default sort
WHEN they click the section-level Clear/Reset button inside the dropdown
THEN only that section (filter or sort) resets — the other section is unchanged

GIVEN no filters are active and sort is at default (A → Z)
WHEN the dropdown button renders
THEN no badge dot is shown
```

---

**H. Bulk Status Change**

Each table row has a checkbox in the leftmost column. The table header has a select-all checkbox that toggles all visible rows at once.

When 1 or more rows are checked, a bulk action bar appears above the table showing:

- "X selected" label
- "Set Active" button
- "Set Inactive" button
- "Deselect All" button

Clicking Set Active or Set Inactive loops through all selected brands and calls the PUT update API for each one with the appropriate `brand_status`. When all calls finish, a toast summary appears: "X brands updated". After that, the selection clears and the list refreshes.

**User Stories:**

> As a user, I want to change the status of multiple brands at once, so that I don't have to open each edit modal individually.

> As a user, I want to see a summary of how many brands were updated, so that I know the bulk action finished successfully.

```
GIVEN the user checks one or more rows
WHEN at least 1 row is selected
THEN the bulk action bar appears above the table with Set Active, Set Inactive, and Deselect All buttons

GIVEN the user clicks Set Active or Set Inactive
WHEN all update API calls complete
THEN a success toast shows "X brands updated"
AND the selection is cleared
AND the list refreshes

GIVEN the user clicks Deselect All
WHEN the click is handled
THEN all checkboxes are unchecked and the bulk action bar disappears

GIVEN the user checks the header checkbox
WHEN it is checked
THEN all visible rows are selected
WHEN it is unchecked
THEN all rows are deselected
```

---

**I. Edit Button on Table Row**

Each row has a pencil icon button at the rightmost end. Clicking it opens the edit modal — same modal that row-click already opens. The row-click behavior is preserved alongside the explicit button, so both ways work.

**User Story:**

> As a user, I want a visible edit button on each row, so that I can open the edit modal without having to know to click the row itself.

```
GIVEN the brand list is showing
WHEN the user clicks the pencil icon on a row
THEN the edit modal opens for that brand (same behavior as clicking the row)
```

---

**J. Restore Deleted Brand**

When the user opens the edit modal for a brand whose `brand_status` is `"deleted"`, the modal footer shows a green **"Restore Brand"** button instead of the Delete button.

Clicking Restore calls the PUT update API with `brand_status: 'active'`, shows a success toast, and refreshes the list. The brand is then back in the active list.

**User Stories:**

> As a user, I want to restore a brand I previously deleted, so that I can bring it back without having to recreate it from scratch.

```
GIVEN the user opens the edit modal for a deleted brand
WHEN the modal opens
THEN a green "Restore Brand" button is shown in the footer (no Delete button)

GIVEN the user clicks Restore Brand
WHEN the API call succeeds
THEN a success toast is shown
AND the list refreshes with the brand now showing as active
```

---

**K. Empty State**

When there are no brands to show (either the list is genuinely empty or all results are filtered out), the page shows:

- `PackageOpen` icon
- "No brands yet" title
- A short subtitle with context
- An "Add Brand" CTA button (not just plain text)

This replaces the old plain-text empty state.

**User Story:**

> As a user, I want a helpful empty state when there are no brands, so that I know what to do next instead of staring at a blank table.

```
GIVEN the brand list is empty (or all filtered out)
WHEN the table would render with zero rows
THEN the PackageOpen icon, "No brands yet" heading, subtitle, and Add Brand button are shown instead of the table
```

---

**L. Loading Skeleton**

While the brand list data is loading (API hasn't responded yet), the page shows a skeleton table instead of a spinner or blank space. The skeleton includes:

- A header row matching the real table columns
- 5 body rows with placeholder blocks matching the real column widths
- Built using the shadcn `Skeleton` component

This replaces any generic spinner or blank state during load.

**User Story:**

> As a user, I want to see a table-shaped skeleton while data loads, so that the page feels fast and stable rather than jumping from blank to populated.

```
GIVEN the API call is in progress
WHEN the component renders
THEN a skeleton table (1 header + 5 body rows) is shown with column widths matching the real table

GIVEN the API responds
WHEN data is ready
THEN the skeleton is replaced by the real brand list
```

---

**M. Layout Alignment to Product List**

The controls bar and page card structure of the Brand page is now aligned with the Product List page for visual consistency:

- Controls bar structure: search input (left, full-width on mobile, `max-w-xs` on desktop) + Filter & Sort button + Add Brand button (right, `shrink-0`)
- Controls bar is `sticky top-0` using CSS sticky — no IntersectionObserver
- Same card structure as Product List: Title section → Controls bar → Table area

No new user stories for this — it's a layout consistency improvement that makes the two pages feel like they belong to the same product.

---

#### 3.1.3 Product Name (`/main/inventory/product-name`)

**Description:** This is the master data page for product names (types). Product names are used as a foreign key in `product_list`, so every name needs to be unique per user. You also can't delete a product name while it's still being used by active products — that would break your product data.

**Route:** `/main/inventory/product-name`

**What it does:**

- Show all product names along with how many active products are using each one (`product_count`)
- Add a new product name (with a uniqueness check)
- Edit a product name (also checks uniqueness, but skips itself when checking)
- Delete a product name — only allowed if no active products are using it

---

**User Stories:**

> As a user, I want to see all my product names in one place, so that I can manage and maintain my product name master data.

> As a user, I want to know how many active products use each product name, so that I can make informed decisions before editing or deleting a name.

> As a user, I want to be prevented from creating a duplicate product name, so that my name list stays clean and unambiguous.

> As a user, I want to be prevented from deleting a product name that is still in use by active products, so that I don't accidentally break product data integrity.

> As a user, I want to see a clear warning when a product name cannot be deleted, so that I understand why the delete action is disabled before I try.

---

**Acceptance Criteria:**

**A. Show Product Name List**

Each product name shows its name and how many active products are using it (`product_count`). The count comes from joining `product_name` with `product_list`, counting only products where `deleted_at IS NULL`.

```
GIVEN the user opens /main/inventory/product-name
WHEN data loads successfully
THEN all product names are shown, each with their product_count

GIVEN data is still loading
WHEN the API hasn't responded yet
THEN show a loading state (skeleton or spinner)

GIVEN no product names have been saved yet
WHEN the page loads
THEN show an appropriate empty state
```

**B. Add a New Product Name**

```
GIVEN the user opens the add product name form and types a name
WHEN that name already exists (case-insensitive) and isn't soft-deleted
THEN the API returns HTTP 409 and the form shows "Product name already exists"

GIVEN the user types a name that doesn't exist yet
WHEN the user submits the form
THEN the new product name is saved and appears in the list with product_count = 0
AND a success toast is shown

GIVEN the user submits the form with an empty name
WHEN frontend validation runs
THEN the form doesn't submit and shows "Product name is required"
```

**C. Edit a Product Name**

```
GIVEN the user opens the edit modal and changes the name to one already used by another product name
WHEN the user submits the form
THEN the API returns HTTP 409 and the form shows "Product name already exists"

GIVEN the user opens the edit modal and saves without changing the name
WHEN the user submits the form
THEN there's no conflict — the update goes through (the API excludes the product name itself from the uniqueness check)

GIVEN the user changes the name to something genuinely new
WHEN the user submits the form
THEN the product name is updated in the list and a success toast is shown
```

**D. Delete Product Name — Guard: Name Still in Use**

This is a P0 validation. The delete button is disabled upfront — not after a failed attempt.

```
GIVEN the user opens the edit modal for a product name with product_count > 0
WHEN the modal opens
THEN a warning box appears below the Note field with the message:
     "Product name is still used by X product(s) and cannot be deleted."
AND the delete button is disabled (opacity-40, cursor-not-allowed)

GIVEN the user opens the edit modal for a product name with product_count = 0
WHEN the modal opens
THEN no warning box is shown
AND the delete button is active and clickable

GIVEN a product name has product_count > 0 and the delete API is called directly (bypassing the UI)
WHEN the deleteProductName service runs
THEN it throws an error with status 409 and message "Product name is still used by X product(s) and cannot be deleted"
AND the API route returns HTTP 409

GIVEN the user confirms deletion of a product name with product_count = 0
WHEN it succeeds
THEN the product name disappears from the list and a success toast is shown
```

---

**Validations:**

| Rule                                                                                   | Scope           | How it's enforced                                                                    |
| -------------------------------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------ |
| Product name is required                                                               | Create + Update | Frontend form validation                                                             |
| Product name must be unique (case-insensitive, excluding soft-deleted)                 | Create          | Backend service — HTTP 409 if duplicate                                              |
| Product name must be unique (case-insensitive, excluding self, excluding soft-deleted) | Update          | Backend service — HTTP 409 if it conflicts with another name                         |
| Can't delete a product name that's still used by active products                       | Delete          | Backend service — HTTP 409; Frontend — delete button disabled if `product_count > 0` |

---

**Error States:**

| Situation                                                   | Layer                 | What the user sees                                    |
| ----------------------------------------------------------- | --------------------- | ----------------------------------------------------- |
| Product name already taken (create)                         | Backend → Frontend    | Form error: "Product name already exists"             |
| Product name conflicts with another name (update)           | Backend → Frontend    | Form error: "Product name already exists"             |
| Product name is still used by products (delete via UI)      | Frontend (preventive) | Red warning box in modal + delete button disabled     |
| Product name is still used by products (delete bypasses UI) | Backend → Frontend    | HTTP 409 + `toast.error(err.message)` as a safety net |
| API fails (5xx)                                             | Backend → Frontend    | Generic error toast                                   |

**Warning Box — Visual Spec (Edit modal):**

- Position: below the Note field
- Style: red border, light red background
- Icon: `AlertCircle` in the top-left, red color
- Text: `"Product name is still used by X product(s) and cannot be deleted."` (X = `product_count`)
- Render condition: `isInUse && !isDeleted` where `isInUse = product_count > 0`

---

**API Endpoints:**

`GET /api/inventory/v1/product-name/list`

- Auth: Required
- What it does: Returns all product names for the user, each with a `product_count` (number of active products using that name)
- Implementation: `Promise.all` — fetch `product_name` + `product_list` (active only, `deleted_at IS NULL`) in parallel, then merge the results
- Response: `{ data: [{ id, product_name, product_name_status, product_count, note, ... }] }`

`POST /api/inventory/v1/product-name/create`

- Auth: Required
- Body: `{ product_name: string }`
- Validation: uniqueness check — query `product_name` where `product_name ilike newName AND user_id = userId AND product_name_status != 'deleted'`
- Success response: `{ success: true, productName: {...} }` (201)
- Error response: HTTP 409 `{ error: "CONFLICT", message: "Product name already exists" }` if duplicate

`PUT /api/inventory/v1/product-name/update/[id]`

- Auth: Required
- Param: `id` — integer, product name ID
- Body: `{ product_name: string, product_name_status: string }`
- Validation: same uniqueness check as create, but adds `.neq("id", id)` to exclude the current record from the check
- Success response: `{ success: true, productName: {...} }` (200)
- Error response: HTTP 409 `{ error: "CONFLICT", message: "Product name already exists" }` if conflict

`DELETE /api/inventory/v1/product-name/delete/[id]`

- Auth: Required
- Param: `id` — integer, product name ID
- Guard: query `product_list` where `product_name_id = id AND user_id = userId AND deleted_at IS NULL` — if any records exist, throw 409
- Implementation: soft-delete (set `product_name_status = 'deleted'`, set `deleted_at`)
- Success response: `{ success: true, data: {...} }` (200)
- Error response: HTTP 409 `{ error: "CONFLICT", message: "Product name is still used by X product(s) and cannot be deleted" }` if still in use

`GET /api/inventory/v1/product-name/summary`

- Auth: Required
- What it does: Returns aggregate stats — total count of product names, count per status
- Response: `{ success: true, data: { totalProductNames: number, totalStatus: { active: number, inactive: number, deleted: number } } }`

`GET /api/inventory/v1/product-name/[id]`

- Auth: Required
- Param: `id` — integer, product name ID
- What it does: Returns a single product name record
- Response: `{ success: true, data: {...} }`

---

**Database Tables:**

| Table          | Relevant columns                                                             | What it's used for                                  |
| -------------- | ---------------------------------------------------------------------------- | --------------------------------------------------- |
| `product_name` | `id`, `user_id`, `product_name`, `product_name_status`, `note`, `deleted_at` | Product name master data                            |
| `product_list` | `id`, `product_name_id`, `user_id`, `deleted_at`                             | Used to calculate `product_count` and guard deletes |

---

**Implemented Features (P1 — delivered v1.16):**

---

**E. Search Bar**

Client-side substring filter on product name. Works in combination with the sort dropdown.

> As a user, I want to type into a search box and instantly see only the product names that match, so that I can find a specific name without scrolling.

```
GIVEN the user is on /main/inventory/product-name
WHEN the user types into the search box
THEN the table filters in real time to show only rows where the product name contains the typed text (case-insensitive)

GIVEN the search box has text in it
WHEN the user clicks the clear (X) button
THEN the search input clears and all product names are shown again
```

- Component files: `ProductNamesPageClient.jsx`, `ProductNamesTable.jsx`
- Key IDs: `searchInput_productNamePage`, `clearSearchBtn_productNamePage`

---

**F. Sort Controls**

Sort dropdown with 4 options (A→Z default, Z→A, most products, fewest products). Works in combination with search.

> As a user, I want to sort product names by name or by how many products use them, so that I can quickly spot the most-used or alphabetically adjacent names.

```
GIVEN the user opens the sort dropdown
WHEN the user selects a sort option
THEN the table reorders immediately — A→Z (default), Z→A, most products first, fewest products first

GIVEN a non-default sort is active
WHEN the user clicks the reset button inside the dropdown
THEN the sort returns to A→Z (default)
```

- Component files: `ProductNameFilterDropdown.jsx`, `ProductNamesTable.jsx`
- Key IDs: `filterSortBtn_productNamePage`, `sortOption_*_productNamePage` (e.g. `sortOption_az_productNamePage`), `resetSortBtn_productNamePage`

---

**G. Edit Button Per Row**

Each table row has an explicit pencil icon button to open the edit modal, in addition to the existing row-click behavior.

> As a user, I want a clear edit button on each product name row, so that I don't have to guess that clicking the row opens the edit modal.

```
GIVEN the user is viewing the product names table
WHEN the user clicks the pencil icon on a row
THEN the edit modal opens for that product name
```

- Component file: `ProductNamesTable.jsx`
- ID pattern: `editProductNameBtn_{id}_productNamePage` (e.g. `editProductNameBtn_42_productNamePage`)

---

**H. Restore Deleted Product Name**

When the edit modal is opened for a soft-deleted product name, a green Restore button appears instead of Delete.

> As a user, I want to restore a soft-deleted product name, so that I can bring it back without having to recreate it.

```
GIVEN the user opens the edit modal for a product name with status = 'deleted'
WHEN the modal opens
THEN a green "Restore" button is shown instead of the Delete button

GIVEN the user clicks the Restore button
WHEN the PUT request succeeds
THEN the product name status is set back to 'active'
AND a success toast shows: "Product name restored successfully!"
AND the modal closes
```

- Component file: `UpdateProductName.jsx`
- Key ID: `restoreProductNameBtn_productNamePage`
- Success toast: `"Product name restored successfully!"`

---

**I. Loading Skeleton**

While the product name list is fetching, a shadcn Skeleton table is shown instead of a blank page.

> As a user, I want to see a skeleton placeholder while data loads, so that the page feels responsive and I know something is happening.

```
GIVEN the user navigates to /main/inventory/product-name
WHEN the API call is in flight
THEN a skeleton table is rendered with 6 columns and 5 rows

GIVEN the API call completes
WHEN data arrives
THEN the skeleton is replaced by the real product names table
```

- Component file: `ProductNamesPageClient.jsx`
- Key ID: `loadingSkeleton_productNamePage`
- Skeleton shape: 6 columns × 5 rows

---

**J. Empty States**

Two distinct empty states: one for a truly empty list, one for a filtered result with no matches.

> As a user, I want a helpful empty state when there are no product names yet, so that I know how to get started.

> As a user, I want a clear message when my search returns no results, so that I know the filter is working and not that the list is broken.

**True empty (no product names saved):**

```
GIVEN no product names have been created yet
WHEN the page loads
THEN show: PackageOpen icon + "No product names yet" heading + subtitle + "Add Product Name" CTA button
```

- Component file: `ProductNamesPageClient.jsx`
- Key ID: `emptyState_productNamePage`

**Filtered empty (search returns no matches):**

```
GIVEN there are product names in the list
WHEN the user types a search term that matches nothing
THEN show: SearchX icon + "No results" message + a clear search button to reset the filter
```

- Component file: `ProductNamesTable.jsx`

---

**Upcoming Scope (P2 — not yet implemented):**

---

##### K. Bulk Status Change

**Description:** Let the user select multiple product name rows and flip their status to Active or Inactive in one shot — no need to open each edit modal one by one.

**User Story:**

> As a user, I want to select multiple product names and set their status to Active or Inactive in one action, so I can manage a group of names without editing them one by one.

**Acceptance Criteria:**

```
GIVEN the product name table is loaded
WHEN the user checks one or more row checkboxes
THEN a bulk action bar appears above the table showing "{n} selected" and three buttons: Set Active, Set Inactive, Deselect All
```

```
GIVEN the bulk action bar is visible
WHEN the user clicks Set Active or Set Inactive
THEN all selected names update to that status, a success toast shows "{n} name(s) updated", checkboxes clear, and the table re-fetches
```

```
GIVEN the bulk action bar is visible
WHEN the user clicks Deselect All
THEN all checkboxes uncheck and the bar disappears
```

```
GIVEN some rows are checked
WHEN the user changes the search query or filter
THEN any rows no longer visible are automatically deselected
```

```
GIVEN all visible rows are checked
THEN the header checkbox shows a checked state

GIVEN some (but not all) visible rows are checked
THEN the header checkbox shows an indeterminate state
```

**Component changes:** `ProductNamesTable.jsx` — add Checkbox column, select-all in header, bulk action bar.

**Key test IDs:**

| Element                    | id                                   |
| -------------------------- | ------------------------------------ |
| Bulk action bar            | `bulkActionBar_productNamePage`      |
| Set Active button          | `bulkSetActiveBtn_productNamePage`   |
| Set Inactive button        | `bulkSetInactiveBtn_productNamePage` |
| Deselect All button        | `bulkDeselectAllBtn_productNamePage` |
| Header select-all checkbox | `selectAllNames_productNamePage`     |
| Per-row checkbox           | `nameCheckbox_{id}_productNamePage`  |

---

##### L. Product Count Badge Navigation

**Description:** The product count badge on each row becomes a clickable link (when count > 0) that takes the user straight to the product list pre-filtered by that product name — so they can instantly see which products use it.

**User Story:**

> As a user, I want to click the product count badge on a product name row and be taken to the product list page filtered to that name, so I can quickly see which products use it.

**Acceptance Criteria:**

```
GIVEN a product name has product_count > 0
WHEN the user clicks its count badge
THEN the browser navigates to /main/inventory/product-list?name={product_name} (URL-encoded)
```

```
GIVEN a product name has product_count = 0
THEN the badge is slate-colored, not clickable, and has no hover effect
```

```
GIVEN the badge button receives keyboard focus
THEN a visible focus ring is shown
```

**Component changes:** `ProductNamesTable.jsx` — wrap clickable badge in `<button>`.

**Key test ID:** `productCountBadge_{id}_productNamePage`

---

#### 3.1.4 Product History (`/main/inventory/product-history`)

**Description:** A read-only log of all product usage sessions. Each record represents one usage session from the `product_history` table — when a product was started, finished, or paused. Users can browse the full list, search by product name, filter by status, and sort by date or product name. No record can be added, edited, or deleted from this page.

**Note:** Records in this table are created internally from the Product List page when a user triggers "Record Usage". The Product History page itself has no add/edit/delete UI — it is strictly a read-only view.

**Route:** `/main/inventory/product-history`
**Entry Point:** `app/main/inventory/product-history/page.jsx`
**Main Components:** `ProductHistoryPageClient.jsx`, `ProductHistoryTable.jsx`, `ProductHistoryFilterDropdown.jsx`

---

**User Stories**

> As a user, I want to see all my product usage sessions in one table, so that I can review my full usage history at a glance.

> As a user, I want to search for usage records by product name, so that I can quickly find history for a specific product.

> As a user, I want to filter usage records by status (active, inactive, completed), so that I can focus on sessions that matter to me right now.

> As a user, I want to sort usage records by date or product name, so that I can organize the list the way I prefer.

---

**Acceptance Criteria**

**A. List View**

```
GIVEN the user navigates to /main/inventory/product-history
WHEN the page loads
THEN the table shows all usage records sorted by start_usage_date descending (most recent first) by default
AND each row shows: #, Product (brand · type · product name), Status badge, Quantity, Start Date, End Date, Note
AND a loading skeleton (id="loadingSkeleton_productHistoryPage") is shown while data is fetching
```

**B. Search by Product Name**

```
GIVEN there are usage records in the table
WHEN the user types in the search input (id="searchInput_productHistoryPage")
THEN the table filters client-side to show only rows where the product name contains the search string (case-insensitive, substring match)
AND search is applied on product name field only (not brand or type)
```

```
GIVEN the search input has text
WHEN the user clicks the clear button (id="clearSearchBtn_productHistoryPage")
THEN the search input is cleared and all records are shown again
```

```
GIVEN the search input has text AND a status filter is active
WHEN the user types a search string
THEN both the search and status filter are applied together (AND logic)
```

**C. Filter by Status**

```
GIVEN the user clicks the filter/sort button (id="filterSortBtn_productHistoryPage")
WHEN the dropdown opens
THEN three status options are shown:
  Active (id="filterOption_active_productHistoryPage")
  Inactive (id="filterOption_inactive_productHistoryPage")
  Completed (id="filterOption_completed_productHistoryPage")
AND the currently selected filter option is visually highlighted
```

**D. Sort Options**

```
GIVEN the user opens the filter/sort dropdown
WHEN the sort section is visible
THEN four sort options are shown:
  Most Recent First (id="sortOption_date_desc_productHistoryPage") — default
  Oldest First (id="sortOption_date_asc_productHistoryPage")
  Product Name A→Z (id="sortOption_name_asc_productHistoryPage")
  Product Name Z→A (id="sortOption_name_desc_productHistoryPage")
AND the currently active sort option is visually highlighted
```

**E. Empty State — True Empty**

```
GIVEN the user has no usage records
WHEN the page loads
THEN an empty state (id="emptyState_productHistoryPage") is shown with icon + "No usage history yet" heading
AND there is no CTA button (records are created from Product List page)
```

**F. Empty State — Filtered Empty**

```
GIVEN search or filter produces no results
THEN the table body shows a filtered empty message with a "Clear filters" action
```

**G. Loading State**

```
GIVEN data is still fetching
THEN a skeleton (id="loadingSkeleton_productHistoryPage") with 7 columns is shown in place of the table
```

---

**Validations / Constraints**

| Rule            | Detail                                                              |
| --------------- | ------------------------------------------------------------------- |
| Read-only       | No add, edit, or delete action on this page                         |
| Data source     | Records from `product_history` only — this page writes nothing      |
| Search scope    | Product name only — brand and type are displayed but not searchable |
| Sort default    | Most recent first (start_usage_date DESC) on initial load           |
| Filter + search | AND logic                                                           |
| Client-side     | Search, filter, and sort all operate client-side                    |

---

**API Endpoints**

`GET /api/inventory/v1/product-history/list`

Response (HTTP 200):

```json
{
  "data": [
    {
      "id": "uuid",
      "product_id": "uuid",
      "product_name": "string",
      "brand_name": "string",
      "product_type": "string",
      "status": "active | inactive | completed",
      "quantity": 1,
      "start_usage_date": "YYYY-MM-DD",
      "end_usage_date": "YYYY-MM-DD | null",
      "note": "string | null"
    }
  ]
}
```

| Code | Condition               |
| ---- | ----------------------- |
| 401  | User not authenticated  |
| 500  | Unexpected server error |

`PATCH /api/inventory/v1/product-history/update/[id]`

- Auth: Required
- Param: `id` — UUID, history record ID
- Description: Internal endpoint called by the Product List "Record Usage" flow to update a usage session (e.g. mark as completed, set end date). This endpoint is NOT exposed in the Product History UI — the page remains read-only. Only the Product List page triggers this via the Record Usage action.
- Body: `{ status?: string, end_usage_date?: string, depleted_quantity?: number }`
- Response: `{ success: true, data: {...} }`

`GET /api/inventory/v1/product-history/[id]`

- Auth: Required
- Param: `id` — UUID, history record ID
- Description: Returns a single product history entry by ID. Used by the Product Detail page to display individual usage session data.
- Response: `{ success: true, data: { id, product_id, product_name, brand_name, product_type, status, quantity, start_usage_date, end_usage_date, note } }`
- Error: 404 if not found or does not belong to the user

---

**Key Test IDs**

| Element                         | ID                                          |
| ------------------------------- | ------------------------------------------- |
| Table                           | `productHistoryTable_productHistoryPage`    |
| Search input                    | `searchInput_productHistoryPage`            |
| Clear search button             | `clearSearchBtn_productHistoryPage`         |
| Filter/sort trigger button      | `filterSortBtn_productHistoryPage`          |
| Filter option — active          | `filterOption_active_productHistoryPage`    |
| Filter option — inactive        | `filterOption_inactive_productHistoryPage`  |
| Filter option — completed       | `filterOption_completed_productHistoryPage` |
| Sort option — most recent first | `sortOption_date_desc_productHistoryPage`   |
| Sort option — oldest first      | `sortOption_date_asc_productHistoryPage`    |
| Sort option — name A→Z          | `sortOption_name_asc_productHistoryPage`    |
| Sort option — name Z→A          | `sortOption_name_desc_productHistoryPage`   |
| Empty state                     | `emptyState_productHistoryPage`             |
| Loading skeleton                | `loadingSkeleton_productHistoryPage`        |

---

**P0 Gap — Missing Test IDs**

Zero `id` attributes currently exist on any interactive element in this feature. Frontend must add all IDs above before Tester can write tests.

Impacted files:

- `ProductHistoryPageClient.jsx` — search input, clear button, loading skeleton, empty state
- `ProductHistoryTable.jsx` — table element
- `ProductHistoryFilterDropdown.jsx` — filter/sort button, all filter + sort options

All new IDs must also be registered in `cypress/fixtures/app-constants.json` under `test_ids.product_history`.

---

#### 3.1.5 Inventory AI Chat

**Description:** A chat interface powered by Claude that lets the user ask natural language questions about their inventory data. Context is built from the user's current product list, stock levels, and usage history. Conversation history is not persisted — each request is stateless.

**Route:** Embedded in the Inventory module (no dedicated route)
**API:** `POST /api/chat`

---

**User Story:**

> As a user, I want to ask questions about my inventory in natural language so I can quickly get insights without navigating multiple pages.

---

**Core Features:**

- Send a text message and receive a text response from Claude
- Input field clears automatically after the message is sent
- Loading indicator is shown while the API is processing the request
- Error message is shown if the API call fails

---

**Acceptance Criteria:**

```
GIVEN the user types a message and submits it
WHEN the API call is in progress
THEN a loading indicator is shown and the input is disabled

GIVEN the API responds successfully
WHEN the response arrives
THEN the reply is displayed and the input field is cleared

GIVEN the API call fails (network error or 5xx)
WHEN the error occurs
THEN an error message is shown to the user (e.g. "Something went wrong. Please try again.")
AND the input remains available so the user can retry

GIVEN the user submits an empty message
WHEN the form validates
THEN the message is not sent
```

---

**API:**

`POST /api/chat`

- Auth: Required
- Body: `{ message: string }`
- Description: Sends the user's message to Claude with inventory context (product list, stock levels, usage history) and returns a reply. Each request is independent — no session or conversation history is stored.
- Response: `{ reply: string }`
- Error: 400 if message is empty; 500 on unexpected error

---

#### 3.1.6 Product Detail Page (`/main/inventory/product-list/[id]`) — implemented v1.11

**Description:** The individual product detail page showing summary stats, purchase history, and usage history in a single view. Accessible from the route `/main/inventory/product-list/[id]`.

**Route:** `/main/inventory/product-list/[id]`
**Entry Point:** `app/main/inventory/product-list/[id]/page.jsx`
**Main Component:** `app/main/inventory/product-list/[id]/ProductDetailPage.jsx`

**User Stories:**

> As a user, I want to see a complete history of purchases and usage sessions for a single product, so that I can understand how I've been using and buying it.

> As a user, I want to see summary stats (current stock, total added, total spent, usage sessions) for a product in one place, so that I can evaluate its consumption at a glance.

**Page Structure:**

1. Back link — "Back to Product List" → `/main/inventory/product-list`
2. PageHeader — `title`: product name, `description`: brand · type, `breadcrumbs`: Inventory > Product List > [product name]
3. Status badge (active/inactive) — next to the PageHeader (float right on sm+)
4. 4 stat cards (2-col mobile, 4-col desktop):
   - **Current Stock** — `product.quantity`, sub-label "Out of stock" / "Low stock" if applicable
   - **Total Added** — SUM(`quantity_added`) from stock history, sub-label "all time"
   - **Total Spent** — SUM(`price`) from stock history, formatted as `Rp X.XXX`
   - **Usage Sessions** — COUNT of records from usage history
5. 2-column content grid (1-col mobile, 2-col desktop):
   - **Purchase History** — table columns: Date, Qty Added, Price, Note; sorted most recent first; empty state: icon + "No purchase history yet"
   - **Usage History** — reuses the `ProductUsageLog` component

**Data Fetching:** 3 parallel API calls via `Promise.all` on component mount:

- `GET /api/inventory/v1/product/[id]` → product data
- `GET /api/inventory/v1/product/stock/history/[id]` → purchase history
- Usage history API → usage log

**Loading State:** Full skeleton with back link still visible — skeleton for header, 4 stat cards, and 2 content sections.

**Error State:** Centered display with `Package` icon, error message, and a "Try again" button (retry button re-calls `loadData`).

**Acceptance Criteria:**

```
GIVEN the user navigates to /main/inventory/product-list/[id]
WHEN the page loads
THEN 4 stat cards show accurate data based on the product's stock history and usage history

GIVEN data is still loading
WHEN the API hasn't responded yet
THEN a skeleton is shown for all sections
AND the back link remains visible

GIVEN the API fails (network error or 5xx)
WHEN the error occurs
THEN an error message is shown with a "Try again" button
AND clicking "Try again" retries all 3 API calls

GIVEN a product has status "active"
WHEN the page loads
THEN an emerald "active" badge is shown next to the PageHeader

GIVEN a product has no purchase history
WHEN the Purchase History section renders
THEN the empty state is shown with an icon and "No purchase history yet"
```

**Validations:**

- `productId` is validated as a positive integer before being passed to the API
- The page is protected via `requireAuth()` in the server component wrapper

**API Endpoints:**

- `GET /api/inventory/v1/product/[id]` — product detail
- `GET /api/inventory/v1/product/stock/history/[id]` — purchase history
- `GET /api/inventory/v1/product-history/[id]` — single usage history entry by ID; used by this page to display individual usage session data
- `GET /api/inventory/v1/product/restock-predictions` — used on the Product List page (not on the detail page)

---

## Version History

| Version | Date       | Changes                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1     | 2026-06-17 | Full translation from Indonesian to English (sections 3.1.0, 3.1.1, and all mixed-language content). Fixed `product_usage_log` → `product_history` table name throughout. Added missing endpoints: `GET /product-brand/[id]`, `GET /product-brand/summary`. Added and clarified `PATCH /product-history/update/[id]` and `GET /product-history/[id]` with usage context notes. Expanded section 3.1.5 (Inventory AI Chat) from stub to full spec. |
| 1.0     | (initial)  | Original PRD — partial Indonesian, stub sections                                                                                                                                                                                                                                                                                                                                                                                                  |
