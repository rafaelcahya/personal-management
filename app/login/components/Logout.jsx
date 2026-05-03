"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function LogoutButton({ size = "sm" }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        sessionStorage.setItem("intentional_logout", "true");

        try {
            const res = await fetch("/api/auth/logout", { method: "POST" });
            if (!res.ok) throw new Error("Logout failed");
            router.push("/login");
            router.refresh();
        } catch {
            sessionStorage.removeItem("intentional_logout");
            toast.error("Couldn't sign you out — please try again.");
            setLoading(false);
        }
    };

    return (
        <Button
            id="logoutBtn"
            onClick={handleLogout}
            disabled={loading}
            variant="outline"
            size={size}
            className="border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 gap-2"
            aria-label="Sign out from application"
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
                <LogOut className="h-4 w-4" aria-hidden="true" />
            )}
            {loading ? "Signing out..." : "Sign out"}
        </Button>
    );
}
