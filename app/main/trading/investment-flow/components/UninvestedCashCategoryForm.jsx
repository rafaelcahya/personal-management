'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Wallet } from 'lucide-react'
import { z } from 'zod'
import Button from '@/components/base/Button/Button'
import Input from '@/components/base/Input/Input'
import {
  FieldContainer,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/base/Field/Field'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalHeaderContent,
  ModalIcon,
  ModalTitle,
} from '@/components/base/Modal/Modal'
import { formatRupiah } from '@/lib/utils/currencyFormatter'

const cashCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must not exceed 100 characters'),
  nominal: z
    .number({ invalid_type_error: 'Nominal is required' })
    .nonnegative('Nominal cannot be negative'),
})

const fieldClass =
  'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500'

export default function UninvestedCashCategoryForm({
  open,
  onOpenChange,
  mode = 'create',
  initialValues,
  onSubmit,
  idPrefix = 'cashCategoryForm',
}) {
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState(null)

  const form = useForm({
    resolver: zodResolver(cashCategorySchema),
    defaultValues: {
      name: initialValues?.name || '',
      nominal: initialValues?.nominal ?? 0,
    },
  })

  const { control, reset, handleSubmit } = form

  useEffect(() => {
    if (open) {
      reset({
        name: initialValues?.name || '',
        nominal: initialValues?.nominal ?? 0,
      })
    }
  }, [open, initialValues, reset])

  const submit = async (values) => {
    setLoading(true)
    setFormError(null)
    try {
      const success = await onSubmit(values)
      if (success) onOpenChange(false)
    } catch (err) {
      setFormError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (isOpen) => {
    onOpenChange(isOpen)
    if (!isOpen) {
      reset()
      setFormError(null)
    }
  }

  const isEdit = mode === 'edit'

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalContent
        id={`${idPrefix}_investmentFlowPage`}
        variant="bordered"
        borderColor="border-slate-200"
      >
        <ModalHeader layout="beside">
          <ModalIcon icon={Wallet} />
          <ModalHeaderContent>
            <ModalTitle>{isEdit ? 'Edit Cash Pool' : 'Add Cash Pool'}</ModalTitle>
            <ModalDescription>
              {isEdit
                ? 'Update this uninvested cash category'
                : 'Name a cash pool and set its balance (e.g. "Trading Capital")'}
            </ModalDescription>
          </ModalHeaderContent>
        </ModalHeader>

        <form onSubmit={handleSubmit(submit)} className="flex flex-col flex-1 min-h-0">
          <ModalBody>
            <FieldContainer>
              <Controller
                control={control}
                name="name"
                render={({ field, fieldState }) => (
                  <FieldContent error={fieldState.error?.message}>
                    <FieldLabel
                      htmlFor={`${idPrefix}NameField_investmentFlowPage`}
                      className="font-medium"
                    >
                      Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`${idPrefix}NameField_investmentFlowPage`}
                      placeholder="e.g., Trading Capital, Emergency Reserve"
                      className={`${fieldClass} ${fieldState.error ? 'border-rose-500' : ''}`}
                    />
                    <FieldError className="font-medium" />
                  </FieldContent>
                )}
              />

              <Controller
                control={control}
                name="nominal"
                render={({ field, fieldState }) => (
                  <FieldContent error={fieldState.error?.message}>
                    <FieldLabel
                      htmlFor={`${idPrefix}NominalField_investmentFlowPage`}
                      className="font-medium"
                    >
                      Balance
                    </FieldLabel>
                    <Input
                      type="text"
                      value={field.value ? formatRupiah(field.value) : ''}
                      placeholder="e.g., 5000000"
                      id={`${idPrefix}NominalField_investmentFlowPage`}
                      className={`${fieldClass} ${fieldState.error ? 'border-rose-500' : ''}`}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '')
                        field.onChange(digits ? Number(digits) : 0)
                      }}
                    />
                    <FieldDescription className="text-xs text-slate-400">
                      Cash amount in this pool (Rp)
                    </FieldDescription>
                    <FieldError className="font-medium" />
                  </FieldContent>
                )}
              />
            </FieldContainer>
          </ModalBody>

          {formError && <p className="mx-6 mb-2 text-sm text-rose-600 font-medium">{formError}</p>}

          <ModalFooter className="shrink-0 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
              id={`${idPrefix}CancelBtn_investmentFlowPage`}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} id={`${idPrefix}SubmitBtn_investmentFlowPage`}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Pool'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
