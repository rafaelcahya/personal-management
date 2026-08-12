'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Wallet } from 'lucide-react'
import { z } from 'zod'
import Button from '@/components/base/Button/Button'
import Input from '@/components/base/Input/Input'
import { FieldContainer, FieldContent, FieldError, FieldLabel } from '@/components/base/Field/Field'
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

const uninvestedCashSchema = z.object({
  amount: z.coerce.number().nonnegative({ message: 'Amount must be 0 or more' }),
})

const fieldClass =
  'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500'

export default function UninvestedCashForm({ open, onOpenChange, initialAmount, onSubmit }) {
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(uninvestedCashSchema),
    defaultValues: { amount: initialAmount ?? 0 },
  })

  const { control, reset, handleSubmit } = form

  useEffect(() => {
    if (open) {
      reset({ amount: initialAmount ?? 0 })
    }
  }, [open, initialAmount, reset])

  const submit = async (values) => {
    setLoading(true)
    try {
      await onSubmit(values)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (isOpen) => {
    onOpenChange(isOpen)
    if (!isOpen) reset()
  }

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalContent
        id="uninvestedCashForm_investmentFlowPage"
        variant="bordered"
        borderColor="border-slate-200"
      >
        <ModalHeader layout="beside">
          <ModalIcon icon={Wallet} />
          <ModalHeaderContent>
            <ModalTitle>Edit Uninvested Cash</ModalTitle>
            <ModalDescription>
              Update the cash amount not yet allocated to any category
            </ModalDescription>
          </ModalHeaderContent>
        </ModalHeader>

        <form onSubmit={handleSubmit(submit)} className="flex flex-col flex-1 min-h-0">
          <ModalBody>
            <FieldContainer>
              <Controller
                control={control}
                name="amount"
                render={({ field, fieldState }) => (
                  <FieldContent error={fieldState.error?.message}>
                    <FieldLabel
                      htmlFor="uninvestedCashAmountField_investmentFlowPage"
                      className="font-medium"
                    >
                      Amount
                    </FieldLabel>
                    <Input
                      {...field}
                      id="uninvestedCashAmountField_investmentFlowPage"
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0"
                      className={`${fieldClass} ${fieldState.error ? 'border-rose-500' : ''}`}
                    />
                    <FieldError className="font-medium" />
                  </FieldContent>
                )}
              />
            </FieldContainer>
          </ModalBody>

          <ModalFooter className="shrink-0 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
              id="uninvestedCashCancelBtn_investmentFlowPage"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              id="uninvestedCashSubmitBtn_investmentFlowPage"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
