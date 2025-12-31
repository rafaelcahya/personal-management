import { NextResponse } from "next/server";
import { getUpdateProduct } from "@/lib/services/inventory/product/getUpdateProduct";

export async function PUT(req, { params }) {
    try {
        const { id } = await params;

        if (!id || isNaN(Number(id))) {
            return NextResponse.json(
                { success: false, error: "Invalid product ID provided" },
                { status: 400 }
            );
        }

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

        const requiredFields = [
            "product",
            "brand",
            "type",
            "product_status",
            "quantity",
            "on_hand_quantity",
            "product_image",
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
            /^\d+(\.\d+)?$/.test(value.replace(/^-/, ""));

        if (body.quantity && !isValidNumber(body.quantity)) {
            validationErrors.push("quantity must be a valid number");
        }

        if (body.on_hand_quantity && !isValidNumber(body.on_hand_quantity)) {
            validationErrors.push("on hand quantity must be a valid number");
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

        const updateProduct = await getUpdateProduct(Number(id), body);

        if (!updateProduct) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Product with ID ${id} not found`,
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                product: updateProduct,
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("PUT /api/inventory/product/update error:", err);
        return NextResponse.json(
            {
                success: false,
                error: "Internal Server Error",
            },
            { status: 500 }
        );
    }
}
