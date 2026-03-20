import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProductBrandList } from "@/lib/services/inventory/product_brand/getProductBrandList";

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

        const productBrands = await getProductBrandList(user.id);

        const totalProductBrands = Array.isArray(productBrands)
            ? productBrands.length
            : 0;

        const totalStatus = (productBrands || []).reduce((acc, brand) => {
            const status = brand.brand_status;
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        return NextResponse.json({
            success: true,
            data: {
                totalProductBrands,
                totalStatus,
            },
        });
    } catch (err) {
        console.error(
            "GET /api/inventory/v1/product-brand/summary error:",
            err,
        );
        return NextResponse.json(
            { success: false, error: err?.message || "Internal Server Error" },
            { status: 500 },
        );
    }
}
