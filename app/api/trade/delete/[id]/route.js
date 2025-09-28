import { getDeleteTrade } from "@/lib/services/trade/getDeleteTrade";
import { toast } from "sonner";

export async function DELETE(req, { params }) {
    try {
        const { id } = await params;
        const deletedTrade = await getDeleteTrade(id);

        return new Response(
            JSON.stringify({ success: true, trade: deletedTrade }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (err) {
        toast.error("Error deleting trade:", err);
        return new Response(
            JSON.stringify({ success: false, error: err.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
