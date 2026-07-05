'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, parseISO } from 'date-fns'
import { CheckCircle2, AlertCircle, User } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import Card, { CardHeader, CardIcon, CardTitle, CardDescription } from '@/components/base/Card/Card'
import Input from '@/components/base/Input/Input'
import DatePicker from '@/components/base/DatePicker/DatePicker/DatePicker'
import FieldContent from '@/components/base/Field/FieldContent'
import FieldLabel from '@/components/base/Field/FieldLabel'
import FieldError from '@/components/base/Field/FieldError'
import FieldDescription from '@/components/base/Field/FieldDescription'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/base/Select/Select'
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

  const {
    register,
    handleSubmit,
    reset,
    control,
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
    <Card as="section" aria-label="Profile">
      <CardHeader>
        <CardIcon icon={User} />
        <div className="min-w-0 flex-1">
          <CardTitle>Profile</CardTitle>
          <CardDescription>Personal details used for performance calculations</CardDescription>
        </div>
      </CardHeader>

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
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldContent error={errors.display_name?.message}>
                <FieldLabel htmlFor="displayNameInput_settingsPage">Display Name</FieldLabel>
                <Input
                  id="displayNameInput_settingsPage"
                  {...register('display_name')}
                  placeholder="Your name"
                  className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                />
                <FieldDescription>How your name appears across the app 👤</FieldDescription>
                <FieldError />
              </FieldContent>

              <FieldContent error={errors.birth_date?.message}>
                <FieldLabel>Date of Birth</FieldLabel>
                <Controller
                  name="birth_date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      id="birthDateInput_settingsPage"
                      value={field.value ? parseISO(field.value) : null}
                      onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                      fromDate={new Date(1940, 0, 1)}
                      toDate={new Date(new Date().getFullYear() - 10, 11, 31)}
                      placeholder="Pick a date"
                    />
                  )}
                />
                <FieldDescription>Used to calculate age-graded performance 🎂</FieldDescription>
                <FieldError />
              </FieldContent>

              <FieldContent error={errors.height_cm?.message}>
                <FieldLabel htmlFor="heightInput_settingsPage">Height (cm)</FieldLabel>
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
                <FieldDescription>Used for stride and pace estimations 📐</FieldDescription>
                <FieldError />
              </FieldContent>

              <FieldContent error={errors.weight_kg?.message}>
                <FieldLabel htmlFor="weightInput_settingsPage">Weight (kg)</FieldLabel>
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
                <FieldDescription>Helps estimate running economy and VO₂max ⚖️</FieldDescription>
                <FieldError />
              </FieldContent>

              <FieldContent>
                <FieldLabel>Sex</FieldLabel>
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
                <FieldDescription>
                  Used for age-graded performance and category comparisons 🧬
                </FieldDescription>
              </FieldContent>
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
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => weightRef.current?.focus()}
                        className="px-0 h-auto text-violet-500"
                      >
                        weight
                      </Button>{' '}
                      and{' '}
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => heightRef.current?.focus()}
                        className="px-0 h-auto text-violet-500"
                      >
                        height
                      </Button>{' '}
                      to calculate BMI
                    </>
                  ) : !hasWeight ? (
                    <>
                      Fill in your{' '}
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => weightRef.current?.focus()}
                        className="px-0 h-auto text-violet-500"
                      >
                        weight
                      </Button>{' '}
                      to calculate BMI
                    </>
                  ) : (
                    <>
                      Fill in your{' '}
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => heightRef.current?.focus()}
                        className="px-0 h-auto text-violet-500"
                      >
                        height
                      </Button>{' '}
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
              <Button id="profileSaveBtn_settingsPage" type="submit" disabled={saving} size="base">
                {saving ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </Card>
  )
}
