"use client";

import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Logout() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.replace("/auth/login");
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    return (
        <Button
            onClick={handleLogout}
            className="bg-violet-600 hover:bg-violet-700 text-white hover:text-white"
        >
            <LogOutIcon/>
            Logout
        </Button>
    );
}
