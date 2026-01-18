import { NextResponse } from "next/server";
import { getUpdateProduct } from "@/lib/services/inventory/product/getUpdateProduct";

export async function PATCH(req, { params }) {
    try {
        const { id } = await params;

        // Validate ID
        if (!id || isNaN(Number(id))) {
            return NextResponse.json(
                { success: false, error: "Invalid product ID provided" },
                { status: 400 }
            );
        }

        // Parse body
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

        // Validate required fields
        const requiredFields = ["usage_quantity", "usage_date"];
        const validationErrors = [];

        requiredFields.forEach((field) => {
            if (body[field] === undefined || body[field] === null) {
                validationErrors.push(
                    `${field.replaceAll("_", " ")} is required`
                );
            }
        });

        // Validate qty
        if (body.usage_quantity !== undefined) {
            const qty = Number(body.usage_quantity);
            if (isNaN(qty) || qty < 0) {
                validationErrors.push(
                    "usage quantity must be 0 or positive number"
                );
            }
        }

        // Validate date
        if (body.usage_date && isNaN(Date.parse(body.usage_date))) {
            validationErrors.push("usage date must be valid ISO date");
        }

        if (validationErrors.length > 0) {
            return NextResponse.json(
                { success: false, error: validationErrors },
                { status: 400 }
            );
        }

        // Auto-calculate status & date field
        const usageQty = Number(body.usage_quantity);
        const newStatus = usageQty > 0 ? "active" : "inactive";

        // Prepare payload
        const payload = {
            usage_quantity: usageQty,
            product_status: newStatus,
            usage_date: body.usage_date,
            note: body.note || null,
        };

        // Update via service
        const updatedProduct = await getUpdateProduct(Number(id), payload);

        if (!updatedProduct) {
            return NextResponse.json(
                { success: false, error: `Product with ID ${id} not found` },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                product: updatedProduct,
                message:
                    usageQty > 0
                        ? "Product activated"
                        : "roduct marked as out of stock",
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("PATCH /api/inventory/product/update/[id] error:", err);
        return NextResponse.json(
            { success: false, error: err.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
