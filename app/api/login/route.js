import { loginUser } from "@/lib/auth/auth";

export async function POST(req) {
	try {
		const { username, password } = await req.json();
		const user = await loginUser(username, password);

		return new Response(JSON.stringify({ success: true, user }), { status: 200 });
	} catch (err) {
		return new Response(JSON.stringify({ error: err.message }), { status: 401 });
	}
}
