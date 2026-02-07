import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deleteProductName } from "@/lib/services/inventory/product/name/deleteProductName";

export async function DELETE(req, { params }) {
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

        const { id } = await params;

        if (!id || isNaN(Number(id))) {
            return NextResponse.json(
                { success: false, error: "Invalid product name ID" },
                { status: 400 },
            );
        }

        const deletedProductName = await deleteProductName(Number(id), user.id);

        return NextResponse.json(
            { success: true, productName: deletedProductName },
            { status: 200 },
        );
    } catch (err) {
        console.error(
            "DELETE /api/inventory/v1/product-name/delete error:",
            err,
        );

        if (
            err.message.includes("not found") ||
            err.message.includes("unauthorized")
        ) {
            return NextResponse.json(
                { success: false, error: err.message },
                { status: 404 },
            );
        }

        return NextResponse.json(
            { success: false, error: err.message || "Internal server error" },
            { status: 500 },
        );
    }
}
