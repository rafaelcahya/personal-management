import { getListTrade } from "@/lib/services/trade/getListTrade";

export async function GET() {
    try {
        const listTrade = await getListTrade();
        return new Response(
            JSON.stringify({ success: true, trade: listTrade }),
            {
                status: 200,
                headers: {
                    "Cache-Control": "no-store",
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }
}
