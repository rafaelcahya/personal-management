import { useState } from 'react'
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
import { toast } from 'sonner'
import { deleteProductBrand } from '@/lib/api/productBrand'

export default function ProductBrandDelete({
  productBrand,
  onDeleted,
  onClose,
  disabled = false,
  className,
}) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteProductBrand(productBrand.id)
      toast.success('Product brand deleted successfully!')
      onDeleted?.()
      onClose?.()
    } catch (err) {
      toast.error(err.message || 'Failed to delete product brand')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal>
      <ModalTrigger asChild>
        <Button
          id="deleteBrandTriggerBtn_productBrandPage"
          disabled={disabled}
          className={`bg-transparent hover:bg-rose-100 dark:hover:bg-rose-500/5 text-rose-500 disabled:opacity-40 disabled:cursor-not-allowed${className ? ` ${className}` : ''}`}
        >
          Delete
        </Button>
      </ModalTrigger>
      <ModalContent
        id="deleteBrandConfirmDialog_productBrandPage"
        showCloseButton={false}
        variant="bordered" borderColor="border-slate-200"
      >
        <ModalHeader>
          <ModalTitle className="font-semibold">Delete Product Brand</ModalTitle>
          <ModalDescription className="text-slate-foreground">
            Are you sure you want to delete this product brand? This action cannot be undone.
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <ModalClose asChild>
            <Button
              id="cancelDeleteBrandBtn_productBrandPage"
              variant="ghost"
              className="bg-transparent hover:bg-secondary/80 text-secondary-foreground hover:text-secondary-foreground border-none"
            >
              Cancel
            </Button>
          </ModalClose>
          <ModalClose asChild>
            <Button
              id="confirmDeleteBrandBtn_productBrandPage"
              onClick={handleDelete}
              disabled={loading}
              className="bg-rose-600 hover:bg-rose-700 dark:text-white"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
