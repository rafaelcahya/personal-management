'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Loader2, Pencil } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { updateProductDetails } from '@/lib/api/product'
import { fetchProductBrand } from '@/lib/api/productBrand'
import { fetchProductName } from '@/lib/api/productName'

export default function EditProductSheet({ product, open, onOpenChange, onUpdated }) {
  const [brands, setBrands] = useState([])
  const [productNames, setProductNames] = useState([])
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState(null)

  const form = useForm({
    defaultValues: {
      brand_id: '',
      product_id: '',
      type: '',
      product_status: 'active',
    },
  })

  const { control, handleSubmit, reset } = form

  useEffect(() => {
    if (!open || !product) return

    setServerError(null)
    reset({
      brand_id: product.brand_id?.toString() ?? '',
      product_id: product.product_id?.toString() ?? '',
      type: product.type ?? '',
      product_status: product.product_status ?? 'active',
    })

    async function loadOptions() {
      try {
        const [b, n] = await Promise.all([
          fetchProductBrand({ status: 'active', limit: 100 }),
          fetchProductName({ status: 'active', limit: 100 }),
        ])
        setBrands(b?.data ?? [])
        setProductNames(n?.data ?? [])
      } catch (err) {
        console.error('Failed to load brands/names:', err)
      }
    }
    loadOptions()
  }, [open, product, reset])

  const onSubmit = async (values) => {
    setLoading(true)
    setServerError(null)
    try {
      await updateProductDetails(product.id, {
        brand_id: Number(values.brand_id),
        product_id: Number(values.product_id),
        type: values.type,
        product_status: values.product_status,
      })
      toast.success('Product updated successfully!')
      onOpenChange(false)
      onUpdated?.()
    } catch (err) {
      console.error('Edit product error:', err)
      setServerError(err.message || 'Failed to update product')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (isOpen) => {
    if (!isOpen) setServerError(null)
    onOpenChange(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        id="editProductDialog_productListPage"
        className="max-w-md max-h-[90vh] flex flex-col p-0 gap-0"
      >
        <DialogHeader className="border-b border-slate-100 px-5 py-4 shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <Pencil className="size-4 text-violet-500" />
            Edit Product
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Update details for{' '}
            <span className="font-medium text-slate-700">
              {product?.brand} {product?.type} {product?.product}
            </span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="editProductForm_productListPage"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col overflow-y-auto px-5 py-5 gap-5"
            noValidate
          >
            <div className="flex flex-col gap-5">
              {/* Brand */}
              <FormField
                control={control}
                name="brand_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Brand</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger
                          id="brandSelect_editProductDialog"
                          className="w-full font-medium focus-visible:ring-violet-200 focus-visible:border-violet-500"
                        >
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {brands.length === 0 ? (
                          <div className="p-8 text-center text-sm text-muted-foreground">
                            No active brands available
                          </div>
                        ) : (
                          brands.map((b) => (
                            <SelectItem key={b.id} value={b.id.toString()}>
                              {b.brand}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs text-slate-400">
                      Which brand is this from?
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Product Name */}
              <FormField
                control={control}
                name="product_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Product Name</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger
                          id="nameSelect_editProductDialog"
                          className="w-full font-medium focus-visible:ring-violet-200 focus-visible:border-violet-500"
                        >
                          <SelectValue placeholder="Select product name" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {productNames.length === 0 ? (
                          <div className="p-8 text-center text-sm text-muted-foreground">
                            No active product names available
                          </div>
                        ) : (
                          productNames.map((n) => (
                            <SelectItem key={n.id} value={n.id.toString()}>
                              {n.product_name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs text-slate-400">
                      What's the product called?
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Type */}
              <FormField
                control={control}
                name="type"
                rules={{ required: 'Type is required' }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Type</FormLabel>
                    <FormControl>
                      <Input
                        id="typeInput_editProductDialog"
                        {...field}
                        placeholder="e.g. Whitening, Hydrating, SPF 50"
                        className={`font-medium focus-visible:ring-violet-200 focus-visible:border-violet-500 ${
                          fieldState.error ? 'border-rose-500' : ''
                        }`}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-slate-400">
                      What kind is it? (serum, lotion, toner, etc.)
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={control}
                name="product_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger
                          id="statusSelect_editProductDialog"
                          className="w-full font-medium focus-visible:ring-violet-200 focus-visible:border-violet-500"
                        >
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs text-slate-400">
                      Active products appear in your inventory, inactive ones are hidden from stock
                      tracking.
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {serverError && (
                <div className="rounded-lg border-2 border-red-200 bg-red-50/50 p-4 animate-in fade-in-50 slide-in-from-top-2 duration-200">
                  <p className="text-sm font-semibold text-red-900 mb-1">
                    ⚠️ Unable to update product
                  </p>
                  <p className="text-sm text-red-800">{serverError}</p>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button
                  id="cancelBtn_editProductDialog"
                  type="button"
                  className="text-violet-600 bg-white hover:bg-violet-100 font-medium"
                  disabled={form.formState.isSubmitting || loading}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                id="saveBtn_editProductDialog"
                type="submit"
                disabled={form.formState.isSubmitting || loading}
                className="min-w-[80px]"
              >
                {(form.formState.isSubmitting || loading) && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                {form.formState.isSubmitting || loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
