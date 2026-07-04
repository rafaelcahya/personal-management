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

export default function DeleteProductDialog({ product, onDeleted }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)

    try {
      await deleteProduct(product.id)

      toast.success(`${product.brand} deleted successfully`)
      setOpen(false)
      onDeleted?.()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error(error.message || 'Failed to delete product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button
          variant="ghost"
          size="base"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2Icon className="h-4 w-4 mr-2" />
          Delete Product
        </Button>
      </ModalTrigger>
      <ModalContent showCloseButton={false}>
        <ModalHeader>
          <ModalTitle>Delete {product.brand}?</ModalTitle>
          <ModalDescription>
            This will permanently delete{' '}
            <strong>
              {product.brand} {product.type} {product.product}
            </strong>
            . This action cannot be undone.
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <ModalClose asChild>
            <Button
              disabled={loading}
              variant="secondary"
            >
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
