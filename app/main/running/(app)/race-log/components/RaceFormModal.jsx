'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import Button from '@/components/base/Button/Button'
import DatePicker from '@/components/base/DatePicker/DatePicker/DatePicker'
import Input from '@/components/base/Input/Input'
import { Checkbox } from '@/components/base/Checkbox/Checkbox'
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
} from '@/components/base/Select/Select'
import Textarea from '@/components/base/Textarea/Textarea'
import FieldContent from '@/components/base/Field/FieldContent'
import FieldLabel from '@/components/base/Field/FieldLabel'
import FieldError from '@/components/base/Field/FieldError'
import FieldDescription from '@/components/base/Field/FieldDescription'
import { toast } from 'sonner'
import { createRaceLog } from '@/lib/api/running'
import { createRaceLogSchema } from '@/schemas/raceLog'
import { DISTANCE_PRESETS, hmsToSecs, secsToHMSInput } from './raceLogUtils'

export default function RaceFormModal({ open, onClose, onSaved }) {
  const [distanceMode, setDistanceMode] = useState('preset')
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState(null)
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
          <FieldContent error={errors.title?.message}>
            <FieldLabel htmlFor="raceTitle" required>
              Race name
            </FieldLabel>
            <Input
              id="raceTitle"
              placeholder="e.g. Jakarta Marathon 2025"
              className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
              {...register('title')}
            />
            <FieldDescription className="text-xs text-slate-400">
              Name it after the official race event 🏁
            </FieldDescription>
            <FieldError />
          </FieldContent>

          {/* Race date */}
          <Controller
            name="race_date"
            control={control}
            render={({ field, fieldState }) => (
              <FieldContent error={fieldState.error?.message}>
                <FieldLabel required>Race date</FieldLabel>
                <DatePicker
                  id="raceDate"
                  value={field.value ? parseISO(field.value) : null}
                  onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                />
                <FieldDescription className="text-xs text-slate-400">
                  The date you actually ran the race 📅
                </FieldDescription>
                <FieldError />
              </FieldContent>
            )}
          />

          {/* Distance */}
          <FieldContent error={errors.distance_m?.message}>
            <FieldLabel required>Distance</FieldLabel>
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
            <FieldDescription className="text-xs text-slate-400">
              Pick a preset or enter exact meters for custom races 📏
            </FieldDescription>
            <FieldError />
          </FieldContent>

          {/* DNF checkbox */}
          <FieldContent>
            <div className="flex items-center gap-2.5">
              <Controller
                name="did_not_finish"
                control={control}
                render={({ field }) => (
                  <Checkbox id="dnf" checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
              <FieldLabel htmlFor="dnf" className="cursor-pointer select-none">
                Did not finish (DNF)
              </FieldLabel>
            </div>
            <FieldDescription className="text-xs text-slate-400">
              Check this if you did not finish the race 🚫
            </FieldDescription>
          </FieldContent>

          {/* Finish time — hidden when DNF */}
          {!dnf && (
            <Controller
              name="finish_time_sec"
              control={control}
              render={({ field, fieldState }) => (
                <FieldContent error={fieldState.error?.message}>
                  <FieldLabel htmlFor="finishTime" required>
                    Finish time (HH:MM:SS)
                  </FieldLabel>
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
                  />
                  <FieldDescription className="text-xs text-slate-400">
                    Your official chip or gun time (hh:mm:ss) ⏱️
                  </FieldDescription>
                  <FieldError />
                </FieldContent>
              )}
            />
          )}

          {/* Optional fields — 2 columns */}
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="position_place"
              control={control}
              render={({ field, fieldState }) => (
                <FieldContent error={fieldState.error?.message}>
                  <FieldLabel htmlFor="posPlace">Position (place)</FieldLabel>
                  <Input
                    id="posPlace"
                    type="number"
                    placeholder="e.g. 42"
                    className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                  />
                  <FieldDescription className="text-xs text-slate-400">
                    Your overall finisher position 🥇
                  </FieldDescription>
                  <FieldError />
                </FieldContent>
              )}
            />
            <Controller
              name="position_male"
              control={control}
              render={({ field, fieldState }) => (
                <FieldContent error={fieldState.error?.message}>
                  <FieldLabel htmlFor="posMale">Position (male)</FieldLabel>
                  <Input
                    id="posMale"
                    type="number"
                    placeholder="e.g. 8"
                    className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                  />
                  <FieldDescription className="text-xs text-slate-400">
                    Your position within the male category 👟
                  </FieldDescription>
                  <FieldError />
                </FieldContent>
              )}
            />
          </div>

          {/* Notes */}
          <FieldContent>
            <FieldLabel htmlFor="raceNotes">Notes</FieldLabel>
            <Textarea
              id="raceNotes"
              placeholder="Weather, conditions, how you felt…"
              className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
              rows={3}
              {...register('notes')}
            />
            <FieldDescription className="text-xs text-slate-400">
              Conditions, how you felt, lessons learned 📝
            </FieldDescription>
          </FieldContent>

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
              className="text-violet-600 font-medium"
              type="button"
              variant="secondary"
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
