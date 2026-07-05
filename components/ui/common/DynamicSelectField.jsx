'use client'

import { Controller } from 'react-hook-form'
import FieldContent from '@/components/base/Field/FieldContent'
import FieldLabel from '@/components/base/Field/FieldLabel'
import FieldError from '@/components/base/Field/FieldError'
import Combobox from '@/components/base/Combobox/Combobox'

export default function DynamicSelectField({
  control,
  name,
  label,
  options = [],
  loading = false,
  displayField,
  placeholder = 'Select an option',
}) {
  const comboOptions = options.map((opt) => ({
    value: opt[displayField],
    label: opt[displayField],
  }))

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const comboValue = field.value ? { value: field.value, label: field.value } : null

        return (
          <FieldContent error={fieldState.error?.message}>
            <FieldLabel className="font-medium">{label}</FieldLabel>
            <Combobox
              id={`${name}Field_tradePage`}
              value={comboValue}
              onChange={(selected) => field.onChange(selected?.value ?? '')}
              options={comboOptions}
              placeholder={loading ? 'Loading...' : placeholder}
              inputTrigger={false}
              disabled={loading}
              clearable={false}
            />
            <FieldError id={`${name}Field_errorMessage_tradePage`} />
          </FieldContent>
        )
      }}
    />
  )
}
