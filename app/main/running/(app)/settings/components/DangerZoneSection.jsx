'use client'

import { useState } from 'react'
import { AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import Card, {
  CardContent,
  CardHeader,
  CardIcon,
  CardTitle,
  CardDescription,
} from '@/components/base/Card/Card'
import Input from '@/components/base/Input/Input'
import FieldContent from '@/components/base/Field/FieldContent'
import FieldLabel from '@/components/base/Field/FieldLabel'
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from '@/components/base/Modal/Modal.jsx'
import { deleteAllActivities } from '@/lib/api/running'

export default function DangerZoneSection() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)
  const [deleteSuccess, setDeleteSuccess] = useState(false)

  function openDialog() {
    setDialogOpen(true)
    setConfirmText('')
    setDeleteError(null)
  }

  function closeDialog() {
    if (deleting) return
    setDialogOpen(false)
    setConfirmText('')
    setDeleteError(null)
  }

  async function handleConfirm() {
    setDeleting(true)
    setDeleteError(null)
    try {
      await deleteAllActivities()
      setDialogOpen(false)
      setConfirmText('')
      setDeleteSuccess(true)
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete activities')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Card as="section" aria-label="Danger zone" className="border-red-200">
      <CardHeader className="border-red-100">
        <CardIcon icon={AlertTriangle} className="bg-red-50" iconClassName="text-red-600" />
        <div className="min-w-0 flex-1">
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>Irreversible actions — proceed with caution</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <Card variant="danger" className="shadow-none rounded-lg">
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-2 min-w-0">
              <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-red-800">Delete all activity data</p>
                <p className="text-xs text-red-600 mt-0.5">
                  Permanently remove all your running activities. This cannot be undone.
                </p>
              </div>
            </div>
            <Button
              id="dangerZoneDeleteBtn_settingsPage"
              onClick={openDialog}
              size="base"
              variant="outline"
              className="shrink-0 border-red-300 text-red-700 hover:bg-red-100 hover:text-red-800 focus-visible:ring-2 focus-visible:ring-red-300"
            >
              Delete All
            </Button>
          </CardContent>
        </Card>

        {deleteSuccess && (
          <div
            className="flex items-center gap-1.5 text-sm text-green-700"
            role="status"
            aria-live="polite"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            All activity data deleted successfully.
          </div>
        )}
      </CardContent>

      <Modal open={dialogOpen} onOpenChange={closeDialog}>
        <ModalContent
          id="dangerZoneDialog_settingsPage"
          className="w-full max-w-md"
          aria-describedby="danger-zone-description"
          variant="bordered"
          borderColor="border-slate-200"
        >
          <ModalHeader>
            <ModalTitle className="text-red-700">Delete all activity data?</ModalTitle>
          </ModalHeader>

          <ModalBody className="flex flex-col gap-4">
            <p id="danger-zone-description" className="text-sm text-slate-600">
              This will permanently delete all your running activity data. This action cannot be
              undone.
            </p>

            <FieldContent>
              <FieldLabel htmlFor="dangerZoneConfirmInput_settingsPage">
                Type <span className="font-mono font-bold">DELETE</span> to confirm
              </FieldLabel>
              <Input
                id="dangerZoneConfirmInput_settingsPage"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                disabled={deleting}
                autoComplete="off"
              />
            </FieldContent>

            {deleteError && (
              <div
                id="dangerZoneError_settingsPage"
                className="flex items-center gap-1.5 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700"
                role="alert"
                aria-live="assertive"
              >
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                {deleteError}
              </div>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={closeDialog} disabled={deleting}>
              Cancel
            </Button>
            <Button
              id="dangerZoneConfirmBtn_settingsPage"
              onClick={handleConfirm}
              disabled={confirmText !== 'DELETE' || deleting}
              className="bg-red-600 hover:bg-red-700 text-white focus-visible:ring-2 focus-visible:ring-red-300"
            >
              {deleting ? 'Deleting…' : 'Delete All Data'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  )
}
