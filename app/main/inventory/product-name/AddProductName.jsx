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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Loader2, Tag } from 'lucide-react'
import { productNameSchema } from '@/schemas/productName'
import { createProductName } from '@/lib/api/productName'

export default function AddProductName({ onAdded }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(productNameSchema),
    defaultValues: {
      product_name: '',
      product_name_status: 'active',
      note: '',
    },
  })

  const { control, handleSubmit, reset } = form
  const handleAddNewProductName = async (values) => {
    setLoading(true)
    try {
      await createProductName(values)
      toast.success('New product name created successfully!')
      setOpen(false)
      await onAdded?.()

      reset()
    } catch (err) {
      if (err.message === 'Product name already exists') {
        form.setError('product_name', { message: 'Product name already exists' })
      } else {
        toast.error(err.message || 'Failed to create product name')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild id="addNewProductNameBtn_productNamePage">
        <Button>Add New Product Name</Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-md max-h-[90vh] flex flex-col p-0 gap-0"
        id="addNewProductNameForm_productNamePage"
      >
        <DialogHeader className="border-b border-slate-100 px-5 py-4 shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <Tag className="size-4 text-violet-500" />
            Add New Product Name
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Create a new product name to organize your inventory — keep stock levels accurate and
            operations smooth.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(handleAddNewProductName)}
            className="flex flex-col overflow-y-auto px-5 py-5 gap-5"
            noValidate
          >
            <FormField
              control={control}
              name="product_name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="font-medium">Product name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. Clear"
                      id="productNameField"
                      className={`text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 ${
                        fieldState.error ? 'border-rose-500' : ''
                      }`}
                    />
                  </FormControl>
                  <FormMessage
                    id="productNameField_errorMessage_productNamePage"
                    className="text-xs"
                  />
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
                      id="noteField"
                      className="focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm font-medium"
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
                  id="cancelNewProductNameBtn_productNamePage"
                  disabled={form.formState.isSubmitting || loading}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || loading}
                id="submitNewProductNameBtn_productNamePage"
                className="min-w-[80px]"
              >
                {(form.formState.isSubmitting || loading) && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                {form.formState.isSubmitting || loading ? 'Adding...' : 'Add Product Name'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
