'use client'

import { FieldContent, FieldLabel, FieldError, FieldContainer } from '@/components/base/Field/Field'
import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, FilePenLine } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import Input from '@/components/base/Input/Input'
import Textarea from '@/components/base/Textarea/Textarea'
import DatePicker from '@/components/base/DatePicker/DatePicker/DatePicker'
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalHeaderContent,
  ModalIcon,
  ModalTitle,
} from '@/components/base/Modal/Modal.jsx'
import { updateStockEntry } from '@/lib/api/product'
import { editStockEntrySchema } from '@/schemas/productQuantity'

export default function EditStockForm({ entry, open, onOpenChange, onUpdated }) {
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState(null)

  const form = useForm({
    resolver: zodResolver(editStockEntrySchema),
    defaultValues: {
      quantity_added: entry?.quantity_added ?? 1,
      price: entry?.price ?? 0,
      purchase_date: entry?.purchase_date ? new Date(entry.purchase_date) : new Date(),
      note: entry?.note ?? '',
    },
  })

  const { control, handleSubmit, reset } = form

  useEffect(() => {
    if (open && entry) {
      reset({
        quantity_added: entry.quantity_added ?? 1,
        price: Number(entry.price ?? 0),
        purchase_date: entry.purchase_date ? new Date(entry.purchase_date) : new Date(),
        note: entry.note ?? '',
      })
      setServerError(null)
    }
  }, [open, entry]) // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (values) => {
    setLoading(true)
    setServerError(null)
    try {
      await updateStockEntry(entry.id, {
        quantity_added: values.quantity_added,
        price: values.price,
        purchase_date: values.purchase_date.toISOString(),
        note: values.note,
      })
      toast.success('Stock entry updated successfully')
      onOpenChange(false)
      onUpdated?.()
    } catch (err) {
      setServerError(err.message || 'Failed to update stock entry')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent
        className="max-h-[90vh]"
        id="editStockPopup_productDetailPage"
        variant="bordered"
        borderColor="border-slate-200"
      >
        <ModalHeader layout="beside">
          <ModalIcon icon={FilePenLine} />
          <ModalHeaderContent>
            <ModalTitle>Edit Stock Entry</ModalTitle>
            <ModalDescription>
              Update quantity, price, date, or note for this purchase
            </ModalDescription>
          </ModalHeaderContent>
        </ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          <ModalBody>
            <FieldContainer>
              <Controller
                control={control}
                name="quantity_added"
                render={({ field, fieldState }) => (
                  <FieldContent error={fieldState.error?.message}>
                    <FieldLabel className="font-medium">Quantity Added</FieldLabel>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value === '' ? '' : Number(e.target.value))
                      }
                      id="editQtyField_productDetailPage"
                      className="font-medium font-mono text-sm focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                      min={1}
                    />
                    <FieldError />
                  </FieldContent>
                )}
              />

              <Controller
                control={control}
                name="price"
                render={({ field, fieldState }) => (
                  <FieldContent error={fieldState.error?.message}>
                    <FieldLabel className="font-medium">Price (Rp)</FieldLabel>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value === '' ? '' : Number(e.target.value))
                      }
                      id="editPriceField_productDetailPage"
                      className="font-medium font-mono text-sm focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                      min={0}
                    />
                    <FieldError />
                  </FieldContent>
                )}
              />

              <Controller
                control={control}
                name="purchase_date"
                render={({ field, fieldState }) => (
                  <FieldContent error={fieldState.error?.message}>
                    <FieldLabel className="font-medium">Purchase Date</FieldLabel>
                    <DatePicker value={field.value} onChange={field.onChange} />
                    <FieldError />
                  </FieldContent>
                )}
              />

              <Controller
                control={control}
                name="note"
                render={({ field }) => (
                  <FieldContent>
                    <FieldLabel className="font-medium">Note (Optional)</FieldLabel>
                    <Textarea
                      {...field}
                      id="editNoteField_productDetailPage"
                      placeholder="Any notes about this purchase"
                      className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 resize-vertical min-h-[80px]"
                      rows={3}
                    />
                  </FieldContent>
                )}
              />

              {serverError && (
                <div className="rounded-lg border-2 border-red-200 bg-red-50/50 p-4 animate-in fade-in-50 slide-in-from-top-2 duration-200">
                  <p className="text-sm font-semibold text-red-900 mb-1">Unable to update entry</p>
                  <p className="text-sm text-red-800">{serverError}</p>
                </div>
              )}
            </FieldContainer>
          </ModalBody>

          <ModalFooter>
            <Button type="submit" disabled={loading} id="submitEditStockBtn_productDetailPage">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
