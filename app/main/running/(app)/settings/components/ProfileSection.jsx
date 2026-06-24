'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, parseISO } from 'date-fns'
import { CalendarIcon, CheckCircle2, AlertCircle, User, Loader2 } from 'lucide-react'
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { getUserProfile, updateUserProfile } from '@/lib/api/running'
import { profileSchema } from '@/schemas/runningProfile'

export default function ProfileSection() {
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const heightRef = useRef(null)
  const weightRef = useRef(null)

  const form = useForm({
    resolver: zodResolver(profileSchema),
  })

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = form

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
    <section
      aria-label="Profile"
      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
    >
      <div className="flex items-start gap-3 px-5 py-4 border-b border-slate-100">
        <div className="flex items-center justify-center size-9 rounded-lg bg-violet-50 shrink-0">
          <User className="size-4 text-violet-600" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">Profile</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Personal details used for performance calculations
          </p>
        </div>
      </div>

      {loading ? (
        <div id="profileLoading_settingsPage" className="px-5 py-4 flex flex-col gap-3">
          <Skeleton className="h-4 w-40 rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
        </div>
      ) : loadError ? (
        <div className="px-5 py-4">
          <p className="text-sm text-red-700">{loadError}</p>
        </div>
      ) : (
        <div className="px-5 py-5">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
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
                <Button
                  id="profileSaveBtn_settingsPage"
                  type="submit"
                  disabled={saving}
                  size="sm"
                  className="min-w-[80px]"
                >
                  {saving ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : 'Save'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </section>
  )
}
