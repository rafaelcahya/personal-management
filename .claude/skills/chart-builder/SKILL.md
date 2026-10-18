---
name: chart-builder
description: Build or change charts in this repo with Recharts 3 — file placement, ResponsiveContainer sizing, axis and grid styling with CSS variables, custom tooltips, empty states for too-little data, legends, ids, and accessibility. Use for any chart or data visualization in app/main/; load the dataviz skill for color and form choices.
---

# Chart Builder (Recharts)

Library: `recharts` 3. For **choosing the chart type, colors, and layout**, also load the `dataviz` skill. This skill covers how charts are built in this repo.

## Placement

One chart per file in the page's `components/` folder (`EfTrendChart.jsx`, `WeeklyDistanceChart.jsx`), wrapped in the page's `Section` card. Data shaping helpers go in `components/utils.js` next to them (e.g. `RUN_TYPES`, `rolling30DayAvg`).

## Pattern (from `app/main/running/(app)/analytics/components/EfTrendChart.jsx`)

```jsx
'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  EmptyState,
  EmptyStateTitle,
  EmptyStateDescription,
} from '@/components/base/EmptyState/EmptyState'

const MIN_POINTS = 3
const AXIS_TICK = { fontSize: 10, fill: 'var(--color-muted-foreground)' }

export default function EfTrendChart({ activities }) {
  const points = activities
    .filter((a) => a.efficiency_factor != null)
    .sort((a, b) => new Date(a.started_at) - new Date(b.started_at))
    .slice(-90)
    .map((a) => ({
      label: new Date(a.started_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      ef: Number(a.efficiency_factor),
    }))

  if (points.length < MIN_POINTS) {
    return (
      <EmptyState size="sm">
        <EmptyStateTitle>Not enough data yet</EmptyStateTitle>
        <EmptyStateDescription id="efTrendEmptyCount_analyticsPage">
          Need at least {MIN_POINTS} runs with EF. Currently have {points.length}.
        </EmptyStateDescription>
      </EmptyState>
    )
  }

  return (
    <div role="img" aria-label={`Efficiency factor trend, ${points.length} runs`}>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={points} margin={{ top: 4, right: 8, left: -4, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="label"
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            width={52}
          />
          <Tooltip content={<EfTooltip />} />
          <Line
            type="monotone"
            dataKey="ef"
            stroke="var(--color-violet-600)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
```

## Rules

1. Always wrap in `ResponsiveContainer width="100%"` with a fixed height (180–240px for section charts).
2. **Too little data → EmptyState**, with the reason and the count, instead of an empty or misleading chart. Put the minimum in a named constant.
3. Colors come from CSS variables (`var(--color-violet-600)`, `var(--color-border)`, `var(--color-muted-foreground)`, `var(--chart-1)`…`var(--chart-5)`). No new raw hex — some older charts hard-code `#22c55e`/`#ef4444`; use `var(--color-success)` / `var(--color-destructive)` instead.
4. Axes: small ticks (`fontSize: 10`), no tick lines or axis lines, `interval="preserveStartEnd"` for dates.
5. Custom tooltip as a small card: `bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs`, values formatted with units.
6. Show a legend (custom flex row under the chart) whenever there's more than one series or color meaning.
7. Add a small caption with the data range/count (`text-xs text-slate-400`) and give it an `id` for tests.
8. Accessibility: wrapper gets `role="img"` and an `aria-label` that states what the chart shows; never rely on color alone (add sign, label, or legend).
9. Keep data shaping out of JSX — compute arrays before `return`, and memoize (`useMemo`) when the input is large.
