import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getEventSummary } from "@/lib/services/event/getEventSummary";

export async function GET() {
	try {
		const supabase = await createClient();

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

		const summary = await getEventSummary(user.id);

		return NextResponse.json(
			{ success: true, event: summary },
			{ status: 200 },
		);
	} catch (err) {
		console.error("GET /api/trade/v1/event/summary error:", err);
		return NextResponse.json(
			{ success: false, error: err.message || "Internal server error" },
			{ status: 500 },
		);
	}
}
