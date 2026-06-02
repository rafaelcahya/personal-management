'use client'

import { useState } from 'react'
import {
  Flag,
  Calendar,
  MapPin,
  AlertTriangle,
  Link2,
  CalendarPlus,
  Pencil,
  Trash2,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { updateUpcomingRace, deleteUpcomingRace, createRaceLog } from '@/lib/api/running'
import { getDistanceLabel, hmsToSecs, secsToHMSInput, formatDate } from './raceLogUtils'
import ActivityPickerDialog from './ActivityPickerDialog'
import UpcomingRaceFormModal from './UpcomingRaceFormModal'

function daysUntil(dateStr) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const race = new Date(dateStr)
  race.setHours(0, 0, 0, 0)
  return Math.round((race - today) / 86400000)
}

function CountdownBadge({ dateStr }) {
  const days = daysUntil(dateStr)
  if (days <= 7) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
        Race week!
      </span>
    )
  }
  if (days <= 30) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
        {days} days
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
      {days} days
    </span>
  )
}

export default function UpcomingRaceCard({ race, onUpdated, onDeleted }) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [finishTimeStr, setFinishTimeStr] = useState(
    race.finish_time_sec ? secsToHMSInput(race.finish_time_sec) : ''
  )
  const [positionPlace, setPositionPlace] = useState(race.position_place ?? '')
  const [avgHr, setAvgHr] = useState(race.avg_hr ?? '')
  const [elevationGain, setElevationGain] = useState(race.elevation_gain_m ?? '')
  const [linking, setLinking] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const linked = !!race.linked_activity_id
  const fieldsDisabled = !linked

  async function handleLinkActivity(activity) {
    setPickerOpen(false)
    setLinking(true)
    try {
      const result = await updateUpcomingRace(race.id, { linked_activity_id: activity.id })
      onUpdated(result.data)
      toast.success('Activity linked')
    } catch (err) {
      toast.error(err.message || 'Failed to link activity')
    } finally {
      setLinking(false)
    }
  }

  function handleAddToCalendar() {
    const startStr = race.race_date.replace(/-/g, '')
    const [y, m, d] = race.race_date.split('-').map(Number)
    const nextDay = new Date(Date.UTC(y, m - 1, d + 1))
    const endStr = nextDay.toISOString().slice(0, 10).replace(/-/g, '')
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: race.title,
      dates: `${startStr}/${endStr}`,
      details: [race.distance_m ? getDistanceLabel(race.distance_m) : '', race.notes || '']
        .filter(Boolean)
        .join(' — '),
      location: race.location || '',
    })
    window.open(`https://calendar.google.com/calendar/render?${params}`, '_blank')
  }

  async function handleSaveAsCompleted() {
    setCompleting(true)
    try {
      await deleteUpcomingRace(race.id)
      await createRaceLog({
        title: race.title,
        race_date: race.race_date,
        distance_m: race.distance_m,
        location: race.location || null,
        notes: race.notes || null,
        finish_time_sec: hmsToSecs(finishTimeStr) || null,
        position_place: positionPlace ? Number(positionPlace) : null,
        avg_hr: avgHr ? Number(avgHr) : null,
        elevation_gain_m: elevationGain ? Number(elevationGain) : null,
        activity_id: race.linked_activity_id || null,
      })
      onDeleted(race.id)
      toast.success('Race saved to history!')
    } catch (err) {
      toast.error(err.message || 'Failed to save race')
    } finally {
      setCompleting(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteUpcomingRace(race.id)
      onDeleted(race.id)
      toast.success('Upcoming race deleted')
      setDeleteOpen(false)
    } catch (err) {
      toast.error(err.message || 'Failed to delete race')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div
        id={`upcomingRaceCard_${race.id}_raceLogPage`}
        className="border border-slate-200/50 shadow-sm rounded-xl bg-white p-4 flex flex-col gap-4"
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center justify-center size-9 rounded-full bg-violet-50 shrink-0">
              <Flag className="size-4 text-violet-500" aria-hidden="true" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-slate-800 truncate">{race.title}</span>
              <span className="text-xs text-violet-600 font-medium">
                {getDistanceLabel(race.distance_m)}
              </span>
            </div>
          </div>
          {race.race_date && <CountdownBadge dateStr={race.race_date} />}
        </div>

        {/* Amber info guide — shown when no linked activity */}
        {!linked && (
          <div
            id="upcomingRaceInfoGuide_raceLogPage"
            className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2 text-sm text-amber-800"
            role="alert"
          >
            <AlertTriangle className="size-4 shrink-0 mt-0.5 text-amber-500" aria-hidden="true" />
            <span>
              Race ini belum dijalankan. Setelah race selesai, link activity Strava untuk melengkapi
              data.
            </span>
          </div>
        )}

        {/* Race details row */}
        <div className="flex items-center gap-4 flex-wrap text-xs text-slate-500">
          {race.race_date && (
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5 shrink-0" aria-hidden="true" />
              {formatDate(race.race_date)}
            </span>
          )}
          {race.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
              {race.location}
            </span>
          )}
        </div>

        {/* Manual result fields */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`finishTime_${race.id}`} className="text-xs">
              Finish time (hh:mm:ss)
            </Label>
            <Input
              id={`finishTime_${race.id}`}
              placeholder="00:45:30"
              value={finishTimeStr}
              onChange={(e) => setFinishTimeStr(e.target.value)}
              onBlur={() => {
                const secs = hmsToSecs(finishTimeStr)
                if (secs != null) setFinishTimeStr(secsToHMSInput(secs))
              }}
              disabled={fieldsDisabled}
              className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Finish time"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`position_${race.id}`} className="text-xs">
              Position
            </Label>
            <Input
              id={`position_${race.id}`}
              type="number"
              placeholder="e.g. 42"
              value={positionPlace}
              onChange={(e) => setPositionPlace(e.target.value)}
              disabled={fieldsDisabled}
              className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Position"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`avgHr_${race.id}`} className="text-xs">
              Avg HR (bpm)
            </Label>
            <Input
              id={`avgHr_${race.id}`}
              type="number"
              placeholder="e.g. 165"
              value={avgHr}
              onChange={(e) => setAvgHr(e.target.value)}
              disabled={fieldsDisabled}
              className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Average heart rate"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`elevation_${race.id}`} className="text-xs">
              Elevation gain (m)
            </Label>
            <Input
              id={`elevation_${race.id}`}
              type="number"
              placeholder="e.g. 250"
              value={elevationGain}
              onChange={(e) => setElevationGain(e.target.value)}
              disabled={fieldsDisabled}
              className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Elevation gain"
            />
          </div>
        </div>

        {/* Actions row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Left actions */}
          <div className="flex items-center gap-2">
            <Button
              id="linkActivityBtn_raceLogPage"
              variant="outline"
              size="sm"
              onClick={() => setPickerOpen(true)}
              disabled={linking}
              className="flex items-center gap-1.5 text-xs min-h-11 md:min-h-9"
            >
              {linking ? (
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Link2 className="size-3.5" aria-hidden="true" />
              )}
              {linked ? 'Change activity' : 'Link activity'}
            </Button>
            <Button
              id="addToCalendarBtn_raceLogPage"
              variant="outline"
              size="sm"
              onClick={handleAddToCalendar}
              className="flex items-center gap-1.5 text-xs min-h-11 md:min-h-9"
            >
              <CalendarPlus className="size-3.5" aria-hidden="true" />
              Add to Calendar
            </Button>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditOpen(true)}
              className="flex items-center justify-center size-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors min-h-11 min-w-11 md:min-h-8 md:min-w-8"
              aria-label="Edit upcoming race"
            >
              <Pencil className="size-3.5" aria-hidden="true" />
            </button>
            {linked && (
              <Button
                id="saveAsCompletedBtn_raceLogPage"
                size="sm"
                onClick={handleSaveAsCompleted}
                disabled={completing}
                className="flex items-center gap-1.5 text-xs min-h-11 md:min-h-9"
              >
                {completing ? (
                  <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  'Save as completed'
                )}
              </Button>
            )}
            <button
              id="deleteUpcomingRaceBtn_raceLogPage"
              onClick={() => setDeleteOpen(true)}
              className="flex items-center justify-center size-8 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors min-h-11 min-w-11 md:min-h-8 md:min-w-8"
              aria-label="Delete upcoming race"
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <ActivityPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        currentActivityId={race.linked_activity_id ?? null}
        onSelect={handleLinkActivity}
      />

      <UpcomingRaceFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSaved={(updated) => {
          onUpdated(updated)
          setEditOpen(false)
        }}
        race={race}
      />

      <Dialog open={deleteOpen} onOpenChange={(v) => !v && setDeleteOpen(false)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete upcoming race?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">
            This will remove <span className="font-medium">{race.title}</span> from your upcoming
            races. This action cannot be undone.
          </p>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={deleting}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              id="deleteUpcomingRaceConfirmBtn_raceLogPage"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
