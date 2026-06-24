'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Loader2, PlusCircle } from 'lucide-react'
import { productBrandSchema } from '@/schemas/productBrand'
import { addProductBrand } from '@/lib/api/productBrand'

export default function AddProduct({ onAdded, context = 'desktop' }) {
  const [open, setOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(productBrandSchema),
    defaultValues: {
      brand: '',
      brand_status: 'active',
      note: '',
    },
  })

  const { control, handleSubmit, reset, formState } = form

  const handleAddNewProductBrand = async (values) => {
    try {
      await addProductBrand(values)
      toast.success('New product brand added successfully!')
      setOpen(false)
      onAdded?.()
      reset()
    } catch (err) {
      if (err.message === 'Brand name already exists') {
        form.setError('brand', { message: 'Brand name already exists' })
      } else {
        toast.error(err.message || 'Something went wrong')
      }
    }
  }

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen)
    if (!isOpen) {
      reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild id={`addNewProductBrandBtn_${context}_productBrandPage`}>
        <Button>Add Product Brand</Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-md max-h-[90vh] flex flex-col p-0 gap-0"
        id={`addNewProductBrandForm_${context}_productBrandPage`}
      >
        <DialogHeader className="border-b border-slate-100 px-5 py-4 shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <PlusCircle className="size-4 text-violet-600" aria-hidden="true" />
            Add New Product Brand
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Create a new product brand to organize your inventory — keep stock levels accurate and
            operations smooth.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(handleAddNewProductBrand)}
            className="flex flex-col overflow-y-auto px-5 py-5 gap-5"
            noValidate
          >
            <FormField
              control={control}
              name="brand"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Product brand</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. Clear"
                      id="brandNameInput_addBrandDialog"
                      className={cn(
                        'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500',
                        fieldState.error && 'border-rose-500'
                      )}
                    />
                  </FormControl>
                  <FormMessage id="brandField_errorMessage_productBrandPage" className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Additional notes"
                      id="noteInput_addBrandDialog"
                      className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  className="text-violet-600 bg-white hover:bg-violet-100 font-medium"
                  id="cancelNewProductBrandBtn_productBrandPage"
                  disabled={formState.isSubmitting}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={formState.isSubmitting}
                id="submitNewProductBrandBtn_productBrandPage"
                className="min-w-[80px]"
              >
                {formState.isSubmitting && (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                )}
                {formState.isSubmitting ? '' : 'Add Product Brand'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
