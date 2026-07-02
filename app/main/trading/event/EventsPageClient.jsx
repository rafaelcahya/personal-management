'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchEventList } from '@/lib/api/event'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import Button from '@/components/base/Button/Button'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import { Search, List, AlignLeft, CalendarX2, SearchX, Sparkles, X, History } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import EventTableHeader from './component/EventTableHeader'
import EventsTable from './EventTable'
import AddEvent from './AddEvent'
import EventFilterDropdown from './component/EventFilterDropdown'
import TimelineView from './component/TimelineView'
import EventAnalysisModal from './component/EventAnalysisModal'
import EventAnalysisHistoryModal from './component/EventAnalysisHistoryModal'
import EventPagination from './component/EventPagination'

const FILTER_STORAGE_KEY = 'event-list-filter'

export default function EventsPageClient() {
  const [listEvent, setListEvent] = useState([])
  const [filter, setFilter] = useState(null)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [view, setView] = useState('list')
  const [selectedEvents, setSelectedEvents] = useState(new Map())
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false)
  const [historyModalOpen, setHistoryModalOpen] = useState(false)

  const searchDebounceRef = useRef(null)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

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

  const doFetch = useCallback(async ({ searchVal, pageVal, filterVal }) => {
    try {
      setIsLoading(true)
      const result = await fetchEventList({ search: searchVal, page: pageVal, filter: filterVal })
      if (!isMounted.current) return
      setListEvent(result.events || [])
      setTotalPages(result.totalPages ?? 1)
      setTotal(result.total ?? 0)
    } catch (err) {
      if (!isMounted.current) return
      console.error('Fetch error:', err)
      toast.error(err.message || 'Failed to fetch events')
    } finally {
      if (isMounted.current) setIsLoading(false)
    }
  }, [])

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
      null: 'Showing all events',
      bullish: 'Showing bullish events',
      bearish: 'Showing bearish events',
      upcoming: 'Showing upcoming events',
      past: 'Showing past events',
    }
    toast.success(filterMessages[newFilter] || filterMessages.null)
  }

  const handleRefresh = useCallback(() => {
    doFetch({ searchVal: search, pageVal: page, filterVal: filter })
  }, [doFetch, search, page, filter])

  const handleToggle = (id, eventObj) => {
    setSelectedEvents((prev) => {
      const next = new Map(prev)
      if (next.has(id)) next.delete(id)
      else if (eventObj) next.set(id, eventObj)
      return next
    })
  }

  const selectedIds = new Set(selectedEvents.keys())

  const isFiltered = search || filter
  const isEmpty = listEvent.length === 0

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

      <div className="flex-1 min-h-0 relative bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <EventTableHeader />

        {/* Controls area */}
        <div className="px-5 py-3 border-b border-slate-100 flex flex-col gap-3">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            {/* View toggle — left */}
            <div className="flex items-center border border-slate-200 rounded-md overflow-hidden shrink-0 self-start">
              <Button
                id="listViewBtn_eventPage"
                variant="ghost"
                onClick={() => setView('list')}
                className={`px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 rounded-none ${
                  view === 'list'
                    ? 'bg-violet-600 text-white hover:bg-violet-600'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <List className="size-3.5" />
                List
              </Button>
              <Button
                id="timelineViewBtn_eventPage"
                variant="ghost"
                onClick={() => setView('timeline')}
                className={`px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 rounded-none ${
                  view === 'timeline'
                    ? 'bg-violet-600 text-white hover:bg-violet-600'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <AlignLeft className="size-3.5" />
                Timeline
              </Button>
            </div>

            {/* Search + Filter + Add — right */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative flex-1 min-w-[160px]">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                <Input
                  id="eventSearchInput_eventPage"
                  value={searchInput}
                  onChange={handleSearchChange}
                  placeholder="Search events..."
                  className="pl-8 h-9 w-full lg:w-48 text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
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

          {/* AI History button */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="base"
              onClick={() => setHistoryModalOpen(true)}
              className="gap-1.5 text-xs text-violet-600 border-violet-200 hover:bg-violet-50"
            >
              <History className="size-3.5" />
              AI Analysis History
            </Button>
          </div>
        </div>

        {/* Content area */}
        {isLoading ? (
          <div className="flex flex-col gap-3 px-5 py-5">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            {isFiltered ? (
              <>
                <SearchX className="size-10 text-slate-300" />
                <p className="text-center font-medium text-slate-600 text-lg">No matching events</p>
                <p className="text-center text-slate-500 text-sm">
                  Try a different search term or filter
                </p>
                {filter && (
                  <Button
                    variant="outline"
                    size="base"
                    onClick={() => handleFilterChange(null)}
                    className="text-violet-600 border-violet-200 hover:bg-violet-50"
                  >
                    Clear filter
                  </Button>
                )}
              </>
            ) : (
              <>
                <CalendarX2 className="size-10 text-slate-300" />
                <p className="text-center font-medium text-slate-600 text-lg">No events yet</p>
                <p className="text-center text-slate-500 text-sm">
                  Start by adding your first market event to track!
                </p>
                <AddEvent
                  onAdded={() => doFetch({ searchVal: search, pageVal: 1, filterVal: filter })}
                />
              </>
            )}
          </div>
        ) : (
          <>
            {view === 'timeline' ? (
              <div className="px-5 py-4">
                <TimelineView events={listEvent} />
              </div>
            ) : (
              <EventsTable
                events={listEvent}
                onRefresh={handleRefresh}
                selectedIds={selectedIds}
                onToggle={handleToggle}
              />
            )}

            <EventPagination
              page={page}
              totalPages={totalPages}
              total={total}
              onPageChange={(p) => setPage(p)}
            />
          </>
        )}
      </div>

      {/* Floating multi-select action bar */}
      {selectedIds.size >= 1 && (
        <div
          id="multiSelectActionBar_eventPage"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white border border-slate-200 shadow-lg rounded-full px-4 py-2.5"
        >
          <span id="multiSelectCount_eventPage" className="text-sm font-semibold text-slate-700">
            {selectedIds.size} event{selectedIds.size !== 1 ? 's' : ''} selected
          </span>
          <Button
            id="analyzeTogetherBtn_eventPage"
            disabled={selectedIds.size < 2 || selectedIds.size > 10}
            onClick={() => setAnalysisModalOpen(true)}
            className="bg-violet-600 hover:bg-violet-700 text-white rounded-full h-8 px-4 text-xs font-medium gap-1.5 disabled:opacity-50"
            title={
              selectedIds.size < 2
                ? 'Select at least 2 events'
                : selectedIds.size > 10
                  ? 'Max 10 events allowed'
                  : ''
            }
          >
            <Sparkles className="size-3.5" /> Analyze Together
          </Button>
          <Button
            id="clearMultiSelectBtn_eventPage"
            variant="ghost"
            size="icon-sm"
            onClick={() => setSelectedEvents(new Map())}
            className="rounded-full text-slate-500 hover:bg-slate-100"
            aria-label="Clear selection"
          >
            <X className="size-4" />
          </Button>
        </div>
      )}

      {historyModalOpen && (
        <EventAnalysisHistoryModal
          open={historyModalOpen}
          onClose={() => setHistoryModalOpen(false)}
        />
      )}

      {analysisModalOpen && (
        <EventAnalysisModal
          open={analysisModalOpen}
          onClose={() => {
            setAnalysisModalOpen(false)
            setSelectedEvents(new Map())
          }}
          analysisType="multi"
          events={[...selectedEvents.values()]}
          onAnalysisComplete={() => {
            setSelectedEvents(new Map())
          }}
        />
      )}
    </div>
  )
}
