'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  AlertTriangle,
  Calendar,
  Clock,
  Heart,
  Link2,
  Loader2,
  MapPin,
  Mountain,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { createRaceLog } from '@/lib/api/running'
import { getDistanceLabel, secsToHMS } from './raceLogUtils'

export default function RaceConfirmDialog({ open, onClose, activity, onSaved }) {
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState(null)

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      did_not_finish: false,
      position_place: null,
      position_male: null,
      notes: '',
    },
  })

  const dnf = watch('did_not_finish')

  useEffect(() => {
    if (open) {
      setServerError(null)
      reset({
        title: activity?.name ?? '',
        did_not_finish: false,
        position_place: null,
        position_male: null,
        notes: '',
      })
    }
  }, [open, activity, reset])

  async function onSubmit(fields) {
    if (!activity) return
    setSaving(true)
    setServerError(null)
    try {
      const result = await createRaceLog({
        title: fields.title,
        race_date: activity.started_at.slice(0, 10),
        distance_m: activity.distance_m ? Math.round(activity.distance_m) : undefined,
        finish_time_sec: !fields.did_not_finish
          ? (activity.moving_time_sec ?? activity.duration_sec ?? undefined)
          : undefined,
        avg_hr: activity.avg_hr ? Math.round(activity.avg_hr) : undefined,
        elevation_gain_m: activity.elevation_gain_m
          ? Math.round(activity.elevation_gain_m)
          : undefined,
        did_not_finish: fields.did_not_finish,
        position_place: fields.position_place || undefined,
        position_male: fields.position_male || undefined,
        notes: fields.notes || undefined,
        activity_id: activity.id,
      })
      toast.success('Race entry added')
      onSaved(result.data)
      onClose()
    } catch (err) {
      setServerError(err.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  if (!activity) return null

  const distLabel = getDistanceLabel(activity.distance_m)
  const finishTime = activity.moving_time_sec ?? activity.duration_sec
  const raceDate = activity.started_at
    ? new Date(activity.started_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '—'

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent id="raceConfirmDialog" className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Race Entry</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Race name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirmRaceTitle">
              Race name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="confirmRaceTitle"
              placeholder="e.g. Jakarta Marathon 2025"
              className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
              {...register('title', { required: 'Race name is required' })}
            />
            {errors.title && (
              <p className="text-xs text-red-600" role="alert">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Activity data summary */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 divide-y divide-slate-100">
            <div className="flex items-center justify-between px-3 py-2 text-sm">
              <span className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="size-3.5 text-slate-400" aria-hidden="true" /> Date
              </span>
              <span className="font-medium text-slate-700">{raceDate}</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 text-sm">
              <span className="flex items-center gap-1.5 text-slate-500">
                <MapPin className="size-3.5 text-slate-400" aria-hidden="true" /> Distance
              </span>
              <span className="font-medium text-slate-700">{distLabel}</span>
            </div>
            {finishTime && !dnf && (
              <div className="flex items-center justify-between px-3 py-2 text-sm">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="size-3.5 text-slate-400" aria-hidden="true" /> Finish time
                </span>
                <span className="font-medium text-slate-700">{secsToHMS(finishTime)}</span>
              </div>
            )}
            {activity.avg_hr && (
              <div className="flex items-center justify-between px-3 py-2 text-sm">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Heart className="size-3.5 text-red-400" aria-hidden="true" /> Avg HR
                </span>
                <span className="font-medium text-slate-700">
                  {Math.round(activity.avg_hr)} bpm
                </span>
              </div>
            )}
            {activity.elevation_gain_m && (
              <div className="flex items-center justify-between px-3 py-2 text-sm">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Mountain className="size-3.5 text-slate-400" aria-hidden="true" /> Elevation
                </span>
                <span className="font-medium text-slate-700">
                  {Math.round(activity.elevation_gain_m)} m
                </span>
              </div>
            )}
            <div className="flex items-center justify-between px-3 py-2 text-sm">
              <span className="flex items-center gap-1.5 text-slate-500">
                <Link2 className="size-3.5 text-violet-400" aria-hidden="true" /> Strava activity
              </span>
              <span className="font-medium text-slate-700 truncate max-w-[180px]">
                {activity.name || 'Untitled'}
              </span>
            </div>
          </div>

          {/* DNF */}
          <div className="flex items-center gap-2.5">
            <Controller
              name="did_not_finish"
              control={control}
              render={({ field }) => (
                <Checkbox id="confirmDnf" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <Label htmlFor="confirmDnf" className="cursor-pointer select-none">
              Did not finish (DNF)
            </Label>
          </div>

          {/* Position */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmPosPlace">Position (place)</Label>
              <Controller
                name="position_place"
                control={control}
                render={({ field }) => (
                  <Input
                    id="confirmPosPlace"
                    type="number"
                    placeholder="e.g. 42"
                    className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                  />
                )}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmPosMale">Position (male)</Label>
              <Controller
                name="position_male"
                control={control}
                render={({ field }) => (
                  <Input
                    id="confirmPosMale"
                    type="number"
                    placeholder="e.g. 8"
                    className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                  />
                )}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirmNotes">Notes</Label>
            <Textarea
              id="confirmNotes"
              placeholder="Weather, conditions, how you felt…"
              className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
              rows={2}
              {...register('notes')}
            />
          </div>

          {serverError && (
            <p className="text-xs text-red-600 flex items-center gap-1" role="alert">
              <AlertTriangle className="size-3.5 shrink-0" aria-hidden="true" />
              {serverError}
            </p>
          )}
        </form>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" type="button" disabled={saving}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            id="raceConfirmSubmitBtn"
            onClick={handleSubmit(onSubmit)}
            disabled={saving}
            className="min-w-[80px]"
          >
            {saving ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : 'Log race'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
