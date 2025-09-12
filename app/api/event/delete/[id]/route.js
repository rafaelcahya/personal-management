import { getDeleteEvent } from "@/lib/services/event/getDeleteEvent";
import { toast } from "sonner";

export async function DELETE(req, { params }) {
    try {
        const { id } = await params;

        const deletedEvent = await getDeleteEvent(id);

        return new Response(JSON.stringify({ success: true, deletedEvent }), {
            status: 200,
        });
    } catch (err) {
        toast.error("Error deleting fee:", err);
        return new Response(
            JSON.stringify({ success: false, error: err.message }),
            { status: 500 }
        );
    }
}
