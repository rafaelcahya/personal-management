"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CatchAll() {
	const router = useRouter();

	useEffect(() => {
		const user = localStorage.getItem("user");
		if (!user) {
			router.replace("/auth/login");
			localStorage.removeItem("user");
			return;
		}

		router.replace("/auth/login");
		toast.error("Session expired");
		localStorage.removeItem("user");
	}, [router]);

	return null;
}
