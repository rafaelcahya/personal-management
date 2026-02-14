import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { upsertSettings } from "@/lib/services/trade/settings/upsertSettings";

export async function PUT(request) {
    try {
        const supabase = await createClient();

        // Get authenticated user
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 },
            );
        }

        // Parse request body
        const body = await request.json();

        // Validate required fields
        const {
            initial_margin,
            bi_risk_free_rate,
            personal_risk_free_rate,
            margin_of_error,
        } = body;

        // Convert strings to numbers
        const settingsData = {
            initial_margin: parseFloat(initial_margin) || 0,
            bi_risk_free_rate: parseFloat(bi_risk_free_rate) || 0,
            personal_risk_free_rate: parseFloat(personal_risk_free_rate) || 0,
            margin_of_error: parseFloat(margin_of_error) || 10,
        };

        // Validate numeric values
        if (settingsData.initial_margin < 0) {
            return NextResponse.json(
                { success: false, error: "Initial margin cannot be negative" },
                { status: 400 },
            );
        }

        if (
            settingsData.bi_risk_free_rate < 0 ||
            settingsData.bi_risk_free_rate > 100
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: "BI risk free rate must be between 0-100",
                },
                { status: 400 },
            );
        }

        if (
            settingsData.personal_risk_free_rate < 0 ||
            settingsData.personal_risk_free_rate > 100
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Personal risk free rate must be between 0-100",
                },
                { status: 400 },
            );
        }

        if (
            settingsData.margin_of_error < 0 ||
            settingsData.margin_of_error > 100
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Margin of error must be between 0-100",
                },
                { status: 400 },
            );
        }

        // Upsert settings (insert or update)
        const updatedSettings = await upsertSettings(user.id, settingsData);

        return NextResponse.json(
            {
                success: true,
                settings: updatedSettings,
                message: "Settings updated successfully",
            },
            { status: 200 },
        );
    } catch (err) {
        console.error("PUT /api/trade/settings/update error:", err);
        return NextResponse.json(
            {
                success: false,
                error: err.message || "Internal server error",
            },
            { status: 500 },
        );
    }
}
