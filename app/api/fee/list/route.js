import { getListFee } from "@/lib/services/fee/getListFee";

export async function GET() {
    try {
        const feeList = await getListFee();
        return new Response(JSON.stringify({ success: true, feeList }), {
            status: 200,
            headers: {
                "Cache-Control": "no-store",
                "Content-Type": "application/json",
            },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }
}
