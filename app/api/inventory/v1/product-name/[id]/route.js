import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSingleProductName } from "@/lib/services/inventory/product_name/getSingleProductName";

export async function GET(req, { params }) {
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

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Product Name ID is required" },
                { status: 400 },
            );
        }

        const idNum = Number(id);
        if (isNaN(idNum)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Product Name ID must be a valid number",
                },
                { status: 400 },
            );
        }

        if (!Number.isInteger(idNum)) {
            return NextResponse.json(
                { success: false, error: "Product Name ID must be an integer" },
                { status: 400 },
            );
        }

        if (idNum <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Product Name ID must be a positive integer",
                },
                { status: 400 },
            );
        }

        const productName = await getSingleProductName(
            user.id,
            idNum.toString(),
        );

        if (!productName) {
            return NextResponse.json(
                { success: false, error: "Product Name not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(
            { success: true, data: productName },
            { status: 200 },
        );
    } catch (err) {
        console.error("GET /api/inventory/v1/product-name/[id] error:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 },
        );
    }
}
