"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function LogoutButton() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signOut();

        if (error) {
            toast.error("Failed to logout");
            setLoading(false);
            return;
        }

        router.push("/login");
        router.refresh();
    };

    return (
        <Button
            id="logoutBtn"
            onClick={handleLogout}
            disabled={loading}
            variant="outline"
            className="border-red-100 text-red-500 hover:bg-red-100 hover:text-red-500"
            aria-label="Logout from application"
        >
            {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
                <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            {loading ? "Logging out..." : "Logout"}
        </Button>
    );
}
