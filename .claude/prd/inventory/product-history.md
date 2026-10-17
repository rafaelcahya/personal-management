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
