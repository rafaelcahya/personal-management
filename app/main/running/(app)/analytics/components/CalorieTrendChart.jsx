'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { fetchCalorieTrend } from '@/lib/api/running'

export default function CalorieTrendChart() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const result = await fetchCalorieTrend()
        if (!cancelled) setData(result)
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load calorie trend')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div
        className="h-[200px] bg-slate-100 rounded-lg animate-pulse"
        aria-label="Loading calorie trend"
      />
    )
  }

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center h-[180px] gap-2 text-center"
        role="alert"
        aria-live="assertive"
      >
        <p className="text-sm text-red-400">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          variant="ghost"
          className="text-xs text-violet-600 underline hover:no-underline"
        >
          Try again
        </Button>
      </div>
    )
  }

  if (data?.weight_kg == null) {
    return (
      <div className="flex flex-col items-center justify-center h-[180px] gap-1 text-center px-4">
        <p className="text-sm text-slate-400">No weight set</p>
        <p className="text-xs text-slate-300">
          Add your weight in Settings to see calorie estimates
        </p>
      </div>
    )
  }

  const months = data?.data ?? []

  if (months.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[180px] gap-1 text-center px-4">
        <p className="text-sm text-slate-400">No calorie data yet</p>
        <p className="text-xs text-slate-300">Complete some runs to see your calorie trends here</p>
      </div>
    )
  }

  return (
    <div id="calorieTrendChart_analyticsPage" className="flex flex-col gap-3">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={months} margin={{ top: 4, right: 8, left: -4, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${Math.round(v / 1000)}k`}
            width={36}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null
              return (
                <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
                  <p className="font-medium text-slate-600 mb-1">{label}</p>
                  <p className="text-slate-800">
                    Calories:{' '}
                    <span className="font-semibold">
                      {Math.round(payload[0]?.value).toLocaleString()} kcal
                    </span>
                  </p>
                </div>
              )
            }}
          />
          <Bar dataKey="total_kcal" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <p className="text-xs text-slate-400">
        Calories estimated using your current weight ({data.weight_kg} kg). Update your weight in
        Settings to keep this accurate.
      </p>
    </div>
  )
}
