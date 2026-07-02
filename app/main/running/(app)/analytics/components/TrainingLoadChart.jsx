'use client'

import Button from '@/components/base/Button/Button'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Info } from 'lucide-react'
import {
  Tooltip as UITooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip'
import { ACWR_COLORS } from './utils'
import EmptyState from './EmptyState'

const STATUS_LABELS = {
  no_data: 'No Data',
  low: 'Low Load',
  optimal: 'Optimal',
  caution: 'Caution',
  danger: 'High Risk',
  resting: 'Rest Week',
}

const TRAINING_STATUS_CONFIG = {
  productive: {
    label: 'Productive',
    badge: 'bg-green-100 text-green-700',
    tip: 'Your training is working — VO2max is trending upward at a healthy load level.',
  },
  maintaining: {
    label: 'Maintaining',
    badge: 'bg-blue-100 text-blue-700',
    tip: "You're sustaining current fitness. Add a quality session to stimulate improvement.",
  },
  peaking: {
    label: 'Peaking',
    badge: 'bg-violet-100 text-violet-700',
    tip: 'Load is tapering while VO2max is rising — a successful taper before a race.',
  },
  overreaching: {
    label: 'Overreaching',
    badge: 'bg-red-100 text-red-700',
    tip: 'Training load is too high relative to baseline. Reduce volume for at least one week.',
  },
  unproductive: {
    label: 'Unproductive',
    badge: 'bg-amber-100 text-amber-700',
    tip: 'Training consistently but VO2max is declining. Review training quality and recovery.',
  },
  detraining: {
    label: 'Detraining',
    badge: 'bg-slate-100 text-slate-500',
    tip: 'Training load is low and VO2max is not rising. Gradually increase volume to rebuild.',
  },
}

function StatusInfoTip({ content }) {
  return (
    <TooltipProvider delayDuration={200}>
      <UITooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon-xs" aria-label="More information">
            <Info className="size-3" aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-56 text-xs leading-relaxed">
          {content}
        </TooltipContent>
      </UITooltip>
    </TooltipProvider>
  )
}

export default function TrainingLoadChart({ trainingLoad }) {
  if (!trainingLoad || trainingLoad.status === 'no_data') {
    return <EmptyState message="Not enough training history to show load trends (need 28+ days)" />
  }

  const { acwr, acute_load_7d, chronic_load_28d, status, training_status } = trainingLoad
  const statusColor = ACWR_COLORS[status] ?? '#94a3b8'
  const trainingStatusMeta = training_status ? TRAINING_STATUS_CONFIG[training_status] : null

  const barData = [
    { label: 'Acute (7d)', value: parseFloat(acute_load_7d?.toFixed(1) ?? 0), fill: '#8b5cf6' },
    {
      label: 'Chronic (28d)',
      value: parseFloat(chronic_load_28d?.toFixed(1) ?? 0),
      fill: '#c4b5fd',
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <div className="flex items-center gap-3">
          <div className="text-3xl font-bold tabular-nums" style={{ color: statusColor }}>
            {acwr != null ? acwr.toFixed(2) : '—'}
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-slate-400">ACWR</p>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className="inline-block text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ background: statusColor + '22', color: statusColor }}
              >
                {STATUS_LABELS[status] ?? status}
              </span>
              {trainingStatusMeta && (
                <div className="flex items-center gap-1">
                  <span
                    className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${trainingStatusMeta.badge}`}
                  >
                    {trainingStatusMeta.label}
                  </span>
                  <StatusInfoTip content={trainingStatusMeta.tip} />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="sm:ml-4 text-xs text-slate-400 max-w-xs">
          Ratio of your last 7-day load vs 28-day average.{' '}
          <span className="text-slate-500">0.8–1.3 is optimal.</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={120}>
        <BarChart
          data={barData}
          layout="vertical"
          margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickLine={false}
            axisLine={false}
            width={88}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              return (
                <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
                  <p className="text-slate-600 font-medium">{payload[0]?.payload?.label}</p>
                  <p className="text-slate-800 font-semibold">{payload[0]?.value} pts</p>
                </div>
              )
            }}
          />
          <Bar dataKey="value" radius={[0, 3, 3, 0]}>
            {barData.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-slate-100">
        {[
          { range: '< 0.8', label: 'Low Load', color: '#60a5fa' },
          { range: '0.8–1.3', label: 'Optimal', color: '#22c55e' },
          { range: '1.3–1.5', label: 'Caution', color: '#eab308' },
          { range: '> 1.5', label: 'High Risk', color: '#ef4444' },
        ].map((z) => (
          <div key={z.range} className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: z.color }} />
            <span>
              {z.range} — {z.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
