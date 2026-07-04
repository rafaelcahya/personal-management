'use client'

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
import { Trash2, Loader2 } from 'lucide-react'
import { deleteFee } from '@/lib/api/fee'
import { toast } from 'sonner'

export default function DeleteFee({ fee, onDeleted, onClose, className }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteFee(fee.id)
      toast.success('Fee deleted successfully 🗑️')
      onClose?.()
      onDeleted?.()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error(error.message || 'Failed to delete fee')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal>
      <ModalTrigger asChild>
        <Button
          variant="ghost"
          size="base"
          className={`justify-center text-red-600 hover:text-red-600 hover:bg-red-50 font-medium${className ? ` ${className}` : ''}`}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Fee
        </Button>
      </ModalTrigger>
      <ModalContent showCloseButton={false}>
        <ModalHeader>
          <ModalTitle>Delete Fee?</ModalTitle>
          <ModalDescription className="text-slate-600">
            This will remove the fee from your active list. You can still access deleted fees from
            your archived records if needed.
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <ModalClose asChild>
            <Button
              disabled={loading}
              variant="ghost"
              className="bg-transparent hover:bg-secondary/80 text-secondary-foreground hover:text-secondary-foreground border-none"
            >
              Cancel
            </Button>
          </ModalClose>
          <ModalClose asChild>
            <Button
              onClick={handleDelete}
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
