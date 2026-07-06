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
import { deleteTrade } from '@/lib/api/trade'
import { toast } from 'sonner'

export default function DeleteTrade({ trade, onDeleted, onClose, className }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteTrade(trade.id)
      toast.success('Trade deleted successfully! 🗑️')
      onDeleted?.()
      onClose?.()
    } catch (error) {
      toast.error(error.message || 'Failed to delete trade')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal>
      <ModalTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className={`text-red-600 hover:text-red-600 hover:bg-red-50${className ? ` ${className}` : ''}`}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </ModalTrigger>
      <ModalContent showCloseButton={false}>
        <ModalHeader>
          <ModalTitle>Delete Trade?</ModalTitle>
          <ModalDescription className="text-sm">
            This action cannot be undone. This will permanently delete this trade record from your
            trading journal.
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
            <Button onClick={handleDelete} disabled={loading} variant="destructive">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
