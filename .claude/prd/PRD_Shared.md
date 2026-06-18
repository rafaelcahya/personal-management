# Product Requirements Document (PRD)

## Personal Management App

**Version:** 1.20
**Last Updated:** 2026-06-17
**Owner:** Rafael Cahya  
**Stack:** Next.js 15 App Router · Supabase (PostgreSQL) · Tailwind CSS · shadcn/ui · Claude AI (Sonnet 4.6)

---

## Product Release Plan

> PRD version = document revision (tracks requirement changes).
> Product release version = what ships to production (GitHub milestone).

| Release  | Status  | GitHub Milestone                                                       | PRD Coverage                                                                | Issues      |
| -------- | ------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------- | ----------- |
| **v1.0** | Shipped | —                                                                      | PM PRD v1.0–v1.19 (all features to date: Inventory, Trading, Auth, Sidebar) | —           |
| **v1.1** | Planned | [v1.1](https://github.com/rafaelcahya/personal-management/milestone/2) | RT PRD section 10 Analytics, section 11 AI Coach                            | #4 #5 #6 #7 |
| **v1.2** | Planned | [v1.2](https://github.com/rafaelcahya/personal-management/milestone/3) | TBD                                                                         | —           |

---

## 1. Overview

Personal Management App is a personal web application for managing two main domains:

1. **Inventory** — Household product stock management
2. **Trading** — Stock portfolio management and analysis

The app includes an **AI Chat** powered by Claude for natural language interaction across both domains.

---

## 2. Users & Access

| Role               | Access                      |
| ------------------ | --------------------------- |
| Authenticated User | Full access to all features |
| Unauthenticated    | Redirect to `/login`        |

- Auth via Supabase (Google OAuth only)
- Session managed via SSR cookies (middleware.js)
- Every request to `/main/*` and `/api/*` must be authenticated

---

## 3. Modules & Features

---

---

## 4. API Standards

### Response Format

```json
// Success
{ "data": {...}, "message": "string" }

// Error
{ "error": "ERROR_CODE", "message": "Human readable message" }
```

### HTTP Status Codes

| Status | Condition                      |
| ------ | ------------------------------ |
| 200    | OK                             |
| 201    | Created                        |
| 400    | Validation error / Bad request |
| 401    | Unauthenticated                |
| 403    | Forbidden                      |
| 404    | Not found                      |
| 500    | Server error                   |

### Auth

- All `/api/*` endpoints (except `/api/auth/*`) must validate session
- [DEPRECATED v1.1] ~~Use JWT/authToken cookie for auth validation in route handlers~~ — replaced by Supabase SSR `createClient()` + `supabase.auth.getUser()`
- All `/api/*` route handlers MUST use `lib/supabase/server.ts` `createClient()` + `supabase.auth.getUser()` for session validation
- Admin operations (e.g., bypass RLS) use `createAdminClient()` from `lib/supabase/admin.js` — not a singleton, call as a function each time it is needed
- Auth endpoints:
  - `POST /api/auth/logout` — server-side session termination

### Shared AI Chat Endpoints

The following endpoints power the AI chat features. Full specs are documented in their respective module PRDs:

- `POST /api/chat` — Inventory AI Chat (see PRD_Inventory.md)
- `POST /api/trade-chat` — Trading AI Chat (see PRD_Trading.md)

---

## 5. UI/UX Standards

- **Design System:** shadcn/ui + Tailwind CSS
- **Color Tokens:** `primary`, `secondary`, `tertiary`, `trade-profit`, `trade-loss`, `trade-warning`
- **Responsive:** Mobile-first, minimal breakpoints tablet (768px) and desktop (1024px)
- **Loading States:** Every async operation must show a skeleton or spinner
- **Empty States:** Every list must have a display state when data is empty
- **Error States:** Every form and API call must handle errors with clear messages
- **Accessibility:** WCAG 2.1 AA (keyboard nav, contrast ratio, aria labels, semantic HTML)

### PageHeader Component

**Component:** `app/main/components/PageHeader.jsx`

Every page in the app (Inventory, Trading, and Running Tracker) must use the `PageHeader` component at the top of the page content.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | string | Yes | Page title — rendered as `<h1>` |
| `description` | string | — | Short description below the title |
| `breadcrumbs` | `{label, href?}[]` | — | Array of breadcrumb items; item without `href` = current page |

**Pages using PageHeader:**
| Page | Route | Title | Breadcrumbs |
|------|-------|-------|-------------|
| Inventory Dashboard | `/main/inventory/dashboard` | "Inventory Dashboard" | Inventory > Dashboard |
| Product List | `/main/inventory/product-list` | "Product List" | Inventory > Product List |
| Product Detail | `/main/inventory/product-list/[id]` | [product name] | Inventory > Product List > [product name] |
| Product Brand | `/main/inventory/product-brand` | "Product Brand" | Inventory > Product Brand |
| Product Name | `/main/inventory/product-name` | "Product Name" | Inventory > Product Name |
| Product History | `/main/inventory/product-history` | "Product History" | Inventory > Product History |
| Trading Dashboard | `/main/trading/dashboard` | "Trading Dashboard" | Trading > Dashboard |
| Trade List | `/main/trading/trade-list` | "Trades" | Trading > Trades |
| Fee | `/main/trading/fee` | "Fees" | Trading > Fees |
| Event | `/main/trading/event` | "Market Events" | Trading > Market Events |
| Settings | `/main/trading/settings` | "Settings" | Trading > Settings |
| Running Dashboard | `/main/running/dashboard` | "Dashboard" | — |
| Activities | `/main/running/activities` | "Activities" | — |
| Activity Detail | `/main/running/activities/[id]` | [activity name] | — |
| Analytics | `/main/running/analytics` | "Analytics" | — |
| AI Coach | `/main/running/ai` | "AI Coach" | — |
| Race Log | `/main/running/race-log` | "Race Log" | — |
| Race Detail | `/main/running/race-log/[id]` | [race title] | — |

> Note: Pace Calculator and Settings pages in Running Tracker do NOT use PageHeader.

### Sidebar Navigation Component

**Component:** `app/main/components/Sidebar.jsx`

The sidebar is the main navigation shared across all modules (Inventory, Trading, Running).

**Collapsed Mode Tooltip:**

When the sidebar is collapsed (icon only, no text label), each nav item must show a tooltip on hover to display the menu name.

- Tooltip uses shadcn/ui `Tooltip` + `TooltipProvider` — NOT the native HTML `title` attribute
- Tooltip appears on the `right` side of the icon
- Tooltip is only active when `collapsed === true`; when expanded the text label is already visible
- `delayDuration={0}` — appears immediately with no delay

**Acceptance Criteria:**

- GIVEN the sidebar is in collapsed state WHEN the user hovers a nav icon THEN a tooltip appears to the right of the icon showing the menu name
- GIVEN the sidebar is in expanded state WHEN the user hovers a nav item THEN no tooltip appears (the label is already visible)

---

## 6. Database Tables

### Inventory Tables

| Table              | Module    | Description                                                                                                       |
| ------------------ | --------- | ----------------------------------------------------------------------------------------------------------------- |
| `product_list`     | Inventory | Product data                                                                                                      |
| `product_brand`    | Inventory | Brand master data                                                                                                 |
| `product_name`     | Inventory | Product type master data                                                                                          |
| `product_quantity` | Inventory | Current stock per product                                                                                         |
| `product_history`  | Inventory | Stock activity log                                                                                                |
| `inventory_budget` | Inventory | Monthly budget per type — columns: `user_id`, `type`, `monthly_budget`, `updated_at`; unique on `(user_id, type)` |

### Trading Tables

| Table        | Module  | Description       |
| ------------ | ------- | ----------------- |
| `trade_list` | Trading | Trade data        |
| `event_list` | Trading | Market events     |
| `fee_list`   | Trading | Fee structure     |
| `settings`   | Trading | Per-user settings |

### Auth Tables

| Table        | Module | Description         |
| ------------ | ------ | ------------------- |
| `auth.users` | Auth   | Managed by Supabase |

### Running Tracker Tables

> Full schema (columns, RLS, indexes) is documented in PRD_Running_Tracker.md section 8.

| Table                       | Description                                  |
| --------------------------- | -------------------------------------------- |
| `rt_activities`             | Core run/workout record                      |
| `rt_race_log`               | Race finish entries                          |
| `rt_upcoming_races`         | Future race targets                          |
| `rt_gear`                   | Shoe and equipment tracking                  |
| `rt_goals`                  | Training goals                               |
| `rt_symptom_logs`           | Injury and pain entries                      |
| `rt_ai_insights`            | AI-generated insight records                 |
| `rt_activity_best_efforts`  | Per-activity personal record entries         |
| `rt_activity_splits`        | Per-km splits per activity                   |
| `rt_activity_streams`       | Second-by-second telemetry (HR, pace, power) |
| `rt_daily_training_metrics` | Computed daily load (ACWR, acute/chronic)    |
| `rt_subjective_health_logs` | Daily sleep, energy, and mood entries        |
| `rt_weight_logs`            | Body weight and composition entries          |
| `rt_strava_credentials`     | Strava OAuth tokens                          |
| `rt_users`                  | Runner profile                               |
| `rt_user_settings`          | Per-user notification and zone preferences   |

---

## 7. Non-Functional Requirements

| Aspect          | Requirement                                                              |
| --------------- | ------------------------------------------------------------------------ |
| Performance     | API response < 2 seconds                                                 |
| Security        | No raw SQL interpolation, input sanitization, encrypted sensitive fields |
| Accessibility   | WCAG 2.1 AA                                                              |
| Browser Support | Chrome, Firefox, Safari (last 2 versions)                                |
| Auth            | Session-based via Supabase SSR cookies                                   |

---

## 8. Agent Instructions

This document is the **single source of truth** for all agents. When working on a task:

- **PM Agent** — analyze product, identify gaps, and update this PRD as owner
- **Frontend Agent** — implement per section 3 (features) and section 5 (UI/UX standards)
- **Backend Agent** — implement per section 3 (features) and section 4 (API standards)
- **Tester Agent** — write test cases based on all features, validations, and error states in section 3

Every requirement change must be updated by the PM Agent in this file before other agents implement it.

---

## 9. Version History

| Version | Date       | Changes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Author       |
| ------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| 1.0     | 2026-05-03 | Initial PRD — documented all existing features                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Rafael Cahya |
| 1.1     | 2026-05-03 | Auth module security & UX fixes — see sprint log. Updated 3.3.1 (Login: Google OAuth only, error/reason param handling, ?next= flow, Suspense); Added 3.3.3 (Logout: LogoutButton, POST /api/auth/logout); Added 3.3.4 (Session Expiry: AuthListener); Updated 3.3.2 (Callback: no_code/auth_failed redirects, ?next= preservation); Updated 3.4 (User Settings APIs: GET/PUT /api/user, POST /api/user/avatar); Updated Section 4 Auth (removed JWT, added createAdminClient pattern, added /api/auth/logout); Updated Section 2 (Google OAuth only)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Rafael Cahya |
| 1.2     | 2026-05-03 | Auth flow bug fixes & PRD clarity update. (1) Fixed: middleware now preserves ?next= param when redirecting to /login so the user returns to the intended page after login. (2) Fixed: LogoutButton now calls POST /api/auth/logout (server-side canonical) instead of client-side signOut directly — session is cleared server-side before redirect. (3) Fixed: AuthListener no longer shows "session expired" toast on intentional logout — uses sessionStorage flag to distinguish intentional logout vs session expiry. (4) Fixed: callback route validates ?next= must start with "/" for security. Added 3.3.0 Auth Flow Overview with visual flow diagram for login, logout, and session expiry.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Rafael Cahya |
| 1.3     | 2026-05-03 | Auth UI/UX overhaul based on frontend + UI/UX agent review. (1) Login page: added app identity (icon + "Personal Management" above Card); Google button now follows Google branding guidelines (white bg, 4-color SVG, label "Sign in with Google"); all copy text updated. (2) LogoutButton: default size="sm", neutral color (not red), label "Sign out". (3) New: UserMenu component on landing page — shows Google user avatar + email in DropdownMenu with Sign out option. (4) Landing page: CTA buttons changed to "Go to Trading" / "Go to Inventory"; card descriptions updated. (5) Double toast on session expiry removed — toast only from login page via ?reason= param. Updated 3.3.1, 3.3.3, 3.3.4 in PRD. PRD maintenance: header version updated to 1.3; all [DEPRECATED] items tagged with version (v1.1); flow diagrams and error messages table aligned with actual implementation (SESSION EXPIRY FLOW: remove toast from AuthListener, update copy text; LOGIN FLOW: "Sign in with Google"; LOGOUT FLOW: "Sign out" + UserMenu).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Rafael Cahya |
| 1.4     | 2026-05-05 | Added 3.1.0 Inventory Dashboard — 6 summary cards (Total Products, Active, Inactive, Total Stock, In Use, Favorites) + 6 analytics sections (Cost Per Use, Low Stock Alert, Neglected Products, Monthly Spend by Type, Avg Usage Duration, Days Until Empty). Layout 2-column grid responsive (mobile 1-col → desktop 2-col for analytics sections, 6-col for summary cards). API: GET /api/inventory/v1/dashboard and GET /api/inventory/v1/product/summary. Database tables: product_list, product_quantity, product_history.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Rafael Cahya |
| 1.5     | 2026-05-09 | Dashboard v1.5 — removed Neglected Products (Section 3) and Days Until Empty (Section 6); added 4 new features: (1) Spend This Month vs Last Month — bar chart comparison with delta badge (Section 0, full width); (2) Most Restocked Products — restock frequency table per product sorted by count DESC (replaces Section 3); (3) Monthly Spend by Type enhanced — added "This Month" total in section header; (4) Avg Cost/Use Over Time — line chart cumulative cost per use per product with product selector and hover tooltip showing delta + % per purchase (Section 6, full width). Layout updated: Low Stock Alert + Most Restocked become a 2-col grid, rest full width. API response updated: added mostRestocked, spendComparison, costPerUseHistory; removed neglected and daysUntilEmpty. Installed recharts for chart components.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Rafael Cahya |
| 1.6     | 2026-05-09 | Dashboard v1.6 — 4 new statistics + several improvements: (1) Restock Prediction (Section 7) — predicts depletion date per product based on avg_days × quantity, sorted DESC, 5-level urgency badge; (2) Monthly Budget Tracker (Section 8) — set & track budget per type with inline edit, 3-color progress bar, new budget API + Supabase table `inventory_budget`; (3) Spending Heatmap (Section 9) — GitHub-style calendar heatmap 52 weeks × 7 days, 5 violet color levels, hover tooltip, no additional library; (4) Product Lifecycle Score (Section 10) — composite score 0-100 from normalized cost_per_use + avg_days, tiers S/A/B/C, score bar. Monthly Spend by Type changed from per-category to per-product (shows brand + name + type badge per row). All table headers unified to bg-slate-100 + rounded corners style. API dashboard updated: added restockPrediction, spendingHeatmap, lifecycleScore. New: GET+POST /api/inventory/v1/budget. Database: added table inventory_budget (RLS, UNIQUE user+type).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Rafael Cahya |
| 1.10    | 2026-05-10 | **Sticky controls bar fix (Product List)** — fixed broken `h-full` height chain caused by `inventory/layout.jsx` wrapping children in a plain `div.relative` with no height constraints. Removed inner scroll container; page now scrolls naturally inside `main`. Controls bar (search + filter + add button) changed to `sticky top-0 z-10 bg-white` so it stays visible as the user scrolls the product list.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Rafael Cahya |
| 1.11    | 2026-05-12 | **Product List enhancements (9 new features).** P0: (1) Last Purchase Price hint in Add Stock dialog — fetch `GET /api/inventory/v1/product/[id]/last-price` when dialog opens, show "Last purchase price: Rp X — d MMM yyyy" or "No previous purchase data available". P1: (2) Summary cards clickable — Total Products, Active, Inactive, Favorites in ProductListSummary can be clicked to apply filters; Total Stock and In Use are not clickable. (3) Column sorting — Product, Quantity, In Use, Usage Date headers in desktop table are sortable client-side ascending/descending with icon indicator. (4) Dynamic category filter — dropdown adds a "Category" section with all unique `product.type` values; filter value prefixed with `"type:"`. (5) Note in Usage Log — `item.note` shown in card above UsageCompletionForm when row is expanded. (6) `LOW_STOCK_THRESHOLD = 5` — constant defined in 3 files (`ProductFilterDropdown`, `ProductsTable`, `ProductsPage`); no scattered magic numbers. P2: (7) Recent Purchases in Add Stock dialog — fetch `GET /api/inventory/v1/product/stock/history/[id]` when dialog opens, show 3 most recent entries above the form. (8) Restock prediction hint in table — `~Xd left` below QuantityBadge, orange if ≤ 7 days; data from `GET /api/inventory/v1/product/restock-predictions`. (9) Product detail page — new route `/main/inventory/product-list/[id]`: back link, PageHeader, 4 stat cards (Current Stock, Total Added, Total Spent, Usage Sessions), Purchase History table, Usage History (reuse ProductUsageLog), loading skeleton, error state + retry. Added 3 new endpoints to API doc: `GET restock-predictions`, `GET [id]/last-price`, `GET stock/history/[id]`. Updated PageHeader table: added Product Detail. | Rafael Cahya |
| 1.9     | 2026-05-10 | Product List improvements & Edit Product feature. (1) **Edit Product** — implemented `EditProductSheet` using `<Dialog>` (consistent with all other actions), not `<Sheet>`; fields: Brand (Select), Product Name (Select), Type (Input), Status (Select); each field has a guide message; pre-filled from current product data; PATCH `/api/inventory/v1/product/[id]`. (2) **Language** — all UI text in Product List changed to English: "Habis" → "Out of Stock", "Menipis" → "Low Stock", "Tidak ada produk yang cocok" → "No products match your filters", "Hapus filter & pencarian" → "Clear filters & search", search placeholder updated to English. (3) **API dedup fix** — `getProductSummary()` called only once in `ProductsPage`, result passed as props to `ProductListSummary`, `ProductTableHeader`, and `ProductFilterDropdown` (previously 3× parallel API calls). (4) **`useDebounce` hook** — created in `hooks/useDebounce.js` (was imported but did not exist). (5) **Quantity column** — "On Hand Quantity" renamed to "In Use"; Quantity and In Use columns now right-aligned with `tabular-nums`. (6) **Star icon** — always rendered in Product column (`visibility:hidden` when not favorite) to prevent layout shift on favorite toggle. (7) **Action dropdown reorder** — Edit Product → Add Stock → Record Usage → separator → Favorites → separator → Delete.                                                                                                                                                                                                                                                                                                                                                                                                | Rafael Cahya |
| 1.12    | 2026-05-15 | **Product Brand module — full spec + P0 validation enforcement.** Section 3.1.2 fully rewritten from stub to production-grade spec. (1) Added user stories (5). (2) Added acceptance criteria for all 4 operations: list, create, edit, delete. (3) Documented P0 uniqueness validation on create and update — case-insensitive ilike check, excludes soft-deleted brands; update excludes self via `.neq("id", id)`; API returns HTTP 409 on conflict. (4) Documented P0 delete guard — service queries `product_list` for active products using brand before soft-delete; throws 409 with count in message. (5) Documented preventive UX: modal edit checks `product_count > 0` → shows red warning box (AlertCircle icon, red border/bg, message with count) below Note field; delete button disabled (`opacity-40 cursor-not-allowed`) — guard fires at modal open, not after attempt. (6) Documented `product_count` field added to list endpoint — parallel fetch via `Promise.all`, merged into each brand object. (7) Added full API endpoint specs (GET/POST/PUT/DELETE) with request/response format, HTTP codes, and validation notes. (8) Added database table reference.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Rafael Cahya |
| 1.13    | 2026-05-15 | **Product Brand — 9 new features documented in section 3.1.2.** (E) Search bar — client-side substring filter on brand name, with clear (X) button, works in combination with status filter and sort. (F) Product count badge column — blue when count > 0 (clickable, navigates to product list pre-filtered by brand), gray when count = 0. (G) Filter & Sort merged dropdown — SlidersHorizontal icon, 4 sort options (A→Z default, Z→A, most/fewest products), independent clear buttons per section, violet badge dot showing active filter/sort count. (H) Bulk status change — per-row checkboxes + select-all, bulk action bar with Set Active / Set Inactive / Deselect All, loops PUT API per brand, toast summary "X brands updated". (I) Explicit edit (pencil icon) button on each row, alongside existing row-click behavior. (J) Restore deleted brand — edit modal for deleted brand shows green Restore Brand button (instead of Delete), calls PUT with brand_status: 'active'. (K) Empty state — PackageOpen icon + "No brands yet" heading + subtitle + Add Brand CTA button. (L) Loading skeleton — shadcn Skeleton table (1 header + 5 body rows) matching real column widths. (M) Layout aligned to Product List page — same controls bar structure, sticky top-0 CSS, same card layout pattern.                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Rafael Cahya |
| 1.14    | 2026-05-16 | **Product Name — section 3.1.3 fully rewritten from stub to production-grade spec.** (1) Added description explaining the foreign key constraint and uniqueness requirement. (2) Added 5 user stories. (3) Added acceptance criteria for all 4 operations: list (with product_count), create (uniqueness check), edit (uniqueness check excluding self), delete (guard: name still in use). (4) Added validations table (4 rules). (5) Added error states table (5 states) including delete guard warning box visual spec. (6) Added full API endpoint specs for all 6 routes with request/response shape, HTTP codes, and current implementation state notes. (7) Added database table reference. (8) Documented 6 P0 implementation gaps found in code review: missing product_count join, missing uniqueness checks on create/update, missing delete guard, missing toast on delete error, missing warning box in edit modal — each gap lists the exact file to fix. (9) Documented upcoming P1/P2 scope for feature parity with Product Brand v1.13.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Rafael Cahya |
| 1.15    | 2026-05-17 | **Product Name — P0 gaps resolved.** All 6 P0 implementation gaps from v1.14 have been implemented by Backend + Frontend agents: `product_count` now returned by list endpoint; uniqueness check added to create and update (case-insensitive, excludes self on update); delete guard added (throws 409 with product count); delete error now surfaced via `toast.error`; warning box + disabled delete button shown in edit modal when `product_count > 0`. Removed P0 gap table from section 3.1.3 and removed "Current state: not yet implemented" notes from API endpoint specs.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Rafael Cahya |
| 1.16    | 2026-05-17 | **Product Name — P1 features documented as production-ready (section 3.1.3).** Replaced 6 P1 bullet placeholders with full specs: (E) Search bar — client-side substring filter, IDs `searchInput_productNamePage` + `clearSearchBtn_productNamePage`, components `ProductNamesPageClient.jsx` + `ProductNamesTable.jsx`. (F) Sort controls — dropdown with A→Z / Z→A / most/fewest options, IDs `filterSortBtn_productNamePage` + `sortOption_*_productNamePage` + `resetSortBtn_productNamePage`, components `ProductNameFilterDropdown.jsx` + `ProductNamesTable.jsx`. (G) Edit button per row — pencil icon, ID pattern `editProductNameBtn_{id}_productNamePage`, component `ProductNamesTable.jsx`. (H) Restore deleted product name — green Restore button in edit modal, ID `restoreProductNameBtn_productNamePage`, success toast "Product name restored successfully!", component `UpdateProductName.jsx`. (I) Loading skeleton — 6 columns × 5 rows shadcn Skeleton table, ID `loadingSkeleton_productNamePage`, component `ProductNamesPageClient.jsx`. (J) Empty states — true empty (PackageOpen icon + Add CTA, ID `emptyState_productNamePage`, `ProductNamesPageClient.jsx`) and filtered empty (SearchX icon + clear button, `ProductNamesTable.jsx`). P2 backlog retained.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Rafael Cahya |
| 1.18    | 2026-05-17 | **Product History — section 3.1.4 fully rewritten from stub to production-grade spec.** Added 4 user stories, acceptance criteria for list view (7-col table, default sort most recent first), search by product name (client-side, AND logic with filter), filter by status (active/inactive/completed), 4 sort options, true empty state, filtered empty state, loading skeleton. Added API endpoint spec, component list, and 13 key test IDs. Called out P0 gap: zero test IDs exist on any element — Frontend must add all IDs before Tester can write tests.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Rafael Cahya |
| 1.17    | 2026-05-17 | **Product Name P2 — full specs written for Bulk Status Change and Product Count Badge Navigation.** Merged Filter & Sort removed from P2 (delivered in P1). (K) Bulk Status Change — per-row checkboxes + select-all header checkbox, bulk action bar with Set Active / Set Inactive / Deselect All, auto-deselect on filter/search change, indeterminate header state, success toast "{n} name(s) updated". Key IDs: `bulkActionBar_productNamePage`, `bulkSetActiveBtn_productNamePage`, `bulkSetInactiveBtn_productNamePage`, `bulkDeselectAllBtn_productNamePage`, `selectAllNames_productNamePage`, `nameCheckbox_{id}_productNamePage`. (L) Product Count Badge Navigation — blue badge wraps a `<button>` when count > 0, navigates to `/main/inventory/product-list?name={encoded}`, slate badge is inert when count = 0, keyboard focus ring required. Key ID: `productCountBadge_{id}_productNamePage`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Rafael Cahya |
| 1.19    | 2026-05-29 | **Sidebar — collapsed mode tooltip.** Added Section 5 "Sidebar Navigation Component" spec. Nav items now use shadcn/ui Tooltip (side=right, delayDuration=0) when sidebar is collapsed, replacing native HTML title attribute. Tooltip only renders when collapsed; expanded state unchanged.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Rafael Cahya |
| 1.20    | 2026-06-17 | **Full English rewrite + DB table registry expansion + PageHeader Running Tracker pages + AI chat endpoint cross-references.** (1) Rewrote all Indonesian content to English throughout the entire file — all section descriptions, table cells, comments, and notes. (2) DB Tables section split into four subsections (Inventory, Trading, Auth, Running Tracker); added `inventory_budget` with column and unique constraint details; added 16 Running Tracker tables with cross-reference note to PRD_Running_Tracker.md section 8 for full schema. (3) PageHeader table expanded with route column and 7 Running Tracker pages (Running Dashboard, Activities, Activity Detail, Analytics, AI Coach, Race Log, Race Detail); added note that Pace Calculator and Settings do not use PageHeader. (4) Added "Shared AI Chat Endpoints" subsection in API Standards cross-referencing `POST /api/chat` (Inventory) and `POST /api/trade-chat` (Trading) to their module PRDs. (5) Version incremented to v1.20.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Rafael Cahya |
