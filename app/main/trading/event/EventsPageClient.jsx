'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchEventList, fetchEventSummary } from '@/lib/api/event'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import EventListSummary from './component/EventListSummary'
import PageHeader from '../../components/PageHeader'
import EventTableHeader from './component/EventTableHeader'
import EventsTable from './EventTable'
import AddEvent from './AddEvent'
import EventFilterDropdown from './component/EventFilterDropdown'

const FILTER_STORAGE_KEY = 'event-list-filter'

export default function EventsPageClient({ initialEvents }) {
  const [listEvent, setListEvent] = useState(initialEvents || [])
  const [filter, setFilter] = useState(null)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [summary, setSummary] = useState({
    totalEvents: 0,
    totalBullish: 0,
    totalBearish: 0,
    totalFavorite: 0,
  })

  const searchDebounceRef = useRef(null)

  useEffect(() => {
    try {
      const savedFilter = localStorage.getItem(FILTER_STORAGE_KEY)
      if (savedFilter) {
        setFilter(savedFilter === 'null' ? null : savedFilter)
      }
    } catch (error) {
      console.error('Failed to load filter from localStorage:', error)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(FILTER_STORAGE_KEY, filter === null ? 'null' : filter)
    } catch (error) {
      console.error('Failed to save filter to localStorage:', error)
    }
  }, [filter])

  const fetchSummary = useCallback(async () => {
    try {
      const data = await fetchEventSummary()
      setSummary(
        data ?? {
          totalEvents: 0,
          totalBullish: 0,
          totalBearish: 0,
          totalFavorite: 0,
        }
      )
    } catch (err) {
      console.error('Failed to fetch summary:', err)
    }
  }, [])

  const doFetch = useCallback(
    async ({ searchVal, pageVal, filterVal }) => {
      try {
        setIsLoading(true)
        const [result] = await Promise.all([
          fetchEventList({ search: searchVal, page: pageVal, filter: filterVal }),
          fetchSummary(),
        ])
        setListEvent(result.events || [])
        setTotalPages(result.totalPages ?? 1)
        setTotal(result.total ?? 0)
      } catch (err) {
        console.error('Fetch error:', err)
        toast.error(err.message || 'Failed to fetch events')
      } finally {
        setIsLoading(false)
      }
    },
    [fetchSummary]
  )

  useEffect(() => {
    doFetch({ searchVal: search, pageVal: page, filterVal: filter })
  }, [search, page, filter])

  const handleSearchChange = (e) => {
    const val = e.target.value
    setSearchInput(val)
    clearTimeout(searchDebounceRef.current)
    searchDebounceRef.current = setTimeout(() => {
      setSearch(val)
      setPage(1)
    }, 400)
  }

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
    setPage(1)

    const filterMessages = {
      null: 'Showing all events 📅',
      bullish: 'Showing bullish events 📈',
      bearish: 'Showing bearish events 📉',
      favorite: 'Showing favorite events ⭐',
      upcoming: 'Showing upcoming events 🔜',
      past: 'Showing past events 📜',
    }
    toast.success(filterMessages[newFilter] || filterMessages.null)
  }

  const handleRefresh = useCallback(() => {
    doFetch({ searchVal: search, pageVal: page, filterVal: filter })
  }, [doFetch, search, page, filter])

  return (
    <div className="flex flex-col h-full gap-5">
      <PageHeader
        title="Market Events"
        description="Track market events and their impact on your trades"
        breadcrumbs={[
          { label: 'Trading', href: '/main/trading/dashboard' },
          { label: 'Market Events' },
        ]}
      />
      <EventListSummary summary={summary} />

      <div className="flex-1 min-h-0 relative border border-slate-200/50 shadow-slate-100 rounded-xl overflow-hidden flex flex-col p-5 bg-white">
        <div className="flex flex-col gap-5 sm:gap-0 h-full overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between mb-3 sm:mb-4 gap-3">
            <div className="max-w-[500px]">
              <EventTableHeader />
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-2 w-full">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                <Input
                  id="eventSearchInput_eventPage"
                  value={searchInput}
                  onChange={handleSearchChange}
                  placeholder="Search events..."
                  className="pl-8 h-9 w-48 text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                />
              </div>

              <EventFilterDropdown
                filter={filter}
                onFilterChange={handleFilterChange}
                events={listEvent}
              />

              <AddEvent
                onAdded={() => doFetch({ searchVal: search, pageVal: 1, filterVal: filter })}
              />
            </div>
          </div>

          {/* Table / empty states */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="size-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
              <p className="text-sm text-slate-600 font-medium">Loading events...</p>
            </div>
          ) : listEvent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <p className="text-center font-medium text-slate-600 text-lg">
                {search || filter ? 'No events match' : 'No events yet'}
              </p>
              <p className="text-center text-slate-500 text-sm">
                {search || filter
                  ? 'Try a different search term or filter'
                  : 'Start by adding your first market event to track!'}
              </p>
              {filter && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFilterChange(null)}
                  className="text-violet-600 border-violet-200 hover:bg-violet-50"
                >
                  Clear filter
                </Button>
              )}
            </div>
          ) : (
            <>
              <EventsTable
                events={listEvent}
                allEvents={listEvent}
                onEventsChange={setListEvent}
                onRefresh={handleRefresh}
              />

              {totalPages > 1 && (
                <div
                  id="eventPagination_eventPage"
                  className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2 shrink-0"
                >
                  <p className="text-xs text-slate-500">
                    Page {page} of {totalPages} ({total} total)
                  </p>
                  <div className="flex items-center gap-1">
                    <Button
                      id="prevPageBtn_eventPage"
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1 || isLoading}
                      className="h-7 w-7 p-0"
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    <span className="text-xs font-medium text-slate-600 px-2">{page}</span>
                    <Button
                      id="nextPageBtn_eventPage"
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages || isLoading}
                      className="h-7 w-7 p-0"
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
