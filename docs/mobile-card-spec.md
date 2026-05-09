# Mobile Card Layout Pattern — Inventory Dashboard Table Sections

## Breakpoint & Switching Strategy

Use card layout below `sm` (< 640px), normal table at `sm` and above.

Implementation: wrap two versions — `<div className="block sm:hidden">` for card list, `<div className="hidden sm:block">` for the existing table. Do not modify existing `hidden sm:table-cell` classes on the table.

---

## Card Anatomy

```
┌─────────────────────────────────────────┐
│  Brand Name                        #01  │  ← Row A: metadata bar
│  Product Full Name  [type badge]        │  ← Row B: product identity
│  [chip 1]  [chip 2]  [primary badge]    │  ← Row C: secondary info
└─────────────────────────────────────────┘
```

**Row A — Metadata bar**

- Brand: `text-xs text-slate-400 font-normal`
- Rank number: `text-xs text-slate-300 font-normal` — float right, no circle
- Layout: `flex items-center justify-between`

**Row B — Product identity**

- Product name: `text-sm font-medium text-slate-700` — full width, no truncate
- Type badge (if present): `text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0` — inline after name
- Layout: `flex items-center gap-1.5 mt-0.5`

**Row C — Secondary info**

- Layout: `flex items-center flex-wrap gap-2 mt-2`
- Each chip: small grey label + value, or direct existing badge component
- Chip label: `text-[10px] text-slate-400 uppercase tracking-wide mr-0.5`
- Chip value: see per-section below

---

## Card Wrapper

```
className="px-4 py-3 border-b border-slate-100 last:border-b-0 hover:bg-violet-50/30 transition-colors"
```

List container:

```
className="divide-y divide-slate-100"
```

---

## Per-Section Secondary Info (Row C)

### RestockPrediction

```
Row C:  [Qty: 3]  [Empty: 14 Jan 2025]  [UrgencyBadge →]
```

- **Qty chip**: label `"Qty"` + value `font-mono font-medium text-sm text-slate-700`
- **Est. Empty chip**: label `"Empty"` + value `text-sm text-slate-600` (formatted date, `dd MMM` format)
- **UrgencyBadge**: existing component, `ml-auto` to float right
- If `quantity === 0` or days very low, Qty value can use `text-red-600`

### ProductTable (CostPerUse)

```
Row C:  [Cost/Use: Rp 4.500]  [StatusBadge →]
```

- **Cost/Use chip**: label `"Cost/Use"` + value `font-semibold text-violet-700 text-sm` — primary metric, bold violet
- **StatusBadge**: existing component, `ml-auto`
- Total Spent & Total Units omitted on mobile (available on product detail page)

### LifecycleScore

```
Row C:  [TierBadge]  [Avg: 45 days]  [ScoreBar →]
```

- **TierBadge**: existing component, left side
- **Avg duration chip**: label `"Avg"` + value `text-sm text-slate-600`
- **ScoreBar**: existing component (`w-20` bar), `ml-auto` to float right
- Cost/Use omitted on mobile

### AvgUsageDuration

```
Row C:  [DurationBadge]
```

- Single item in Row C — no label needed, badge is self-explanatory
- **DurationBadge**: existing component, slightly larger on mobile: `text-sm px-2.5 py-1` (vs `text-xs` on desktop)

---

## Typography Scale

| Element                        | Tailwind class                                       |
| ------------------------------ | ---------------------------------------------------- |
| Brand / Label                  | `text-xs text-slate-400`                             |
| Product name                   | `text-sm font-medium text-slate-700`                 |
| Chip label                     | `text-[10px] text-slate-400 uppercase tracking-wide` |
| Chip value (normal)            | `text-sm text-slate-600`                             |
| Chip value (primary/highlight) | `text-sm font-semibold text-violet-700`              |
| Chip value (mono number)       | `text-sm font-mono font-medium text-slate-700`       |
| Rank number                    | `text-xs text-slate-300`                             |

---

## Spacing

| Area                             | Value                |
| -------------------------------- | -------------------- |
| Card horizontal padding          | `px-4`               |
| Card vertical padding            | `py-3`               |
| Row A to Row B gap               | `mt-0.5`             |
| Row B to Row C gap               | `mt-2`               |
| Gap between chips in Row C       | `gap-2`              |
| Gap between chip label and value | `mr-0.5` / `gap-0.5` |

---

## Badge Colors — Use Existing Components

All badge components (`UrgencyBadge`, `TierBadge`, `DurationBadge`, `StatusBadge`, `ScoreBar`) are used as-is. The card layout only changes **position and container**, not the badges themselves.

Reference palette already in use:

- Critical/red: `bg-red-100 text-red-700 border-red-200`
- Warning/orange: `bg-orange-100 text-orange-700 border-orange-200`
- Caution/yellow: `bg-yellow-100 text-yellow-700 border-yellow-200`
- Good/green: `bg-green-100 text-green-700 border-green-200`
- Best/violet: `bg-violet-100 text-violet-700 border-violet-200`
- Neutral: `bg-slate-100 text-slate-500 border-slate-200`

---

## Skeleton on Mobile

Replace `SkeletonRows` with card skeleton at mobile breakpoint:

```jsx
<div className="px-4 py-3 border-b border-slate-100 animate-pulse">
  <div className="h-3 w-24 bg-slate-100 rounded" />
  <div className="h-4 w-40 bg-slate-100 rounded mt-1" />
  <div className="flex gap-2 mt-2">
    <div className="h-5 w-16 bg-slate-100 rounded" />
    <div className="h-5 w-20 bg-slate-100 rounded" />
  </div>
</div>
```

Use the same `count` prop (default 5).

---

## Reference JSX — RestockPrediction

```jsx
// Mobile card list — block sm:hidden
<div className="block sm:hidden divide-y divide-slate-100">
  {items.map((item, index) => (
    <div key={item.id} className="px-4 py-3 hover:bg-violet-50/30 transition-colors">
      {/* Row A */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">{item.brand || '—'}</span>
        <span className="text-xs text-slate-300">{index + 1}</span>
      </div>
      {/* Row B */}
      <div className="flex items-center gap-1.5 mt-0.5">
        <p className="text-sm font-medium text-slate-700">{item.product}</p>
        {item.type && (
          <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0">
            {item.type}
          </span>
        )}
      </div>
      {/* Row C */}
      <div className="flex items-center flex-wrap gap-2 mt-2">
        <span className="text-xs text-slate-400">
          Qty <span className="font-mono font-medium text-slate-700">{item.quantity}</span>
        </span>
        {item.predicted_date && (
          <span className="text-xs text-slate-400">
            Empty{' '}
            <span className="text-slate-600">
              {format(new Date(item.predicted_date), 'dd MMM')}
            </span>
          </span>
        )}
        <span className="ml-auto">
          <UrgencyBadge quantity={item.quantity} daysUntilEmpty={item.days_until_empty} />
        </span>
      </div>
    </div>
  ))}
</div>
```

Row C content is the only part that changes per section — all other rows follow the same structure.
