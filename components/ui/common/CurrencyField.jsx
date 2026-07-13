'use client'

import { FieldContent, FieldLabel, FieldError } from '@/components/base/Field/Field'
import { Controller } from 'react-hook-form'
import Input from '@/components/base/Input/Input'
import { formatRupiah } from '@/lib/utils/currencyFormatter'

export default function CurrencyField({ control, idField, name, label, placeholder, message }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FieldContent error={fieldState.error?.message}>
          <FieldLabel className="font-medium">{label}</FieldLabel>
          <Input
            id={idField}
            type="text"
            value={formatRupiah(field.value)}
            placeholder={placeholder}
            className={`uppercase text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 ${
              fieldState.error ? 'border-rose-500' : ''
            }`}
            onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
          />
          <FieldError id={message} />
        </FieldContent>
      )}
    />
  )
}
