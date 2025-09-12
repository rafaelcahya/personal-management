import { getDeleteTrade } from "@/lib/trade/services/getDeleteTrade";
import { toast } from "sonner";

export async function DELETE(req, { params }) {
    try {
        const { id } = params;
        const deletedTrade = await getDeleteTrade(id);

        return new Response(JSON.stringify({ success: true, deletedTrade }), {
            status: 200,
        });
    } catch (err) {
        toast.error("Error deleting trade:", err);
        return new Response(
            JSON.stringify({ success: false, error: err.message }),
            { status: 500 }
        );
    }
}
