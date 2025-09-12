import { getUpdateSettings } from "@/lib/services/settings/getUpdateSettings";

export async function PUT(req) {
    try {
        const { initial_margin, bi_risk_free_rate, personal_risk_free_rate } =
            await req.json();

        const settings = await getUpdateSettings(
            initial_margin,
            bi_risk_free_rate,
            personal_risk_free_rate
        );

        return new Response(JSON.stringify({ success: true, settings }), {
            status: 200,
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 401,
        });
    }
}
