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
import { deleteTrade } from "@/lib/api/trade";

export default function TradeDelete({ trade, onDeleted, onClose }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteTrade(trade.id);
            toast.success("Trade deleted successfully!");
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
                <Button className="bg-transparent hover:bg-rose-100 dark:hover:bg-rose-500/5 text-rose-500 font-medium">
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="font-medium">
                        Delete Trade
                    </AlertDialogTitle>
                    <AlertDialogDescription className="font-medium text-slate-500">
                        Are you sure you want to delete this trade? This action
                        cannot be undone.
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
