import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Test query
        const { data, error } = await supabaseAdmin
            .from("product_history")
            .select("*")
            .limit(5);

        return NextResponse.json({
            success: !error,
            count: data?.length || 0,
            data,
            error: error?.message,
        });
    } catch (err) {
        return NextResponse.json({
            success: false,
            error: err.message,
        });
    }
}
