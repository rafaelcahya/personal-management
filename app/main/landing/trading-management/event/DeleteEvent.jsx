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
import { deleteEvent } from "@/lib/api/event";

export default function DeleteEvent({ event, onDeleted, onClose }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteEvent(event.id);
            toast.success("Event deleted successfully!");
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
                    <AlertDialogTitle>Remove Event</AlertDialogTitle>
                    <AlertDialogDescription>
                        Deleting this event will remove it from your performance
                        records permanently.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="font-medium text-secondary-foreground bg-transparent hover:bg-secondary-hover hover:text-secondary-foreground border-none">
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
