'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Loader2, Search } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { fetchActivities } from '@/lib/api/running'
import { fmtDistance, fmtPace, fmtDuration } from '../../dashboard/utils/format'

const PICKER_LIMIT = 10

export default function ActivityPickerDialog({ open, onClose, onSelect, currentActivityId }) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [activities, setActivities] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (!open) return
    setPage(1)
    setSearch('')
  }, [open])

  useEffect(() => {
    if (!open) return
    clearTimeout(debounceRef.current)
    const delay = search ? 300 : 0
    debounceRef.current = setTimeout(() => {
      setLoading(true)
      fetchActivities({ page, limit: PICKER_LIMIT, search: search || null })
        .then((res) => {
          setActivities(res.data ?? [])
          setTotal(res.total ?? 0)
        })
        .catch(() => {
          setActivities([])
          setTotal(0)
        })
        .finally(() => setLoading(false))
    }, delay)
    return () => clearTimeout(debounceRef.current)
  }, [open, page, search])

  const totalPages = Math.max(1, Math.ceil(total / PICKER_LIMIT))

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        id="activityPickerDialog"
        className="max-w-2xl flex flex-col gap-0 p-0 max-h-[80vh]"
      >
        <DialogHeader className="px-5 pt-5 pb-3 shrink-0">
          <DialogTitle>Select Activity</DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="px-5 pb-3 shrink-0">
          <div className="relative">
            <Search
              className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400"
              aria-hidden="true"
            />
            <Input
              id="activityPickerSearch"
              placeholder="Search by name…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-8 text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto min-h-0">
          <Table className="min-w-[480px] w-full table-auto">
            <TableHeader className="bg-slate-50 sticky top-0 z-10">
              <TableRow className="border-none uppercase text-xs">
                <TableHead className="py-2 pl-5 text-slate-500 w-[45%]">Activity</TableHead>
                <TableHead className="py-2 text-slate-500">Date</TableHead>
                <TableHead className="py-2 text-right text-slate-500">Dist</TableHead>
                <TableHead className="py-2 text-right text-slate-500">Pace</TableHead>
                <TableHead className="py-2 pr-5 text-right text-slate-500">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center">
                    <Loader2
                      className="size-5 animate-spin text-slate-400 mx-auto"
                      aria-hidden="true"
                    />
                  </TableCell>
                </TableRow>
              )}
              {!loading && activities.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="py-10 text-center text-sm text-slate-400">
                    No activities found
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                activities.map((a) => {
                  const isSelected = a.id === currentActivityId
                  const dur = a.moving_time_sec ?? a.duration_sec
                  return (
                    <TableRow
                      key={a.id}
                      onClick={() => onSelect(a)}
                      className={`cursor-pointer transition-colors ${isSelected ? 'bg-violet-50' : 'hover:bg-slate-50'}`}
                    >
                      <TableCell className="pl-5 w-[45%]">
                        <div className="flex flex-col min-w-0">
                          <span
                            className={`text-sm font-medium truncate ${isSelected ? 'text-violet-700' : 'text-slate-800'}`}
                          >
                            {a.name || 'Untitled'}
                          </span>
                          <span className="text-xs text-slate-400">{a.activity_type ?? '—'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 whitespace-nowrap">
                        {a.started_at
                          ? new Date(a.started_at).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums text-sm text-slate-700">
                        {a.distance_m ? `${fmtDistance(a.distance_m)} km` : '—'}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums text-sm text-slate-700">
                        {a.avg_pace_sec_per_km ? `${fmtPace(a.avg_pace_sec_per_km)}/km` : '—'}
                      </TableCell>
                      <TableCell className="pr-5 text-right font-mono tabular-nums text-sm text-slate-700">
                        {dur != null ? fmtDuration(dur) : '—'}
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 shrink-0">
          <Button
            variant="outline"
            size="base"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="size-3.5" aria-hidden="true" />
            Prev
          </Button>
          <span className="text-xs text-slate-400">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="base"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || loading}
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight className="size-3.5" aria-hidden="true" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
