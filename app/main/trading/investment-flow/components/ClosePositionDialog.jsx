'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleDollarSign, Loader2 } from 'lucide-react'
import { z } from 'zod'
import Button from '@/components/base/Button/Button'
import Input from '@/components/base/Input/Input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/base/Select/Select'
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
import { cn } from '@/lib/utils'

const closeFormSchema = z.object({
  proceeds: z
    .number({ invalid_type_error: 'Proceeds is required' })
    .nonnegative('Proceeds cannot be negative'),
  cash_category_id: z.string().uuid('Select a cash pool to receive the proceeds'),
})

const fieldClass =
  'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500'

export default function ClosePositionDialog({
  open,
  onOpenChange,
  node,
  cashCategories = [],
  onConfirm,
}) {
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState(null)

  const form = useForm({
    resolver: zodResolver(closeFormSchema),
    defaultValues: {
      proceeds: undefined,
      cash_category_id: node?.uninvested_cash_category_id ?? '',
    },
  })

  const { control, reset, handleSubmit, watch } = form
  const proceeds = watch('proceeds')

  useEffect(() => {
    if (open) {
      reset({
        proceeds: undefined,
        cash_category_id: node?.uninvested_cash_category_id ?? '',
      })
      setFormError(null)
    }
  }, [open, node, reset])

  if (!node) return null

  const nominal = node.nominal ?? 0
  const hasProceeds = typeof proceeds === 'number'
  const realizedPnl = hasProceeds ? proceeds - nominal : 0
  const isGain = realizedPnl >= 0
  const noCashPools = cashCategories.length === 0

  const submit = async (values) => {
    setLoading(true)
    setFormError(null)
    try {
      const success = await onConfirm(node.id, values)
      if (success) onOpenChange(false)
    } catch (err) {
      setFormError(err.message || 'Failed to close position')
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

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalContent
        className="max-h-[85vh]"
        id="closePositionDialog_investmentFlowPage"
        variant="bordered"
        borderColor="border-slate-200"
      >
        <ModalHeader layout="beside">
          <ModalIcon icon={CircleDollarSign} />
          <ModalHeaderContent>
            <ModalTitle>Close {node.name}</ModalTitle>
            <ModalDescription>
              Sell this position — the proceeds return to a cash pool and the node is removed.
            </ModalDescription>
          </ModalHeaderContent>
        </ModalHeader>

        <form onSubmit={handleSubmit(submit)} className="flex flex-col flex-1 min-h-0">
          <ModalBody>
            <FieldContainer>
              <FieldContent>
                <FieldLabel className="font-medium">Cost basis</FieldLabel>
                <p className="text-sm font-semibold text-slate-700">{formatRupiah(nominal)}</p>
              </FieldContent>

              <Controller
                control={control}
                name="proceeds"
                render={({ field, fieldState }) => (
                  <FieldContent error={fieldState.error?.message}>
                    <FieldLabel
                      htmlFor="closePositionProceedsField_investmentFlowPage"
                      className="font-medium"
                    >
                      Proceeds
                    </FieldLabel>
                    <Input
                      type="text"
                      value={field.value ? formatRupiah(field.value) : ''}
                      placeholder="e.g., 12000000"
                      id="closePositionProceedsField_investmentFlowPage"
                      className={`${fieldClass} ${fieldState.error ? 'border-rose-500' : ''}`}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '')
                        field.onChange(digits ? Number(digits) : undefined)
                      }}
                    />
                    <FieldDescription className="text-xs text-slate-400">
                      How much cash did you actually get from selling? (Rp)
                    </FieldDescription>
                    <FieldError className="font-medium" />
                  </FieldContent>
                )}
              />

              {hasProceeds && (
                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-500">Realized P&amp;L</span>
                    <span className="text-[11px] text-slate-400">
                      {formatRupiah(proceeds)} − {formatRupiah(nominal)}
                    </span>
                  </div>
                  <span
                    id="closePositionPnlPreview_investmentFlowPage"
                    className={cn(
                      'text-sm font-semibold',
                      isGain ? 'text-emerald-600' : 'text-rose-600'
                    )}
                  >
                    {isGain ? '+' : '−'}
                    {formatRupiah(Math.abs(realizedPnl))}
                  </span>
                </div>
              )}

              <Controller
                control={control}
                name="cash_category_id"
                render={({ field, fieldState }) => (
                  <FieldContent error={fieldState.error?.message}>
                    <FieldLabel
                      htmlFor="closePositionCashCategoryField_investmentFlowPage"
                      className="font-medium"
                    >
                      Return proceeds to
                    </FieldLabel>
                    <Select value={field.value || ''} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="closePositionCashCategoryField_investmentFlowPage"
                        className={`${fieldClass} ${fieldState.error ? 'border-rose-500' : ''}`}
                      >
                        <SelectValue placeholder="Select cash pool..." />
                      </SelectTrigger>
                      <SelectContent>
                        {cashCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldDescription className="text-xs text-slate-400">
                      {noCashPools
                        ? 'Create a cash pool first so the proceeds have somewhere to go.'
                        : 'Which uninvested cash pool receives the proceeds?'}
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
              id="closePositionCancelBtn_investmentFlowPage"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || noCashPools}
              id="closePositionConfirmBtn_investmentFlowPage"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Closing...' : 'Close Position'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
