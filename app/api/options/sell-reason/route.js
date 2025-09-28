import { getSellReasonOptions } from "@/lib/options/sellReasonOptions";

export async function GET() {
    try {
        const sellReasonOptions = await getSellReasonOptions();
        return new Response(
            JSON.stringify({ success: true, option: sellReasonOptions }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }
}
