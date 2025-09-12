import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const LOGIN_PATH = "/auth/login";
const DASHBOARD_PATH = "/dashboard";

export async function middleware(req) {
	const token = req.cookies.get("token")?.value;
	const { pathname } = req.nextUrl;

	let user = null;

	if (token) {
		try {
			user = jwt.verify(token, process.env.JWT_SECRET);
		} catch (e) {
			// Token invalid / expired
		}
	}

	const isAuthRoute = pathname.startsWith(LOGIN_PATH);
	const isProtected =
		pathname.startsWith(DASHBOARD_PATH) || pathname.startsWith("/protected");

	if (!user && isProtected) {
		return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
	}

	if (user && isAuthRoute) {
		return NextResponse.redirect(new URL(DASHBOARD_PATH, req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
