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

function fmtKm(m) {
  return `${(m / 1000).toFixed(1)}k`
}

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
      <p className="font-medium text-slate-700">{fmtKm(p.cum_dist_m)}</p>
      <p className="text-slate-500">Energy used: {p.energy_pct}%</p>
    </div>
  )
}

export default function EnergyBudgetChart({ profile }) {
  if (!profile?.length) return null
  const total = profile[profile.length - 1].cum_dist_m || 1

  return (
    <div id="energyBudgetChart_routeSimulatorPage">
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={profile} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="energyFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#f97316" stopOpacity={0.03} />
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
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
            width={44}
            unit="%"
          />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="energy_pct"
            stroke="#f97316"
            strokeWidth={2}
            fill="url(#energyFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
      <p className="mt-1 text-xs text-slate-400">
        Cumulative effort spent along the route — climbs eat a bigger slice per km.
      </p>
    </div>
  )
}
