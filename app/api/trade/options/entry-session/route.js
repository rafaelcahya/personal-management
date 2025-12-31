import { getEntrySessionOptions } from "@/lib/options/entrySessionOptions";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const entrySessionOptions = await getEntrySessionOptions();
        return NextResponse.json(
            {
                success: true,
                option: entrySessionOptions,
            },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 401 });
    }
}
