import { getUpdateSettings } from "@/lib/services/settings/getUpdateSettings";
import { NextResponse } from "next/server";

export async function PUT(req) {
    try {
        const {
            initial_margin,
            bi_risk_free_rate,
            personal_risk_free_rate,
            margin_of_error,
        } = await req.json();

        const settings = await getUpdateSettings(
            initial_margin,
            bi_risk_free_rate,
            personal_risk_free_rate,
            margin_of_error
        );

        return (
            NextResponse.json({ success: true, settings }),
            { status: 200 }
        );
    } catch (err) {
        return (
            NextResponse.json({ error: err.message }),
            { status: 401 }
        );
    }
}
