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

| Condition        | Badge                      |
| ---------------- | -------------------------- |
| `quantity === 0` | Red badge "Out of Stock"   |
| `quantity ≤ 2`   | Orange badge "Low: X left" |

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

| Condition    | Badge                        |
| ------------ | ---------------------------- |
| `< 30 days`  | Red badge (consumed quickly) |
| `30–59 days` | Yellow badge                 |
| `≥ 60 days`  | Green badge (long-lasting)   |
| Format       | `X days`                     |

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

| Condition               | Badge                     |
| ----------------------- | ------------------------- |
| `quantity = 0`          | Red badge "Out of Stock"  |
| `days_until_empty ≤ 7`  | Red badge "Critical"      |
| `days_until_empty ≤ 14` | Orange badge "Soon"       |
| `days_until_empty ≤ 30` | Yellow badge "This Month" |
| `days_until_empty > 30` | Green badge "6+ Months"   |

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

| Condition | Color             |
| --------- | ----------------- |
| `< 75%`   | Violet            |
| `75–99%`  | Yellow            |
| `≥ 100%`  | Red (over budget) |

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

| Level | Range       | Tailwind Color  |
| ----- | ----------- | --------------- |
| 0     | No spend    | `bg-slate-100`  |
| 1     | > 0 – < 50k | `bg-violet-200` |
| 2     | 50k – 200k  | `bg-violet-400` |
| 3     | 200k – 500k | `bg-violet-600` |
| 4     | > 500k      | `bg-violet-800` |

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

| Score | Tier | Color  |
| ----- | ---- | ------ |
| ≥ 80  | S    | Violet |
| 60–79 | A    | Green  |
| 40–59 | B    | Yellow |
| < 40  | C    | Slate  |

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
