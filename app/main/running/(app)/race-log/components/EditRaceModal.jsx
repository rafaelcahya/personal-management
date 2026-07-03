'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, Loader2 } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import Input from '@/components/base/Input/Input'
import { Checkbox } from '@/components/base/Checkbox/Checkbox'
import Textarea from '@/components/base/Textarea/Textarea'
import DatePicker from '@/components/base/DatePicker/DatePicker/DatePicker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/base/Select/Select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { format, parseISO } from 'date-fns'
import FieldContent from '@/components/base/Field/FieldContent'
import FieldLabel from '@/components/base/Field/FieldLabel'
import FieldError from '@/components/base/Field/FieldError'
import { toast } from 'sonner'
import { updateRaceLog } from '@/lib/api/running'
import { updateRaceLogSchema } from '@/schemas/raceLog'

const DISTANCE_PRESETS = [
  { label: '5K', value: 5000 },
  { label: '10K', value: 10000 },
  { label: 'Half Marathon (21.1K)', value: 21097.5 },
  { label: 'Marathon (42.2K)', value: 42195 },
  { label: 'Custom', value: 'custom' },
]

function hmsToSecs(str) {
  if (!str) return null
  const parts = str.split(':').map(Number)
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return null
}

function secsToHMSInput(s) {
  if (!s) return ''
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

export default function EditRaceModal({ open, onClose, entry, onSaved }) {
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
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateRaceLogSchema),
    defaultValues: {
      title: '',
      race_date: '',
      distance_m: null,
      finish_time_sec: null,
      avg_hr: null,
      elevation_gain_m: null,
      position_place: null,
      position_male: null,
      did_not_finish: false,
      notes: '',
    },
  })

  const dnf = watch('did_not_finish')

  useEffect(() => {
    if (open && entry) {
      const presetMatch = DISTANCE_PRESETS.find(
        (p) => p.value !== 'custom' && p.value === Number(entry.distance_m)
      )
      setDistanceMode(presetMatch ? 'preset' : 'custom')
      setFinishTimeStr(entry.finish_time_sec ? secsToHMSInput(entry.finish_time_sec) : '')
      reset({
        title: entry.title || '',
        race_date: entry.race_date ? entry.race_date.slice(0, 10) : '',
        distance_m: entry.distance_m ? Number(entry.distance_m) : null,
        finish_time_sec: entry.finish_time_sec ?? null,
        avg_hr: entry.avg_hr ?? null,
        elevation_gain_m: entry.elevation_gain_m ? Number(entry.elevation_gain_m) : null,
        position_place: entry.position_place ?? null,
        position_male: entry.position_male ?? null,
        did_not_finish: entry.did_not_finish ?? false,
        notes: entry.notes ?? '',
      })
    }
    setServerError(null)
  }, [open, entry, reset])

  async function onSubmit(data) {
    setSaving(true)
    setServerError(null)
    try {
      const result = await updateRaceLog(entry.id, data)
      toast.success('Race entry updated')
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
      <DialogContent
        id="editRaceModal_raceDetailPage"
        className="max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Edit Race Entry</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 py-1">
          {/* Title */}
          <FieldContent error={errors.title?.message}>
            <FieldLabel htmlFor="editRaceTitle" required>
              Race name
            </FieldLabel>
            <Input
              id="editRaceTitle"
              placeholder="e.g. Jakarta Marathon 2025"
              className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
              {...register('title')}
            />
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
                  id="editRaceDate"
                  value={field.value ? parseISO(field.value) : null}
                  onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                />
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
                  <SelectTrigger className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500">
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
                    placeholder="Distance in meters"
                    className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                  />
                )}
              />
            )}
            <FieldError />
          </FieldContent>

          {/* DNF checkbox */}
          <FieldContent>
            <div className="flex items-center gap-2.5">
              <Controller
                name="did_not_finish"
                control={control}
                render={({ field }) => (
                  <Checkbox id="editDnf" checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
              <FieldLabel htmlFor="editDnf" className="cursor-pointer select-none">
                Did not finish (DNF)
              </FieldLabel>
            </div>
          </FieldContent>

          {/* Finish time */}
          {!dnf && (
            <Controller
              name="finish_time_sec"
              control={control}
              render={({ field, fieldState }) => (
                <FieldContent error={fieldState.error?.message}>
                  <FieldLabel htmlFor="editFinishTime">Finish time (HH:MM:SS)</FieldLabel>
                  <Input
                    id="editFinishTime"
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
                  <FieldError />
                </FieldContent>
              )}
            />
          )}

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="avg_hr"
              control={control}
              render={({ field, fieldState }) => (
                <FieldContent error={fieldState.error?.message}>
                  <FieldLabel htmlFor="editAvgHr">Avg HR (bpm)</FieldLabel>
                  <Input
                    id="editAvgHr"
                    type="number"
                    placeholder="e.g. 165"
                    className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                  />
                  <FieldError />
                </FieldContent>
              )}
            />
            <Controller
              name="elevation_gain_m"
              control={control}
              render={({ field, fieldState }) => (
                <FieldContent error={fieldState.error?.message}>
                  <FieldLabel htmlFor="editElevation">Elevation gain (m)</FieldLabel>
                  <Input
                    id="editElevation"
                    type="number"
                    placeholder="e.g. 250"
                    className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                  />
                  <FieldError />
                </FieldContent>
              )}
            />
            <Controller
              name="position_place"
              control={control}
              render={({ field, fieldState }) => (
                <FieldContent error={fieldState.error?.message}>
                  <FieldLabel htmlFor="editPosPlace">Position (place)</FieldLabel>
                  <Input
                    id="editPosPlace"
                    type="number"
                    placeholder="e.g. 42"
                    className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                  />
                  <FieldError />
                </FieldContent>
              )}
            />
            <Controller
              name="position_male"
              control={control}
              render={({ field, fieldState }) => (
                <FieldContent error={fieldState.error?.message}>
                  <FieldLabel htmlFor="editPosMale">Position (male)</FieldLabel>
                  <Input
                    id="editPosMale"
                    type="number"
                    placeholder="e.g. 8"
                    className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                  />
                  <FieldError />
                </FieldContent>
              )}
            />
          </div>

          {/* Notes */}
          <FieldContent>
            <FieldLabel htmlFor="editNotes">Notes</FieldLabel>
            <Textarea
              id="editNotes"
              placeholder="Weather, conditions, how you felt…"
              className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
              rows={3}
              {...register('notes')}
            />
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
            id="editRaceSaveBtn_raceDetailPage"
            onClick={handleSubmit(onSubmit)}
            disabled={saving}
            className="min-w-[80px]"
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              'Save changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
