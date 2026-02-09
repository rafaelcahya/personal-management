"use client";

import { useState } from "react";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { deleteFee } from "@/lib/api/fee";
import { toast } from "sonner";

export default function DeleteFee({ fee, onDeleted, onClose }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteFee(fee.id);
            toast.success("Fee deleted successfully! 🗑️");
            onDeleted?.();
            onClose?.();
        } catch (error) {
            toast.error(error.message || "Failed to delete fee");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Fee
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Fee?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this fee record from your trading history.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        disabled={loading}
                        className="bg-transparent hover:bg-secondary-hover text-secondary-foreground hover:text-secondary-foreground border-none"
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-rose-600 hover:bg-rose-700 dark:text-white"
                    >
                        {loading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
