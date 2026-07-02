import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import Button from '@/components/base/Button/Button'
import { toast } from 'sonner'
import { deleteProductName } from '@/lib/api/productName'

export default function DeleteProductName({ productName, onDeleted, onClose, disabled = false }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteProductName(productName.id)
      toast.success('Product name deleted successfully!')
      onDeleted?.()
      onClose?.()
    } catch (err) {
      console.error(err.message || err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          id="deleteProductNameBtn_productNamePage"
          disabled={disabled}
          className="bg-transparent hover:bg-rose-100 dark:hover:bg-rose-500/5 text-rose-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-semibold">Delete Product Name</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-foreground">
            Are you sure you want to delete this product name? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent hover:bg-secondary/80 text-secondary-foreground hover:text-secondary-foreground border-none">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            id="deleteProductNameConfirmBtn_productNamePage"
            onClick={handleDelete}
            disabled={loading}
            className="bg-rose-600 hover:bg-rose-700 dark:text-white"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
