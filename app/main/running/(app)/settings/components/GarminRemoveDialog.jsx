'use client'

import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import Button from '@/components/base/Button/Button'
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalTitle,
  ModalFooter,
  ModalDescription,
} from '@/components/base/Modal/Modal.jsx'
import { deleteGarminConnection } from '@/lib/api/running'

export default function GarminRemoveDialog({ open, onOpenChange, onRemoved }) {
  const [removing, setRemoving] = useState(false)
  const [error, setError] = useState(null)

  function handleOpenChange(next) {
    if (removing && !next) return
    if (!next) setError(null)
    onOpenChange(next)
  }

  async function handleRemove() {
    setRemoving(true)
    setError(null)
    try {
      await deleteGarminConnection()
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        window.location.href = '/login'
        return
      }
      setError(err.message || 'Failed to remove Garmin connection')
      setRemoving(false)
      return
    }
    setRemoving(false)
    onOpenChange(false)
    toast.success('Garmin connection removed')
    onRemoved()
  }

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalContent
        id="garminRemoveDialog_settings"
        className="w-full max-w-md"
        aria-describedby="garmin-remove-description"
        showCloseButton={!removing}
        closeOnOverlayClick={!removing}
      >
        <ModalHeader>
          <ModalTitle>Remove Garmin connection?</ModalTitle>
          <ModalDescription id="garmin-remove-description" className="text-sm">
            Your saved key will be deleted and syncing from Garmin will stop. Garmin data already
            added to your runs stays. You can add a key again at any time.
          </ModalDescription>
        </ModalHeader>

        {error && (
          <ModalBody padding={{ x: 0 }}>
            <div
              id="garminRemoveError_settings"
              role="alert"
              className="flex items-center gap-1.5 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700"
            >
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              {error}
            </div>
          </ModalBody>
        )}

        <ModalFooter>
          <Button
            id="garminRemoveCancelBtn_settings"
            variant="ghost"
            onClick={() => handleOpenChange(false)}
            disabled={removing}
            className="h-11 md:h-8"
          >
            Cancel
          </Button>
          <Button
            id="garminRemoveConfirmBtn_settings"
            onClick={handleRemove}
            disabled={removing}
            className="h-11 md:h-8 bg-red-600 hover:bg-red-700 text-white focus-visible:ring-2 focus-visible:ring-red-300"
          >
            {removing ? 'Removing…' : 'Remove'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
