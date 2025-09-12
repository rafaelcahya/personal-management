import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "default-secret"
);

export async function middleware(request) {
    const token = request.cookies.get("authToken")?.value;
    const { pathname } = request.nextUrl;

    // console.log("🔑 Middleware token:", token);

    if (pathname.startsWith("/auth") || pathname.startsWith("/api")) {
        return NextResponse.next();
    }

    if (pathname.startsWith("/main")) {
        if (!token) {
            console.log("❌ No token, redirecting...");
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }

        try {
            await jwtVerify(token, secret);
            // console.log("✅ Token valid");
        } catch (err) {
            // console.log("❌ Invalid token:", err.message);
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/main/:path*"],
};
