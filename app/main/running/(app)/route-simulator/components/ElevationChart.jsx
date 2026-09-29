'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { fmtPace } from '../../dashboard/utils/format'

const ZONE_COLOR = {
  climb: 'bg-amber-400',
  cruise: 'bg-slate-300',
  descend: 'bg-green-400',
}

const ZONE_LABEL = {
  climb: 'Climb — ease off',
  cruise: 'Cruise — hold pace',
  descend: 'Descend — let it roll',
}

function fmtKm(m) {
  return `${(m / 1000).toFixed(1)}k`
}

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
      <p className="font-medium text-slate-700">{fmtKm(p.cum_dist_m)}</p>
      <p className="text-slate-500">Elevation: {p.ele_m} m</p>
      <p className="text-slate-500">Grade: {p.grade}%</p>
      <p className="text-slate-500">Target pace: {fmtPace(p.pace_sec_per_km)}/km</p>
    </div>
  )
}

export default function ElevationChart({ profile }) {
  if (!profile?.length) return null

  const total = profile[profile.length - 1].cum_dist_m || 1

  return (
    <div id="elevationChart_routeSimulatorPage">
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={profile} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="eleFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis
            dataKey="cum_dist_m"
            type="number"
            domain={[0, total]}
            tickFormatter={fmtKm}
            tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
            width={44}
            unit=" m"
          />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="ele_m"
            stroke="#7c3aed"
            strokeWidth={2}
            fill="url(#eleFill)"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Effort-zone strip — colored by terrain, aligned to distance */}
      <div className="mt-2 flex h-2.5 w-full overflow-hidden rounded-full" aria-hidden="true">
        {profile.slice(1).map((p, i) => {
          const width = ((p.cum_dist_m - profile[i].cum_dist_m) / total) * 100
          return (
            <div key={p.cum_dist_m} className={ZONE_COLOR[p.zone]} style={{ width: `${width}%` }} />
          )
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
        {Object.entries(ZONE_LABEL).map(([zone, label]) => (
          <span key={zone} className="flex items-center gap-1.5">
            <span className={`inline-block size-2.5 rounded-full ${ZONE_COLOR[zone]}`} />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
