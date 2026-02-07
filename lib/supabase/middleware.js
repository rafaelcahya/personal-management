import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
    const path = request.nextUrl.pathname;

    console.log("🔷 Middleware hit:", path);

    // Skip middleware untuk auth routes
    if (
        path.startsWith("/auth/callback") ||
        path.startsWith("/login") ||
        path.startsWith("/_next") ||
        path.startsWith("/api/auth")
    ) {
        console.log("⏭️  Skipping middleware for:", path);
        return NextResponse.next();
    }

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
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
    console.log("👤 User in middleware:", user ? user.email : "Not logged in");

    // Redirect unauthenticated users to login
    if (!user && path !== "/login") {
        console.log("🚫 No user, redirecting to /login");
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Redirect authenticated users away from login page
    if (user && path === "/login") {
        console.log("✅ User exists, redirecting to /main/landing");
        return NextResponse.redirect(new URL("/main/landing", request.url));
    }

    return response;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
