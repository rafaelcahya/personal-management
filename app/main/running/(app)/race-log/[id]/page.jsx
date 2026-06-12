'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import {
  fetchRaceLogEntry,
  deleteRaceLog,
  fetchActivity,
  fetchSubjectiveHealthByDate,
  fetchActivityStreams,
  getUserProfile,
} from '@/lib/api/running'
import PageHeader from '@/app/main/components/PageHeader'
import EditRaceModal from '../components/EditRaceModal'
import ActivitySection from '../components/ActivitySection'
import RacingWeightSection from '../components/RacingWeightSection'

function PageSkeleton() {
  return (
    <div className="flex flex-col gap-3 sm:gap-5 animate-pulse">
      <div className="h-8 bg-slate-100 rounded w-2/3" />
      <div className="border border-slate-200/50 rounded-xl bg-white overflow-hidden">
        <div className="p-5 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="size-9 rounded-lg bg-slate-100 shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-6 bg-slate-100 rounded w-56" />
              <div className="h-4 bg-slate-100 rounded w-32" />
            </div>
          </div>
          <div className="border-t border-slate-100" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 bg-slate-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RaceDetailPage() {
  const { id } = useParams()
  const router = useRouter()

  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [activity, setActivity] = useState(null)
  const [splits, setSplits] = useState([])
  const [laps, setLaps] = useState([])
  const [bestEfforts, setBestEfforts] = useState([])
  const [photos, setPhotos] = useState([])
  const [streams, setStreams] = useState([])
  const [activityLoading, setActivityLoading] = useState(false)
  const [healthLog, setHealthLog] = useState(undefined)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [res, profileRes] = await Promise.allSettled([
          fetchRaceLogEntry(id),
          getUserProfile(),
        ])
        if (profileRes.status === 'fulfilled' && !cancelled) {
          setProfile(profileRes.value)
        }
        if (res.status === 'rejected') throw res.reason
        if (!cancelled) {
          setEntry(res.value.data)
          if (res.value.data?.activity_id) {
            setActivityLoading(true)
            const activityId = res.value.data.activity_id
            Promise.allSettled([fetchActivity(activityId), fetchActivityStreams(activityId)])
              .then(([actRes, streamsRes]) => {
                if (!cancelled) {
                  if (actRes.status === 'fulfilled') {
                    setActivity(actRes.value.activity)
                    setSplits(actRes.value.splits ?? [])
                    setLaps(actRes.value.laps ?? [])
                    setBestEfforts(actRes.value.best_efforts ?? [])
                    setPhotos(actRes.value.photos ?? [])
                  }
                  if (streamsRes.status === 'fulfilled') {
                    setStreams(streamsRes.value?.data ?? [])
                  }
                  setActivityLoading(false)
                  const activityDate = actRes.value?.activity?.started_at?.slice(0, 10)
                  if (activityDate) {
                    fetchSubjectiveHealthByDate(activityDate)
                      .then((log) => {
                        if (!cancelled) setHealthLog(log ?? null)
                      })
                      .catch(() => {
                        if (!cancelled) setHealthLog(null)
                      })
                  }
                }
              })
              .catch(() => {
                if (!cancelled) setActivityLoading(false)
              })
          }
        }
      } catch (err) {
        if (err.message === 'UNAUTHORIZED') {
          window.location.href = '/login'
          return
        }
        if (!cancelled) setError(err.message || 'Failed to load race entry')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [id])

  async function handleDelete() {
    if (!entry) return
    setDeleting(true)
    try {
      await deleteRaceLog(entry.id)
      toast.success('Race entry deleted')
      router.push('/main/running/race-log')
    } catch (err) {
      toast.error(err.message || 'Failed to delete entry')
      setDeleting(false)
    }
  }

  return (
    <div id="raceDetailPage" className="flex flex-col gap-3 sm:gap-5">
      {/* Back + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center size-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors shrink-0"
          aria-label="Go back"
        >
          <ChevronLeft className="size-4" />
        </button>
        <PageHeader
          title={entry?.title ?? 'Race Detail'}
          breadcrumbs={[
            { label: 'Running', href: '/main/running/dashboard' },
            { label: 'Race Log', href: '/main/running/race-log' },
            { label: entry?.title ?? 'Detail' },
          ]}
        />
      </div>

      {loading && <PageSkeleton />}

      {!loading && error && (
        <div
          className="flex flex-col items-center justify-center gap-3 py-20 text-sm text-red-400"
          role="alert"
        >
          <AlertTriangle className="size-8" aria-hidden="true" />
          <span>{error}</span>
          <button
            onClick={() => window.location.reload()}
            className="text-xs text-violet-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 rounded"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && entry && (
        <div className="border border-slate-200/50 shadow-slate-100 rounded-xl bg-white overflow-hidden pt-0 lg:pt-6 pb-6">
          {/* Activity carousel (outside content column, full-width) */}
          {activityLoading && <div className="w-full h-64 bg-slate-100 animate-pulse" />}

          {/* Linked activity */}
          {activityLoading && (
            <div className="w-full lg:w-3/5 mx-auto px-4 lg:px-0 flex flex-col gap-3 mt-5 animate-pulse">
              <div className="border-t border-slate-100" />
              <div className="h-5 bg-slate-100 rounded w-32" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-20 bg-slate-100 rounded-lg" />
                ))}
              </div>
            </div>
          )}

          {profile && (profile.weight_kg || profile.height_cm) && (
            <div className="w-full lg:w-3/5 mx-auto px-4 lg:px-0 mt-5">
              <RacingWeightSection entry={entry} profile={profile} />
            </div>
          )}

          {!activityLoading && activity && (
            <ActivitySection
              activity={activity}
              activityId={entry.activity_id}
              splits={splits}
              laps={laps}
              bestEfforts={bestEfforts}
              photos={photos}
              streams={streams}
              healthLog={healthLog}
              onEditClick={() => setEditOpen(true)}
              entryDistanceM={entry.distance_m ? Number(entry.distance_m) : null}
              entryFinishTimeSec={entry.finish_time_sec}
            />
          )}

          {/* Delete button */}
          <div className="w-full lg:w-3/5 mx-auto px-4 lg:px-0 mt-5">
            <div className="border-t border-slate-100 pt-2 flex justify-end">
              <Button
                id="deleteRaceBtn_raceDetailPage"
                variant="outline"
                size="sm"
                onClick={() => setDeleteOpen(true)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                <Trash2 className="size-3.5 mr-1.5" aria-hidden="true" />
                Delete race
              </Button>
            </div>
          </div>
        </div>
      )}

      <EditRaceModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        entry={entry}
        onSaved={(updated) => setEntry(updated)}
      />

      <AlertDialog open={deleteOpen} onOpenChange={(v) => !v && setDeleteOpen(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this race entry?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{entry?.title}</strong> will be permanently deleted. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              className="text-violet-600 hover:text-violet-600 bg-white dark:bg-transparent hover:bg-violet-100 dark:hover:bg-violet-500/5 font-medium border-none"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              id="deleteRaceConfirmBtn_raceDetailPage"
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-500"
            >
              {deleting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
