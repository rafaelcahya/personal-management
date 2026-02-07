import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "default-secret",
);

export async function POST(req) {
    try {
        const cookieHeader = req.headers.get("cookie") || "";
        const token = cookieHeader
            .split(";")
            .map((c) => c.trim())
            .find((c) => c.startsWith("authToken="))
            ?.split("=")[1];

        if (!token)
            return NextResponse.json({ error: "No token" }, { status: 401 });

        const { payload } = await jwtVerify(token, secret);
        const userId = payload.sub || payload.id;
        if (!userId)
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 401 },
            );

        const formData = await req.formData();
        const file = formData.get("file");
        if (!file)
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 },
            );

        const fileExt = file.name.split(".").pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from("avatar")
            .upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("avatar").getPublicUrl(filePath);

        return NextResponse.json({ publicUrl: data.publicUrl });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
