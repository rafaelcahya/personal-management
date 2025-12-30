import { getEntryOccasionOptions } from "@/lib/options/entryOccasionOptions";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const entryOccasionOptions = await getEntryOccasionOptions();
        return (
            NextResponse.json({
                success: true,
                option: entryOccasionOptions,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        return (
            NextResponse.json({ error: err.message }),
            {
                status: 401,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
