'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, parseISO } from 'date-fns'
import { CalendarIcon, CheckCircle2, AlertCircle, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getUserProfile, updateUserProfile, detectMaxHr } from '@/lib/api/running'
import { profileSchema } from '@/schemas/runningProfile'

export default function ProfileSection() {
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [detecting, setDetecting] = useState(false)
  const [detectedHr, setDetectedHr] = useState(null)
  const [detectNoData, setDetectNoData] = useState(false)
  const [detectError, setDetectError] = useState(false)

  const heightRef = useRef(null)
  const weightRef = useRef(null)

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
  })

  const watchedWeight = watch('weight_kg')
  const watchedHeight = watch('height_cm')

  const weightNum = parseFloat(watchedWeight)
  const heightNum = parseFloat(watchedHeight)
  const hasWeight = !isNaN(weightNum) && weightNum > 0
  const hasHeight = !isNaN(heightNum) && heightNum > 0

  let bmi = null
  let bmiCategory = null
  let bmiColor = null

  if (hasWeight && hasHeight) {
    bmi = weightNum / Math.pow(heightNum / 100, 2)
    if (bmi < 18.5) {
      bmiCategory = 'Underweight'
      bmiColor = 'amber'
    } else if (bmi < 25) {
      bmiCategory = 'Normal'
      bmiColor = 'violet'
    } else if (bmi < 30) {
      bmiCategory = 'Overweight'
      bmiColor = 'amber'
    } else {
      bmiCategory = 'Obese'
      bmiColor = 'amber'
    }
  }

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await getUserProfile()
        if (!cancelled) reset({ ...(data ?? {}), sex: data?.sex ?? 'none' })
      } catch (err) {
        if (!cancelled) setLoadError(err.message || 'Failed to load profile')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [reset])

  async function handleDetectMaxHr() {
    setDetecting(true)
    setDetectedHr(null)
    setDetectNoData(false)
    setDetectError(false)
    try {
      const result = await detectMaxHr()
      if (result == null) {
        setDetectNoData(true)
      } else {
        setDetectedHr(result)
        setValue('max_hr', result, { shouldValidate: true })
      }
    } catch {
      setDetectError(true)
    } finally {
      setDetecting(false)
    }
  }

  async function onSubmit(values) {
    setSaving(true)
    setSaveError(null)
    setSaveSuccess(false)
    const cleaned = Object.fromEntries(
      Object.entries(values).filter(([k, v]) => {
        if (k === 'sex') return true
        return v !== '' && v != null
      })
    )
    if (cleaned.sex === 'none') cleaned.sex = null
    try {
      await updateUserProfile(cleaned)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      setSaveError(err.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section aria-label="Profile">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Profile</h2>

      {loading ? (
        <Card className="border border-slate-200/70 py-0">
          <CardContent id="profileLoading_settingsPage" className="px-5 py-4 flex flex-col gap-3">
            <Skeleton className="h-4 w-40 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
          </CardContent>
        </Card>
      ) : loadError ? (
        <Card className="border border-red-200 py-0 bg-red-50">
          <CardContent className="px-5 py-4">
            <p className="text-sm text-red-700">{loadError}</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-slate-200/70 py-0">
          <CardContent className="px-5 py-4">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="displayNameInput_settingsPage" className="text-sm font-medium">
                    Display Name
                  </Label>
                  <Input
                    id="displayNameInput_settingsPage"
                    {...register('display_name')}
                    placeholder="Your name"
                    className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                  />
                  <p className="text-xs text-slate-400">How your name appears across the app 👤</p>
                  {errors.display_name && (
                    <p className="text-xs text-red-600">{errors.display_name.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium">Date of Birth</Label>
                  <Controller
                    name="birth_date"
                    control={control}
                    render={({ field }) => {
                      const selected = field.value ? parseISO(field.value) : undefined
                      return (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="birthDateInput_settingsPage"
                              variant="outline"
                              className="w-full justify-start text-sm font-medium text-left focus-visible:ring-violet-200 focus-visible:border-violet-600"
                            >
                              <CalendarIcon
                                className="mr-2 h-4 w-4 shrink-0 text-slate-400"
                                aria-hidden="true"
                              />
                              {selected ? (
                                format(selected, 'dd MMM yyyy')
                              ) : (
                                <span className="text-slate-400">Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selected}
                              onSelect={(date) =>
                                field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                              }
                              captionLayout="dropdown"
                              defaultMonth={selected ?? new Date(1990, 0, 1)}
                              fromYear={1940}
                              toYear={new Date().getFullYear() - 10}
                              autoFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )
                    }}
                  />
                  <p className="text-xs text-slate-400">
                    Used to calculate age-graded performance 🎂
                  </p>
                  {errors.birth_date && (
                    <p className="text-xs text-red-600">{errors.birth_date.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="heightInput_settingsPage" className="text-sm font-medium">
                    Height (cm)
                  </Label>
                  <Input
                    id="heightInput_settingsPage"
                    type="number"
                    {...register('height_cm')}
                    ref={(el) => {
                      register('height_cm').ref(el)
                      heightRef.current = el
                    }}
                    placeholder="e.g. 170"
                    className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                  />
                  <p className="text-xs text-slate-400">Used for stride and pace estimations 📐</p>
                  {errors.height_cm && (
                    <p className="text-xs text-red-600">{errors.height_cm.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="weightInput_settingsPage" className="text-sm font-medium">
                    Weight (kg)
                  </Label>
                  <Input
                    id="weightInput_settingsPage"
                    type="number"
                    step="0.1"
                    {...register('weight_kg')}
                    ref={(el) => {
                      register('weight_kg').ref(el)
                      weightRef.current = el
                    }}
                    placeholder="e.g. 65"
                    className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                  />
                  <p className="text-xs text-slate-400">
                    Helps estimate running economy and VO₂max ⚖️
                  </p>
                  {errors.weight_kg && (
                    <p className="text-xs text-red-600">{errors.weight_kg.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="maxHrInput_settingsPage" className="text-sm font-medium">
                    Max HR (bpm)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="maxHrInput_settingsPage"
                      type="number"
                      {...register('max_hr')}
                      placeholder="e.g. 190"
                      className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                    />
                    <Button
                      id="detectMaxHrBtn_settingsPage"
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={detecting}
                      onClick={handleDetectMaxHr}
                      className="shrink-0 gap-1.5 text-xs text-violet-600 border-violet-200 hover:bg-violet-50"
                    >
                      <Zap className="size-3.5" aria-hidden="true" />
                      {detecting ? 'Detecting…' : 'Detect'}
                    </Button>
                  </div>
                  {detectedHr != null && (
                    <p
                      id="maxHrDetectedHint_settingsPage"
                      className="text-xs text-green-700 flex items-center gap-1"
                    >
                      <CheckCircle2 className="size-3.5 shrink-0" aria-hidden="true" />
                      Detected: {detectedHr} bpm — from your highest recorded activity
                    </p>
                  )}
                  {detectNoData && (
                    <p id="maxHrNoDataHint_settingsPage" className="text-xs text-slate-500">
                      No heart rate data found in your activities
                    </p>
                  )}
                  {detectError && (
                    <p id="maxHrDetectError_settingsPage" className="text-xs text-red-600">
                      Could not detect Max HR — please try again
                    </p>
                  )}
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Max HR is the highest heart rate your heart can reach during maximum effort.
                    It&apos;s used to calculate your HR training zones. The most accurate way to
                    find it is from a hard race or all-out effort — the detected value from your
                    activities is a good starting point.
                  </p>
                  {errors.max_hr && <p className="text-xs text-red-600">{errors.max_hr.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="restingHrInput_settingsPage" className="text-sm font-medium">
                    Resting HR (bpm)
                  </Label>
                  <Input
                    id="restingHrInput_settingsPage"
                    type="number"
                    {...register('resting_hr_baseline')}
                    placeholder="e.g. 55"
                    className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                  />
                  <p className="text-xs text-slate-400">
                    Your heart rate first thing in the morning — used for Karvonen HR zones 😴
                  </p>
                  {errors.resting_hr_baseline && (
                    <p className="text-xs text-red-600">{errors.resting_hr_baseline.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium">Sex</Label>
                  <Controller
                    name="sex"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value ?? 'none'}>
                        <SelectTrigger
                          id="sexSelect_settingsPage"
                          className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 cursor-pointer"
                        >
                          <SelectValue placeholder="Prefer not to say" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Prefer not to say</SelectItem>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <p className="text-xs text-slate-400">
                    Used for age-graded performance and category comparisons 🧬
                  </p>
                </div>
              </div>

              {/* BMI chip — spans full width below the grid */}
              <div className="flex flex-col gap-1.5">
                <div
                  id="bmiChip_settingsPage"
                  className={`inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full text-sm font-medium ${
                    bmi != null
                      ? bmiColor === 'violet'
                        ? 'bg-violet-50 text-violet-700'
                        : 'bg-amber-50 text-amber-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                  aria-live="polite"
                >
                  {bmi != null ? (
                    <>
                      <span>BMI {bmi.toFixed(1)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{bmiCategory}</span>
                    </>
                  ) : (
                    <span>BMI —</span>
                  )}
                </div>

                {bmi != null && (
                  <div className="flex gap-3 text-xs flex-wrap">
                    {[
                      { label: 'Underweight', range: '< 18.5' },
                      { label: 'Normal', range: '18.5 – 24.9' },
                      { label: 'Overweight', range: '25 – 29.9' },
                      { label: 'Obese', range: '≥ 30' },
                    ].map(({ label, range }) => (
                      <span
                        key={label}
                        className={
                          label === bmiCategory
                            ? bmiColor === 'violet'
                              ? 'text-violet-700 font-semibold'
                              : 'text-amber-700 font-semibold'
                            : 'text-slate-400'
                        }
                      >
                        {label} <span className="font-normal">{range}</span>
                      </span>
                    ))}
                  </div>
                )}

                {bmi == null && (
                  <p
                    id="bmiMissingPrompt_settingsPage"
                    className="text-xs text-slate-400"
                    aria-live="polite"
                  >
                    {!hasWeight && !hasHeight ? (
                      <>
                        Fill in your{' '}
                        <button
                          type="button"
                          onClick={() => weightRef.current?.focus()}
                          className="text-violet-500 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 rounded"
                        >
                          weight
                        </button>{' '}
                        and{' '}
                        <button
                          type="button"
                          onClick={() => heightRef.current?.focus()}
                          className="text-violet-500 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 rounded"
                        >
                          height
                        </button>{' '}
                        to calculate BMI
                      </>
                    ) : !hasWeight ? (
                      <>
                        Fill in your{' '}
                        <button
                          type="button"
                          onClick={() => weightRef.current?.focus()}
                          className="text-violet-500 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 rounded"
                        >
                          weight
                        </button>{' '}
                        to calculate BMI
                      </>
                    ) : (
                      <>
                        Fill in your{' '}
                        <button
                          type="button"
                          onClick={() => heightRef.current?.focus()}
                          className="text-violet-500 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 rounded"
                        >
                          height
                        </button>{' '}
                        to calculate BMI
                      </>
                    )}
                  </p>
                )}

                <p className="text-xs text-slate-400 italic">
                  BMI ignores muscle mass — trends matter more than the value.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-1">
                {saveSuccess && (
                  <div
                    id="profileSaveSuccess_settingsPage"
                    className="flex items-center gap-1.5 text-sm text-green-700"
                    role="status"
                    aria-live="polite"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                    Profile saved
                  </div>
                )}
                {saveError && (
                  <div
                    id="profileSaveError_settingsPage"
                    className="flex items-center gap-1.5 text-sm text-red-600"
                    role="alert"
                    aria-live="assertive"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    {saveError}
                  </div>
                )}
                <Button id="profileSaveBtn_settingsPage" type="submit" disabled={saving} size="sm">
                  {saving ? 'Saving…' : 'Save'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </section>
  )
}
