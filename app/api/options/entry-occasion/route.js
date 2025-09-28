import { getEntryOccasionOptions } from "@/lib/options/entryOccasionOptions";

export async function GET() {
    try {
        const entryOccasionOptions = await getEntryOccasionOptions();
        return new Response(
            JSON.stringify({ success: true, option: entryOccasionOptions }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }
}
