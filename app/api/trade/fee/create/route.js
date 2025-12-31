import { getCreateFee } from "@/lib/services/fee/getCreateFee";
import { NextResponse } from "next/server";

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

        const requiredFields = ["fee_name", "fee", "fee_date"];
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

        if (body.fee && !isValidNumber(body.fee)) {
            validationErrors.push("fee must be a valid number");
        }

        if (validationErrors.length > 0) {
            return NextResponse.json(
                { success: false, error: validationErrors },
                { status: 400 }
            );
        }

        const newFee = await getCreateFee(
            body.fee_name,
            body.fee,
            body.fee_date
        );

        return NextResponse.json(
            { success: true, fee: newFee },
            { status: 200 }
        );
    } catch (err) {
        console.error("POST /api/trade/fee/create error:", err);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
