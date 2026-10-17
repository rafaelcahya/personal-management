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
- Built using the base `Skeleton` component from `@/components/base/Skeleton/Skeleton`

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
