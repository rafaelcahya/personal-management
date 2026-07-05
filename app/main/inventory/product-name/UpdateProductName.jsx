'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import Button from '@/components/base/Button/Button'
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/components/base/Modal/Modal.jsx'
import Input from '@/components/base/Input/Input'
import FieldContent from '@/components/base/Field/FieldContent'
import FieldLabel from '@/components/base/Field/FieldLabel'
import FieldError from '@/components/base/Field/FieldError'
import Textarea from '@/components/base/Textarea/Textarea'
import { AlertCircle, Loader2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/base/Select/Select'

import { productNameSchema } from '@/schemas/productName'
import { updateProductName } from '@/lib/api/productName'
import DeleteProductName from './DeleteProductName'

export default function ProductNameUpdate({ productName, onClose, onUpdated }) {
  const [loading, setLoading] = useState(false)
  const [restoring, setRestoring] = useState(false)

  const form = useForm({
    resolver: zodResolver(productNameSchema),
    defaultValues: {
      product_name: '',
      product_name_status: 'active',
      note: '',
    },
  })

  const { control, handleSubmit, reset } = form

  useEffect(() => {
    if (productName) {
      reset({
        product_name: productName.product_name || '',
        product_name_status: productName.product_name_status || 'active',
        note: productName.note || '',
      })
    }
  }, [productName, reset])

  const handleUpdate = async (values) => {
    setLoading(true)
    try {
      await updateProductName(productName.id, values)
      toast.success('Product name updated successfully!')
      onUpdated?.()
      onClose()
    } catch (err) {
      if (err.message === 'Product name already exists') {
        form.setError('product_name', { message: 'Product name already exists' })
      } else {
        toast.error(err.message || 'Failed to update product name')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async () => {
    setRestoring(true)
    try {
      await updateProductName(productName.id, {
        product_name: productName.product_name,
        product_name_status: 'active',
        note: productName.note || '',
      })
      toast.success('Product name restored successfully!')
      onUpdated?.()
      onClose()
    } catch (err) {
      toast.error(err.message || 'Failed to restore product name')
    } finally {
      setRestoring(false)
    }
  }

  const isDeleted = productName?.product_name_status === 'deleted'
  const isInUse = (productName?.product_count ?? 0) > 0

  if (!productName) return null

  return (
    <Modal open={!!productName} onOpenChange={onClose}>
      <ModalContent
        id="updateProductNameDialog_productNamePage"
        className="sm:max-w-md"
        variant="bordered"
        borderColor="border-slate-200"
      >
        <ModalHeader>
          <ModalTitle>Update Product Name</ModalTitle>
          <ModalDescription className="text-slate-foreground">
            Edit name details including name, status, and notes.
          </ModalDescription>
        </ModalHeader>

        <form onSubmit={handleSubmit(handleUpdate)} className="flex flex-col flex-1 min-h-0">
          <ModalBody className="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto">
            <Controller
              control={control}
              name="product_name"
              render={({ field, fieldState }) => (
                <FieldContent error={fieldState.error?.message}>
                  <FieldLabel className="font-medium">Product Name</FieldLabel>
                  <Input
                    {...field}
                    placeholder="e.g. Clear"
                    className={cn(
                      'text-sm font-medium capitalize focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500',
                      fieldState.error && 'border-red-500 focus-visible:ring-red-500'
                    )}
                  />
                  <FieldError />
                </FieldContent>
              )}
            />

            {/* Status Select */}
            <Controller
              control={control}
              name="product_name_status"
              render={({ field, fieldState }) => (
                <FieldContent error={fieldState.error?.message}>
                  <FieldLabel className="font-medium">Status</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                          <span>Active</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="inactive">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                          <span>Inactive</span>
                        </div>
                      </SelectItem>
                      {isDeleted && (
                        <SelectItem value="deleted" className="text-red-600 hover:bg-red-50">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                            <span>Deleted</span>
                          </div>
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FieldError />
                </FieldContent>
              )}
            />

            {/* Notes */}
            <Controller
              control={control}
              name="note"
              render={({ field, fieldState }) => (
                <FieldContent error={fieldState.error?.message}>
                  <FieldLabel className="font-medium">Note</FieldLabel>
                  <Textarea
                    {...field}
                    placeholder="Additional notes about this brand..."
                    className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 resize-vertical min-h-[80px]"
                    rows={3}
                  />
                </FieldContent>
              )}
            />

            {isInUse && !isDeleted && (
              <div
                id="productNameInUseWarning_updateDialog"
                className="rounded-md border border-rose-300 bg-rose-50 dark:bg-rose-500/10 dark:border-rose-500/30 p-3"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
                  <p className="text-sm font-medium text-rose-600 dark:text-rose-400">
                    Product name is still used by {productName.product_count} product(s) and cannot
                    be deleted.
                  </p>
                </div>
              </div>
            )}
          </ModalBody>

          <ModalFooter>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex gap-2">
                <div className="flex-1">
                  {isDeleted ? (
                    <Button
                      type="button"
                      id="restoreProductNameBtn_productNamePage"
                      onClick={handleRestore}
                      disabled={restoring}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      {restoring && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {restoring ? 'Restoring...' : 'Restore Product Name'}
                    </Button>
                  ) : (
                    <DeleteProductName
                      productName={productName}
                      onDeleted={onUpdated}
                      onClose={onClose}
                      disabled={isInUse}
                      className="w-full"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <ModalClose asChild>
                    <Button
                      id="cancelUpdateProductNameBtn_productNamePage"
                      type="button"
                      variant="secondary"
                      className="w-full text-violet-600 font-medium"
                    >
                      Cancel
                    </Button>
                  </ModalClose>
                </div>
              </div>
              <Button
                id="submitUpdateProductNameBtn_productNamePage"
                type="submit"
                disabled={loading || isDeleted}
                className="w-full"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Updating...' : 'Update Product Name'}
              </Button>
            </div>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
