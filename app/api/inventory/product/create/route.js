import { NextResponse } from "next/server";
import { getCreateProduct } from "../../../../../lib/services/inventory/product/getCreateProduct";

export async function POST(req) {
    try {
        let body;
        try {
            body = await req.json();
        } catch (parseError) {
            return NextResponse.json(
                { success: false, error: "Invalid JSON in request body" },
                { status: 400 }
            );
        }

        if (!body) {
            return NextResponse.json(
                { success: false, error: "Request body is required" },
                { status: 400 }
            );
        }

        // Update field names to match frontend
        const requiredFields = [
            "product_id",
            "brand_id",
            "type",
            "product_status",
            "usage_date",
        ];

        const validationErrors = [];
        requiredFields.forEach((field) => {
            if (!body[field] || body[field].toString().trim() === "") {
                validationErrors.push(
                    `${field.replaceAll("_", " ")} is required`
                );
            }
        });

        const isValidNumber = (value) =>
            /^\d+(\.\d+)?$/.test(value.toString().replace(/^-/, ""));

        if (body.usage_quantity && !isValidNumber(body.usage_quantity)) {
            validationErrors.push("usage quantity must be a valid number");
        }

        if (validationErrors.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: validationErrors,
                },
                { status: 400 }
            );
        }

        const newProduct = await getCreateProduct(
            body.product_id,
            body.brand_id,
            body.type,
            body.product_status,
            body.product_image || "",
            body.note || ""
        );

        return NextResponse.json(
            { success: true, product: newProduct },
            { status: 200 }
        );
    } catch (err) {
        console.error("POST /api/inventory/product/create error:", err);
        return NextResponse.json(
            { success: false, error: err.message || "Internal server error" },
            { status: 500 }
        );
    }
}
