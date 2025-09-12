import { getEntryOccasionOptions } from "@/lib/options/entryOccasionOptions";

export async function GET() {
    try {
        const entryOccasionOptions = await getEntryOccasionOptions();
        return new Response(
            JSON.stringify({ success: true, entryOccasionOptions }),
            { status: 200 }
        );
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 401,
        });
    }
}
