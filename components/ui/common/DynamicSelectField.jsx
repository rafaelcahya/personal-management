'use client'

import { Controller } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import FieldContent from '@/components/base/Field/FieldContent'
import FieldLabel from '@/components/base/Field/FieldLabel'
import FieldError from '@/components/base/Field/FieldError'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/base/Select/Select'

export default function DynamicSelectField({
  control,
  name,
  label,
  options = [],
  loading = false,
  displayField,
  placeholder = 'Select an option',
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FieldContent error={fieldState.error?.message}>
          <FieldLabel className="font-medium">{label}</FieldLabel>
          <Select onValueChange={field.onChange} value={field.value || ''} disabled={loading}>
            <SelectTrigger
              id={`${name}Field_tradePage`}
              className={`w-full text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 ${
                fieldState.error ? 'border-rose-500' : ''
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  <span className="text-slate-500">Loading...</span>
                </div>
              ) : (
                <SelectValue placeholder={placeholder} />
              )}
            </SelectTrigger>
            <SelectContent className="max-h-[300px]" id={`${name}Options_tradePage`}>
              {!loading && options.length === 0 ? (
                <div className="p-4 text-sm text-slate-500 text-center">No options available</div>
              ) : (
                options.map((option) => (
                  <SelectItem
                    key={option.id}
                    id={`${name}Option${option.id}_tradePage`}
                    value={option[displayField]}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {option[displayField]}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <FieldError id={`${name}Field_errorMessage_tradePage`} />
        </FieldContent>
      )}
    />
  )
}
