'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/base/Badge/Badge'
import UpdateEvent from './UpdateEvent'
import ImpactBadge from './component/ImpactBadge'
import EventCardList from './component/EventCardList'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/base/Table/Table.jsx'
import { Checkbox } from '@/components/base/Checkbox/Checkbox'

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
      <Table wrapperClassName="hidden lg:block" className="min-w-full" aria-label="Events">
        <TableHeader sticky>
          <TableRow>
            {onToggle && <TableHead className="w-10" />}
            <TableHead>Event</TableHead>
            <TableHead className="w-[130px]">Impact</TableHead>
            <TableHead className="w-[140px]">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody divider={false}>
          {events.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={onToggle ? 4 : 3}
                className="px-5 py-8 text-center text-slate-500"
              >
                No events found.
              </TableCell>
            </TableRow>
          ) : (
            events.map((event) => {
              const linkCount = Array.isArray(event.links) ? event.links.length : 0
              const isSelected = selectedIds.has(event.id)
              return (
                <TableRow
                  key={event.id}
                  selected={isSelected}
                  clickable
                  onClick={() => router.push(`/main/trading/event/${event.id}`)}
                >
                  {onToggle && (
                    <TableCell
                      className="w-10"
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggle(event.id, event)
                      }}
                    >
                      <Checkbox
                        id={`multiSelectCheckbox_${event.id}_eventPage`}
                        checked={isSelected}
                        onCheckedChange={() => onToggle(event.id, event)}
                        className="rounded cursor-pointer"
                      />
                    </TableCell>
                  )}
                  <TableCell className="whitespace-normal">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm text-slate-800">{event.title || '—'}</p>
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
                  </TableCell>
                  <TableCell className="w-[130px]">
                    <ImpactBadge value={event.impact_direction} />
                  </TableCell>
                  <TableCell className="text-slate-700 w-[140px]">
                    <p className="font-medium text-sm">{formatEventDate(event.event_date)}</p>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>

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
