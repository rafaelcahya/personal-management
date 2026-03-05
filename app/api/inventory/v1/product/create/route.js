import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createProduct } from "@/lib/services/inventory/product/createProduct";

export async function POST(req) {
    try {
        const supabase = await createClient();

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: "Tidak terautentikasi" },
                { status: 401 },
            );
        }

        let body;
        try {
            body = await req.json();
        } catch (parseError) {
            return NextResponse.json(
                { success: false, error: "Invalid JSON in request body" },
                { status: 400 },
            );
        }

        if (!body) {
            return NextResponse.json(
                { success: false, error: "Request body is required" },
                { status: 400 },
            );
        }

        const requiredFields = ["product_id", "brand_id", "type"];

        const validationErrors = [];
        requiredFields.forEach((field) => {
            if (!body[field] || body[field].toString().trim() === "") {
                validationErrors.push(
                    `${field.replaceAll("_", " ")} is required`,
                );
            }
        });

        if (validationErrors.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: validationErrors,
                },
                { status: 400 },
            );
        }

        const payload = {
            product_id: parseInt(body.product_id),
            brand_id: parseInt(body.brand_id),
            type: body.type,
            usage_quantity: parseInt(body.usage_quantity) || 0,
            product_image: body.product_image || "",
            note: body.note || "",
        };

        const newProduct = await createProduct(user.id, payload);

        return NextResponse.json(
            { success: true, product: newProduct },
            { status: 200 },
        );
    } catch (err) {
        console.error("POST /api/inventory/v1/product/create error:", err);
        return NextResponse.json(
            { success: false, error: err.message || "Internal server error" },
            { status: 500 },
        );
    }
}
