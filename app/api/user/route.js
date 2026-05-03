import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "UNAUTHORIZED", message: "Authentication required" },
                { status: 401 },
            );
        }

        const { data, error } = await supabase
            .from("users")
            .select("id, username, nickname, avatar")
            .eq("id", user.id)
            .single();

        if (error) throw error;

        if (data.avatar) {
            const { data: avatarData } = supabase.storage
                .from("avatar")
                .getPublicUrl(data.avatar);
            data.avatar = avatarData.publicUrl;
        }

        return NextResponse.json({ data: { user: data }, message: "User fetched successfully" });
    } catch (err) {
        return NextResponse.json(
            { error: "INTERNAL_ERROR", message: err.message },
            { status: 500 },
        );
    }
}

export async function PUT(req) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "UNAUTHORIZED", message: "Authentication required" },
                { status: 401 },
            );
        }

        const body = await req.json();
        const { username, nickname, avatar } = body;

        const updateData = {};
        if (username) updateData.username = username;
        if (nickname) updateData.nickname = nickname;
        if (avatar) updateData.avatar = avatar;

        const { error } = await supabase
            .from("users")
            .update(updateData)
            .eq("id", user.id);

        if (error) throw error;

        return NextResponse.json({ data: { user: updateData }, message: "User updated successfully" });
    } catch (err) {
        return NextResponse.json(
            { error: "INTERNAL_ERROR", message: err.message },
            { status: 500 },
        );
    }
}
