import { getCreateTrade } from "@/lib/services/trade/getCreateTrade";
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
                    message: validationErrors,
                },
                { status: 400 }
            );
        }

        const newTrade = await getCreateTrade(
            body.trade_date,
            body.ticker,
            body.margin,
            body.proceeds,
            body.return_percent,
            body.realized_gain,
            body.stock_type_option,
            body.entry_session_option,
            body.entry_occasion_option,
            body.sell_reason_option,
            body.buy_reason_option,
            body.notes
        );

        return NextResponse.json(
            { success: true, trade: newTrade },
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (err) {
        return NextResponse.json(
            { success: false, error: err.message },
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
