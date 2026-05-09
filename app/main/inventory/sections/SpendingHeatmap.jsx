'use client'

import { useMemo, useState } from 'react'
import { format, startOfWeek, addDays, subYears, eachWeekOfInterval } from 'date-fns'
import { formatRupiah } from '@/lib/utils/currencyFormatter'

const LEVELS = [
  { min: 0, max: 0, bg: 'bg-slate-100', label: 'No spend' },
  { min: 1, max: 49999, bg: 'bg-violet-200', label: '< 50k' },
  { min: 50000, max: 199999, bg: 'bg-violet-400', label: '50k–200k' },
  { min: 200000, max: 499999, bg: 'bg-violet-600', label: '200k–500k' },
  { min: 500000, max: Infinity, bg: 'bg-violet-800', label: '> 500k' },
]

function getLevel(total) {
  return LEVELS.findIndex((l) => total >= l.min && total <= l.max)
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function SpendingHeatmap({ items, loading }) {
  const [tooltip, setTooltip] = useState(null)

  const spendMap = useMemo(() => {
    const map = {}
    for (const item of items) map[item.date] = item.total
    return map
  }, [items])

  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date()
    const start = startOfWeek(subYears(today, 1), { weekStartsOn: 0 })
    const end = startOfWeek(today, { weekStartsOn: 0 })

    const weekStarts = eachWeekOfInterval({ start, end }, { weekStartsOn: 0 })

    const weeksData = weekStarts.map((weekStart) =>
      Array.from({ length: 7 }, (_, i) => {
        const date = addDays(weekStart, i)
        const key = format(date, 'yyyy-MM-dd')
        const total = spendMap[key] || 0
        const isFuture = date > today
        return { date, key, total, level: isFuture ? -1 : getLevel(total) }
      })
    )

    // Month labels: find first week index per month
    const labels = []
    let lastMonth = -1
    weeksData.forEach((week, wi) => {
      const month = week[0].date.getMonth()
      if (month !== lastMonth) {
        labels.push({ label: format(week[0].date, 'MMM'), col: wi })
        lastMonth = month
      }
    })

    return { weeks: weeksData, monthLabels: labels }
  }, [spendMap])

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm shadow-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">🗓️ Spending Heatmap</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Daily purchase activity over the last 12 months
          </p>
        </div>
        <div className="px-5 py-6 animate-pulse">
          <div className="h-24 bg-slate-100 rounded-lg w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm shadow-slate-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-base font-semibold text-slate-800">🗓️ Spending Heatmap</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Daily purchase activity over the last 12 months
        </p>
      </div>

      <div className="relative">
        <div className="px-5 py-4 overflow-x-auto">
          <div className="inline-flex gap-3">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] pt-5">
              {DAY_LABELS.map((d, i) => (
                <div
                  key={d}
                  className="h-[11px] text-[9px] text-slate-400 leading-none flex items-center"
                  style={{ visibility: i % 2 === 1 ? 'visible' : 'hidden' }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="relative">
              {/* Month labels */}
              <div className="flex h-4 mb-1 relative" style={{ width: weeks.length * 14 }}>
                {monthLabels.map(({ label, col }) => (
                  <span
                    key={`${label}-${col}`}
                    className="absolute text-[10px] text-slate-500"
                    style={{ left: col * 14 }}
                  >
                    {label}
                  </span>
                ))}
              </div>

              {/* Cells */}
              <div className="flex gap-[3px]">
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[3px]">
                    {week.map(({ date, key, total, level }) => {
                      if (level === -1) return <div key={key} className="w-[11px] h-[11px]" />
                      const levelCls = LEVELS[level]?.bg ?? 'bg-slate-100'
                      return (
                        <div
                          key={key}
                          className={`w-[11px] h-[11px] rounded-[2px] cursor-pointer ${levelCls} transition-opacity hover:opacity-70`}
                          onMouseEnter={(e) =>
                            setTooltip({
                              date: format(date, 'dd MMM yyyy'),
                              total,
                              x: e.currentTarget.getBoundingClientRect().left,
                              y: e.currentTarget.getBoundingClientRect().top,
                            })
                          }
                          onMouseLeave={() => setTooltip(null)}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tooltip */}
          {tooltip && (
            <div
              className="fixed z-50 pointer-events-none bg-slate-800 text-white text-xs rounded px-2 py-1.5 shadow-lg -translate-x-1/2 -translate-y-full"
              style={{ left: tooltip.x + 6, top: tooltip.y - 6 }}
            >
              <p className="font-medium">{tooltip.date}</p>
              <p className="text-slate-300">
                {tooltip.total > 0 ? formatRupiah(tooltip.total) : 'No spend'}
              </p>
            </div>
          )}
        </div>
        {/* Scroll indicator — visible only on mobile */}
        <div className="md:hidden absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white to-transparent pointer-events-none rounded-r-xl" />
      </div>
      {/* Legend */}
      <div className="px-5 pb-4 flex items-center gap-1.5">
        <span className="text-[10px] text-slate-400">Less</span>
        {LEVELS.map((l, i) => (
          <div key={i} className={`w-[11px] h-[11px] rounded-[2px] ${l.bg}`} title={l.label} />
        ))}
        <span className="text-[10px] text-slate-400">More</span>
      </div>
    </div>
  )
}
