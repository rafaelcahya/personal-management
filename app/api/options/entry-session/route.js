import { getEntrySessionOptions } from "@/lib/options/entrySessionOptions";

export async function GET() {
    try {
        const entrySessionOptions = await getEntrySessionOptions();
        return new Response(
            JSON.stringify({ success: true, option: entrySessionOptions }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }
}
