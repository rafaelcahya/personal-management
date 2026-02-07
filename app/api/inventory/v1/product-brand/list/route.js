import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProductBrandList } from "@/lib/services/inventory/product/brand/getProductBrandList";

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

        const productBrandList = await getProductBrandList(user.id);

        return NextResponse.json(
            { success: true, data: productBrandList },
            { status: 200 },
        );
    } catch (err) {
        console.error("GET /api/inventory/v1/product-brand error:", err);
        return NextResponse.json(
            { success: false, error: err.message || "Internal server error" },
            { status: 500 },
        );
    }
}
