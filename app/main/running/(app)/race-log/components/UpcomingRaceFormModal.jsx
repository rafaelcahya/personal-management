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
import { Textarea } from '@/components/ui/textarea'
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
import { toast } from 'sonner'
import { createUpcomingRace, updateUpcomingRace } from '@/lib/api/running'
import { createUpcomingRaceSchema, updateUpcomingRaceSchema } from '@/schemas/upcomingRace'
import { DISTANCE_PRESETS } from './raceLogUtils'

function secondsToHms(totalSec) {
  if (!totalSec) return { h: '', m: '', s: '' }
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return { h: h > 0 ? String(h) : '', m: String(m).padStart(2, '0'), s: String(s).padStart(2, '0') }
}

function hmsToSeconds(h, m, s) {
  const total = (Number(h) || 0) * 3600 + (Number(m) || 0) * 60 + (Number(s) || 0)
  return total > 0 ? total : null
}

export default function UpcomingRaceFormModal({ open, onClose, onSaved, race }) {
  const isEdit = race != null
  const [distanceMode, setDistanceMode] = useState('preset')
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState(null)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [targetH, setTargetH] = useState('')
  const [targetM, setTargetM] = useState('')
  const [targetS, setTargetS] = useState('')

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isEdit ? updateUpcomingRaceSchema : createUpcomingRaceSchema),
    defaultValues: {
      title: '',
      race_date: '',
      distance_m: null,
      location: '',
      notes: '',
    },
  })

  useEffect(() => {
    if (open) {
      setServerError(null)
      if (isEdit) {
        const presetValues = DISTANCE_PRESETS.map((p) => p.value)
        const isPreset = presetValues.includes(race.distance_m)
        setDistanceMode(isPreset ? 'preset' : 'custom')
        reset({
          title: race.title ?? '',
          race_date: race.race_date ?? '',
          distance_m: race.distance_m ?? null,
          location: race.location ?? '',
          notes: race.notes ?? '',
        })
        const hms = secondsToHms(race.target_time_sec)
        setTargetH(hms.h)
        setTargetM(hms.m)
        setTargetS(hms.s)
      } else {
        setDistanceMode('preset')
        reset({
          title: '',
          race_date: '',
          distance_m: null,
          location: '',
          notes: '',
        })
        setTargetH('')
        setTargetM('')
        setTargetS('')
      }
    }
  }, [open, isEdit, race, reset])

  async function onSubmit(data) {
    if (data.distance_m == null) {
      setError('distance_m', { message: 'Distance is required' })
      return
    }
    setSaving(true)
    setServerError(null)
    try {
      const payload = {
        title: data.title,
        race_date: data.race_date,
        distance_m: data.distance_m,
        location: data.location || null,
        notes: data.notes || null,
        target_time_sec: hmsToSeconds(targetH, targetM, targetS),
      }
      let result
      if (isEdit) {
        result = await updateUpcomingRace(race.id, payload)
        toast.success('Upcoming race updated')
      } else {
        result = await createUpcomingRace(payload)
        toast.success('Upcoming race added')
      }
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
        id="upcomingRaceFormModal_raceLogPage"
        className="max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Upcoming Race' : 'Add Upcoming Race'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 py-1">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="upcomingRaceTitle">
              Race name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="upcomingRaceTitle"
              placeholder="e.g. Bali Marathon 2026"
              className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
              {...register('title')}
              aria-describedby={errors.title ? 'upcomingRaceTitleError' : undefined}
            />
            <p className="text-xs text-slate-400">Name it after the official race event 🏁</p>
            {errors.title && (
              <p id="upcomingRaceTitleError" className="text-xs text-red-600" role="alert">
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
                      id="upcomingRaceDate"
                      variant="outline"
                      className={`w-full justify-start text-left text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 ${!field.value ? 'text-slate-400' : 'text-slate-900'}`}
                      aria-describedby={errors.race_date ? 'upcomingRaceDateError' : undefined}
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
            <p className="text-xs text-slate-400">
              The day of the race, not the racepack pickup date 📅
            </p>
            {errors.race_date && (
              <p id="upcomingRaceDateError" className="text-xs text-red-600" role="alert">
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

          {/* Location (optional) */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="upcomingRaceLocation">Location</Label>
            <Input
              id="upcomingRaceLocation"
              placeholder="e.g. Bali, Indonesia"
              className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
              {...register('location')}
            />
            <p className="text-xs text-slate-400">
              City or venue — helps you remember where you raced 📍
            </p>
          </div>

          {/* Notes (optional) */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="upcomingRaceNotes">Notes</Label>
            <Textarea
              id="upcomingRaceNotes"
              placeholder="Goals, target time, anything else…"
              className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
              rows={3}
              {...register('notes')}
            />
            <p className="text-xs text-slate-400">
              Goals, pacing strategy, anything you want to remember 📝
            </p>
          </div>

          {/* Target time (optional) */}
          <div className="flex flex-col gap-1.5">
            <Label>
              Target time <span className="text-slate-400 font-normal text-xs">(optional)</span>
            </Label>
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-0.5 flex-1">
                <Input
                  id="targetTimeHoursInput_upcomingRacePage"
                  type="number"
                  min={0}
                  max={23}
                  placeholder="0"
                  value={targetH}
                  onChange={(e) => setTargetH(e.target.value)}
                  className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-center"
                  aria-label="Hours"
                />
                <span className="text-[10px] text-slate-400 text-center">hrs</span>
              </div>
              <span className="text-slate-400 font-medium mb-3">:</span>
              <div className="flex flex-col gap-0.5 flex-1">
                <Input
                  id="targetTimeMinutesInput_upcomingRacePage"
                  type="number"
                  min={0}
                  max={59}
                  placeholder="00"
                  value={targetM}
                  onChange={(e) => setTargetM(e.target.value)}
                  className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-center"
                  aria-label="Minutes"
                />
                <span className="text-[10px] text-slate-400 text-center">min</span>
              </div>
              <span className="text-slate-400 font-medium mb-3">:</span>
              <div className="flex flex-col gap-0.5 flex-1">
                <Input
                  id="targetTimeSecondsInput_upcomingRacePage"
                  type="number"
                  min={0}
                  max={59}
                  placeholder="00"
                  value={targetS}
                  onChange={(e) => setTargetS(e.target.value)}
                  className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-center"
                  aria-label="Seconds"
                />
                <span className="text-[10px] text-slate-400 text-center">sec</span>
              </div>
            </div>
            <p className="text-xs text-slate-400">Your goal finish time for this race ⏱️</p>
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
            id="upcomingRaceSaveBtn_raceLogPage"
            onClick={handleSubmit(onSubmit)}
            disabled={saving}
            className="min-w-[80px]"
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : isEdit ? (
              'Save changes'
            ) : (
              'Add race'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
