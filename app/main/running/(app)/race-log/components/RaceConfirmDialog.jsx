'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  AlertTriangle,
  Calendar,
  Clock,
  Heart,
  Link2,
  Loader2,
  MapPin,
  Mountain,
  Trophy,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { createRaceLog } from '@/lib/api/running'
import { getDistanceLabel, secsToHMS } from './raceLogUtils'

export default function RaceConfirmDialog({ open, onClose, activity, onSaved }) {
  const [serverError, setServerError] = useState(null)

  const form = useForm({
    defaultValues: {
      title: '',
      did_not_finish: false,
      position_place: null,
      position_male: null,
      notes: '',
    },
  })

  const dnf = form.watch('did_not_finish')

  useEffect(() => {
    if (open) {
      setServerError(null)
      form.reset({
        title: activity?.name ?? '',
        did_not_finish: false,
        position_place: null,
        position_male: null,
        notes: '',
      })
    }
  }, [open, activity, form])

  async function onSubmit(fields) {
    if (!activity) return
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
      <DialogContent
        id="raceConfirmDialog"
        className="max-w-md max-h-[90vh] flex flex-col p-0 gap-0"
      >
        <DialogHeader className="border-b border-slate-100 px-5 py-4 shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <Trophy className="size-4 text-violet-500" aria-hidden="true" />
            Confirm Race Entry
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Log this activity as an official race result
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col overflow-y-auto px-5 py-5 gap-5"
            noValidate
          >
            {/* Race name */}
            <FormField
              control={form.control}
              name="title"
              rules={{ required: 'Race name is required' }}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Race name</FormLabel>
                  <FormControl>
                    <Input
                      id="confirmRaceTitle"
                      placeholder="e.g. Jakarta Marathon 2025"
                      className={cn(
                        'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500',
                        fieldState.error && 'border-rose-500'
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

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
            <FormField
              control={form.control}
              name="did_not_finish"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2.5">
                  <FormControl>
                    <Checkbox
                      id="confirmDnf"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="confirmDnf"
                    className="text-sm font-medium cursor-pointer select-none !mt-0"
                  >
                    Did not finish (DNF)
                  </FormLabel>
                </FormItem>
              )}
            />

            {/* Position */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="position_place"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Position (place)</FormLabel>
                    <FormControl>
                      <Input
                        id="confirmPosPlace"
                        type="number"
                        placeholder="e.g. 42"
                        className={cn(
                          'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500',
                          fieldState.error && 'border-rose-500'
                        )}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="position_male"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Position (male)</FormLabel>
                    <FormControl>
                      <Input
                        id="confirmPosMale"
                        type="number"
                        placeholder="e.g. 8"
                        className={cn(
                          'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500',
                          fieldState.error && 'border-rose-500'
                        )}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      id="confirmNotes"
                      placeholder="Weather, conditions, how you felt…"
                      rows={2}
                      className={cn(
                        'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 resize-none',
                        fieldState.error && 'border-rose-500'
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {serverError && (
              <p className="text-xs text-red-600 flex items-center gap-1" role="alert">
                <AlertTriangle className="size-3.5 shrink-0" aria-hidden="true" />
                {serverError}
              </p>
            )}

            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  disabled={form.formState.isSubmitting}
                  className="text-violet-600 bg-white hover:bg-violet-100 font-medium"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                id="raceConfirmSubmitBtn"
                type="submit"
                disabled={form.formState.isSubmitting}
                className="min-w-[80px]"
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  'Log race'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
