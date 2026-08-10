'use client'

import { useState } from 'react'
import {
  EmptyState,
  EmptyStateTitle,
  EmptyStateDescription,
} from '@/components/base/EmptyState/EmptyState'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/base/Table/Table.jsx'

function fmtTime(sec) {
  if (!sec || sec <= 0) return '—'
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function fmtDistKm(m) {
  if (!m || m <= 0) return '—'
  return `${(m / 1000).toFixed(1)} km`
}

function gearDisplayName(g) {
  if (g.name) return g.name
  const parts = [g.brand_name, g.model_name].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : 'Unknown gear'
}

export default function GearUsageBreakdown({ gear, error }) {
  const [showRetired, setShowRetired] = useState(false)

  if (error) {
    return (
      <EmptyState size="sm" variant="error">
        <EmptyStateTitle>Failed to load gear data</EmptyStateTitle>
      </EmptyState>
    )
  }

  if (!gear) return null

  const visible = showRetired ? gear : gear.filter((g) => !g.retired)
  const hasRetired = gear.some((g) => g.retired)

  if (!visible.length) {
    return (
      <div id="gearUsageBreakdown_analyticsPage" className="flex flex-col gap-3">
        <EmptyState size="sm">
          <EmptyStateTitle>
            {gear.length === 0 ? 'No gear usage in this range' : 'No active gear in this range'}
          </EmptyStateTitle>
          {gear.length > 0 && !showRetired && (
            <EmptyStateDescription>Toggle to include retired gear.</EmptyStateDescription>
          )}
        </EmptyState>
        {hasRetired && (
          <RetiredToggle showRetired={showRetired} onToggle={() => setShowRetired((v) => !v)} />
        )}
      </div>
    )
  }

  return (
    <div id="gearUsageBreakdown_analyticsPage" className="flex flex-col gap-3">
      <div className="overflow-x-auto">
        <Table
          id="gearUsageTable_analyticsPage"
          className="min-w-max w-full"
          aria-label="Gear usage breakdown"
        >
          <TableHeader sticky>
            <TableRow>
              <TableHead className="px-3 py-3 whitespace-nowrap font-semibold text-slate-500">
                Gear
              </TableHead>
              <TableHead
                className="px-3 py-3 whitespace-nowrap font-semibold text-slate-500"
                align="right"
              >
                Activities
              </TableHead>
              <TableHead
                className="px-3 py-3 whitespace-nowrap font-semibold text-slate-500"
                align="right"
              >
                Time
              </TableHead>
              <TableHead
                className="px-3 py-3 whitespace-nowrap font-semibold text-slate-500"
                align="right"
              >
                Distance
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((g) => (
              <TableRow key={g.id}>
                <TableCell className="px-3 py-3.5 whitespace-nowrap">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-slate-900 leading-tight">
                      {gearDisplayName(g)}
                    </span>
                    {g.retired && (
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full w-fit">
                        Retired
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell
                  className="px-3 py-3.5 whitespace-nowrap font-mono text-slate-700"
                  align="right"
                >
                  {g.total_activities}
                </TableCell>
                <TableCell
                  className="px-3 py-3.5 whitespace-nowrap font-mono text-slate-700"
                  align="right"
                >
                  {fmtTime(g.total_moving_time_sec)}
                </TableCell>
                <TableCell
                  className="px-3 py-3.5 whitespace-nowrap font-mono text-slate-700"
                  align="right"
                >
                  {fmtDistKm(g.total_distance_m)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {hasRetired && (
        <RetiredToggle showRetired={showRetired} onToggle={() => setShowRetired((v) => !v)} />
      )}
    </div>
  )
}

function RetiredToggle({ showRetired, onToggle }) {
  return (
    <Button
      type="button"
      size="xs"
      variant="ghost"
      id="gearRetiredToggle_analyticsPage"
      onClick={onToggle}
      className="self-start text-xs text-violet-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 rounded"
    >
      {showRetired ? 'Hide retired gear' : 'Show retired gear'}
    </Button>
  )
}
