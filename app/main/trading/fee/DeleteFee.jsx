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
import { deleteFee } from "../../../../../lib/api/fee";

export default function DeleteFee({ fee, onDeleted, onClose }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteFee(fee.id);
            toast.success("Fee deleted successfully!");
            onDeleted?.();
            onClose?.();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="font-medium bg-transparent hover:bg-rose-100 dark:hover:bg-rose-500/5 text-rose-500">
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader className="font-medium">
                    <AlertDialogTitle>Delete Fee</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this fee? This action
                        cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="font-medium hover:bg-secondary-hover hover:text-secondary-foreground text-secondary-foreground border-none">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={loading}
                        className="font-medium bg-rose-600 hover:bg-rose-700 dark:text-white"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
