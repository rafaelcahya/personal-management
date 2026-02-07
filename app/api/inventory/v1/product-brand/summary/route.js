import { NextResponse } from "next/server";
import { getProductBrandList } from "@/lib/services/inventory/product/brand/getProductBrandList";

export async function GET() {
    try {
        const productBrands = await getProductBrandList();

        const totalProductBrands = Array.isArray(productBrands)
            ? productBrands.length
            : 0;

        const totalStatus = productBrands.reduce((acc, totalProductBrand) => {
            const type = totalProductBrand.brand_status;
            acc[type] = (acc[type] || 0) + 1;
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
        return NextResponse.json(
            { success: false, error: err?.message || String(err) },
            { status: 500 }
        );
    }
}
