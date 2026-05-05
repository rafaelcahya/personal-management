"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function UserMenu({ user }) {
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

    const firstName =
        user?.user_metadata?.full_name?.split(" ")[0] ||
        user?.email?.split("@")[0] ||
        "User";
    const avatarUrl = user?.user_metadata?.avatar_url;
    const initial = firstName[0]?.toUpperCase();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    id="userMenuTrigger_landingPage"
                    variant="ghost"
                    className="gap-2 h-9 p-6 focus-visible:ring-0 hover:bg-violet-50"
                    disabled={loading}
                    aria-label="User menu"
                >
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={firstName}
                                className="h-full w-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            <span className="text-xs font-semibold text-primary">
                                {initial}
                            </span>
                        )}
                    </div>
                    <span className="text-sm hidden sm:inline">{firstName}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal py-2">
                    <p id="userMenuEmail_landingPage" className="text-xs text-muted-foreground truncate">
                        {user?.email}
                    </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    id="userMenuSignOut_landingPage"
                    onClick={handleLogout}
                    disabled={loading}
                    className="text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer gap-2 hover:outline-none"
                >
                    <LogOut className="h-4 w-4 text-red-400" aria-hidden="true" />
                    {loading ? "Signing out..." : "Sign out"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
