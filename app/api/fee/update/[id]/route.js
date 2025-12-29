import { getUpdateFee } from "@/lib/services/fee/getUpdateFee";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
    try {
        const { id } = await params;

        if (!id || isNaN(Number(id))) {
            return NextResponse.json(
                { success: false, message: "Invalid trade ID provided" },
                { status: 400 }
            );
        }

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

        const requiredFields = ["fee_name", "fee", "fee_date"];

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

        const updateFee = await getUpdateFee(id, body);

        return new Response(JSON.stringify({ success: true, fee: updateFee }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        return new Response(
            JSON.stringify({ success: false, error: err.message }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
