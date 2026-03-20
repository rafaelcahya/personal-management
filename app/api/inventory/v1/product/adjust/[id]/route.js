import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateProduct } from "@/lib/services/inventory/product/updateProduct";

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

        if (!body) {
            return NextResponse.json(
                { success: false, error: "Request body is required" },
                { status: 400 },
            );
        }

        const requiredFields = ["usage_quantity", "start_usage_date"];
        const validationErrors = [];

        requiredFields.forEach((field) => {
            if (body[field] === undefined || body[field] === null) {
                validationErrors.push(
                    `${field.replaceAll("_", " ")} is required`,
                );
            }
        });

        if (body.usage_quantity !== undefined && body.usage_quantity !== null) {
            const qty = Number(body.usage_quantity);

            if (isNaN(qty)) {
                validationErrors.push("Usage quantity must be a valid number");
            } else if (qty < 0) {
                validationErrors.push("Usage quantity cannot be negative");
            } else if (qty === 0) {
                validationErrors.push(
                    "Usage quantity must be greater than 0. You need to enter a quantity to start tracking.",
                );
            } else if (!Number.isInteger(qty)) {
                validationErrors.push("Usage quantity must be a whole number");
            }
        }

        if (body.start_usage_date && isNaN(Date.parse(body.start_usage_date))) {
            validationErrors.push("Start usage date must be valid ISO date");
        }

        if (validationErrors.length > 0) {
            return NextResponse.json(
                { success: false, error: validationErrors },
                { status: 400 },
            );
        }

        const usageQty = Number(body.usage_quantity);

        const payload = {
            usage_quantity: usageQty,
            product_status: "active",
            usage_date: body.start_usage_date,
            note: body.note || null,
        };

        const updatedProduct = await updateProduct(user.id, idNum, payload);

        if (!updatedProduct) {
            return NextResponse.json(
                { success: false, error: `Product with ID ${id} not found` },
                { status: 404 },
            );
        }

        return NextResponse.json(
            {
                success: true,
                product: updatedProduct,
                message: "Product activated",
            },
            { status: 200 },
        );
    } catch (err) {
        console.error(
            "PATCH /api/inventory/v1/product/update/[id] error:",
            err,
        );

        if (err.message.includes("not found")) {
            return NextResponse.json(
                { success: false, error: err.message },
                { status: 404 },
            );
        }

        if (err.message.includes("Insufficient stock")) {
            return NextResponse.json(
                { success: false, error: err.message },
                { status: 422 },
            );
        }

        return NextResponse.json(
            { success: false, error: err.message || "Internal Server Error" },
            { status: 500 },
        );
    }
}
