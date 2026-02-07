import { NextResponse } from "next/server";
import { getProductNameList } from "@/lib/services/inventory/product/name/getProductNameList";

export async function GET() {
    try {
        const productNames = await getProductNameList();

        const totalProductNames = Array.isArray(productNames)
            ? productNames.length
            : 0;

        const totalStatus = productNames.reduce((acc, totalProductName) => {
            const type = totalProductName.product_name_status;
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});

        return NextResponse.json({
            success: true,
            data: {
                totalProductNames,
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
