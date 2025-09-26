import { NextResponse } from "next/server";
import { loginUser } from "@/lib/auth/auth";
import { SignJWT } from "jose";

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "default-secret"
);

export async function POST(req) {
    try {
        const { username, password } = await req.json();
        const user = await loginUser(username, password);

        const token = await new SignJWT({
            id: user.id,
            username: user.username,
            role: user.role,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("1d")
            .sign(secret);

        const res = NextResponse.json({ success: true, user });

        res.cookies.set("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24,
        });

        res.headers.set(
            "Set-Cookie",
            `authToken=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400${
                process.env.NODE_ENV === "production" ? "; Secure" : ""
            }`
        );

        return res;
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 401 });
    }
}
