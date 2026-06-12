'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
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

export default function EventTable({ events, onRefresh }) {
  const router = useRouter()
  const [selectedEvent, setSelectedEvent] = useState(null)

  return (
    <>
      {/* Mobile card list — below md */}
      <div className="block lg:hidden">
        <EventCardList events={events} />
      </div>

      {/* Desktop table — lg and above */}
      <div className="hidden lg:block">
        <Table className="w-full">
          <TableHeader className="bg-slate-100 sticky top-0 z-20">
            <TableRow className="border-none">
              <TableHead className="py-2 text-slate-foreground rounded-l-lg">Event</TableHead>
              <TableHead className="py-2 text-slate-foreground text-center w-[130px]">
                Impact
              </TableHead>
              <TableHead className="py-2 text-slate-foreground text-center w-[140px]">
                Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-slate-500">
                  No events found.
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => {
                const linkCount = Array.isArray(event.links) ? event.links.length : 0
                return (
                  <TableRow
                    key={event.id}
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => router.push(`/main/trading/event/${event.id}`)}
                  >
                    <TableCell className="py-3 whitespace-normal">
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
                    </TableCell>

                    <TableCell className="text-center w-[130px]">
                      <div className="flex items-center justify-center">
                        <ImpactBadge value={event.impact_direction} />
                      </div>
                    </TableCell>

                    <TableCell className="text-center w-[140px]">
                      <p className="font-medium text-sm">{formatEventDate(event.event_date)}</p>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
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
