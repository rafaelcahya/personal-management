import { getStockTypeOptions } from "@/lib/options/stockTypeOptions";

export async function GET() {
    try {
        const stockTypeOptions = await getStockTypeOptions();
        return new Response(
            JSON.stringify({ success: true, option: stockTypeOptions }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }
}
