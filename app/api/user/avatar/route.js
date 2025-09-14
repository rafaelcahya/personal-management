import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "default-secret"
);

async function getUserIdFromReq(req) {
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith("authToken="))
        ?.split("=")[1];

    if (!token) throw new Error("No token");

    const { payload } = await jwtVerify(token, secret);
    return payload.sub || payload.id;
}

export async function POST(req) {
    try {
        const userId = await getUserIdFromReq(req);

        const formData = await req.formData();
        const file = formData.get("file");
        if (!file) throw new Error("No file provided");

        const fileExt = file.name.split(".").pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from("avatar")
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("avatar").getPublicUrl(filePath);

        return NextResponse.json({ path: filePath });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
