import { getCreateFee } from "@/lib/services/fee/getCreateFee";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        let body;
        try {
            body = await req.json();
        } catch (parseError) {
            return NextResponse.json(
                { success: false, message: "Invalid JSON in request body" },
                { status: 400 }
            );
        }

        if (!body) {
            return NextResponse.json(
                { success: false, message: "Request body is required" },
                { status: 400 }
            );
        }

        const requiredFields = [
            "fee_name",
            "fee",
            "fee_date",
        ];

        const validationErrors = [];
        requiredFields.forEach((field) => {
            if (!body[field] || body[field].toString().trim() === "") {
                validationErrors.push(
                    `${field.replaceAll("_", " ")} is required`
                );
            }
        });

        const isValidDateFormat = (dateStr) => {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            return dateRegex.test(dateStr);
        };

        const isValidDate = (dateStr) => {
            if (!isValidDateFormat(dateStr)) {
                return false;
            }
            const date = new Date(dateStr);
            return !isNaN(date.getTime());
        };

        if (body.fee_date) {
            if (!isValidDate(body.fee_date)) {
                validationErrors.push(
                    "fee date must be valid format YYYY-MM-DD"
                );
            }
        }

        const isValidNumber = (value) =>
            /^\d+(\.\d+)?$/.test(value.replace(/^-/, ""));

        if (body.fee && !isValidNumber(body.fee)) {
            validationErrors.push("fee must be a valid number");
        }

        if (validationErrors.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: validationErrors,
                },
                { status: 400 }
            );
        }

        const newFee = await getCreateFee(
            body.fee_name,
            body.fee,
            body.fee_date
        );

        return new Response(JSON.stringify({ success: true, fee: newFee }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }
}
