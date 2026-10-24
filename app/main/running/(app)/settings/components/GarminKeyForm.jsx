'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addYears } from 'date-fns'
import { AlertCircle, Link2 } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import PasswordInput from '@/components/base/PasswordInput/PasswordInput'
import DatePicker from '@/components/base/DatePicker/DatePicker/DatePicker'
import {
  FieldContainer,
  FieldContent,
  FieldLabel,
  FieldError,
  FieldDescription,
} from '@/components/base/Field/Field'
import { saveGarminConnectionSchema } from '@/schemas/runningGarmin'
import { saveGarminConnection } from '@/lib/api/running'
import {
  FIELD_CLASS,
  GARMIN_BTN_CLASS,
  fromIsoDate,
  toIsoDate,
  utcToday,
} from '../../../utils/garmin'

const KEY_ID = 'garminApiKeyInput_settings'
const EXPIRY_ID = 'garminExpiresAtInput_settings'

/**
 * Key + expiry form shared by first connect, expired/invalid recovery and the Replace dialog.
 * The key only lives in the form until the request ends and is cleared after a rejection.
 */
export default function GarminKeyForm({
  formId,
  submitId,
  submitLabel,
  showIcon = false,
  inlineSubmit = true,
  onSaved,
  onSubmittingChange,
}) {
  const [submitting, setSubmitting] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [nothingSaved, setNothingSaved] = useState(false)

  const { control, handleSubmit, setError, setValue, setFocus, reset } = useForm({
    resolver: zodResolver(saveGarminConnectionSchema),
    defaultValues: { api_key: '', expires_at: '' },
  })

  const minDate = utcToday()
  const maxDate = addYears(minDate, 1)

  function changeSubmitting(value) {
    setSubmitting(value)
    onSubmittingChange?.(value)
  }

  async function onSubmit(values) {
    let refocusKey = false
    changeSubmitting(true)
    setSaveError(null)
    setNothingSaved(false)
    try {
      const connection = await saveGarminConnection(values)
      reset()
      onSaved(connection)
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        window.location.href = '/login'
        return
      }
      setNothingSaved(true)
      if (err.status === 400) {
        const field = err.issues?.[0]?.path?.[0]
        if (field === 'api_key' || field === 'expires_at') {
          setError(field, { message: err.message })
        } else {
          setValue('api_key', '')
          setError('api_key', { message: err.message })
          refocusKey = true
        }
      } else if (err.status === 502) {
        setSaveError('Garmin API is unavailable. Try again later.')
      } else {
        setSaveError(err.message || 'Could not save the key. Please try again.')
      }
    } finally {
      changeSubmitting(false)
      // The inputs are disabled while submitting, so focus can only move once that has cleared
      if (refocusKey) requestAnimationFrame(() => setFocus('api_key'))
    }
  }

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <FieldContainer>
        <Controller
          control={control}
          name="api_key"
          render={({ field, fieldState }) => (
            <FieldContent required disabled={submitting} error={fieldState.error?.message}>
              <FieldLabel htmlFor={KEY_ID}>API key</FieldLabel>
              <PasswordInput
                {...field}
                id={KEY_ID}
                autoComplete="off"
                placeholder="Paste your Garmin API key"
                className={`${FIELD_CLASS} ${fieldState.error ? 'border-rose-500' : ''}`}
              />
              <FieldError />
            </FieldContent>
          )}
        />
      </FieldContainer>

      <FieldContainer>
        <Controller
          control={control}
          name="expires_at"
          render={({ field, fieldState }) => (
            <FieldContent required disabled={submitting} error={fieldState.error?.message}>
              <FieldLabel htmlFor={EXPIRY_ID}>Key expiry date</FieldLabel>
              <DatePicker
                id={EXPIRY_ID}
                value={fromIsoDate(field.value)}
                onChange={(date) => field.onChange(toIsoDate(date))}
                onBlur={field.onBlur}
                fromDate={minDate}
                toDate={maxDate}
                placeholder="Pick a date"
                className={`${FIELD_CLASS} ${fieldState.error ? 'border-rose-500' : ''}`}
              />
              <FieldDescription>The date you picked in Garmin Connect</FieldDescription>
              <FieldError />
            </FieldContent>
          )}
        />
      </FieldContainer>

      {saveError && (
        <div
          id="garminSaveErrorMsg_settings"
          role="alert"
          className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700"
        >
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          {saveError}
        </div>
      )}
      {nothingSaved && <p className="text-xs text-slate-400">Nothing was saved.</p>}

      {inlineSubmit && (
        <Button
          id={submitId}
          type="submit"
          isLoading={submitting}
          loadingText="Checking key…"
          className={`${GARMIN_BTN_CLASS} w-full sm:w-auto sm:self-start`}
        >
          {!submitting && showIcon && <Link2 className="w-4 h-4" aria-hidden="true" />}
          {submitting ? 'Checking key…' : submitLabel}
        </Button>
      )}
    </form>
  )
}
