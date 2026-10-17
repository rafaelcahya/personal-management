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
