import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
    const path = request.nextUrl.pathname;

    const cypressAuthCookie = request.cookies.get("cypress-bypass")?.value;
    const expectedSecret = process.env.CYPRESS_AUTH_SECRET;

    console.log("=== MIDDLEWARE DEBUG ===");
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("Path:", path);
    console.log("Cookie 'cypress-bypass':", cypressAuthCookie || "NOT FOUND");
    console.log("Expected secret:", expectedSecret || "NOT SET");

    if (
        process.env.NODE_ENV !== "production" &&
        cypressAuthCookie &&
        expectedSecret &&
        cypressAuthCookie === expectedSecret
    ) {
        console.log("✅ CYPRESS BYPASS ACTIVE - Skipping auth");
        return NextResponse.next();
    }

    console.log("⚠️  Bypass not active - running normal auth flow");

    // ============ SKIP AUTH ROUTES ============
    if (
        path.startsWith("/auth/callback") ||
        path.startsWith("/login") ||
        path.startsWith("/_next") ||
        path.startsWith("/api/auth")
    ) {
        return NextResponse.next();
    }

    // ============ SUPABASE AUTH CHECK ============
    let response = NextResponse.next({
        request: { headers: request.headers },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name) {
                    return request.cookies.get(name)?.value;
                },
                set(name, value, options) {
                    request.cookies.set({ name, value, ...options });
                    response = NextResponse.next({
                        request: { headers: request.headers },
                    });
                    response.cookies.set({ name, value, ...options });
                },
                remove(name, options) {
                    request.cookies.set({ name, value: "", ...options });
                    response = NextResponse.next({
                        request: { headers: request.headers },
                    });
                    response.cookies.set({ name, value: "", ...options });
                },
            },
        },
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    console.log("User authenticated:", !!user);

    if (!user && path !== "/login") {
        console.log("❌ No user - redirecting to /login");
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (user && path === "/login") {
        console.log("✅ User exists - redirecting to /main/landing");
        return NextResponse.redirect(new URL("/main/landing", request.url));
    }

    return response;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
