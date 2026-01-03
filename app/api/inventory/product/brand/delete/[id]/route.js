import { NextResponse } from "next/server";
import { getDeleteProductBrand } from "@/lib/services/inventory/product/brand/getDeleteProductBrand";

export async function DELETE(req, { params }) {
    try {
        const { id } = await params;

        if (!id || isNaN(Number(id))) {
            return NextResponse.json(
                { success: false, error: "Invalid product brand ID provided" },
                { status: 400 }
            );
        }

        const deletedProductBrand = await getDeleteProductBrand(id);

        if (!deletedProductBrand) {
            return NextResponse.json(
                { success: false, error: "Product brand not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, data: deletedProductBrand },
            { status: 200 }
        );
    } catch (err) {
        console.error("DELETE /api/inventory/product/brand/delete error:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}
