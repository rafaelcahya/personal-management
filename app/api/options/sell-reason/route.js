import { getSellReasonOptions } from "@/lib/options/sellReasonOptions";

export async function GET() {
    try {
        const sellReasonOptions = await getSellReasonOptions();
        return new Response(
            JSON.stringify({ success: true, sellReasonOptions }),
            { status: 200 }
        );
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 401,
        });
    }
}
