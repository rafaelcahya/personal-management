'use client'

import { useState } from 'react'
import { KeyRound } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalHeaderContent,
  ModalIcon,
  ModalTitle,
  ModalFooter,
  ModalDescription,
} from '@/components/base/Modal/Modal.jsx'
import { GARMIN_BTN_CLASS } from '../../../utils/garmin'
import GarminKeyForm from './GarminKeyForm'

const FORM_ID = 'garminReplaceForm_settings'

export default function GarminReplaceDialog({ open, onOpenChange, onSaved }) {
  const [submitting, setSubmitting] = useState(false)

  function handleOpenChange(next) {
    if (submitting && !next) return
    onOpenChange(next)
  }

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalContent
        id="garminReplaceDialog_settings"
        className="w-full max-w-md"
        showCloseButton={!submitting}
        closeOnOverlayClick={!submitting}
      >
        <ModalHeader layout="beside">
          <ModalIcon icon={KeyRound} />
          <ModalHeaderContent>
            <ModalTitle>Replace Garmin key</ModalTitle>
            <ModalDescription>
              Paste a new Personal API key and the expiry date you chose for it.
            </ModalDescription>
          </ModalHeaderContent>
        </ModalHeader>

        <ModalBody padding={{ x: 0 }}>
          <GarminKeyForm
            formId={FORM_ID}
            inlineSubmit={false}
            onSubmittingChange={setSubmitting}
            onSaved={onSaved}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            id="garminReplaceCancelBtn_settings"
            type="button"
            variant="ghost"
            onClick={() => handleOpenChange(false)}
            disabled={submitting}
            className="h-11 md:h-8"
          >
            Cancel
          </Button>
          <Button
            id="garminSaveKeyBtn_settings"
            type="submit"
            form={FORM_ID}
            isLoading={submitting}
            loadingText="Checking key…"
            className={GARMIN_BTN_CLASS}
          >
            {submitting ? 'Checking key…' : 'Save key'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
