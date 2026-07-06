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
import { deleteProductName } from '@/lib/api/productName'

export default function DeleteProductName({
  productName,
  onDeleted,
  onClose,
  disabled = false,
  className,
}) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteProductName(productName.id)
      toast.success('Product name deleted successfully!')
      onDeleted?.()
      onClose?.()
    } catch (err) {
      console.error(err.message || err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal>
      <ModalTrigger asChild>
        <Button
          id="deleteProductNameBtn_productNamePage"
          disabled={disabled}
          className={`bg-transparent hover:bg-rose-100 dark:hover:bg-rose-500/5 text-rose-500 disabled:opacity-40 disabled:cursor-not-allowed${className ? ` ${className}` : ''}`}
        >
          Delete
        </Button>
      </ModalTrigger>
      <ModalContent showCloseButton={false}>
        <ModalHeader>
          <ModalTitle className="font-semibold">Delete Product Name</ModalTitle>
          <ModalDescription className="text-sm">
            Are you sure you want to delete this product name? This action cannot be undone.
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <ModalClose asChild>
            <Button
              variant="ghost"
              className="bg-transparent hover:bg-secondary/80 text-secondary-foreground hover:text-secondary-foreground border-none"
            >
              Cancel
            </Button>
          </ModalClose>
          <ModalClose asChild>
            <Button
              id="deleteProductNameConfirmBtn_productNamePage"
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
