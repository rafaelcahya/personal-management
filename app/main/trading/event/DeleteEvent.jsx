'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { Button } from '@/components/ui/button'
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
      <AlertDialog open={open} onOpenChange={(val) => !val && onClose?.()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              This event will be permanently removed. This action cannot be undone.
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
              className="bg-rose-600 hover:bg-rose-700 text-white font-medium"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="justify-start text-red-600 hover:text-red-600 hover:bg-red-50 font-medium"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Event
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Event?</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-600">
            This event will be permanently removed. This action cannot be undone.
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
            className="bg-rose-600 hover:bg-rose-700 text-white font-medium"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
