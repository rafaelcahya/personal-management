'use client'

import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import { fetchFitnessAgeTrend } from '@/lib/api/running'

function fmtWeek(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function FitnessAgeTrendChart() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchFitnessAgeTrend()
      .then((d) => {
        if (!cancelled) setData(d)
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load fitness age data')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div
        id="fitnessAgeTrendLoading_analyticsPage"
        className="h-[200px] bg-slate-50 rounded-lg animate-pulse"
      />
    )
  }

  if (error) {
    return (
      <p id="fitnessAgeTrendError_analyticsPage" className="text-sm text-red-400 py-4">
        {error}
      </p>
    )
  }

  if (data?.sex_missing) {
    return (
      <div
        id="fitnessAgeTrendSexMissing_analyticsPage"
        className="flex flex-col items-center justify-center h-[180px] gap-1 text-center px-4"
      >
        <p className="text-sm text-slate-400">Sex not set in your profile</p>
        <p className="text-xs text-slate-300">
          Add your sex in{' '}
          <a href="/main/running/settings" className="text-violet-500 underline">
            Settings
          </a>{' '}
          to see your Fitness Age trend.
        </p>
      </div>
    )
  }

  const weekly = data?.weekly ?? []

  if (weekly.length === 0) {
    return (
      <div
        id="fitnessAgeTrendEmpty_analyticsPage"
        className="flex flex-col items-center justify-center h-[180px] gap-1 text-center px-4"
      >
        <p className="text-sm text-slate-400">Not enough data yet</p>
        <p className="text-xs text-slate-300">
          Need at least 4 qualifying runs with HR + VO₂max data per week to show the trend.
        </p>
      </div>
    )
  }

  const chronologicalAge = data?.chronological_age ?? null
  const chartData = weekly.map((w) => ({ ...w, label: fmtWeek(w.week) }))

  const ages = chartData.map((d) => d.fitness_age)
  const allAges = chronologicalAge != null ? [...ages, chronologicalAge] : ages
  const yMin = Math.max(0, Math.min(...allAges) - 5)
  const yMax = Math.max(...allAges) + 5

  return (
    <div>
      <p id="fitnessAgeTrendDataCount_analyticsPage" className="text-xs text-slate-400 mb-3">
        Showing {weekly.length} week{weekly.length !== 1 ? 's' : ''} · based on last 8 qualifying
        runs per week
        {chronologicalAge != null && ` · your age: ${chronologicalAge}`}
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: -4, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[yMin, yMax]}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            unit=" yrs"
            width={52}
          />
          {chronologicalAge != null && (
            <ReferenceLine
              y={chronologicalAge}
              stroke="#94a3b8"
              strokeDasharray="5 3"
              strokeOpacity={0.7}
              label={{
                value: 'Your age',
                position: 'insideTopRight',
                fontSize: 10,
                fill: '#94a3b8',
              }}
            />
          )}
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null
              const d = payload[0]?.payload
              return (
                <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
                  <p className="font-medium text-slate-600 mb-1">{label}</p>
                  <p className="text-slate-800">
                    Fitness Age: <span className="font-semibold">{d?.fitness_age} yrs</span>
                  </p>
                  {d?.avg_vo2max != null && (
                    <p className="text-violet-600 mt-0.5">
                      Avg VO₂max:{' '}
                      <span className="font-semibold">
                        {Number(d.avg_vo2max).toFixed(1)} mL/kg/min
                      </span>
                    </p>
                  )}
                  {chronologicalAge != null && (
                    <p className="text-slate-400 mt-0.5">
                      {d?.fitness_age < chronologicalAge
                        ? `${chronologicalAge - d.fitness_age} yrs younger`
                        : d?.fitness_age > chronologicalAge
                          ? `${d.fitness_age - chronologicalAge} yrs older`
                          : 'Same as your age'}
                    </p>
                  )}
                </div>
              )
            }}
          />
          <Line
            type="monotone"
            dataKey="fitness_age"
            stroke="#7c3aed"
            strokeWidth={2}
            dot={{ fill: '#7c3aed', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
            name="Fitness Age"
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
