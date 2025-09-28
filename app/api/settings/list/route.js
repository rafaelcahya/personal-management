import { getListSettings } from "@/lib/services/settings/getListSettings";

export async function GET() {
    try {
        const settingsList = await getListSettings();
        return new Response(JSON.stringify({ success: true, settingsList }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }
}
