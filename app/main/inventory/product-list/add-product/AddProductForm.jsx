'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@/components/base/Button/Button'
import Input from '@/components/base/Input/Input'
import AttachmentGroup from '@/components/base/Attachment/AttachmentGroup'
import Attachment from '@/components/base/Attachment/Attachment'
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/base/Modal/Modal.jsx'
import FieldContent from '@/components/base/Field/FieldContent'
import FieldLabel from '@/components/base/Field/FieldLabel'
import FieldError from '@/components/base/Field/FieldError'
import FieldDescription from '@/components/base/Field/FieldDescription'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/base/Select/Select'
import Textarea from '@/components/base/Textarea/Textarea'
import { toast } from 'sonner'
import { Loader2, PlusIcon } from 'lucide-react'
import { productSchema } from '@/schemas/product'
import { createProduct } from '@/lib/api/product'
import { fetchProductBrand } from '@/lib/api/productBrand'
import { fetchProductName } from '@/lib/api/productName'

export default function AddProductForm({ onAdded }) {
  const [open, setOpen] = useState(false)
  const [productBrands, setProductBrands] = useState([])
  const [productNames, setProductNames] = useState([])
  const [loading, setLoading] = useState(false)
  const [imageAttachment, setImageAttachment] = useState(null)
  const [serverError, setServerError] = useState(null)

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      product_brand: '',
      product_name: '',
      type: '',
      note: '',
    },
  })

  const { control, reset } = form

  const handleImageAdd = (files) => {
    const file = files[0]
    if (!file) return
    if (imageAttachment?.objectUrl) URL.revokeObjectURL(imageAttachment.objectUrl)
    setImageAttachment({ file, objectUrl: URL.createObjectURL(file) })
  }

  const handleImageRemove = () => {
    if (imageAttachment?.objectUrl) URL.revokeObjectURL(imageAttachment.objectUrl)
    setImageAttachment(null)
  }

  const loadProductBrands = async () => {
    try {
      const { data: brands } = await fetchProductBrand()
      const activeBrands = Array.isArray(brands)
        ? brands.filter((b) => b.brand_status === 'active')
        : []
      setProductBrands(activeBrands)
    } catch (err) {
      console.error('Fetch brands error:', err)
    }
  }

  const loadProductNames = async () => {
    try {
      const { data: names } = await fetchProductName()
      const activeNames = Array.isArray(names)
        ? names.filter((n) => n.product_name_status === 'active')
        : []
      setProductNames(activeNames)
    } catch (err) {
      console.error('Fetch names error:', err)
    }
  }

  useEffect(() => {
    if (open) {
      loadProductBrands()
      loadProductNames()
    }
  }, [open])

  const onSubmit = async (values) => {
    setLoading(true)
    setServerError(null)

    try {
      let imageBase64 = ''

      if (imageAttachment?.file) {
        imageBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(imageAttachment.file)
        })
      }

      const payload = {
        product_id: values.product_name,
        brand_id: values.product_brand,
        type: values.type,
        usage_quantity: 0,
        product_image: imageBase64,
        note: values.note || '',
      }

      await createProduct(payload)

      toast.success('Product added successfully!')
      setOpen(false)
      reset()
      handleImageRemove()
      onAdded?.()
    } catch (err) {
      console.error('Submit error:', err)
      setServerError(err.message || 'Failed to add product')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen)
    if (!isOpen) {
      setServerError(null)
      reset()
      handleImageRemove()
    }
  }

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalTrigger asChild id="addNewProductBtn_productPage">
        <Button>
          <PlusIcon className="w-4" />
          <span>Add Product</span>
        </Button>
      </ModalTrigger>
      <ModalContent
        className="sm:max-w-md flex flex-col max-h-[90vh]"
        id="addNewProductForm_productPage"
        variant="bordered" borderColor="border-slate-200"
      >
        <ModalHeader className="text-left shrink-0">
          <ModalTitle>🛍️ Add New Product</ModalTitle>
          <ModalDescription>Got a new item? Let's add it to your inventory!</ModalDescription>
        </ModalHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          <ModalBody className="space-y-4">
            {/* Image Upload */}
            <FieldContent>
              <FieldLabel className="font-medium">Product Image</FieldLabel>
              <AttachmentGroup
                id="productImageField_productPage"
                trigger="dropzone"
                accept="image/*"
                multiple={false}
                maxFiles={1}
                showTriggerAlways={false}
                onFilesAdd={handleImageAdd}
              >
                {imageAttachment && (
                  <Attachment
                    file={{
                      name: imageAttachment.file.name,
                      size: imageAttachment.file.size,
                      type: imageAttachment.file.type,
                      url: imageAttachment.objectUrl,
                    }}
                    status="idle"
                    onRemove={handleImageRemove}
                  />
                )}
              </AttachmentGroup>
              <FieldDescription className="text-xs text-slate-400">
                Add a photo to easily identify this product later 🖼️
              </FieldDescription>
            </FieldContent>

            {/* Product Brand */}
            <Controller
              control={form.control}
              name="product_brand"
              render={({ field, fieldState }) => (
                <FieldContent error={fieldState.error?.message}>
                  <FieldLabel>Product brand</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      className="min-w-full font-medium"
                      id="productBrandField_productPage"
                    >
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {productBrands?.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                          No active product brands available
                        </div>
                      ) : (
                        productBrands?.map((productBrand) => (
                          <SelectItem key={productBrand.id} value={productBrand.id.toString()}>
                            {productBrand.brand}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FieldDescription className="text-xs text-slate-400">
                    Which brand is this from? 🏷️
                  </FieldDescription>
                  <FieldError />
                </FieldContent>
              )}
            />

            {/* Product Name */}
            <Controller
              control={control}
              name="product_name"
              render={({ field, fieldState }) => (
                <FieldContent error={fieldState.error?.message}>
                  <FieldLabel>Product name</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      className="min-w-full font-medium"
                      id="productNameField_productPage"
                    >
                      <SelectValue placeholder="Select name" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {productNames?.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                          No active product names available
                        </div>
                      ) : (
                        productNames?.map((productName) => (
                          <SelectItem key={productName.id} value={productName.id.toString()}>
                            {productName.product_name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FieldDescription className="text-xs text-slate-400">
                    What's the product called? 📦
                  </FieldDescription>
                  <FieldError />
                </FieldContent>
              )}
            />

            {/* Type */}
            <Controller
              control={control}
              name="type"
              render={({ field, fieldState }) => (
                <FieldContent error={fieldState.error?.message}>
                  <FieldLabel className="font-medium">Type</FieldLabel>
                  <Input
                    {...field}
                    id="typeField_productPage"
                    placeholder="e.g. Whitening, Hydrating, SPF 50"
                    className={`text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 ${
                      fieldState.error ? 'border-rose-500' : ''
                    }`}
                  />
                  <FieldDescription className="text-xs text-slate-400">
                    What kind is it? (serum, lotion, toner, etc.) 💡
                  </FieldDescription>
                  <FieldError className="font-medium" />
                </FieldContent>
              )}
            />

            {/* Notes */}
            <Controller
              control={control}
              name="note"
              render={({ field, fieldState }) => (
                <FieldContent error={fieldState.error?.message}>
                  <FieldLabel className="font-medium">Notes</FieldLabel>
                  <Textarea
                    {...field}
                    id="noteField_productPage"
                    value={field.value || ''}
                    placeholder="Additional details or reminders..."
                    className="focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm font-medium"
                  />
                  <FieldDescription className="text-xs text-slate-400">
                    Optional notes about this product 📝
                  </FieldDescription>
                </FieldContent>
              )}
            />

            {/* Server Error Display */}
            {serverError && (
              <div
                id="serverError_productPage"
                className="rounded-lg border-2 border-red-200 bg-red-50/50 p-4 animate-in fade-in-50 slide-in-from-top-2 duration-200"
              >
                <div className="flex gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-900 mb-1">
                      ⚠️ Unable to Add Product
                    </p>
                    <p className="text-sm text-red-800">{serverError}</p>
                  </div>
                </div>
              </div>
            )}
          </ModalBody>

          <ModalFooter className="shrink-0 pt-4">
            <ModalClose asChild>
              <Button
                type="button"
                id="cancelBtn_productPage"
                variant="secondary"
                className="text-violet-600 font-medium"
                disabled={loading}
              >
                Cancel
              </Button>
            </ModalClose>
            <Button type="submit" disabled={loading} id="submitBtn_productPage">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Adding...' : 'Add Product'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
