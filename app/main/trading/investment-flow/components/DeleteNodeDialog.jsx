'use client'

import { useState } from 'react'
import { Loader2, TriangleAlert } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalHeaderContent,
  ModalIcon,
  ModalTitle,
} from '@/components/base/Modal/Modal'

export default function DeleteNodeDialog({ open, onOpenChange, node, onConfirm }) {
  const [loading, setLoading] = useState(false)

  if (!node) return null

  const isCategory = node.node_type === 'category'
  const hasChildren = (node.children?.length ?? 0) > 0

  const handleConfirm = async () => {
    setLoading(true)
    try {
      const success = await onConfirm(node.id)
      if (success) onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="sm" showCloseButton={false} id="deleteNodeDialog_investmentFlowPage">
        <ModalHeader layout="beside">
          <ModalIcon
            icon={TriangleAlert}
            className="bg-destructive/10"
            iconClassName="text-destructive"
          />
          <ModalHeaderContent>
            <ModalTitle>Delete {node.name}?</ModalTitle>
            <ModalDescription>
              {isCategory && hasChildren
                ? 'This will permanently delete this category and all nodes inside it. This cannot be undone.'
                : 'This action cannot be undone.'}
            </ModalDescription>
          </ModalHeaderContent>
        </ModalHeader>
        <ModalFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            id="deleteNodeCancelBtn_investmentFlowPage"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
            id="deleteNodeConfirmBtn_investmentFlowPage"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
