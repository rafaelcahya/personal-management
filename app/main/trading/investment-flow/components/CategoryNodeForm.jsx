'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FolderTree, Loader2 } from 'lucide-react'
import { z } from 'zod'
import Button from '@/components/base/Button/Button'
import Input from '@/components/base/Input/Input'
import { FieldContainer, FieldContent, FieldError, FieldLabel } from '@/components/base/Field/Field'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalHeaderContent,
  ModalIcon,
  ModalTitle,
} from '@/components/base/Modal/Modal'

const categoryNameSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must not exceed 100 characters'),
})

const fieldClass =
  'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500'

export default function CategoryNodeForm({
  open,
  onOpenChange,
  mode = 'create',
  initialValues,
  onSubmit,
  idPrefix = 'categoryNodeForm',
}) {
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(categoryNameSchema),
    defaultValues: { name: initialValues?.name || '' },
  })

  const { control, reset, handleSubmit } = form

  useEffect(() => {
    if (open) {
      reset({ name: initialValues?.name || '' })
    }
  }, [open, initialValues, reset])

  const submit = async (values) => {
    setLoading(true)
    try {
      const success = await onSubmit(values)
      if (success) {
        onOpenChange(false)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (isOpen) => {
    onOpenChange(isOpen)
    if (!isOpen) reset()
  }

  const isEdit = mode === 'edit'

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalContent
        id={`${idPrefix}_investmentFlowPage`}
        variant="bordered"
        borderColor="border-slate-200"
      >
        <ModalHeader layout="beside">
          <ModalIcon icon={FolderTree} />
          <ModalHeaderContent>
            <ModalTitle>{isEdit ? 'Edit Category' : 'Add Category'}</ModalTitle>
            <ModalDescription>
              {isEdit
                ? 'Update the category name'
                : 'Group related tickers under a category, like "Saham IDX"'}
            </ModalDescription>
          </ModalHeaderContent>
        </ModalHeader>

        <form onSubmit={handleSubmit(submit)} className="flex flex-col flex-1 min-h-0">
          <ModalBody>
            <FieldContainer>
              <Controller
                control={control}
                name="name"
                render={({ field, fieldState }) => (
                  <FieldContent error={fieldState.error?.message}>
                    <FieldLabel
                      htmlFor={`${idPrefix}NameField_investmentFlowPage`}
                      className="font-medium"
                    >
                      Category Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`${idPrefix}NameField_investmentFlowPage`}
                      placeholder="e.g., Saham IDX"
                      className={`${fieldClass} ${fieldState.error ? 'border-rose-500' : ''}`}
                    />
                    <FieldError className="font-medium" />
                  </FieldContent>
                )}
              />
            </FieldContainer>
          </ModalBody>

          <ModalFooter className="shrink-0 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
              id={`${idPrefix}CancelBtn_investmentFlowPage`}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} id={`${idPrefix}SubmitBtn_investmentFlowPage`}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Category'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
