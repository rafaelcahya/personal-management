import { getUpdateSettings } from "@/lib/services/settings/getUpdateSettings";

export async function PUT(req) {
    try {
        const { initial_margin, bi_risk_free_rate, personal_risk_free_rate, margin_of_error } =
            await req.json();

        const settings = await getUpdateSettings(
            initial_margin,
            bi_risk_free_rate,
            personal_risk_free_rate,
            margin_of_error
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
