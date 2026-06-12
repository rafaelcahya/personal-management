'use client'

import { useRouter } from 'next/navigation'
import ImpactBadge from './ImpactBadge'

function formatEventDate(dateStr) {
  if (!dateStr) return '—'
  const datePart = String(dateStr).split('T')[0]
  if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    const [y, m, d] = datePart.split('-').map(Number)
    return new Date(y, m - 1, d).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function getMonthKey(dateStr) {
  const datePart = String(dateStr).split('T')[0]
  if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    const [y, m] = datePart.split('-').map(Number)
    return { key: `${y}-${String(m).padStart(2, '0')}`, y, m }
  }
  const d = new Date(dateStr)
  return {
    key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
    y: d.getFullYear(),
    m: d.getMonth() + 1,
  }
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export default function TimelineView({ events }) {
  const router = useRouter()

  const grouped = []
  const seen = new Map()

  for (const event of events) {
    const { key, y, m } = getMonthKey(event.event_date)
    if (!seen.has(key)) {
      seen.set(key, grouped.length)
      grouped.push({ key, label: `${MONTH_NAMES[m - 1]} ${y}`, events: [] })
    }
    grouped[seen.get(key)].events.push(event)
  }

  if (grouped.length === 0) return null

  return (
    <div className="flex flex-col gap-6">
      {grouped.map((group) => (
        <div key={group.key}>
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-sm font-semibold text-slate-700">{group.label}</h3>
            <span className="text-xs text-slate-400 font-medium">
              {group.events.length} event{group.events.length > 1 ? 's' : ''}
            </span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>
          <div className="flex flex-col gap-2">
            {group.events.map((event) => {
              const linkCount = Array.isArray(event.links) ? event.links.length : 0
              return (
                <div
                  key={event.id}
                  onClick={() => router.push(`/main/trading/event/${event.id}`)}
                  className="cursor-pointer border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition-colors flex items-start gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm text-slate-800 truncate">
                        {event.title || '—'}
                      </p>
                      {linkCount > 0 && (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 shrink-0">
                          {linkCount} link{linkCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {formatEventDate(event.event_date)}
                    </p>
                    {Array.isArray(event.tags) && event.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {event.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-violet-100 text-violet-700 text-xs font-medium rounded-md px-2 py-0.5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <ImpactBadge value={event.impact_direction} className="shrink-0 mt-0.5" />
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
