"use client";

import { Button } from "@/components/ui/button";
import { LogOut, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Logout() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.replace("/login");
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    return (
        <Button
            onClick={handleLogout}
            className="font-semibold text-rose-500 bg-rose-50 dark:bg-rose-500/5 hover:bg-rose-100 dark:hover:bg-rose-500/25 bg-transparent m-2"
        >
            <LogOut />
            Logout
        </Button>
    );
}
