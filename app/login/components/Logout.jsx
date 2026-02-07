"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function LogoutButton() {
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            toast.error("Failed to logout");
            return;
        }

        router.push("/login");
        router.refresh();
    };

    return (
        <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-100 text-red-500 hover:bg-red-100 hover:text-red-500"
        >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
        </Button>
    );
}
