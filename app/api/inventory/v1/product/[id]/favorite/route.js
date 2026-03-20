import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { favoriteProduct } from "@/lib/services/inventory/product/favoriteProduct";

export async function PATCH(req, { params }) {
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

        let body;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json(
                { success: false, error: "Invalid JSON in request body" },
                { status: 400 },
            );
        }

        const { isFavorite } = body;

        if (isFavorite === undefined || isFavorite === null) {
            return NextResponse.json(
                { success: false, error: "isFavorite is required" },
                { status: 400 },
            );
        }

        if (typeof isFavorite !== "boolean") {
            return NextResponse.json(
                { success: false, error: "isFavorite must be a boolean" },
                { status: 400 },
            );
        }

        const updatedProduct = await favoriteProduct(
            user.id,
            idNum,
            isFavorite,
        );

        return NextResponse.json(
            { success: true, data: updatedProduct },
            { status: 200 },
        );
    } catch (err) {
        console.error(
            "PATCH /api/inventory/v1/product/[id]/favorite error:",
            err,
        );

        if (err.message.includes("not found")) {
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
