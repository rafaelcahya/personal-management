'use client'

import { useState, useEffect } from 'react'
import { ArrowUp, ArrowDown, Minus } from 'lucide-react'
import { getVo2maxStat } from '@/lib/api/running'

export default function CurrentVo2maxStat() {
  const [state, setState] = useState({ status: 'loading', data: null })

  useEffect(() => {
    getVo2maxStat()
      .then((data) => setState({ status: 'success', data }))
      .catch(() => setState({ status: 'error', data: null }))
  }, [])

  if (state.status === 'loading') {
    return (
      <div className="flex flex-col gap-3" aria-label="Loading VO2max stat" aria-busy="true">
        <div className="h-10 w-24 bg-slate-100 rounded animate-pulse" aria-hidden="true" />
        <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" aria-hidden="true" />
        <div className="h-4 w-40 bg-slate-100 rounded animate-pulse" aria-hidden="true" />
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <p className="text-sm text-slate-400" role="alert" aria-live="polite">
        Could not load VO2max data
      </p>
    )
  }

  const { data } = state

  if (!data || data.empty) {
    return (
      <p className="text-sm text-slate-400">
        Need more HR runs to calculate your VO2max (need at least 5)
      </p>
    )
  }

  const deltaPositive = data.delta !== null && data.delta > 0
  const deltaNegative = data.delta !== null && data.delta < 0

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline gap-1.5">
        <span
          id="currentVo2max_analyticsPage"
          className="text-4xl font-bold tabular-nums text-[#7c3aed]"
        >
          {data.current.toFixed(1)}
        </span>
        <span className="text-xs text-slate-400">mL/kg/min</span>
      </div>

      {data.trend !== null && (
        <div id="vo2maxTrendArrow_analyticsPage" className="flex items-center gap-1.5">
          {data.trend === 'up' && (
            <ArrowUp className="w-4 h-4 text-emerald-500" aria-label="Trending up" />
          )}
          {data.trend === 'down' && (
            <ArrowDown className="w-4 h-4 text-red-500" aria-label="Trending down" />
          )}
          {data.trend === 'flat' && (
            <Minus className="w-4 h-4 text-slate-400" aria-label="Stable" />
          )}
          {data.delta !== null && (
            <span
              className={`text-xs font-medium ${
                deltaPositive
                  ? 'text-emerald-600'
                  : deltaNegative
                    ? 'text-red-500'
                    : 'text-slate-400'
              }`}
            >
              {deltaPositive ? '+' : ''}
              {data.delta.toFixed(1)} vs last 30d
            </span>
          )}
        </div>
      )}

      {data.category !== null && (
        <span
          id="vo2maxCategory_analyticsPage"
          className="inline-flex items-center self-start rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700"
        >
          {data.category}
        </span>
      )}

      <p
        id="vo2maxMaintenanceStatus_analyticsPage"
        className={`text-xs ${
          data.maintenance_status === 'ok'
            ? 'text-emerald-600 font-medium'
            : data.maintenance_status === 'at_risk'
              ? 'text-amber-600 font-medium'
              : 'text-slate-400'
        }`}
      >
        {data.maintenance_status === null
          ? 'Set your max HR in profile to unlock maintenance tracking'
          : data.maintenance_status === 'ok'
            ? 'Maintenance: OK'
            : 'Maintenance: At risk'}
      </p>

      <p
        id="vo2maxImprovementSignal_analyticsPage"
        className={`text-xs ${data.improvement_signal ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}
      >
        {data.improvement_signal
          ? 'Interval training detected'
          : 'No interval sessions in last 14d'}
      </p>
    </div>
  )
}
