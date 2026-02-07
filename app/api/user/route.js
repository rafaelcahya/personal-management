import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "default-secret",
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

export async function GET(req) {
    try {
        const userId = await getUserIdFromReq(req);

        const { data, error } = await supabase
            .from("users")
            .select("id, username, nickname, avatar")
            .eq("id", userId)
            .single();

        if (error) throw error;

        if (data.avatar) {
            const { data: avatarData } = supabase.storage
                .from("avatar")
                .getPublicUrl(data.avatar);
            data.avatar = avatarData.publicUrl;
        }

        return NextResponse.json({ user: data });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 401 });
    }
}

export async function PUT(req) {
    try {
        const userId = await getUserIdFromReq(req);
        const body = await req.json();
        const { username, nickname, avatar } = body;

        const updateData = {};
        if (username) updateData.username = username;
        if (nickname) updateData.nickname = nickname;
        if (avatar) updateData.avatar = avatar;

        const { error } = await supabase
            .from("users")
            .update(updateData)
            .eq("id", userId);

        if (error) throw error;

        return NextResponse.json({ success: true, user: updateData });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}
