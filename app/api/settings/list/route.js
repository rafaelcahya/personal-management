import { getListSettings } from "@/lib/services/settings/getListSettings";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const settingsList = await getListSettings();
        return (
            NextResponse.json({ success: true, settingsList }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
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
