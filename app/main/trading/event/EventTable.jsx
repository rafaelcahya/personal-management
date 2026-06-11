'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  FilePenLine,
  MoreHorizontalIcon,
  StarIcon,
  TrendingUp,
  TrendingDown,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import { favoriteEvent } from '@/lib/api/event'
import UpdateEvent from './UpdateEvent'
import DeleteEvent from './DeleteEvent'

const EVENT_TYPE_COLORS = {
  Earnings: 'bg-amber-50 text-amber-700 border-amber-200',
  'Central Bank': 'bg-blue-50 text-blue-700 border-blue-200',
  Macro: 'bg-sky-50 text-sky-700 border-sky-200',
  'Corporate Action': 'bg-purple-50 text-purple-700 border-purple-200',
  Geopolitical: 'bg-red-50 text-red-700 border-red-200',
  Personal: 'bg-green-50 text-green-700 border-green-200',
  Other: 'bg-slate-100 text-slate-600 border-slate-200',
}

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

export default function EventTable({ events, allEvents, onEventsChange, onRefresh }) {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [loadingFavorite, setLoadingFavorite] = useState(null)

  const handleToggleFavorite = async (event) => {
    const newFavoriteStatus = !event.is_favorite
    const previousState = [...allEvents]
    setLoadingFavorite(event.id)

    onEventsChange((prev) =>
      prev.map((e) => (e.id === event.id ? { ...e, is_favorite: newFavoriteStatus } : e))
    )

    try {
      await favoriteEvent(event.id, newFavoriteStatus)
      toast.success(
        newFavoriteStatus ? 'Event added to favorites ⭐' : 'Event removed from favorites'
      )
    } catch (error) {
      console.error('Favorite error:', error)
      onEventsChange(previousState)
      toast.error(error.message || 'Failed to update favorite status')
    } finally {
      setLoadingFavorite(null)
    }
  }

  return (
    <>
      <Table className="w-full table-fixed">
        <TableHeader className="bg-slate-100 sticky top-0 z-20">
          <TableRow className="border-none">
            <TableHead className="py-2 text-slate-foreground rounded-l-lg w-[55%]">Event</TableHead>
            <TableHead className="py-2 text-slate-foreground text-center w-[15%]">Impact</TableHead>
            <TableHead className="py-2 text-slate-foreground text-center w-[18%]">
              Event Date
            </TableHead>
            <TableHead className="py-2 text-slate-foreground text-center rounded-r-lg w-[12%]">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                No events found. Add your first market event to start tracking! 📅
              </TableCell>
            </TableRow>
          ) : (
            events.map((event) => {
              const isBullish = event.impact_direction === 'UP'
              const typeColor = EVENT_TYPE_COLORS[event.event_type] || EVENT_TYPE_COLORS.Other

              return (
                <TableRow key={event.id} className="hover:bg-slate-100">
                  {/* Event title + description + type */}
                  <TableCell className="w-[55%] py-3 whitespace-normal">
                    <div className="flex items-start gap-2">
                      {event.is_favorite && (
                        <StarIcon className="size-3.5 fill-yellow-400 text-yellow-400 shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm text-slate-800 truncate">
                          {event.title || '—'}
                        </p>
                        {event.event_description && (
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-3 leading-relaxed">
                            {event.event_description}
                          </p>
                        )}
                        {event.event_type && (
                          <Badge
                            variant="outline"
                            className={`mt-1.5 text-xs font-medium px-1.5 py-0 h-4 ${typeColor}`}
                          >
                            {event.event_type}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Impact */}
                  <TableCell className="text-center w-[15%]">
                    <div className="flex items-center justify-center">
                      <Badge
                        variant="outline"
                        className={`font-medium text-xs ${
                          isBullish
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {isBullish ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {isBullish ? 'Bullish' : 'Bearish'}
                      </Badge>
                    </div>
                  </TableCell>

                  {/* Event Date */}
                  <TableCell className="text-center text-sm w-[18%]">
                    <p className="font-medium text-sm">{formatEventDate(event.event_date)}</p>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-center w-[12%]">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 mx-auto outline-none hover:bg-slate-200"
                        >
                          <MoreHorizontalIcon className="size-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setSelectedEvent(event)}
                          className="hover:bg-violet-50 focus:bg-violet-50 cursor-pointer font-medium"
                        >
                          <FilePenLine className="h-4 w-4 mr-2" />
                          Update Event
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleToggleFavorite(event)}
                          disabled={loadingFavorite === event.id}
                          className="hover:bg-violet-50 focus:bg-violet-50 cursor-pointer font-medium"
                        >
                          {loadingFavorite === event.id ? (
                            <Loader2 className="size-4 mr-2 animate-spin" />
                          ) : (
                            <StarIcon
                              className={`size-4 mr-2 ${
                                event.is_favorite ? 'fill-yellow-400 text-yellow-400' : ''
                              }`}
                            />
                          )}
                          {event.is_favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="p-0">
                          <DeleteEvent event={event} onDeleted={onRefresh} />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
