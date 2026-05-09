'use client'

import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Dot,
} from 'recharts'
import { format } from 'date-fns'
import { formatRupiah } from '@/lib/utils/currencyFormatter'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null

  const hasDelta = d.delta !== null
  const isUp = d.delta > 0
  const arrow = isUp ? '▲' : '▼'
  const deltaColor = isUp ? 'text-red-600' : 'text-green-600'

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2.5 text-xs min-w-[160px]">
      <p className="font-semibold text-slate-600 mb-1.5">
        {d.date ? format(new Date(d.date), 'dd MMM yyyy') : '—'}
      </p>
      <div className="flex justify-between gap-4">
        <span className="text-slate-400">Spent</span>
        <span className="font-medium text-slate-700">{formatRupiah(d.price)}</span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-slate-400">Cost/Use</span>
        <span className="font-medium text-violet-700">{formatRupiah(d.cost_per_use)}</span>
      </div>
      {hasDelta && (
        <div
          className={`flex justify-between gap-4 mt-1 pt-1 border-t border-slate-100 ${deltaColor}`}
        >
          <span>vs prev</span>
          <span className="font-semibold">
            {arrow} {formatRupiah(Math.abs(d.delta))}
            {d.delta_percent !== null ? ` (${Math.abs(d.delta_percent)}%)` : ''}
          </span>
        </div>
      )}
    </div>
  )
}

function ProductSelector({ items, selectedId, onChange }) {
  return (
    <select
      value={selectedId ?? ''}
      onChange={(e) => onChange(Number(e.target.value))}
      className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-300 bg-white w-full"
    >
      {items.map((item) => (
        <option key={item.product_list_id} value={item.product_list_id}>
          {item.brand ? `${item.brand} · ` : ''}
          {item.product}
          {item.type ? ` (${item.type})` : ''}
        </option>
      ))}
    </select>
  )
}

export default function CostPerUseHistory({ items, loading }) {
  const [selectedId, setSelectedId] = useState(null)

  const selected = items.find((i) => i.product_list_id === selectedId) ?? items[0] ?? null

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm shadow-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="h-4 bg-slate-200 rounded w-48 animate-pulse" />
          <div className="h-3 bg-slate-100 rounded w-36 mt-1.5 animate-pulse" />
        </div>
        <div className="px-5 py-6">
          <div className="h-48 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm shadow-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">📈 Avg Cost/Use Over Time</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            How your cost per use changes with each purchase
          </p>
        </div>
        <div className="py-10 text-center">
          <p className="text-sm text-slate-400">No purchase history yet 📊</p>
        </div>
      </div>
    )
  }

  const chartData = (selected?.history ?? []).map((h) => ({
    ...h,
    dateLabel: h.date ? format(new Date(h.date), 'MMM d') : '—',
  }))

  const allValues = chartData.map((d) => d.cost_per_use).filter(Boolean)
  const minVal = allValues.length ? Math.min(...allValues) * 0.85 : 0

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm shadow-slate-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex flex-col items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-800">📈 Avg Cost/Use Over Time</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cumulative cost per use after each purchase — hover for delta
          </p>
        </div>
        <ProductSelector
          items={items}
          selectedId={selected?.product_list_id}
          onChange={setSelectedId}
        />
      </div>

      <div className="px-5 py-4">
        {chartData.length < 2 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-slate-400">Not enough purchases to show a trend yet.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="dateLabel"
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                domain={[minVal, 'auto']}
                width={36}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="cost_per_use"
                stroke="#7c3aed"
                strokeWidth={2}
                dot={<Dot r={4} fill="#7c3aed" stroke="#fff" strokeWidth={2} />}
                activeDot={{ r: 5, fill: '#7c3aed', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
