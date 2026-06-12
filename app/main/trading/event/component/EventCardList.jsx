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

export default function EventCardList({ events, selectedIds = new Set(), onToggle }) {
  const router = useRouter()

  if (!events || events.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      {events.map((event) => {
        const linkCount = Array.isArray(event.links) ? event.links.length : 0
        const isSelected = selectedIds.has(event.id)
        return (
          <div
            key={event.id}
            onClick={() => {
              if (!onToggle) router.push(`/main/trading/event/${event.id}`)
            }}
            className={`border rounded-lg p-4 transition-colors ${
              onToggle
                ? isSelected
                  ? 'border-violet-300 bg-violet-50'
                  : 'border-slate-200 hover:bg-slate-50 cursor-pointer'
                : 'border-slate-200 hover:bg-slate-50 cursor-pointer'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div
                className="flex-1 flex items-start gap-2"
                onClick={() => {
                  if (onToggle) router.push(`/main/trading/event/${event.id}`)
                }}
              >
                <p className="font-semibold text-sm text-slate-800 leading-snug flex-1">
                  {event.title || '—'}
                  {linkCount > 0 && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {linkCount} link{linkCount > 1 ? 's' : ''}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <ImpactBadge value={event.impact_direction} />
                {onToggle && (
                  <input
                    id={`multiSelectCheckbox_${event.id}_eventPage`}
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggle(event.id, event)}
                    onClick={(e) => e.stopPropagation()}
                    className="size-4 rounded accent-violet-600 cursor-pointer"
                  />
                )}
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-2">{formatEventDate(event.event_date)}</p>
            {Array.isArray(event.tags) && event.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
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
        )
      })}
    </div>
  )
}
