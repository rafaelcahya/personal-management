'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, CalendarIcon, Loader2 } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarPicker } from '@/components/ui/calendar'
import { format, parseISO } from 'date-fns'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { createRaceLog } from '@/lib/api/running'
import { createRaceLogSchema } from '@/schemas/raceLog'
import { DISTANCE_PRESETS, hmsToSecs, secsToHMSInput } from './raceLogUtils'

export default function RaceFormModal({ open, onClose, onSaved }) {
  const [distanceMode, setDistanceMode] = useState('preset')
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState(null)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [finishTimeStr, setFinishTimeStr] = useState('')

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createRaceLogSchema),
    defaultValues: {
      title: '',
      race_date: '',
      distance_m: null,
      finish_time_sec: null,
      position_place: null,
      position_male: null,
      did_not_finish: false,
      notes: '',
    },
  })

  const dnf = watch('did_not_finish')

  useEffect(() => {
    if (open) {
      setDistanceMode('preset')
      setFinishTimeStr('')
      reset({
        title: '',
        race_date: '',
        distance_m: null,
        finish_time_sec: null,
        position_place: null,
        position_male: null,
        did_not_finish: false,
        notes: '',
      })
      setServerError(null)
    }
  }, [open, reset])

  async function onSubmit(data) {
    if (data.distance_m == null) {
      setError('distance_m', { message: 'Distance is required' })
      return
    }
    setSaving(true)
    setServerError(null)
    try {
      const result = await createRaceLog(data)
      toast.success('Race entry added')
      onSaved(result.data)
      onClose()
    } catch (err) {
      setServerError(err.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent id="raceLogFormModal" className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log a Race</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 py-1">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="raceTitle">
              Race name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="raceTitle"
              placeholder="e.g. Jakarta Marathon 2025"
              className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
              {...register('title')}
              aria-describedby={errors.title ? 'raceTitleError' : undefined}
            />
            <p className="text-xs text-slate-400">Name it after the official race event 🏁</p>
            {errors.title && (
              <p id="raceTitleError" className="text-xs text-red-600" role="alert">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Race date */}
          <div className="flex flex-col gap-1.5">
            <Label>
              Race date <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="race_date"
              control={control}
              render={({ field }) => (
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="raceDate"
                      variant="outline"
                      className={`w-full justify-start text-left text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 ${!field.value ? 'text-slate-400' : 'text-slate-900'}`}
                      aria-describedby={errors.race_date ? 'raceDateError' : undefined}
                    >
                      <CalendarIcon
                        className="size-4 mr-2 shrink-0 text-slate-400"
                        aria-hidden="true"
                      />
                      {field.value ? format(parseISO(field.value), 'd MMM yyyy') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarPicker
                      mode="single"
                      selected={field.value ? parseISO(field.value) : undefined}
                      onSelect={(date) => {
                        field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                        setDatePickerOpen(false)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            <p className="text-xs text-slate-400">The date you actually ran the race 📅</p>
            {errors.race_date && (
              <p id="raceDateError" className="text-xs text-red-600" role="alert">
                {errors.race_date.message}
              </p>
            )}
          </div>

          {/* Distance */}
          <div className="flex flex-col gap-1.5">
            <Label>
              Distance <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="distance_m"
              control={control}
              render={({ field }) => (
                <Select
                  value={
                    distanceMode === 'custom'
                      ? 'custom'
                      : field.value != null
                        ? String(field.value)
                        : ''
                  }
                  onValueChange={(v) => {
                    if (v === 'custom') {
                      setDistanceMode('custom')
                      field.onChange(null)
                    } else {
                      setDistanceMode('preset')
                      field.onChange(Number(v))
                    }
                  }}
                >
                  <SelectTrigger
                    className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                    aria-label="Select distance"
                  >
                    <SelectValue placeholder="Select distance…" />
                  </SelectTrigger>
                  <SelectContent>
                    {DISTANCE_PRESETS.map((p) => (
                      <SelectItem key={String(p.value)} value={String(p.value)}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {distanceMode === 'custom' && (
              <Controller
                name="distance_m"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder="Distance in meters (e.g. 15000)"
                    className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                    aria-label="Custom distance in meters"
                  />
                )}
              />
            )}
            <p className="text-xs text-slate-400">
              Pick a preset or enter exact meters for custom races 📏
            </p>
            {errors.distance_m && (
              <p className="text-xs text-red-600" role="alert">
                {errors.distance_m.type === 'invalid_type'
                  ? 'Distance is required'
                  : errors.distance_m.message}
              </p>
            )}
          </div>

          {/* DNF checkbox */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              <Controller
                name="did_not_finish"
                control={control}
                render={({ field }) => (
                  <Checkbox id="dnf" checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
              <Label htmlFor="dnf" className="cursor-pointer select-none">
                Did not finish (DNF)
              </Label>
            </div>
            <p className="text-xs text-slate-400">Check this if you did not finish the race 🚫</p>
          </div>

          {/* Finish time — hidden when DNF */}
          {!dnf && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="finishTime">
                Finish time (HH:MM:SS) <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="finish_time_sec"
                control={control}
                render={({ field }) => (
                  <Input
                    id="finishTime"
                    placeholder="e.g. 00:45:30"
                    className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                    value={finishTimeStr}
                    onChange={(e) => setFinishTimeStr(e.target.value)}
                    onBlur={() => {
                      const secs = hmsToSecs(finishTimeStr)
                      field.onChange(secs ?? null)
                      if (secs != null) setFinishTimeStr(secsToHMSInput(secs))
                    }}
                    aria-describedby={errors.finish_time_sec ? 'finishTimeError' : undefined}
                  />
                )}
              />
              <p className="text-xs text-slate-400">Your official chip or gun time (hh:mm:ss) ⏱️</p>
              {errors.finish_time_sec && (
                <p id="finishTimeError" className="text-xs text-red-600" role="alert">
                  {errors.finish_time_sec.message}
                </p>
              )}
            </div>
          )}

          {/* Optional fields — 2 columns */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="posPlace">Position (place)</Label>
              <Controller
                name="position_place"
                control={control}
                render={({ field }) => (
                  <Input
                    id="posPlace"
                    type="number"
                    placeholder="e.g. 42"
                    className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                  />
                )}
              />
              <p className="text-xs text-slate-400">Your overall finisher position 🥇</p>
              {errors.position_place && (
                <p className="text-xs text-red-600" role="alert">
                  {errors.position_place.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="posMale">Position (male)</Label>
              <Controller
                name="position_male"
                control={control}
                render={({ field }) => (
                  <Input
                    id="posMale"
                    type="number"
                    placeholder="e.g. 8"
                    className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                  />
                )}
              />
              <p className="text-xs text-slate-400">Your position within the male category 👟</p>
              {errors.position_male && (
                <p className="text-xs text-red-600" role="alert">
                  {errors.position_male.message}
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="raceNotes">Notes</Label>
            <Textarea
              id="raceNotes"
              placeholder="Weather, conditions, how you felt…"
              className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
              rows={3}
              {...register('notes')}
            />
            <p className="text-xs text-slate-400">Conditions, how you felt, lessons learned 📝</p>
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
            <Button
              className="text-violet-600 bg-white dark:bg-transparent hover:bg-violet-100 dark:hover:bg-violet-500/5 font-medium"
              type="button"
              disabled={saving}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            id="raceLogSaveBtn"
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
