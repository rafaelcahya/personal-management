import { getUpdateTrade } from "@/lib/services/trade/getUpdateTrade";

export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();

        const updateTrade = await getUpdateTrade(id, body);

        return new Response(JSON.stringify({ success: true, trade:updateTrade }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        return new Response(
            JSON.stringify({ success: false, error: err.message }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
