'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Trash2Icon, Loader2 } from 'lucide-react'
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
  ModalClose,
} from '@/components/base/Modal/Modal.jsx'
import Button from '@/components/base/Button/Button'
import { deleteProduct } from '@/lib/api/product'

export default function DeleteProductDialog({
  product,
  onDeleted,
  open: controlledOpen,
  onOpenChange: onControlledChange,
}) {
  const isControlled = controlledOpen !== undefined
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const effectiveOpen = isControlled ? controlledOpen : open

  const handleOpenChange = (isOpen) => {
    if (!isControlled) setOpen(isOpen)
    onControlledChange?.(isOpen)
  }

  const handleDelete = async () => {
    setLoading(true)

    try {
      await deleteProduct(product.id)

      toast.success(`${product.brand} deleted successfully`)
      handleOpenChange(false)
      onDeleted?.()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error(error.message || 'Failed to delete product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={effectiveOpen} onOpenChange={handleOpenChange}>
      {!isControlled && (
        <ModalTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2Icon className="h-4 w-4 mr-2" />
            Delete Product
          </Button>
        </ModalTrigger>
      )}
      <ModalContent showCloseButton={false}>
        <ModalHeader>
          <ModalTitle>Delete {product.brand}?</ModalTitle>
          <ModalDescription className="text-sm">
            This will permanently delete{' '}
            <span className="text-violet-700">
              {product.brand} {product.type} {product.product}
            </span>
            . This action cannot be undone.
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <ModalClose asChild>
            <Button disabled={loading} variant="secondary">
              Cancel
            </Button>
          </ModalClose>
          <ModalClose asChild>
            <Button
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={loading}
              variant="destructive"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
