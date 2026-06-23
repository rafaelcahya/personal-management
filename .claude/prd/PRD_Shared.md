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

### Page Container

Every page must follow this exact structure — outer wrapper, PageHeader, then section content.

```jsx
export default function ExamplePage() {
  return (
    <main id="{pageName}" className="space-y-6">
      <PageHeader
        title="Page Title"
        description="Short description"
        breadcrumbs={[{ label: 'Module', href: '/main/module' }, { label: 'Current Page' }]}
      />

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* content */}
      </section>
    </main>
  )
}
```

**Rules:**

| Rule            | Value                                                                                                |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| Outer element   | `<main>` — never `<div>`                                                                             |
| Spacing         | `space-y-6` — never `flex flex-col gap-*`                                                            |
| Page ID         | `id="{pageName}"` on `<main>` — camelCase, e.g. `holdingsPage`, `analyticsPage`                      |
| PageHeader      | Required on every page — no inline breadcrumb nav                                                    |
| Section card    | `bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden` — exact classes, no variants |
| Section element | `<section>` for primary content blocks, `<div>` only for layout grouping inside a section            |

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

### Form (Dialog/Modal)

**Reference implementation:** `app/main/trading/currency/holdings/[id]/components/AddTransactionSheet.jsx`

All forms in the app are rendered inside a `Dialog` modal. This section documents every layer of the pattern.

---

#### 1. Stack

- **Schema:** Zod (`z.object`) with `superRefine` for cross-field validation
- **Form state:** `react-hook-form` + `zodResolver`
- **Components:** shadcn/ui `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`

---

#### 2. Dialog Container

```jsx
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent
    ref={dialogRef}
    id="{formName}_{pageName}"
    className="max-w-md max-h-[90vh] flex flex-col p-0 gap-0"
  >
    <DialogHeader className="border-b border-slate-100 px-5 py-4 shrink-0">
      <DialogTitle className="flex items-center gap-2 text-base font-semibold">
        <SomeIcon className="size-4 text-violet-500" />
        Form Title
      </DialogTitle>
      <DialogDescription className="text-xs text-slate-500">
        Short description of what this form does
      </DialogDescription>
    </DialogHeader>

    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col overflow-y-auto px-5 py-5 gap-5"
        noValidate
      >
        {/* fields */}

        <DialogFooter className="gap-2 pt-2 border-t border-slate-100">
          {/* buttons */}
        </DialogFooter>
      </form>
    </Form>
  </DialogContent>
</Dialog>
```

**Key classes:**
| Element | Classes |
|---|---|
| `DialogContent` | `max-w-md max-h-[90vh] flex flex-col p-0 gap-0` |
| `DialogHeader` | `border-b border-slate-100 px-5 py-4 shrink-0` |
| `DialogTitle` | `flex items-center gap-2 text-base font-semibold` — icon left, text right |
| `DialogDescription` | `text-xs text-slate-500` |
| `<form>` | `flex flex-col overflow-y-auto px-5 py-5 gap-5` + `noValidate` |
| `DialogFooter` | `gap-2 pt-2 border-t border-slate-100` |

---

#### 3. Text Input Field

```jsx
<FormField
  control={form.control}
  name="fieldName"
  render={({ field, fieldState }) => (
    <FormItem>
      <FormLabel className="text-sm font-medium">Label</FormLabel>
      <FormControl>
        <Input
          id="{fieldName}_{formName}"
          type="text"
          placeholder="..."
          {...field}
          aria-invalid={!!fieldState.error}
          className={cn(
            'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500',
            fieldState.error && 'border-rose-500'
          )}
        />
      </FormControl>
      <FormDescription className="text-xs text-slate-400">Helper text 💡</FormDescription>
      <FormMessage className="text-xs" />
    </FormItem>
  )}
/>
```

**Input class rules:**
| State | Classes |
|---|---|
| Default | `text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500` |
| Error | add `border-rose-500` |
| Textarea | add `resize-none` |

**Optional field label:**

```jsx
<FormLabel className="text-sm font-medium">
  Label <span className="text-slate-400 font-normal">(optional)</span>
</FormLabel>
```

---

#### 4. Textarea Field

Same as text input but use `<Textarea>` with `rows={3}` and add `resize-none` to className.

```jsx
<Textarea
  id="{fieldName}_{formName}"
  rows={3}
  {...field}
  aria-invalid={!!fieldState.error}
  className={cn(
    'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 resize-none',
    fieldState.error && 'border-rose-500'
  )}
/>
```

---

#### 5. Toggle Button Group

Used for mutually exclusive options (e.g. buy/sell, type selection).

```jsx
<div
  id="{groupName}_{formName}"
  role="group"
  aria-label="Group label"
  className="flex rounded-lg border border-slate-200 overflow-hidden"
>
  {OPTIONS.map((opt) => (
    <button
      key={opt}
      type="button"
      aria-pressed={field.value === opt}
      onClick={() => field.onChange(opt)}
      className={cn(
        'flex-1 py-2 text-sm font-medium capitalize transition-colors',
        field.value === opt ? 'bg-violet-600 text-white' : 'text-slate-600 hover:bg-slate-50'
      )}
    >
      {opt}
    </button>
  ))}
</div>
```

---

#### 6. Date Picker Field

Uses a `Button` trigger + `Calendar` rendered via `createPortal` into the dialog ref (prevents clipping by Dialog's overflow).

```jsx
;<Button
  ref={dateTriggerRef}
  id="{fieldName}_{formName}"
  type="button"
  variant="outline"
  onClick={openCalendar}
  aria-invalid={!!fieldState.error}
  className={cn(
    'w-full justify-start text-left font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600',
    fieldState.error && 'border-rose-500',
    !field.value && 'text-slate-500'
  )}
>
  <CalendarIcon className="mr-2 size-4 opacity-50" />
  {field.value ? format(parseISO(field.value), 'PPP') : 'Pick a date'}
</Button>

{
  calendarOpen &&
    dialogRef.current &&
    createPortal(
      <div
        ref={calendarRef}
        style={{ position: 'absolute', top: calendarPos.top, left: calendarPos.left, zIndex: 9999 }}
        className="bg-white border border-slate-200 rounded-md shadow-lg p-0"
      >
        <Calendar
          mode="single"
          selected={field.value ? parseISO(field.value) : undefined}
          onSelect={(date) => {
            field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
            setCalendarOpen(false)
          }}
          initialFocus
        />
      </div>,
      dialogRef.current
    )
}
```

> Always use `createPortal` into `dialogRef.current` for dropdowns and calendars so they are not clipped by the Dialog's overflow.

---

#### 7. Computed Result Box

Displayed between fields when a value is auto-calculated from user inputs.

```jsx
{
  result !== null && (
    <div className="bg-slate-50 rounded-md p-3 text-sm flex flex-col gap-0.5" aria-live="polite">
      <div>
        <span className="text-slate-500">= </span>
        <span className="font-semibold font-mono text-slate-800">{formattedValue}</span>
        <span className="text-slate-500 ml-1">{unit}</span>
      </div>
      {/* optional sub-line */}
      <div className="text-xs text-slate-400">implied rate: ...</div>
    </div>
  )
}
```

---

#### 8. Footer Buttons

```jsx
<DialogFooter className="gap-2 pt-2 border-t border-slate-100">
  <DialogClose asChild>
    <Button
      type="button"
      disabled={formState.isSubmitting}
      className="text-violet-600 bg-white hover:bg-violet-100 font-medium"
    >
      Cancel
    </Button>
  </DialogClose>
  <Button
    id="submitBtn_{formName}"
    type="submit"
    disabled={formState.isSubmitting}
    className="min-w-[80px]"
  >
    {formState.isSubmitting ? (
      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
    ) : (
      'Submit Label'
    )}
  </Button>
</DialogFooter>
```

**Button rules:**
| Button | Classes |
|---|---|
| Cancel | `text-violet-600 bg-white hover:bg-violet-100 font-medium` |
| Submit | default variant + `min-w-[80px]` |
| Submit loading | replace label with `<Loader2 className="size-4 animate-spin" />` |
| Both | `disabled={formState.isSubmitting}` |

---

#### 9. ID Naming

| Element       | Pattern                  | Example                                  |
| ------------- | ------------------------ | ---------------------------------------- |
| DialogContent | `{formName}_{pageName}`  | `addTransactionModal_currencyDetailPage` |
| Field input   | `{fieldName}_{formName}` | `amountInput_addTransactionModal`        |
| Toggle group  | `{groupName}_{formName}` | `typeToggle_addTransactionModal`         |
| Submit button | `submitBtn_{formName}`   | `submitBtn_addTransactionModal`          |

---

#### 10. Form Reset on Open

Always reset the form when the dialog opens to clear stale state:

```jsx
useEffect(() => {
  if (open) {
    form.reset({ ...defaultValues })
  }
}, [open, form])
```

---

### Data Table Component

**Reference implementation:** `app/main/trading/currency/holdings/page.jsx` (Holdings table) and `app/main/trading/currency/holdings/[currency]/components/TransactionTable.jsx` (Transaction table)

Every data table in the app follows this exact structure and styling convention.

---

#### 1. Outer Container

```jsx
<section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
  {/* Section Header */}
  {/* Body — one of: loading / error / empty / table */}
</section>
```

---

#### 2. Section Header

Icon on the left, title + subtitle in the middle, optional action button on the right.

```jsx
<div className="flex items-start gap-3 px-5 py-4 border-b border-slate-100">
  <div className="flex items-center justify-center size-9 rounded-lg bg-violet-50 shrink-0">
    <SomeIcon className="size-4 text-violet-600" aria-hidden="true" />
  </div>
  <div className="min-w-0 flex-1">
    <p className="text-sm font-semibold text-slate-900">Section Title</p>
    <p className="text-xs text-slate-500 mt-0.5">Short description of what this table shows</p>
  </div>
  {/* Optional action button */}
  <Button
    id="actionBtn_{pageName}"
    size="sm"
    onClick={onAction}
    className="bg-violet-600 hover:bg-violet-700 shrink-0 min-w-11"
  >
    <Plus className="size-4 mr-1.5" aria-hidden="true" />
    <span className="hidden sm:inline">Add Item</span>
    <span className="sm:hidden">Add</span>
  </Button>
</div>
```

---

#### 3. Loading State

Renders inside the section body when data is loading.

```jsx
function TableSkeleton() {
  return (
    <div className="animate-pulse" aria-label="Loading data">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-4 px-5 py-3.5 border-b border-slate-100">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-24 hidden sm:block" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  )
}
```

---

#### 4. Empty State

```jsx
function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <SomeIcon className="size-10 text-slate-300" aria-hidden="true" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-700">No items yet</p>
        <p className="text-xs text-slate-500">Add your first item to get started</p>
      </div>
      <Button size="sm" onClick={onAdd} className="bg-violet-600 hover:bg-violet-700 min-w-11">
        <Plus className="size-4 mr-1.5" aria-hidden="true" />
        Add Item
      </Button>
    </div>
  )
}
```

---

#### 5. Error State

```jsx
function ErrorState({ onRetry }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 gap-4 text-center"
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle className="size-10 text-slate-400" aria-hidden="true" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-700">Failed to load data</p>
        <p className="text-xs text-slate-500">Check your connection and try again</p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry} className="min-w-11">
        Try again
      </Button>
    </div>
  )
}
```

---

#### 6. Table Structure

```jsx
<div className="overflow-x-auto">
  <table
    id="{tableName}_{pageName}"
    className="min-w-full text-sm"
    aria-label="Descriptive table label"
  >
    <thead>
      <tr className="border-b border-slate-100">
        {/* Left-aligned header (text/label columns) */}
        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
          Column
        </th>
        {/* Right-aligned header (numeric columns) */}
        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
          Amount
        </th>
        {/* Hidden on mobile */}
        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap hidden sm:table-cell">
          Extra Column
        </th>
        {/* Actions column — screen-reader only label */}
        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap w-10">
          <span className="sr-only">Actions</span>
        </th>
      </tr>
    </thead>
    <tbody>
      {rows.map((row) => (
        <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
          {/* Text cell */}
          <td className="px-5 py-3.5 text-slate-700 whitespace-nowrap">{row.label}</td>
          {/* Numeric cell — always font-mono, text-right */}
          <td className="px-5 py-3.5 text-right font-mono text-slate-700">{row.amount}</td>
          {/* Hidden on mobile */}
          <td className="px-5 py-3.5 text-right font-mono text-slate-700 hidden sm:table-cell">
            {row.extra}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

**Clickable rows** (navigate to detail page):

```jsx
<tr
  key={row.id}
  id={`{tableName}Row_${row.id}_{pageName}`}
  onClick={() => router.push(`/path/${row.id}`)}
  className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors"
  role="button"
  tabIndex={0}
  aria-label={`View ${row.label} details`}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      router.push(`/path/${row.id}`)
    }
  }}
>
```

---

#### 7. Cell Conventions

| Content type                             | Alignment | Classes                                        |
| ---------------------------------------- | --------- | ---------------------------------------------- |
| Text / label / date                      | Left      | `text-slate-700`                               |
| Primary identifier (currency code, name) | Left      | `font-semibold text-slate-900`                 |
| Number / amount / rate                   | Right     | `text-right font-mono text-slate-700`          |
| Truncatable text (notes)                 | Left      | `text-slate-500 max-w-xs truncate`             |
| Badge                                    | Left      | inline component — see Badge pattern below     |
| % Change with color                      | Right     | inline component — see PctChange pattern below |

---

#### 8. Reusable Cell Components

**TypeBadge** — buy/sell pill:

```jsx
function TypeBadge({ type }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
        type === 'buy' ? 'bg-violet-50 text-violet-700' : 'bg-slate-100 text-slate-600'
      }`}
    >
      {type.toUpperCase()}
    </span>
  )
}
```

**PctChange** — colored percentage with trend icon:

```jsx
function PctChange({ pct }) {
  if (pct === null || pct === undefined || isNaN(pct)) {
    return (
      <span className="flex items-center gap-1 text-slate-500">
        <Minus className="size-3" aria-hidden="true" />
        <span>—</span>
      </span>
    )
  }
  const isPos = pct > 0
  const isNeg = pct < 0
  return (
    <span
      className={`flex items-center gap-1 font-medium ${
        isPos ? 'text-emerald-600' : isNeg ? 'text-red-500' : 'text-slate-500'
      }`}
    >
      {isPos && <TrendingUp className="size-3" aria-hidden="true" />}
      {isNeg && <TrendingDown className="size-3" aria-hidden="true" />}
      {!isPos && !isNeg && <Minus className="size-3" aria-hidden="true" />}
      <span>
        {isPos ? '+' : ''}
        {pct.toFixed(2)}%
      </span>
    </span>
  )
}
```

---

#### 9. Row Actions (DropdownMenu)

```jsx
<td className="px-5 py-3.5 text-right">
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        id={`actionBtn_${row.id}_{pageName}`}
        aria-label={`Actions for ${row.label}`}
        className="flex items-center justify-center size-7 rounded-md hover:bg-slate-100 transition-colors"
      >
        <MoreHorizontal className="size-4 text-slate-400" aria-hidden="true" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        className="text-red-600 focus:text-red-600 focus:bg-red-50 gap-2"
        onClick={() => handleDelete(row)}
      >
        <Trash2 className="size-4" aria-hidden="true" />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</td>
```

---

#### 10. ID Naming

Follow the `{elementName}_{pageName}` convention in camelCase:

| Element                 | Pattern                          | Example                                          |
| ----------------------- | -------------------------------- | ------------------------------------------------ |
| Table                   | `{tableName}_{pageName}`         | `holdingsTable_holdingsPage`                     |
| Clickable row           | `{tableName}Row_{id}_{pageName}` | `holdingsTableRow_USD_holdingsPage`              |
| Action button in header | `{action}Btn_{pageName}`         | `addInvestmentBtn_holdingsPage`                  |
| Row-level action button | `{action}Btn_{id}_{pageName}`    | `deleteTransactionBtn_abc123_currencyDetailPage` |

---

#### 11. Composing States

```jsx
<section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
  <SectionHeader />
  {loading ? (
    <TableSkeleton />
  ) : error ? (
    <ErrorState onRetry={loadData} />
  ) : rows.length === 0 ? (
    <EmptyState onAdd={openSheet} />
  ) : (
    <div className="overflow-x-auto">
      <table>...</table>
    </div>
  )}
</section>
```

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
