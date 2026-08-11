'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Tag as TagIcon } from 'lucide-react'
import { z } from 'zod'
import Button from '@/components/base/Button/Button'
import Input from '@/components/base/Input/Input'
import Textarea from '@/components/base/Textarea/Textarea'
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

const tickerFormSchema = z
  .object({
    nominalType: z.enum(['manual', 'autosum']),
    name: z.string().min(1, 'Name is required').max(100, 'Name must not exceed 100 characters'),
    nominal: z.number().positive('Nominal must be a positive number').optional(),
    notes: z.string().max(500, 'Notes must not exceed 500 characters').optional(),
  })
  .superRefine((data, ctx) => {
    if (data.nominalType === 'manual' && data.nominal == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Nominal is required',
        path: ['nominal'],
      })
    }
  })

const fieldClass =
  'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500'

export default function TickerNodeForm({
  open,
  onOpenChange,
  mode = 'create',
  initialValues,
  onSubmit,
  idPrefix = 'tickerNodeForm',
}) {
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(tickerFormSchema),
    defaultValues: {
      nominalType: 'manual',
      name: initialValues?.name || '',
      nominal: initialValues?.nominal ?? undefined,
      notes: initialValues?.notes || '',
    },
  })

  const { control, reset, handleSubmit, watch, setValue } = form
  const nominalType = watch('nominalType')

  useEffect(() => {
    if (open) {
      reset({
        nominalType: initialValues?.node_type === 'category' ? 'autosum' : 'manual',
        name: initialValues?.name || '',
        nominal: initialValues?.nominal ?? undefined,
        notes: initialValues?.notes || '',
      })
    }
  }, [open, initialValues, reset])

  const submit = async (values) => {
    setLoading(true)
    try {
      const success = await onSubmit(values)
      if (success) {
        onOpenChange(false)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (isOpen) => {
    onOpenChange(isOpen)
    if (!isOpen) reset()
  }

  const isEdit = mode === 'edit'

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalContent
        className="max-h-[85vh]"
        id={`${idPrefix}_investmentFlowPage`}
        variant="bordered"
        borderColor="border-slate-200"
      >
        <ModalHeader layout="beside">
          <ModalIcon icon={TagIcon} />
          <ModalHeaderContent>
            <ModalTitle>{isEdit ? 'Edit Node' : 'Add Node'}</ModalTitle>
            <ModalDescription>
              {isEdit
                ? 'Update node details'
                : 'Add a leaf node with a name, nominal, and optional notes'}
            </ModalDescription>
          </ModalHeaderContent>
        </ModalHeader>

        <form onSubmit={handleSubmit(submit)} className="flex flex-col flex-1 min-h-0">
          <ModalBody>
            <FieldContainer>
              <FieldContent>
                <FieldLabel className="font-medium">Nominal Type</FieldLabel>
                <div
                  id={`${idPrefix}NominalTypeToggle_investmentFlowPage`}
                  role="group"
                  aria-label="Nominal type"
                  className="flex rounded-lg border overflow-hidden"
                >
                  {[
                    { value: 'manual', label: 'Manual' },
                    { value: 'autosum', label: 'Auto Sum' },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={nominalType === value}
                      id={`${idPrefix}NominalType${value}_investmentFlowPage`}
                      onClick={() => setValue('nominalType', value, { shouldValidate: true })}
                      className={`flex-1 py-1.5 text-sm font-medium transition-colors ${
                        nominalType === value
                          ? 'bg-violet-600 text-white'
                          : 'bg-white text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {nominalType === 'autosum' && (
                  <FieldDescription className="text-xs text-slate-400">
                    Nominal will be automatically summed from child nodes
                  </FieldDescription>
                )}
              </FieldContent>

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
                      placeholder="e.g., BBCA, BTC, Reksa Dana X"
                      className={`${fieldClass} ${fieldState.error ? 'border-rose-500' : ''}`}
                    />
                    <FieldError className="font-medium" />
                  </FieldContent>
                )}
              />

              {nominalType === 'manual' && (
                <>
                  <Controller
                    control={control}
                    name="nominal"
                    render={({ field, fieldState }) => (
                      <FieldContent error={fieldState.error?.message}>
                        <FieldLabel
                          htmlFor={`${idPrefix}NominalField_investmentFlowPage`}
                          className="font-medium"
                        >
                          Nominal
                        </FieldLabel>
                        <Input
                          type="text"
                          value={field.value ? formatRupiah(field.value) : ''}
                          placeholder="e.g., 10000000"
                          id={`${idPrefix}NominalField_investmentFlowPage`}
                          className={`${fieldClass} ${fieldState.error ? 'border-rose-500' : ''}`}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, '')
                            field.onChange(digits ? Number(digits) : undefined)
                          }}
                        />
                        <FieldDescription className="text-xs text-slate-400">
                          How much is currently allocated? (Rp)
                        </FieldDescription>
                        <FieldError className="font-medium" />
                      </FieldContent>
                    )}
                  />

                  <Controller
                    control={control}
                    name="notes"
                    render={({ field, fieldState }) => (
                      <FieldContent error={fieldState.error?.message}>
                        <FieldLabel
                          htmlFor={`${idPrefix}NotesField_investmentFlowPage`}
                          className="font-medium"
                        >
                          Notes (optional)
                        </FieldLabel>
                        <Textarea
                          {...field}
                          id={`${idPrefix}NotesField_investmentFlowPage`}
                          placeholder="Add any notes about this position"
                          className={`${fieldClass} ${fieldState.error ? 'border-rose-500' : ''}`}
                        />
                        <FieldError className="font-medium" />
                      </FieldContent>
                    )}
                  />
                </>
              )}
            </FieldContainer>
          </ModalBody>

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
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Node'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
