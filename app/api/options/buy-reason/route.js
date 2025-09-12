import { getBuyReasonOptions } from "@/lib/options/buyReasonOptions";

export async function GET() {
    try {
        const buyReasonOptions = await getBuyReasonOptions();
        return new Response(
            JSON.stringify({ success: true, buyReasonOptions }),
            { status: 200 }
        );
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 401,
        });
    }
}
