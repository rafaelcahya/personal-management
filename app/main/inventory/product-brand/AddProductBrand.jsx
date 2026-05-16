'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Loader2 } from 'lucide-react'
import { productBrandSchema } from '@/schemas/productBrand'
import { addProductBrand } from '@/lib/api/productBrand'

export default function AddProduct({ onAdded, context = 'desktop' }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(productBrandSchema),
    defaultValues: {
      brand: '',
      brand_status: 'active',
      note: '',
    },
  })

  const { control, handleSubmit, reset } = form

  const handleAddNewProductBrand = async (values) => {
    setLoading(true)
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
    } finally {
      setLoading(false)
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
        className="w-full sm:w-md"
        id={`addNewProductBrandForm_${context}_productBrandPage`}
      >
        <DialogHeader className="text-left">
          <DialogTitle>🏷️ Add New Product Brand</DialogTitle>
          <DialogDescription className="text-slate-foreground">
            Create a new product brand to organize your inventory — keep stock levels accurate and
            operations smooth.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(handleAddNewProductBrand)} className="space-y-4">
            <FormField
              control={control}
              name="brand"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="font-medium">Product brand</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. Clear"
                      id="brandNameInput_addBrandDialog"
                      className={`text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 ${
                        fieldState.error ? 'border-rose-500' : ''
                      }`}
                    />
                  </FormControl>
                  <FormMessage
                    id="brandField_errorMessage_productBrandPage"
                    className="font-medium"
                  >
                    {fieldState.error?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Additional notes"
                      id="noteInput_addBrandDialog"
                      className="focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm font-medium"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  className="text-violet-600 bg-white dark:bg-transparent hover:bg-violet-100 dark:hover:bg-violet-500/5 font-medium"
                  id="cancelNewProductBrandBtn_productBrandPage"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={loading}
                id="submitNewProductBrandBtn_productBrandPage"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Adding...' : 'Add Product Brand'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
