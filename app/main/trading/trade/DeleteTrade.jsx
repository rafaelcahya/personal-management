'use client'

import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import Button from '@/components/base/Button/Button'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteTrade } from '@/lib/api/trade'
import { toast } from 'sonner'

export default function DeleteTrade({ trade, onDeleted, onClose }) {
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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="text-red-600 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Trade?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this trade record from your
            trading journal.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={loading}
            className="bg-transparent hover:bg-secondary/80 text-secondary-foreground hover:text-secondary-foreground border-none"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
