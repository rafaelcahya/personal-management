import { getBuyReasonOptions } from "@/lib/options/buyReasonOptions";

export async function GET() {
    try {
        const buyReasonOptions = await getBuyReasonOptions();
        return new Response(
            JSON.stringify({ success: true, option: buyReasonOptions }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }
}
