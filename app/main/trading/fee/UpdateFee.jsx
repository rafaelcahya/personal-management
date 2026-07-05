'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@/components/base/Button/Button'
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
} from '@/components/base/Modal/Modal.jsx'
import FieldContent from '@/components/base/Field/FieldContent'
import FieldLabel from '@/components/base/Field/FieldLabel'
import FieldError from '@/components/base/Field/FieldError'
import FieldDescription from '@/components/base/Field/FieldDescription'
import Input from '@/components/base/Input/Input'
import DatePicker from '@/components/base/DatePicker/DatePicker/DatePicker'
import { toast } from 'sonner'
import { Loader2, Receipt } from 'lucide-react'
import { feeSchema } from '@/schemas/fee'
import { updateFee } from '@/lib/api/fee'
import { formatRupiah } from '@/lib/utils/currencyFormatter'
import DeleteFee from './DeleteFee'

export default function UpdateFee({ fee, onClose, onUpdated }) {
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(feeSchema),
    defaultValues: {
      fee_name: '',
      fee: '',
      fee_date: new Date(),
    },
  })

  const { control, reset, handleSubmit } = form

  useEffect(() => {
    if (fee) {
      reset({
        fee_name: fee.fee_name || '',
        fee: fee.fee?.toString() || '',
        fee_date: new Date(fee.fee_date),
      })
    }
  }, [fee, reset])

  const onSubmit = async (values) => {
    setLoading(true)

    try {
      const payload = {
        fee_name: values.fee_name,
        fee: values.fee,
        fee_date: values.fee_date.toISOString().split('T')[0],
      }

      await updateFee(fee.id, payload)
      toast.success('Fee updated successfully! ✅')
      onUpdated?.()
    } catch (err) {
      console.error('Update error:', err)
      toast.error(err.message || 'Failed to update fee')
    } finally {
      setLoading(false)
    }
  }

  if (!fee) return null

  return (
    <Modal open={!!fee} onOpenChange={onClose}>
      <ModalContent
        className="sm:max-w-md flex flex-col max-h-[90vh]"
        variant="bordered"
        borderColor="border-slate-200"
      >
        <ModalHeader layout="beside" padding={{ x: 4 }}>
          <ModalIcon icon={Receipt} />
          <ModalHeaderContent>
            <ModalTitle>Update Fee</ModalTitle>
            <ModalDescription>
              Adjust your fee details to keep your records accurate and reliable
            </ModalDescription>
          </ModalHeaderContent>
        </ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          <ModalBody className="space-y-4 pr-2" padding={{ x: 4 }}>
            {/* Fee Date & Fee Name Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fee Date */}
              <Controller
                control={control}
                name="fee_date"
                render={({ field, fieldState }) => (
                  <FieldContent error={fieldState.error?.message}>
                    <FieldLabel className="font-medium">Fee Date</FieldLabel>
                    <DatePicker value={field.value} onChange={field.onChange} />
                    <FieldDescription className="text-xs text-slate-400">
                      When was this fee charged? 📅
                    </FieldDescription>
                    <FieldError className="font-medium" />
                  </FieldContent>
                )}
              />

              {/* Fee Name */}
              <Controller
                control={control}
                name="fee_name"
                render={({ field, fieldState }) => (
                  <FieldContent error={fieldState.error?.message}>
                    <FieldLabel className="font-medium">Fee Name</FieldLabel>
                    <Input
                      {...field}
                      placeholder="e.g., Admin Fee"
                      className={`focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm font-medium ${
                        fieldState.error ? 'border-rose-500' : ''
                      }`}
                    />
                    <FieldDescription className="text-xs text-slate-400">
                      What type of fee is this? 🏷️
                    </FieldDescription>
                    <FieldError className="font-medium" />
                  </FieldContent>
                )}
              />
            </div>

            {/* Fee Amount */}
            <Controller
              control={control}
              name="fee"
              render={({ field, fieldState }) => (
                <FieldContent error={fieldState.error?.message}>
                  <FieldLabel className="font-medium">Fee Amount</FieldLabel>
                  <Input
                    type="text"
                    value={field.value ? formatRupiah(field.value) : ''}
                    placeholder="e.g., 10000"
                    className={`focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm font-medium ${
                      fieldState.error ? 'border-rose-500' : ''
                    }`}
                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                  />
                  <FieldDescription className="text-xs text-slate-400">
                    How much did you pay? 💸
                  </FieldDescription>
                  <FieldError className="font-medium" />
                </FieldContent>
              )}
            />
          </ModalBody>

          <ModalFooter className="shrink-0 pt-4">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex gap-2">
                <div className="flex-1">
                  <DeleteFee fee={fee} onDeleted={onUpdated} onClose={onClose} className="w-full" />
                </div>
                <div className="flex-1">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    disabled={loading}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Updating...' : 'Update Fee'}
              </Button>
            </div>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
