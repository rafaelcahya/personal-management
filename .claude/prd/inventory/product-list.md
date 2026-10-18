#### 3.1.1 Product List (`/main/inventory/product-list`)

**Description:** The main product management page. Displays all products in a browsable table with search and filter. Each row is clickable and navigates to the Product Detail page. Actions (Edit, Add Stock, Record Usage) are accessible from the detail page — there is no per-row action dropdown on this page.

**Route:** `/main/inventory/product-list`
**Entry Point:** `app/main/inventory/product-list/page.jsx`

---

**User Stories:**

> As a user, I want to search products by brand or name, so that I can quickly find a specific product without scrolling through the entire list.

> As a user, I want to filter products by status or stock level, so that I can focus on products that need attention.

> As a user, I want to click a product row and go to its detail page, so that I can see full history and take actions from one place.

> As a user, I want to see at a glance which products are out of stock or running low, so that I can prioritize restocking.

> As a user, I want to mark a product as a favorite directly from the list, so that I don't have to navigate to the detail page just to toggle a star.

---

**Features & Acceptance Criteria:**

**A. Product Table**

Columns shown:

| Column         | Data                | Alignment | Note                                                                                                              |
| -------------- | ------------------- | --------- | ----------------------------------------------------------------------------------------------------------------- |
| Product        | brand + type + name | Left      | Favorite star icon on the left — clickable to toggle favorite; space is always reserved (hidden if not favorited) |
| Quantity       | `quantity`          | Right     | Monospace font                                                                                                    |
| In Use         | `usage_quantity`    | Right     | Monospace font — number of units currently in use                                                                 |
| Usage Date     | `usage_date`        | Center    | Format: DD MMM YYYY, "-" if never used                                                                            |
| Product Status | `product_status`    | Center    | Badge: active (green) / inactive (red)                                                                            |

The ⋯ (3-dot action dropdown) column is removed. The Actions column no longer exists on this page.

**Row click behavior:** clicking anywhere on a row (except the star icon) navigates to `/main/inventory/product-list/[id]` (the Product Detail page). The entire row is a link — cursor changes to pointer on hover.

**Star icon behavior:** clicking the star icon toggles `is_favorite` for that product without navigating away. The icon click is isolated from the row click (event propagation stopped). Favorites are always sorted to the top of the list.

```
GIVEN products exist in the database
WHEN the page loads
THEN all products are shown in the table, with favorites at the top
AND there is no action dropdown column

GIVEN the user clicks anywhere on a product row (except the star)
WHEN the click is handled
THEN the browser navigates to /main/inventory/product-list/[id] for that product

GIVEN the user clicks the star icon on a product row
WHEN the toggle succeeds
THEN is_favorite is updated and the star reflects the new state
AND the user stays on the Product List page (no navigation)
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

Edit Product is no longer accessible from the Product List page. It is accessible from the Product Detail page action bar. See section 3.1.6 for the Edit Product spec.

**F. Add Stock**

Add Stock is no longer accessible from the Product List page. It is accessible from the Product Detail page action bar. See section 3.1.6 for the Add Stock spec.

**G. Record Usage** _(previously called "Update Usage" — renamed for clarity)_

Record Usage is no longer accessible from the Product List page. It is accessible from the Product Detail page action bar. See section 3.1.6 for the Record Usage spec.

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

The favorites toggle is handled via the star icon in the Product column — there is no action dropdown. See the star icon behavior in section A above.

**I. Delete Product**

Delete Product is no longer accessible from the Product List page. It is accessible from the Product Detail page. See section 3.1.6 for the Delete spec.

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

---
