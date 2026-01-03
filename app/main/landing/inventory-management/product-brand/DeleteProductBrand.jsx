import { useState } from "react";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteProductBrand } from "@/lib/api/productBrand";

export default function ProductBrandDelete({
    productBrand,
    onDeleted,
    onClose,
}) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteProductBrand(productBrand.id);
            toast.success("Product brand deleted successfully!");
            onDeleted?.();
            onClose?.();
        } catch (err) {
            toast.error(err.message || err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="bg-transparent hover:bg-rose-100 dark:hover:bg-rose-500/5 text-rose-500 font-medium">
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="font-semibold">
                        Delete Product Brand
                    </AlertDialogTitle>
                    <AlertDialogDescription className="font-medium text-gray-foreground">
                        Are you sure you want to delete this product brand? This
                        action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="font-medium bg-transparent hover:bg-secondary-hover text-secondary-foreground hover:text-secondary-foreground border-none">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-rose-600 hover:bg-rose-700 dark:text-white font-medium"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
