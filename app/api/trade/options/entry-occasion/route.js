import { getEntryOccasionOptions } from "@/lib/options/entryOccasionOptions";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const entryOccasionOptions = await getEntryOccasionOptions();
        return NextResponse.json(
            {
                success: true,
                options: Array.isArray(entryOccasionOptions)
                    ? entryOccasionOptions
                    : [],
            },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 401 });
    }
}
