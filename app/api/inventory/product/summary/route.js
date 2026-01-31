import { NextResponse } from "next/server";
import { getProductList } from "@/lib/services/inventory/product/getProductList";

export async function GET() {
    try {
        const products = await getProductList();

        if (!Array.isArray(products)) {
            return NextResponse.json({
                success: true,
                data: {
                    totalProducts: 0,
                    activeProducts: 0,
                    inactiveProducts: 0,
                    totalQuantity: 0,
                    totalUsageQuantity: 0,
                    favoriteProducts: 0,
                },
            });
        }

        const summary = products.reduce(
            (acc, product) => {
                acc.totalProducts += 1;

                if (product.product_status === "active") {
                    acc.activeProducts += 1;
                } else if (product.product_status === "inactive") {
                    acc.inactiveProducts += 1;
                }

                acc.totalQuantity += Number(product.quantity) || 0;
                acc.totalUsageQuantity += Number(product.usage_quantity) || 0;

                if (product.is_favorite) {
                    acc.favoriteProducts += 1;
                }

                return acc;
            },
            {
                totalProducts: 0,
                activeProducts: 0,
                inactiveProducts: 0,
                totalQuantity: 0,
                totalUsageQuantity: 0,
                favoriteProducts: 0,
            },
        );

        return NextResponse.json({
            success: true,
            data: summary,
        });
    } catch (err) {
        console.error("GET /api/inventory/product/summary error:", err);
        return NextResponse.json(
            { success: false, error: err?.message || "Internal Server Error" },
            { status: 500 },
        );
    }
}
