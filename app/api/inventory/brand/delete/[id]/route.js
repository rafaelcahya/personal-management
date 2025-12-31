import { NextResponse } from "next/server";
import { getDeleteBrand } from "@/lib/services/inventory/brand/getDeleteBrand";

export async function DELETE(req, { params }) {
    try {
        const { id } = await params;

        if (!id || isNaN(Number(id))) {
            return NextResponse.json(
                { success: false, error: "Invalid brand ID provided" },
                { status: 400 }
            );
        }

        const deletedBrand = await getDeleteBrand(id);

        if (!deletedBrand) {
            return NextResponse.json(
                { success: false, error: "Brand not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        console.error("DELETE /api/inventory/brand/delete error:", err);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
