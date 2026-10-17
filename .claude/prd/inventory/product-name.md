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

While the product name list is fetching, a base Skeleton table is shown instead of a blank page.

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
