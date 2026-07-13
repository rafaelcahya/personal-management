'use client'

import { FieldContent, FieldLabel, FieldError, FieldContainer } from '@/components/base/Field/Field'
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
  ModalHeaderContent,
  ModalIcon,
  ModalTitle,
  ModalTrigger,
} from '@/components/base/Modal/Modal.jsx'
import Textarea from '@/components/base/Textarea/Textarea'
import { toast } from 'sonner'
import { Loader2, Package } from 'lucide-react'
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
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild id="addNewProductNameBtn_productNamePage">
        <Button>Add New Product Name</Button>
      </ModalTrigger>
      <ModalContent
        id="addNewProductNameForm_productNamePage"
        variant="bordered"
        borderColor="border-slate-200"
      >
        <ModalHeader layout="beside">
          <ModalIcon icon={Package} />
          <ModalHeaderContent>
            <ModalTitle>Add New Product Name</ModalTitle>
            <ModalDescription>
              Create a new product name to organize your inventory.
            </ModalDescription>
          </ModalHeaderContent>
        </ModalHeader>

        <form
          onSubmit={handleSubmit(handleAddNewProductName)}
          className="flex flex-col flex-1 min-h-0"
        >
          <ModalBody className="overflow-y-auto">
            <FieldContainer>
              <Controller
                control={control}
                name="product_name"
                render={({ field, fieldState }) => (
                  <FieldContent error={fieldState.error?.message}>
                    <FieldLabel className="font-medium">Product name</FieldLabel>
                    <Input
                      {...field}
                      placeholder="e.g. Clear"
                      id="productNameField"
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
                      id="noteField"
                      className="focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm font-medium"
                    />
                  </FieldContent>
                )}
              />
            </FieldContainer>
          </ModalBody>

          <ModalFooter>
            <ModalClose asChild>
              <Button
                type="button"
                variant="secondary"
                className="text-violet-600  font-medium"
                id="cancelNewProductNameBtn_productNamePage"
              >
                Cancel
              </Button>
            </ModalClose>
            <Button type="submit" disabled={loading} id="submitNewProductNameBtn_productNamePage">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Adding...' : 'Add Product Name'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
