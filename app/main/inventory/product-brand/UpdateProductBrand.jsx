'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { AlertCircle, Loader2 } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Input from '@/components/base/Input/Input'
import FieldContent from '@/components/base/Field/FieldContent'
import FieldLabel from '@/components/base/Field/FieldLabel'
import FieldError from '@/components/base/Field/FieldError'
import Textarea from '@/components/base/Textarea/Textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/base/Select/Select'

import { productBrandSchema } from '@/schemas/productBrand'
import { updateProductBrand } from '@/lib/api/productBrand'
import ProductBrandDelete from './DeleteProductBrand'

export default function ProductBrandUpdate({ productBrand, onClose, onUpdated }) {
  const [loading, setLoading] = useState(false)
  const [restoring, setRestoring] = useState(false)

  const form = useForm({
    resolver: zodResolver(productBrandSchema),
    defaultValues: {
      brand: '',
      brand_status: 'active',
      note: '',
    },
  })

  const { control, handleSubmit, reset } = form

  useEffect(() => {
    if (productBrand) {
      reset({
        brand: productBrand.brand || '',
        brand_status: productBrand.brand_status || 'active',
        note: productBrand.note || '',
      })
    }
  }, [productBrand, reset])

  const handleUpdate = async (values) => {
    setLoading(true)
    try {
      await updateProductBrand(productBrand.id, values)
      toast.success('Product brand updated successfully!')
      onUpdated?.()
      onClose()
    } catch (err) {
      if (err.message === 'Brand name already exists') {
        form.setError('brand', { message: 'Brand name already exists' })
      } else {
        toast.error(err.message || 'Failed to update product brand')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async () => {
    setRestoring(true)
    try {
      await updateProductBrand(productBrand.id, {
        brand: productBrand.brand,
        brand_status: 'active',
        note: productBrand.note || '',
      })
      toast.success('Brand restored successfully!')
      onUpdated?.()
      onClose()
    } catch (err) {
      toast.error(err.message || 'Failed to restore brand')
    } finally {
      setRestoring(false)
    }
  }

  const isDeleted = productBrand?.brand_status === 'deleted'
  const isInUse = (productBrand?.product_count ?? 0) > 0

  if (!productBrand) return null

  return (
    <Dialog open={!!productBrand} onOpenChange={onClose}>
      <DialogContent id="updateBrandDialog_productBrandPage" className="sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle>✏️ Update Product Brand</DialogTitle>
          <DialogDescription className="text-slate-foreground">
            Edit brand details including name, status, and notes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
          {/* Brand Name */}
          <Controller
            control={control}
            name="brand"
            render={({ field, fieldState }) => (
              <FieldContent error={fieldState.error?.message}>
                <FieldLabel className="font-medium">Brand Name</FieldLabel>
                <Input
                  {...field}
                  id="brandNameInput_updateBrandDialog"
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
            name="brand_status"
            render={({ field, fieldState }) => (
              <FieldContent error={fieldState.error?.message}>
                <FieldLabel className="font-medium">Status</FieldLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="statusSelect_updateBrandDialog" className="w-full">
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
                  id="noteInput_updateBrandDialog"
                  placeholder="Additional notes about this brand..."
                  className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 resize-vertical min-h-[80px]"
                  rows={3}
                />
              </FieldContent>
            )}
          />

          {isInUse && !isDeleted && (
            <div
              id="brandInUseWarning_updateBrandDialog"
              className="rounded-md border border-rose-300 bg-rose-50 dark:bg-rose-500/10 dark:border-rose-500/30 p-3"
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
                <p className="text-sm font-medium text-rose-600 dark:text-rose-400">
                  Brand is by {productBrand.product_count} product(s) and cannot be deleted.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex gap-2">
                <div className="flex-1">
                  {isDeleted ? (
                    <Button
                      type="button"
                      id="restoreBrandBtn_productBrandPage"
                      onClick={handleRestore}
                      disabled={restoring}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      {restoring && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {restoring ? 'Restoring...' : 'Restore Brand'}
                    </Button>
                  ) : (
                    <ProductBrandDelete
                      productBrand={productBrand}
                      onDeleted={onUpdated}
                      onClose={onClose}
                      disabled={isInUse}
                      className="w-full"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      id="cancelUpdateBrandBtn_productBrandPage"
                      className="w-full text-violet-600 font-medium"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                </div>
              </div>
              <Button
                id="submitUpdateBrandBtn_productBrandPage"
                type="submit"
                disabled={loading || isDeleted}
                className="w-full"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Updating...' : 'Update Product Brand'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
