import { NextResponse } from "next/server";
import { getUpdateTrade } from "@/lib/services/trade/getUpdateTrade";

export async function PUT(req, { params }) {
    try {
        const { id } = await params;

        if (!id || isNaN(Number(id))) {
            return NextResponse.json(
                { success: false, error: "Invalid trade ID provided" },
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
            "trade_date",
            "ticker",
            "margin",
            "proceeds",
            "return_percent",
            "realized_gain",
            "stock_type_option",
            "entry_session_option",
            "entry_occasion_option",
            "buy_reason_option",
            "sell_reason_option",
        ];

        const validationErrors = [];
        requiredFields.forEach((field) => {
            if (!body[field] || body[field].toString().trim() === "") {
                validationErrors.push(
                    `${field.replaceAll("_", " ")} is required`
                );
            }
        });

        const isValidTicker = (ticker) => /^[a-zA-Z0-9]+$/.test(ticker);

        const isValidNumber = (value) =>
            /^\d+(\.\d+)?$/.test(value.replace(/^-/, ""));

        if (body.ticker && !isValidTicker(body.ticker)) {
            validationErrors.push(
                "ticker can only contain letters and numbers (A-Z, a-z, 0-9)"
            );
        }

        if (body.margin && !isValidNumber(body.margin)) {
            validationErrors.push("margin must be a valid number");
        }

        if (body.proceeds && !isValidNumber(body.proceeds)) {
            validationErrors.push("proceeds must be a valid number");
        }

        if (
            body.return_percent &&
            !isValidNumber(body.return_percent.replace("%", ""))
        ) {
            validationErrors.push(
                "return percent must be a valid number (with or without %)"
            );
        }

        if (body.realized_gain && !isValidNumber(body.realized_gain)) {
            validationErrors.push("realized gain must be a valid number");
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

        const updateTrade = await getUpdateTrade(Number(id), body);

        if (!updateTrade) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Trade with ID ${id} not found`,
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                trade: updateTrade,
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("PUT /api/trade/update error:", err);
        return NextResponse.json(
            {
                success: false,
                error: "Internal Server Error",
            },
            { status: 500 }
        );
    }
}
