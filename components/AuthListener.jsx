"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function AuthListener() {
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === "SIGNED_OUT") {
                toast.error("Your session has expired. Please login again.");
                router.push("/login?reason=session_expired");
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    return null;
}
