'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/base/Badge/Badge'
import UpdateEvent from './UpdateEvent'
import ImpactBadge from './component/ImpactBadge'
import EventCardList from './component/EventCardList'

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

export default function EventTable({ events, onRefresh, selectedIds = new Set(), onToggle }) {
  const router = useRouter()
  const [selectedEvent, setSelectedEvent] = useState(null)

  return (
    <>
      {/* Mobile card list — below md */}
      <div className="block lg:hidden">
        <EventCardList events={events} selectedIds={selectedIds} onToggle={onToggle} />
      </div>

      {/* Desktop table — lg and above */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full text-sm" aria-label="Events">
          <thead>
            <tr className="border-b border-slate-100">
              {onToggle && (
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap w-10" />
              )}
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                Event
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap w-[130px]">
                Impact
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap w-[140px]">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={onToggle ? 4 : 3} className="px-5 py-8 text-center text-slate-500">
                  No events found.
                </td>
              </tr>
            ) : (
              events.map((event) => {
                const linkCount = Array.isArray(event.links) ? event.links.length : 0
                const isSelected = selectedIds.has(event.id)
                return (
                  <tr
                    key={event.id}
                    className={`border-b border-slate-50 cursor-pointer transition-colors ${isSelected ? 'bg-violet-50' : 'hover:bg-slate-50'}`}
                    onClick={() => router.push(`/main/trading/event/${event.id}`)}
                  >
                    {onToggle && (
                      <td
                        className="px-5 py-3.5 w-10"
                        onClick={(e) => {
                          e.stopPropagation()
                          onToggle(event.id, event)
                        }}
                      >
                        <input
                          id={`multiSelectCheckbox_${event.id}_eventPage`}
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggle(event.id, event)}
                          onClick={(e) => e.stopPropagation()}
                          className="size-4 rounded accent-violet-600 cursor-pointer"
                        />
                      </td>
                    )}
                    <td className="px-5 py-3.5 whitespace-normal">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm text-slate-800">
                            {event.title || '—'}
                          </p>
                          {linkCount > 0 && (
                            <Badge
                              variant="secondary"
                              className="text-xs font-medium px-1.5 py-0 h-4 shrink-0"
                            >
                              {linkCount} link{linkCount > 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
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
                    </td>
                    <td className="px-5 py-3.5 w-[130px]">
                      <ImpactBadge value={event.impact_direction} />
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 w-[140px]">
                      <p className="font-medium text-sm">{formatEventDate(event.event_date)}</p>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedEvent && (
        <UpdateEvent
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onUpdated={async () => {
            await onRefresh()
            setSelectedEvent(null)
          }}
        />
      )}
    </>
  )
}
