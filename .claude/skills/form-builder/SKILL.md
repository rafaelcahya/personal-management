---
name: form-builder
description: Build or change forms in this repo with react-hook-form + Zod — Controller with the Field base components, required field styling, ids, submit/loading state, server error mapping, toasts, and modal forms. Use for any form, input group, or edit dialog.
---

# Form Builder

Stack: `react-hook-form` 7 + `@hookform/resolvers/zod` 5 + **Zod 4** schemas from `schemas/` (see `zod-schema`). The form uses the same schema the API route validates with.

## Pattern (from `app/main/inventory/product-brand/AddProductBrand.jsx`)

```jsx
'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { FieldContainer, FieldContent, FieldLabel, FieldError } from '@/components/base/Field/Field'
import Input from '@/components/base/Input/Input'
import Button from '@/components/base/Button/Button'
import { productBrandSchema } from '@/schemas/productBrand'
import { addProductBrand } from '@/lib/api/productBrand'

const FIELD_CLASS =
  'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500'

export default function AddProductBrandForm({ onAdded }) {
  const [loading, setLoading] = useState(false)
  const form = useForm({
    resolver: zodResolver(productBrandSchema),
    defaultValues: { brand: '', note: '' },
  })
  const { control, handleSubmit, reset, setError } = form

  async function onSubmit(values) {
    setLoading(true)
    try {
      await addProductBrand(values)
      toast.success('Product brand added')
      reset()
      onAdded?.()
    } catch (err) {
      if (err.message === 'Brand name already exists') {
        setError('brand', { message: err.message })
      } else {
        toast.error(err.message || 'Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FieldContainer>
        <Controller
          control={control}
          name="brand"
          render={({ field, fieldState }) => (
            <FieldContent error={fieldState.error?.message}>
              <FieldLabel className="font-medium">Product brand</FieldLabel>
              <Input
                {...field}
                id="brandNameInput_addBrandDialog"
                placeholder="e.g. Clear"
                className={`${FIELD_CLASS} ${fieldState.error ? 'border-rose-500' : ''}`}
              />
              <FieldError className="font-medium" />
            </FieldContent>
          )}
        />
      </FieldContainer>

      <Button type="submit" disabled={loading} id="submitAddBrandBtn_productBrandPage">
        {loading ? 'Saving…' : 'Add brand'}
      </Button>
    </form>
  )
}
```

## Rules

1. **Every field** gets `text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500` (plus `border-rose-500` when it has an error).
2. Use `Controller` + `FieldContent error={fieldState.error?.message}` + `FieldLabel` + `FieldError`. Errors show inline under the field, not only in a toast.
3. Every input, select, textarea, submit, and cancel button gets an `id` (`{fieldName}Input_{formOrPage}`, `submit{Action}Btn_{page}`) registered in app-constants (`.json` + `.yaml`).
4. **No double submit** — disable the submit button while saving and show a loading label.
5. **Server errors**: map known field errors back with `setError(field, ...)`; everything else → `toast.error(err.message)`. Success → `toast.success(...)`, then `reset()` and close.
6. Number inputs: convert with `z.coerce.number()` in the schema or `valueAsNumber`-style handling in `onChange` — don't send strings for numeric fields.
7. Default values for every field (empty string, not `undefined`) so inputs stay controlled.
8. Modal forms: reset the form when the modal closes (`onOpenChange` → `if (!isOpen) reset()`); put the `<form>` inside `ModalContent` and the scrollable fields inside `ModalBody`. Forms with more than ~3 fields go in a `Sheet` or a page, not a modal.
9. Labels are always visible text (`FieldLabel`), not just placeholders.
