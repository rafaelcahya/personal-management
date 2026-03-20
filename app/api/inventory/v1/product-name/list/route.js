import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProductNameList } from "@/lib/services/inventory/product_name/getProductNameList";

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

        const productNamesList = await getProductNameList(user.id);

        return NextResponse.json(
            { success: true, data: productNamesList },
            { status: 200 },
        );
    } catch (err) {
        console.error("GET /api/inventory/v1/product-name error:", err);
        return NextResponse.json(
            { success: false, error: err.message || "Internal server error" },
            { status: 500 },
        );
    }
}
