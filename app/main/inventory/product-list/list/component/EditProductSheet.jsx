'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
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
        const [b, n] = await Promise.all([fetchProductBrand(), fetchProductName()])
        setBrands(b?.filter((x) => x.brand_status === 'active') ?? [])
        setProductNames(n?.filter((x) => x.product_name_status === 'active') ?? [])
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
        className="sm:max-w-md flex flex-col max-h-[90vh]"
      >
        <DialogHeader className="text-left shrink-0">
          <DialogTitle>✏️ Edit Product</DialogTitle>
          <DialogDescription>
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
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="flex-1 overflow-y-auto space-y-5">
              {/* Brand */}
              <FormField
                control={control}
                name="brand_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
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
                    <p className="text-xs text-slate-400">Which brand is this from? 🏷️</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Product Name */}
              <FormField
                control={control}
                name="product_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
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
                    <p className="text-xs text-slate-400">What's the product called? 📦</p>
                    <FormMessage />
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
                    <FormLabel>Type</FormLabel>
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
                    <p className="text-xs text-slate-400">
                      What kind is it? (serum, lotion, toner, etc.) 💡
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={control}
                name="product_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
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
                    <p className="text-xs text-slate-400">
                      Active products appear in your inventory, inactive ones are hidden from stock
                      tracking. 🔄
                    </p>
                    <FormMessage />
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

            <DialogFooter className="shrink-0 pt-4">
              <DialogClose asChild>
                <Button
                  id="cancelBtn_editProductDialog"
                  type="button"
                  className="text-violet-600 bg-white dark:bg-transparent hover:bg-violet-100 dark:hover:bg-violet-500/5 font-medium"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button id="saveBtn_editProductDialog" type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
