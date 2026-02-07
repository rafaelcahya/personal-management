import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req) {
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

        const { data, error } = await supabase
            .from("product_name")
            .select("*")
            .eq("user_id", user.id)
            .order("product_name", { ascending: true });

        if (error) throw error;

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (err) {
        console.error("GET /api/inventory/v1/product-name error:", err);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 },
        );
    }
}
