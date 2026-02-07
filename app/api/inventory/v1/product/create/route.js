import { NextResponse } from "next/server";
import { createProduct } from "@/lib/services/inventory/product/createProduct";

export async function POST(req) {
    try {
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

        // Required fields validation
        const requiredFields = [
            "product_id",
            "brand_id",
            "type",
            "product_status",
        ];

        const validationErrors = [];
        requiredFields.forEach((field) => {
            if (!body[field] || body[field].toString().trim() === "") {
                validationErrors.push(
                    `${field.replaceAll("_", " ")} is required`,
                );
            }
        });

        const isValidNumber = (value) =>
            /^\d+(\.\d+)?$/.test(value.toString().replace(/^-/, ""));

        if (
            body.usage_quantity !== undefined &&
            !isValidNumber(body.usage_quantity)
        ) {
            validationErrors.push("usage quantity must be a valid number");
        }

        if (validationErrors.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: validationErrors,
                },
                { status: 400 },
            );
        }

        // Prepare payload with all fields
        const payload = {
            product_id: body.product_id,
            brand_id: body.brand_id,
            type: body.type,
            product_status: body.product_status,
            usage_quantity: body.usage_quantity || 0,
            product_image: body.product_image || "",
            note: body.note || "",
            usage_date: body.usage_date || new Date().toISOString(),
        };

        const newProduct = await createProduct(payload);

        return NextResponse.json(
            { success: true, product: newProduct },
            { status: 200 },
        );
    } catch (err) {
        console.error("POST /api/inventory/product/create error:", err);
        return NextResponse.json(
            { success: false, error: err.message || "Internal server error" },
            { status: 500 },
        );
    }
}
