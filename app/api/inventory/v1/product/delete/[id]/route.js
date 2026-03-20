import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deleteProduct } from "@/lib/services/inventory/product/deleteProduct";

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

        const idNum = Number(id);

        if (!id || isNaN(idNum)) {
            return NextResponse.json(
                { success: false, error: "Product ID must be a valid number" },
                { status: 400 },
            );
        }

        if (!Number.isInteger(idNum)) {
            return NextResponse.json(
                { success: false, error: "Product ID must be an integer" },
                { status: 400 },
            );
        }

        if (idNum <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Product ID must be a positive integer",
                },
                { status: 400 },
            );
        }

        const deletedProduct = await deleteProduct(user.id, idNum);

        return NextResponse.json(
            {
                success: true,
                data: deletedProduct,
                message: "Product deleted successfully",
            },
            { status: 200 },
        );
    } catch (err) {
        console.error("DELETE product error:", err);

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
