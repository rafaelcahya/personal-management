#### 3.1.6 Product Detail Page (`/main/inventory/product-list/[id]`)

**Description:** The single hub for viewing and managing an individual product. Shows summary stats, stock history, and usage history in one view. All management actions (Edit Product, Add Stock, Record Usage) are accessible from the action bar in the page header — there is no action dropdown on the Product List page anymore.

**Route:** `/main/inventory/product-list/[id]`
**Entry Point:** `app/main/inventory/product-list/[id]/page.jsx`
**Main Component:** `app/main/inventory/product-list/[id]/ProductDetailPage.jsx`

**User Stories:**

> As a user, I want to see a complete history of stock purchases and usage sessions for a single product, so that I can understand how I've been using and buying it.

> As a user, I want to see summary stats (current stock, total added, total spent, usage sessions) for a product in one place, so that I can evaluate its consumption at a glance.

> As a user, I want to edit product details, add stock, or record usage from the product detail page, so that all management actions are in one place.

> As a user, I want to toggle a product as a favorite from its detail page, so that I can manage favorites without going back to the list.

**Page Structure:**

1. Back link — "Back to Product List" → `/main/inventory/product-list`
2. PageHeader — `title`: product name, `description`: brand · type, `breadcrumbs`: Inventory > Product List > [product name]
3. Header area — right side contains:
   - **Star icon** — clickable to toggle `is_favorite`; filled star if favorite, outline star if not; calls the same toggle API used by the Product List
   - **Status badge** (active/inactive) — displayed next to the star icon
   - **Action bar** — three buttons: `Edit Product`, `Add Stock`, `Record Usage`
     - Each button opens a `<Dialog>` (same form as previously used on the Product List page)
     - On mobile: the action bar buttons collapse into a ⋯ dropdown to save space
4. 4 stat cards (2-col mobile, 4-col desktop):
   - **Current Stock** — `product.quantity`, sub-label "Out of stock" / "Low stock" if applicable
   - **Total Added** — SUM(`quantity_added`) from stock history, sub-label "all time"
   - **Total Spent** — SUM(`price`) from stock history, formatted as `Rp X.XXX`
   - **Usage Sessions** — COUNT of records from usage history
5. 2-column content grid (1-col mobile, 2-col desktop):
   - **Stock History** _(renamed from Purchase History)_ — table columns: Date, Qty Added, Price, Note; sorted most recent first; empty state: icon + "No stock history yet"
   - **Usage History** — reuses the `ProductUsageLog` component

**Action Bar — Edit Product:**

Fields: Brand (Select), Product Name (Select), Type (Input), Status (Select active/inactive). Each field has a guide message below it.

```
GIVEN the user clicks "Edit Product" in the action bar
WHEN the Dialog opens
THEN fields are pre-filled with the current product data

GIVEN the changes are valid
WHEN the user clicks "Save Changes"
THEN the product is updated and the page header reflects the change
AND a success toast is shown
AND the Dialog closes
```

**Action Bar — Add Stock:**

Fields: Quantity to Add, Price (Rp), Purchase Date, Note (optional). Below the Price field: last purchase price hint. Above the form fields: Recent Purchases section (up to 3 most recent entries, hidden if empty).

Last Purchase Price Hint:

| Condition  | Display                                      |
| ---------- | -------------------------------------------- |
| Loading    | "Loading last price..."                      |
| Data found | "Last purchase price: Rp X.XXX — d MMM yyyy" |
| No data    | "No previous purchase data available"        |

```
GIVEN the user clicks "Add Stock" in the action bar
WHEN the Dialog opens
THEN show: Quantity to Add, Price (Rp), Purchase Date, Note (optional)
AND below the Price field show the last purchase price hint
AND above the form fields show the Recent Purchases section if history exists

GIVEN quantity_added ≥ 1 and price ≥ 0
WHEN the user submits
THEN the Current Stock and Total Added stat cards update
AND the Stock History section shows the new entry
AND a success toast is shown
```

**Action Bar — Record Usage:**

```
GIVEN the user clicks "Record Usage" in the action bar
WHEN the dialog opens
THEN the user can record when they started using the product and the quantity being used

GIVEN usage is recorded
WHEN it saves successfully
THEN the Usage Sessions stat card updates
AND a success toast is shown
```

**Star Icon (Favorite Toggle):**

```
GIVEN the user is on the Product Detail page
WHEN the user clicks the star icon in the header
THEN is_favorite is toggled for the product
AND the star icon state updates immediately (filled ↔ outline)
AND a success toast is shown
```

**Data Fetching:** 3 parallel API calls via `Promise.all` on component mount:

- `GET /api/inventory/v1/product/[id]` → product data
- `GET /api/inventory/v1/product/stock/history/[id]` → stock history
- Usage history API → usage log

**Loading State:** Full skeleton with back link still visible — skeleton for header, 4 stat cards, and 2 content sections.

**Error State:** Centered display with `Package` icon, error message, and a "Try again" button (retry button re-calls `loadData`).

**Acceptance Criteria:**

```
GIVEN the user navigates to /main/inventory/product-list/[id]
WHEN the page loads
THEN 4 stat cards show accurate data based on the product's stock history and usage history
AND the action bar shows Edit Product, Add Stock, and Record Usage buttons
AND the star icon reflects the current is_favorite state

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
THEN an emerald "active" badge is shown in the header area

GIVEN a product has no stock history
WHEN the Stock History section renders
THEN the empty state is shown with an icon and "No stock history yet"

GIVEN the user is on a mobile viewport
WHEN the page loads
THEN the action bar buttons are collapsed into a ⋯ dropdown
```

**Validations:**

- `productId` is validated as a positive integer before being passed to the API
- The page is protected via `requireAuth()` in the server component wrapper

**API Endpoints:**

- `GET /api/inventory/v1/product/[id]` — product detail
- `GET /api/inventory/v1/product/stock/history/[id]` — stock history (renamed from purchase history)
- `GET /api/inventory/v1/product/[id]/last-price` — last purchase price hint for Add Stock dialog
- `GET /api/inventory/v1/product-history/[id]` — single usage history entry by ID
- `PUT /api/inventory/v1/product/[id]` — update product (Edit Product action)
- `POST /api/inventory/v1/product/stock/[id]` — add stock (Add Stock action)
- `POST /api/inventory/v1/product-history` — record usage (Record Usage action)
- `PATCH /api/inventory/v1/product/[id]/favorite` — toggle is_favorite (star icon)

---
