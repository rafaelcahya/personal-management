import { getStockTypeOptions } from "@/lib/options/stockTypeOptions";

export async function GET() {
    try {
        const stockTypeOptions = await getStockTypeOptions();
        return new Response(
            JSON.stringify({ success: true, stockTypeOptions }),
            { status: 200 }
        );
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 401,
        });
    }
}
