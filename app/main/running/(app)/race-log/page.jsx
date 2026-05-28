'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Medal, Plus, AlertTriangle, Flag, Trophy, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { fmtDistance } from '../dashboard/utils/format'
import { fetchRaceLog } from '@/lib/api/running'
import PageHeader from '@/app/main/components/PageHeader'
import RaceFormModal from './components/RaceFormModal'
import ActivityPickerDialog from './components/ActivityPickerDialog'
import RaceConfirmDialog from './components/RaceConfirmDialog'
import { getDistanceLabel, secsToHMS, secsToMMSS, formatDate } from './components/raceLogUtils'

function RaceSkeletonRow() {
  return (
    <TableRow className="animate-pulse">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-slate-100 shrink-0" />
          <div className="flex flex-col gap-1.5">
            <div className="h-3 bg-slate-100 rounded w-36" />
            <div className="h-2.5 bg-slate-100 rounded w-16" />
          </div>
        </div>
      </TableCell>
      {[48, 52, 44, 48, 40, 32, 32].map((w, i) => (
        <TableCell key={i}>
          <div className="h-3 bg-slate-100 rounded ml-auto" style={{ width: w }} />
        </TableCell>
      ))}
    </TableRow>
  )
}

export default function RaceLogPage() {
  const router = useRouter()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [formOpen, setFormOpen] = useState(false)
  const [pagePickerOpen, setPagePickerOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingActivity, setPendingActivity] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchRaceLog()
      setEntries(res.data ?? [])
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        window.location.href = '/login'
        return
      }
      setError(err.message || 'Failed to load race log')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function openAddFromActivity(activity) {
    setPendingActivity(activity)
    setPagePickerOpen(false)
    setConfirmOpen(true)
  }

  function handleSaved(newOrUpdated) {
    setEntries((prev) => {
      const idx = prev.findIndex((e) => e.id === newOrUpdated.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = newOrUpdated
        return next.sort((a, b) => new Date(b.race_date) - new Date(a.race_date))
      }
      return [newOrUpdated, ...prev]
    })
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
            id="addRaceFromActivityBtn"
            onClick={() => setPagePickerOpen(true)}
            size="sm"
            variant="outline"
            className="flex items-center gap-1.5"
          >
            <Link2 className="size-4" aria-hidden="true" />
            Add from activity
          </Button>
          <Button
            id="addRaceBtn"
            onClick={() => setFormOpen(true)}
            size="sm"
            className="flex items-center gap-1.5"
          >
            <Plus className="size-4" aria-hidden="true" />
            Log race
          </Button>
        </div>
      </div>

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

      {/* Empty state */}
      {!loading && !error && entries.length === 0 && (
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

      {/* Race table */}
      {!error && (loading || entries.length > 0) && (
        <div id="raceLogList" className="overflow-x-auto">
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
                          {Array.from({ length: 5 }).map((_, i) => (
                            <RaceSkeletonRow key={i} />
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                entries.map((entry) => {
                  const pace = entry.avg_pace_sec_per_km
                    ? secsToMMSS(entry.avg_pace_sec_per_km)
                    : entry.finish_time_sec && entry.distance_m
                      ? secsToMMSS(Math.round((entry.finish_time_sec / entry.distance_m) * 1000))
                      : null
                  return (
                    <TableRow
                      key={entry.id}
                      id="raceLogCard"
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
        </div>
      )}

      <RaceFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={(newEntry) => {
          handleSaved(newEntry)
          router.push(`/main/running/race-log/${newEntry.id}`)
        }}
      />
      <RaceConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        activity={pendingActivity}
        onSaved={(newEntry) => {
          handleSaved(newEntry)
          router.push(`/main/running/race-log/${newEntry.id}`)
        }}
      />
      <ActivityPickerDialog
        open={pagePickerOpen}
        onClose={() => setPagePickerOpen(false)}
        currentActivityId={null}
        onSelect={openAddFromActivity}
      />
    </div>
  )
}
