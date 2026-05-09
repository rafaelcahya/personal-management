'use client'

import { format } from 'date-fns'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Dot,
} from 'recharts'
import { formatRupiah } from '@/lib/utils/currencyFormatter'

function monthLabel(monthStr) {
  if (!monthStr) return '—'
  return format(new Date(monthStr + '-01'), 'MMM yyyy')
}

function monthShort(monthStr) {
  if (!monthStr) return '—'
  return format(new Date(monthStr + '-01'), 'MMM')
}

function DeltaBadge({ delta, deltaPercent }) {
  if (delta === 0 || delta === null) {
    return <span className="text-xs text-slate-400">No change</span>
  }
  const isUp = delta > 0
  const cls = isUp
    ? 'text-red-600 bg-red-50 border-red-200'
    : 'text-green-600 bg-green-50 border-green-200'
  const arrow = isUp ? '▲' : '▼'
  const pct = deltaPercent !== null ? ` ${Math.abs(deltaPercent)}%` : ''
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${cls}`}>
      {arrow}
      {pct} {isUp ? 'more' : 'less'} than last month
    </span>
  )
}

function BarTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
      <p className="font-semibold text-slate-700">{monthLabel(d?.month)}</p>
      <p className="text-violet-700 font-medium">{formatRupiah(d?.total)}</p>
    </div>
  )
}

function LineTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
      <p className="font-semibold text-slate-700">{monthLabel(d?.month)}</p>
      <p className="text-violet-700 font-medium">{formatRupiah(d?.total)}</p>
    </div>
  )
}

export default function SpendComparison({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm shadow-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="h-4 bg-slate-200 rounded w-48 animate-pulse" />
          <div className="h-3 bg-slate-100 rounded w-32 mt-1.5 animate-pulse" />
        </div>
        <div className="px-5 py-6">
          <div className="h-48 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>
    )
  }

  const thisMonth = data?.thisMonth ?? { month: '', total: 0 }
  const lastMonth = data?.lastMonth ?? { month: '', total: 0 }
  const delta = data?.delta ?? 0
  const deltaPercent = data?.deltaPercent ?? null
  const recent3 = data?.recent3 ?? []
  const trend6 = data?.trend6 ?? []

  const hasAnyData = trend6.some((m) => m.total > 0)

  if (!hasAnyData) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm shadow-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">
            📊 Spend This Month vs Last Month
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare your total purchasing spend month-over-month
          </p>
        </div>
        <div className="py-10 text-center">
          <p className="text-sm text-slate-400">No purchase data yet 📋</p>
        </div>
      </div>
    )
  }

  const barData = recent3.map((m) => ({
    ...m,
    label: monthShort(m.month),
    isThis: m.month === thisMonth.month,
  }))

  const lineData = trend6.map((m) => ({
    ...m,
    label: monthShort(m.month),
  }))

  const allLineValues = lineData.map((d) => d.total).filter((v) => v > 0)
  const lineMin = allLineValues.length ? Math.min(...allLineValues) * 0.8 : 0

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm shadow-slate-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-base font-semibold text-slate-800">
          📊 Spend This Month vs Last Month
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Compare your total purchasing spend month-over-month
        </p>
      </div>

      <div className="px-5 py-4 flex flex-col gap-5">
        {/* Stats row */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-6">
            <div>
              <p className="text-xs text-slate-400">{monthLabel(thisMonth.month)}</p>
              <p className="text-xl font-bold text-slate-800 mt-0.5 whitespace-nowrap">
                {formatRupiah(thisMonth.total)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">{monthLabel(lastMonth.month)}</p>
              <p className="text-xl font-bold text-slate-400 mt-0.5 whitespace-nowrap">
                {formatRupiah(lastMonth.total)}
              </p>
            </div>
          </div>
          <DeltaBadge delta={delta} deltaPercent={deltaPercent} />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Bar chart — 3 months */}
          <div>
            <p className="text-xs text-slate-400 mb-2">Last 3 months</p>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart
                data={barData}
                barSize={40}
                margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip content={<BarTooltip />} cursor={{ fill: '#f8f7ff' }} />
                <Bar dataKey="total" radius={[5, 5, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={index} fill={entry.isThis ? '#7c3aed' : '#c4b5fd'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line chart — 6 months trend */}
          <div>
            <p className="text-xs text-slate-400 mb-2">6-month trend</p>
            <ResponsiveContainer width="100%" height={130}>
              <LineChart data={lineData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide domain={[lineMin, 'auto']} />
                <Tooltip content={<LineTooltip />} />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  dot={<Dot r={3} fill="#7c3aed" stroke="#fff" strokeWidth={2} />}
                  activeDot={{ r: 4, fill: '#7c3aed', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
