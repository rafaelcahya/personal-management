'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { RUN_TYPES } from './utils'
import { HILL_TIERS, computeHillScore, getHillTier } from '@/lib/services/running/utils/hillScore'
import EmptyState from './EmptyState'

export default function TerrainDistributionChart({ activities }) {
  const runs = activities.filter((a) => RUN_TYPES.has(a.activity_type))

  if (runs.length === 0) {
    return (
      <EmptyState
        message="No runs yet"
        details="Log some runs to see your terrain mix breakdown."
      />
    )
  }

  const counts = Object.fromEntries(HILL_TIERS.map((tier) => [tier.label, 0]))
  for (const a of runs) {
    const score = computeHillScore(a.elevation_gain_m, a.distance_m)
    const tier = getHillTier(score)
    counts[tier.label] += 1
  }

  const total = runs.length
  const data = HILL_TIERS.map((tier) => ({
    label: tier.label,
    color: tier.color,
    count: counts[tier.label],
    pct: Math.round((counts[tier.label] / total) * 100),
  })).filter((d) => d.count > 0)

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <ResponsiveContainer width="100%" height={200} className="sm:max-w-[200px]">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="label"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            strokeWidth={0}
          >
            {data.map((entry) => (
              <Cell key={entry.label} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const d = payload[0]?.payload
              return (
                <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
                  <p className="font-medium text-slate-600">{d?.label}</p>
                  <p className="text-slate-800 font-semibold">
                    {d?.count} run{d?.count !== 1 ? 's' : ''} ({d?.pct}%)
                  </p>
                </div>
              )
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-col gap-2 w-full sm:w-auto">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: d.color }}
              aria-hidden="true"
            />
            <span className="text-slate-600 font-medium w-24">{d.label}</span>
            <span className="text-slate-400">
              {d.count} run{d.count !== 1 ? 's' : ''} · {d.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
