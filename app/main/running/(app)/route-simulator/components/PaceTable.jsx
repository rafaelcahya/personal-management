'use client'

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/base/Table/Table.jsx'
import { fmtPace } from '../../dashboard/utils/format'

const ZONE_STYLE = {
  climb: 'bg-amber-100 text-amber-700',
  cruise: 'bg-slate-100 text-slate-600',
  descend: 'bg-green-100 text-green-700',
}

function zoneForSplit(s) {
  const net = s.ele_gain_m - s.ele_loss_m
  if (net > 5) return 'climb'
  if (net < -5) return 'descend'
  return 'cruise'
}

export default function PaceTable({ splits }) {
  if (!splits?.length) return null
  const hasHr = splits.some((s) => s.target_hr_low != null)

  return (
    <div id="paceTable_routeSimulatorPage" className="overflow-x-auto">
      <Table className="min-w-max w-full" aria-label="Per-kilometre pace plan">
        <TableHeader sticky>
          <TableRow>
            <TableHead className="px-3 whitespace-nowrap text-xs uppercase tracking-wide">
              KM
            </TableHead>
            <TableHead
              className="px-3 whitespace-nowrap text-xs uppercase tracking-wide"
              align="right"
            >
              Pace
            </TableHead>
            <TableHead
              className="px-3 whitespace-nowrap text-xs uppercase tracking-wide"
              align="right"
            >
              Elev
            </TableHead>
            {hasHr && (
              <TableHead
                className="px-3 whitespace-nowrap text-xs uppercase tracking-wide"
                align="right"
              >
                HR
              </TableHead>
            )}
            <TableHead className="px-3 whitespace-nowrap text-xs uppercase tracking-wide">
              Zone
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {splits.map((s) => {
            const zone = zoneForSplit(s)
            return (
              <TableRow key={s.km}>
                <TableCell className="px-3 whitespace-nowrap text-xs font-medium text-slate-400">
                  {s.km}
                </TableCell>
                <TableCell
                  className="px-3 whitespace-nowrap font-mono tabular-nums text-slate-700"
                  align="right"
                >
                  {fmtPace(s.pace_sec_per_km)}
                </TableCell>
                <TableCell
                  className="px-3 whitespace-nowrap tabular-nums text-xs text-slate-500"
                  align="right"
                >
                  +{s.ele_gain_m}/-{s.ele_loss_m}
                </TableCell>
                {hasHr && (
                  <TableCell
                    className="px-3 whitespace-nowrap tabular-nums text-xs text-slate-500"
                    align="right"
                  >
                    {s.target_hr_low != null ? `${s.target_hr_low}–${s.target_hr_high}` : '—'}
                  </TableCell>
                )}
                <TableCell className="px-3 whitespace-nowrap">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${ZONE_STYLE[zone]}`}
                  >
                    {zone}
                  </span>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
