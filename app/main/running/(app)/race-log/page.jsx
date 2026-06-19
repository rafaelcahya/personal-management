'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Medal,
  Plus,
  AlertTriangle,
  Flag,
  Trophy,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { fmtDistance } from '../dashboard/utils/format'
import { fetchRaceLog, fetchUpcomingRaces } from '@/lib/api/running'
import PageHeader from '@/app/main/components/PageHeader'
import TableSkeletonRows from '@/app/main/components/TableSkeletonRows'
import SyncStravaButton from '@/app/main/running/components/SyncStravaButton'
import RaceFormModal from './components/RaceFormModal'
import UpcomingRaceFormModal from './components/UpcomingRaceFormModal'
import { getDistanceLabel, secsToHMS, secsToMMSS, formatDate } from './components/raceLogUtils'
import UpcomingRacesSection from './components/UpcomingRacesSection'

const LIMIT = 15

const DISTANCE_BUCKETS = [
  { key: '5k', label: '5K' },
  { key: '10k', label: '10K' },
  { key: '21k', label: '21K (Half)' },
  { key: '42k', label: '42K (Full)' },
  { key: 'other', label: 'Other' },
]

export default function RaceLogPage() {
  const router = useRouter()
  const [entries, setEntries] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [formOpen, setFormOpen] = useState(false)
  const [addUpcomingOpen, setAddUpcomingOpen] = useState(false)

  const [upcomingRaces, setUpcomingRaces] = useState([])
  const [upcomingLoading, setUpcomingLoading] = useState(true)
  const [upcomingError, setUpcomingError] = useState(null)

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [activeDistance, setActiveDistance] = useState(null)
  const debounceRef = useRef(null)

  const totalPages = Math.ceil(total / LIMIT)
  const hasActiveFilters = !!(search || activeDistance)

  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setSearch(searchInput.trim())
      setPage(1)
    }, 400)
    return () => clearTimeout(debounceRef.current)
  }, [searchInput])

  // Reset page when filter changes
  useEffect(() => {
    setPage(1)
  }, [activeDistance])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchRaceLog({
      page,
      limit: LIMIT,
      search: search || undefined,
      distance_bucket: activeDistance || undefined,
    })
      .then((res) => {
        if (cancelled) return
        setEntries(res.data ?? [])
        setTotal(res.total ?? 0)
      })
      .catch((err) => {
        if (cancelled) return
        if (err.message === 'UNAUTHORIZED') {
          window.location.href = '/login'
          return
        }
        setError(err.message || 'Failed to load race log')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [page, search, activeDistance])

  useEffect(() => {
    fetchUpcomingRaces()
      .then((res) => setUpcomingRaces(res.data ?? []))
      .catch((err) => {
        if (err.message === 'UNAUTHORIZED') {
          window.location.href = '/login'
          return
        }
        setUpcomingError(err.message || 'Failed to load upcoming races')
      })
      .finally(() => setUpcomingLoading(false))
  }, [])

  function load() {
    setPage((p) => p)
  }

  function handleUpcomingAdd(race) {
    setUpcomingRaces((prev) =>
      [race, ...prev].sort((a, b) => new Date(a.race_date) - new Date(b.race_date))
    )
  }

  function handleUpcomingUpdated(race) {
    setUpcomingRaces((prev) => prev.map((r) => (r.id === race.id ? race : r)))
  }

  function handleUpcomingDeleted(id) {
    setUpcomingRaces((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div id="raceLogPage" className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Race Log"
          description="Your race history — every finish line you've crossed."
          breadcrumbs={[
            { label: 'Running', href: '/main/running/dashboard' },
            { label: 'Race Log' },
          ]}
        />
        <div className="flex items-center gap-2 shrink-0">
          <Button
            id="addRaceBtn"
            onClick={() => setFormOpen(true)}
            size="sm"
            className="flex items-center gap-1.5"
            aria-label="Log race"
          >
            <Plus className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Log race</span>
          </Button>
          <Button
            id="addUpcomingRaceBtn_raceLogPage"
            onClick={() => setAddUpcomingOpen(true)}
            size="sm"
            variant="outline"
            className="flex items-center gap-1.5"
            aria-label="Add upcoming race"
          >
            <Plus className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Add upcoming race</span>
          </Button>
        </div>
      </div>
      <SyncStravaButton id="syncStravaBtn_raceLog" />

      <UpcomingRacesSection
        races={upcomingRaces}
        loading={upcomingLoading}
        error={upcomingError}
        onRetry={() => {
          setUpcomingError(null)
          setUpcomingLoading(true)
          fetchUpcomingRaces()
            .then((res) => setUpcomingRaces(res.data ?? []))
            .catch((err) => {
              if (err.message === 'UNAUTHORIZED') {
                window.location.href = '/login'
                return
              }
              setUpcomingError(err.message || 'Failed to load upcoming races')
            })
            .finally(() => setUpcomingLoading(false))
        }}
        onAdd={handleUpcomingAdd}
        onUpdated={handleUpcomingUpdated}
        onDeleted={handleUpcomingDeleted}
        onCompleted={load}
      />

      {/* Error */}
      {!loading && error && (
        <div
          id="raceLogError"
          className="flex flex-col items-center justify-center py-16 gap-3 text-center"
          role="alert"
        >
          <AlertTriangle className="size-8 text-red-400" aria-hidden="true" />
          <p className="text-sm text-slate-600">{error}</p>
          <Button variant="outline" size="sm" onClick={load}>
            Try again
          </Button>
        </div>
      )}

      {/* Empty state — no races at all */}
      {!loading && !error && total === 0 && !hasActiveFilters && (
        <div
          id="raceLogEmptyState"
          className="flex flex-col items-center justify-center py-20 gap-4 text-center"
        >
          <div className="flex items-center justify-center size-14 rounded-full bg-violet-50">
            <Medal className="size-7 text-violet-400" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">No races logged yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Every race you finish deserves to be remembered.
            </p>
          </div>
          <Button onClick={() => setFormOpen(true)} size="sm" className="flex items-center gap-1.5">
            <Flag className="size-4" aria-hidden="true" />
            Log your first race
          </Button>
        </div>
      )}

      {/* Search + filter bar + Race table */}
      {!error && (loading || total > 0 || hasActiveFilters) && (
        <div className="border border-slate-200/50 shadow-slate-100 rounded-xl bg-white overflow-hidden flex flex-col">
          {/* Title */}
          <div className="px-3 sm:px-5 pt-3 sm:pt-5">
            <div className="space-y-2 mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">🏆 Race Log</h2>
                <p className="text-sm text-slate-600 leading-relaxed mt-1.5 max-w-2xl">
                  Every finish line you&apos;ve crossed — your full race history in one place.
                </p>
              </div>
            </div>
          </div>

          {/* Search + filter bar */}
          <div className="border-b border-slate-100 px-3 sm:px-5 py-2 sm:py-3 flex flex-col gap-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none"
                aria-hidden="true"
              />
              <Input
                id="raceSearchInput"
                type="text"
                placeholder="Search by race name…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-8 pr-8 h-8 text-sm focus-visible:ring-violet-200 focus-visible:border-violet-600"
              />
              {searchInput && (
                <button
                  onClick={() => {
                    setSearchInput('')
                    setSearch('')
                    setPage(1)
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                id="raceFilterChip_all"
                aria-pressed={!activeDistance}
                onClick={() => setActiveDistance(null)}
                className={`flex items-center rounded-full px-3 py-1 text-xs font-medium border whitespace-nowrap transition-colors ${
                  !activeDistance
                    ? 'border-violet-300 bg-violet-100 text-violet-700'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-400'
                }`}
              >
                All
              </button>
              {DISTANCE_BUCKETS.map((b) => (
                <button
                  key={b.key}
                  id={`raceFilterChip_${b.key}`}
                  aria-pressed={activeDistance === b.key}
                  onClick={() => setActiveDistance(activeDistance === b.key ? null : b.key)}
                  className={`flex items-center rounded-full px-3 py-1 text-xs font-medium border whitespace-nowrap transition-colors ${
                    activeDistance === b.key
                      ? 'border-violet-300 bg-violet-100 text-violet-700'
                      : 'border-slate-200 bg-white text-slate-500 hover:border-slate-400'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table area */}
          <div className="px-3 sm:px-5 py-3 sm:py-4 overflow-x-auto">
            <div id="raceLogList">
              <Table className="min-w-[700px] w-full table-auto">
                <TableHeader className="bg-slate-100">
                  <TableRow className="border-none uppercase text-xs">
                    <TableHead className="py-2 text-slate-foreground rounded-l-lg w-[32%]">
                      Race
                    </TableHead>
                    <TableHead className="py-2 text-slate-foreground">Date</TableHead>
                    <TableHead className="py-2 text-slate-foreground text-right">Dist</TableHead>
                    <TableHead className="py-2 text-slate-foreground text-right">Time</TableHead>
                    <TableHead className="py-2 text-slate-foreground text-right">Pace</TableHead>
                    <TableHead className="py-2 text-slate-foreground text-right">Place</TableHead>
                    <TableHead className="py-2 text-slate-foreground text-right rounded-r-lg">
                      Male
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={7} className="p-0">
                        <div id="raceLogLoadingSkeleton">
                          <Table className="min-w-[700px] w-full">
                            <TableBody>
                              <TableSkeletonRows
                                rows={5}
                                metricWidths={[48, 52, 44, 48, 40, 32, 32]}
                              />
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading && entries.length === 0 && (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={7}>
                        <div className="flex flex-col items-center justify-center py-12 gap-2">
                          <p className="text-sm text-slate-500">No races match your filters.</p>
                          <button
                            onClick={() => {
                              setSearchInput('')
                              setSearch('')
                              setActiveDistance(null)
                              setPage(1)
                            }}
                            className="text-xs text-violet-600 hover:underline"
                          >
                            Clear filters
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading &&
                    entries.map((entry) => {
                      const pace = entry.avg_pace_sec_per_km
                        ? secsToMMSS(entry.avg_pace_sec_per_km)
                        : entry.finish_time_sec && entry.distance_m
                          ? secsToMMSS(
                              Math.round((entry.finish_time_sec / entry.distance_m) * 1000)
                            )
                          : null
                      return (
                        <TableRow
                          key={entry.id}
                          id={`raceLogCard_${entry.id}`}
                          className="cursor-pointer hover:bg-slate-100 transition-colors"
                          onClick={() => router.push(`/main/running/race-log/${entry.id}`)}
                        >
                          <TableCell className="w-[32%]">
                            <div className="flex items-center gap-3">
                              <span className="flex size-8 items-center justify-center rounded-full shrink-0 bg-violet-50">
                                <Trophy className="size-4 text-violet-500" aria-hidden="true" />
                              </span>
                              <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-sm font-medium text-slate-700 truncate">
                                    {entry.title}
                                  </span>
                                  {entry.did_not_finish && (
                                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-700 shrink-0">
                                      DNF
                                    </span>
                                  )}
                                  {(entry.top_best_efforts ?? []).map((e) =>
                                    e.pr_rank === 1 ? (
                                      <span
                                        key={e.name}
                                        id={`pbRankChip_${e.name.replace(/\s/g, '')}_raceLogPage`}
                                        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 text-[10px] font-semibold leading-none shrink-0"
                                      >
                                        <Trophy className="size-3" aria-hidden="true" />
                                        #1 {e.name}
                                      </span>
                                    ) : (
                                      <span
                                        key={e.name}
                                        id={`pbRankChip_${e.name.replace(/\s/g, '')}_raceLogPage`}
                                        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold leading-none shrink-0"
                                      >
                                        #{e.pr_rank} {e.name}
                                      </span>
                                    )
                                  )}
                                </div>
                                <span className="text-xs text-slate-400">
                                  {getDistanceLabel(entry.distance_m)}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-slate-600 whitespace-nowrap">
                            {formatDate(entry.race_date)}
                          </TableCell>
                          <TableCell className="text-right font-mono tabular-nums text-sm text-slate-700">
                            {entry.distance_m ? `${fmtDistance(entry.distance_m)} km` : '—'}
                          </TableCell>
                          <TableCell className="text-right font-mono tabular-nums text-sm text-slate-700">
                            {!entry.did_not_finish && entry.finish_time_sec
                              ? secsToHMS(entry.finish_time_sec)
                              : '—'}
                          </TableCell>
                          <TableCell className="text-right font-mono tabular-nums text-sm text-slate-700">
                            {pace ?? '—'}
                          </TableCell>
                          <TableCell className="text-right font-mono tabular-nums text-sm text-slate-700">
                            {entry.position_place != null ? `#${entry.position_place}` : '—'}
                          </TableCell>
                          <TableCell className="text-right font-mono tabular-nums text-sm text-slate-700">
                            {entry.position_male != null ? `#${entry.position_male}` : '—'}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div
                  className="flex items-center justify-between pt-2 mt-2"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setPage((p) => p - 1)}
                    disabled={page <= 1}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 hover:text-violet-600 disabled:opacity-40 disabled:pointer-events-none transition-colors min-h-[44px]"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="size-4" aria-hidden="true" />
                    Prev
                  </button>
                  <span className="text-xs text-slate-400 text-center" aria-live="polite">
                    Page {page} of {totalPages} · {total} records
                  </span>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= totalPages}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 hover:text-violet-600 disabled:opacity-40 disabled:pointer-events-none transition-colors min-h-[44px]"
                    aria-label="Next page"
                  >
                    Next
                    <ChevronRight className="size-4" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <RaceFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={(newEntry) => {
          load()
          router.push(`/main/running/race-log/${newEntry.id}`)
        }}
      />

      <UpcomingRaceFormModal
        open={addUpcomingOpen}
        onClose={() => setAddUpcomingOpen(false)}
        onSaved={(r) => {
          handleUpcomingAdd(r)
          setAddUpcomingOpen(false)
        }}
        race={null}
      />
    </div>
  )
}
