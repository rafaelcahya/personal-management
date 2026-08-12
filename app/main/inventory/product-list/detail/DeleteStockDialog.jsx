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
  ModalClose,
} from '@/components/base/Modal/Modal.jsx'
import Button from '@/components/base/Button/Button'
import { deleteStockEntry } from '@/lib/api/product'
import { format } from 'date-fns'

export default function DeleteStockDialog({ entry, open, onOpenChange, onDeleted }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteStockEntry(entry.id)
      toast.success('Stock entry deleted successfully')
      onOpenChange(false)
      onDeleted?.()
    } catch (err) {
      toast.error(err.message || 'Failed to delete stock entry')
    } finally {
      setLoading(false)
    }
  }

  const dateLabel = entry?.purchase_date
    ? format(new Date(entry.purchase_date), 'd MMM yyyy')
    : 'this entry'

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent showCloseButton={false} id="deleteStockDialog_productDetailPage">
        <ModalHeader>
          <ModalTitle>Delete stock entry?</ModalTitle>
          <ModalDescription className="text-sm">
            This will permanently remove the purchase of{' '}
            <span className="text-violet-700 font-medium">{entry?.quantity_added} units</span> on{' '}
            <span className="text-violet-700 font-medium">{dateLabel}</span> and reduce current
            stock by {entry?.quantity_added}. This action cannot be undone.
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <ModalClose asChild>
            <Button
              disabled={loading}
              variant="secondary"
              id="cancelDeleteStockBtn_productDetailPage"
            >
              Cancel
            </Button>
          </ModalClose>
          <Button
            id="confirmDeleteStockBtn_productDetailPage"
            onClick={handleDelete}
            disabled={loading}
            variant="destructive"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Deleting...' : 'Delete Entry'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
