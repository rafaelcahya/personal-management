'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { deleteEvent } from '@/lib/api/event'
import { toast } from 'sonner'

export default function DeleteEvent({ event, onDeleted, onClose, redirectTo, open }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteEvent(event.id)
      toast.success('Event deleted successfully 🗑️')
      onClose?.()
      onDeleted?.()
      if (redirectTo) router.push(redirectTo)
    } catch (error) {
      console.error('Delete error:', error)
      toast.error(error.message || 'Failed to delete event')
    } finally {
      setLoading(false)
    }
  }

  // Controlled mode (open prop passed from parent — no trigger button)
  if (open !== undefined) {
    return (
      <Modal open={open} onOpenChange={(val) => !val && onClose?.()}>
        <ModalContent showCloseButton={false}>
          <ModalHeader>
            <ModalTitle>Delete Event?</ModalTitle>
            <ModalDescription className="text-slate-600">
              This event will be permanently removed. This action cannot be undone.
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

  return (
    <Modal>
      <ModalTrigger asChild>
        <Button
          variant="ghost"
          size="base"
          className="justify-start text-red-600 hover:text-red-600 hover:bg-red-50 font-medium"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Event
        </Button>
      </ModalTrigger>
      <ModalContent showCloseButton={false}>
        <ModalHeader>
          <ModalTitle>Delete Event?</ModalTitle>
          <ModalDescription className="text-slate-600">
            This event will be permanently removed. This action cannot be undone.
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
