'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@/components/base/Button/Button'
import Input from '@/components/base/Input/Input'
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
import Textarea from '@/components/base/Textarea/Textarea'
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
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalTrigger asChild id={`addNewProductBrandBtn_${context}_productBrandPage`}>
        <Button>Add Product Brand</Button>
      </ModalTrigger>
      <ModalContent
        className="w-full sm:w-md"
        id={`addNewProductBrandForm_${context}_productBrandPage`}
        variant="bordered" borderColor="border-slate-200"
      >
        <ModalHeader className="text-left">
          <ModalTitle>🏷️ Add New Product Brand</ModalTitle>
          <ModalDescription className="text-slate-foreground">
            Create a new product brand to organize your inventory — keep stock levels accurate and
            operations smooth.
          </ModalDescription>
        </ModalHeader>

        <form onSubmit={handleSubmit(handleAddNewProductBrand)} className="flex flex-col flex-1 min-h-0">
          <ModalBody className="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto">
            <Controller
              control={control}
              name="brand"
              render={({ field, fieldState }) => (
                <FieldContent error={fieldState.error?.message}>
                  <FieldLabel className="font-medium">Product brand</FieldLabel>
                  <Input
                    {...field}
                    placeholder="e.g. Clear"
                    id="brandNameInput_addBrandDialog"
                    className={`text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 ${
                      fieldState.error ? 'border-rose-500' : ''
                    }`}
                  />
                  <FieldError className="font-medium" />
                </FieldContent>
              )}
            />

            <Controller
              control={control}
              name="note"
              render={({ field, fieldState }) => (
                <FieldContent error={fieldState.error?.message}>
                  <FieldLabel className="font-medium">Notes</FieldLabel>
                  <Textarea
                    {...field}
                    placeholder="Additional notes"
                    id="noteInput_addBrandDialog"
                    className="focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm font-medium"
                  />
                </FieldContent>
              )}
            />
          </ModalBody>

          <ModalFooter>
            <ModalClose asChild>
              <Button
                type="button"
                variant="secondary"
                className="text-violet-600 font-medium"
                id="cancelNewProductBrandBtn_productBrandPage"
              >
                Cancel
              </Button>
            </ModalClose>
            <Button type="submit" disabled={loading} id="submitNewProductBrandBtn_productBrandPage">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Adding...' : 'Add Product Brand'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
