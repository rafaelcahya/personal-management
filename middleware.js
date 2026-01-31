import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "default-secret"
);

export async function middleware(request) {
    const token = request.cookies.get("authToken")?.value;
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/login") || pathname.startsWith("/api")) {
        return NextResponse.next();
    }

    if (pathname.startsWith("/main")) {
        if (!token) {
            console.error("No token, redirecting...");
            return NextResponse.redirect(new URL("/login", request.url));
        }

        try {
            await jwtVerify(token, secret);
        } catch (err) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/main/:path*"],
};
