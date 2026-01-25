import { getCreateEvent } from "@/lib/services/event/getCreateEvent";
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

        const requiredFields = [
            "event_description",
            "impact_direction",
            "event_date",
        ];

        const validationErrors = [];
        requiredFields.forEach((field) => {
            if (!body[field] || body[field].toString().trim() === "") {
                validationErrors.push(
                    `${field.replaceAll("_", " ")} is required`
                );
            }
        });

        if (validationErrors.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: validationErrors,
                },
                { status: 400 }
            );
        }

        const newEvent = await getCreateEvent(
            body.event_description,
            body.impact_direction,
            body.event_date
        );

        return NextResponse.json(
            { success: true, event: newEvent },
            { status: 200 }
        );
    } catch (err) {
        console.error("POST /api/trade/create error:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 },
        );
    }
}
