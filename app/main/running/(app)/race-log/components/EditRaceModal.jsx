'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, CalendarIcon, Loader2 } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarPicker } from '@/components/ui/calendar'
import { format, parseISO } from 'date-fns'
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
  const [datePickerOpen, setDatePickerOpen] = useState(false)
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
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="editRaceTitle">
              Race name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="editRaceTitle"
              placeholder="e.g. Jakarta Marathon 2025"
              className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-xs text-red-600" role="alert">
                {errors.title.message}
              </p>
            )}
          </div>

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
                      id="editRaceDate"
                      variant="outline"
                      className={`w-full justify-start text-left text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 ${!field.value ? 'text-slate-400' : 'text-slate-900'}`}
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
            {errors.race_date && (
              <p className="text-xs text-red-600" role="alert">
                {errors.race_date.message}
              </p>
            )}
          </div>

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
            {errors.distance_m && (
              <p className="text-xs text-red-600" role="alert">
                {errors.distance_m.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <Controller
              name="did_not_finish"
              control={control}
              render={({ field }) => (
                <Checkbox id="editDnf" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <Label htmlFor="editDnf" className="cursor-pointer select-none">
              Did not finish (DNF)
            </Label>
          </div>

          {!dnf && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="editFinishTime">Finish time (HH:MM:SS)</Label>
              <Controller
                name="finish_time_sec"
                control={control}
                render={({ field }) => (
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
                )}
              />
              {errors.finish_time_sec && (
                <p className="text-xs text-red-600" role="alert">
                  {errors.finish_time_sec.message}
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="editAvgHr">Avg HR (bpm)</Label>
              <Controller
                name="avg_hr"
                control={control}
                render={({ field }) => (
                  <Input
                    id="editAvgHr"
                    type="number"
                    placeholder="e.g. 165"
                    className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                  />
                )}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="editElevation">Elevation gain (m)</Label>
              <Controller
                name="elevation_gain_m"
                control={control}
                render={({ field }) => (
                  <Input
                    id="editElevation"
                    type="number"
                    placeholder="e.g. 250"
                    className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                  />
                )}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="editPosPlace">Position (place)</Label>
              <Controller
                name="position_place"
                control={control}
                render={({ field }) => (
                  <Input
                    id="editPosPlace"
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
              <Label htmlFor="editPosMale">Position (male)</Label>
              <Controller
                name="position_male"
                control={control}
                render={({ field }) => (
                  <Input
                    id="editPosMale"
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

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="editNotes">Notes</Label>
            <Textarea
              id="editNotes"
              placeholder="Weather, conditions, how you felt…"
              className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
              rows={3}
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
